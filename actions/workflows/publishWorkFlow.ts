"use server";

import prisma from "@/lib/prisma";
import flowToExecutionPlan from "@/lib/workflow/flowToExecutionPlan";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Workflow } from "@prisma/client";

export async function publishWorkFlow({
  workflowId,
  definition,
}: {
  workflowId: Workflow["id"];
  definition: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  if (!workflowId) {
    throw new Error("Id required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });
  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== "DRAFT") {
    throw new Error("Workflow is not a draft");
  }

  const flow = JSON.parse(definition);
  const result = flowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Flow definition is not valid");
  }

  if (!result.executionPlan) {
    throw new Error("No execution plan generated");
  }
}
