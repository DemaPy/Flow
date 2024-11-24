import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  ExecutionWorkflowStatus,
  WorkflowTask,
} from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnv, LogCollector } from "@/types/environment";
import { TaskParamType } from "@/types/task";
import { Edge } from "@xyflow/react";
import { createLogCollector } from "../log";

async function ExecuteWorkflow(id: string, nextRun?: Date) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const edges = JSON.parse(execution.definition).edges as Edge[];

  // Setup environment
  const env: Environment = {
    phases: {},
  };

  // Initialize workflow execution
  await initializeWorkflowExecution(
    execution.id,
    execution.workflowId,
    nextRun
  );
  await initializePhaseStatuses(execution);
  // Initialize phases status

  let execFailed = false;
  let creditsConsumed = 0;
  for (const phase of execution.phases) {
    // Execute each phase and create log collector for each phase
    const phaseExecution = await executeWorkflowPhase(
      phase,
      env,
      edges,
      execution.userId
    );
    creditsConsumed = phaseExecution.creditsConsumed;
    if (phaseExecution.status === false) {
      execFailed = true;
      break;
    }
  }

  // Update execution status
  await finalizeWorkflowExecution(
    execution.id,
    execution.workflowId,
    execFailed,
    creditsConsumed
  );

  // Clean up environment
  await cleanUpEnv(env);

  revalidatePath("/workflow/runs");
}

async function cleanUpEnv(env: Environment) {
  if (env.browser) {
    await env.browser
      .close()
      .catch((err) =>
        console.log(
          "Cannot close browser. Error: " + JSON.stringify(err, null, 4)
        )
      );
  }
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  env: Environment,
  edges: Edge[],
  userId: string
) {
  const logCollector: LogCollector = createLogCollector();

  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnvForPhase(node, env, edges);
  // Update phase status
  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(env.phases[node.id].inputs),
    },
  });

  // Decrement user balance credits
  const creditsRequired = TaskRegistry[node.data.type].credits;
  let success = await DecrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;
  if (success) {
    success = await executePhase(phase, node, env, logCollector);
  }

  const outputs = env.phases[node.id].outputs;
  await finalizePhase(
    phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed
  );

  return {
    status: success,
    creditsConsumed,
  };
}

async function DecrementCredits(
  userId: string,
  amount: number,
  logCollector: LogCollector
) {
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: { gte: amount },
      },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    logCollector.ERROR("Insufficient credits");
    return false;
  }
}

function setupEnvForPhase(node: AppNode, env: Environment, edges: Edge[]) {
  env.phases[node.id] = {
    inputs: {},
    outputs: {},
  };
  const inputs = TaskRegistry[node.data.type].inputs;
  // Get input value from user
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const value = node.data.inputs[input.name];
    if (value.length) {
      env.phases[node.id].inputs[input.name] = value;
      continue;
    }

    // Get input value from outputs
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );
    if (!connectedEdge) {
      console.log("Missing edge for input: " + node.id);
      continue;
    }

    // Get output value from prev node
    const outputValue =
      env.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];

    env.phases[node.id].inputs[input.name] = outputValue;
  }
}

async function finalizePhase(
  phaseId: string,
  status: boolean,
  outputs: Record<string, string>,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const completedAt = new Date();

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((item) => ({
            message: item.message,
            timestamp: item.timestamp,
            logLevel: item.level,
          })),
        },
      },
      completedAt,
      outputs: JSON.stringify(outputs),
      status: status
        ? ExecutionPhaseStatus.COMPLETED
        : ExecutionPhaseStatus.FAILED,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? ExecutionWorkflowStatus.FAILED
    : ExecutionWorkflowStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      creditsConsumed,
      status: finalStatus,
      completedAt: new Date(),
    },
  });

  // Race condition for status.
  // executionId used to handle it.
  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {});
  // ignore error while an execution was running
}

async function initializePhaseStatuses(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((item: any) => item.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
  nextRunAt?: Date
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: ExecutionWorkflowStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: ExecutionWorkflowStatus.RUNNING,
      ...(nextRunAt && { nextRunAt }),
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const executeFn = ExecutorRegistry[node.data.type];
  if (!executeFn) {
    return false;
  }

  const execEnv: ExecutionEnv<any> = createExecEnv(
    node,
    environment,
    logCollector
  );
  return await executeFn(execEnv);
}

function createExecEnv(
  node: AppNode,
  env: Environment,
  logCollector: LogCollector
): ExecutionEnv<any> {
  return {
    getInput: (name: string) => env.phases[node.id].inputs[name],
    getBrowser: () => env.browser,
    setBrowser: (browser) => {
      env.browser = browser;
    },
    setPage: (page) => {
      env.page = page;
    },
    getPage: () => env.page,
    setOutput: (name, value) => {
      env.phases[node.id].outputs[name] = value;
    },
    log: logCollector,
  };
}

export default ExecuteWorkflow;
