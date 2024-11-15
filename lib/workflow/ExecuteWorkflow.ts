import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  ExecutionWorkflowStatus,
} from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";

async function ExecuteWorkflow(id: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  // Setup environment
  const env = {
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
    const phaseExecution = await executeWorkflowPhase(phase, env);
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

  revalidatePath("/workflow/runs");
}

async function executeWorkflowPhase(phase: ExecutionPhase, env: any) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  // Update phase status
  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;
  // TODO
  // Decrement user balance credits
  const status = await executePhase(phase, node, env);
  await finalizePhase(phase.id, status);

  return {
    status: status,
  };
}

async function finalizePhase(phaseId: string, status: boolean) {
  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
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
  environment: any
): Promise<boolean> {
  const executeFn = ExecutorRegistry[node.data.type];
  if (!executeFn) {
    return false;
  }
  //youtu.be/RkwbGuL-dzo?t=23898
  https: return await executeFn(environment);
}

export default ExecuteWorkflow;
