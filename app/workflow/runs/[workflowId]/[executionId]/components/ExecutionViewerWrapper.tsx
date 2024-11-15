import getWorkflowExecutionPhases from "@/actions/workflows/getWorkflowExecutionPhases";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import ExecutionViewer from "./ExecutionViewer";

type ExecutionViewerWrapperProps = {
  executionId: string;
};

const ExecutionViewerWrapper = async ({
  executionId,
}: ExecutionViewerWrapperProps) => {
  const { userId } = auth();
  if (!userId) return <div>unauthenticated</div>;

  const workflowExecution = await getWorkflowExecutionPhases(executionId);
  if (!workflowExecution) {
    return <div>Execution not found</div>;
  }

  return <ExecutionViewer workflowExecution={workflowExecution} />;
};

export default ExecutionViewerWrapper;
