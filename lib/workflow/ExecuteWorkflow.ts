import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionWorkflowStatus } from "@/types/workflow";

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

  // Initialize phases status

  let execFailed = false;

  for (const iterator of execution.phases) {
    // Execute each phase
  }

  //   Update execution status

  // Clean up environment

  revalidatePath("/workflow/runs");
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
    where: { id: workflowId },
    data: {},
  });
}

export default ExecuteWorkflow;
