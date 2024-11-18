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
import { Environment, ExecutionEnv } from "@/types/environment";
import { TaskParamType } from "@/types/task";
import { Edge } from "@xyflow/react";

async function ExecuteWorkflow(id: string) {
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
  await initializeWorkflowExecution(execution.id, execution.workflowId);
  await initializePhaseStatuses(execution);
  // Initialize phases status

  let creditsconsumed = 0;
  let execFailed = false;
  for (const phase of execution.phases) {
    // Execute each phase
    const phaseExecution = await executeWorkflowPhase(phase, env, edges);
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
    creditsconsumed
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
  edges: Edge[]
) {
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

  const creditsRequired = TaskRegistry[node.data.type].credits;
  // TODO
  // Decrement user balance credits
  const status = await executePhase(phase, node, env);

  const outputs = env.phases[node.id].outputs;
  await finalizePhase(phase.id, status, outputs);

  return {
    status: status,
  };
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
  outputs: Record<string, string>
) {
  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
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
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
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
  workflowId: string
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
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment
): Promise<boolean> {
  const executeFn = ExecutorRegistry[node.data.type];
  if (!executeFn) {
    return false;
  }

  const execEnv: ExecutionEnv<any> = createExecEnv(node, environment);
  return await executeFn(execEnv);
}

function createExecEnv(node: AppNode, env: Environment): ExecutionEnv<any> {
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
  };
}

export default ExecuteWorkflow;
