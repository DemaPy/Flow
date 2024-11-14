"use server";

import prisma from "@/lib/prisma";
import flowToExecutionPlan from "@/lib/workflow/flowToExecutionPlan";
import { WorkflowExecutionPlan } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Workflow } from "@prisma/client";

export async function runWorkFlow(form: {
  workflowId: Workflow["id"];
  flowDefinition?: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const { workflowId, flowDefinition } = form;
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

  let execPlan: WorkflowExecutionPlan;
  if (!flowDefinition) {
    throw new Error("Flow definition not found");
  }

  const flow = JSON.parse(flowDefinition);
  const result = flowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("Flow is not valid");
  }

  if (!result.executionPlan) {
    throw new Error("Execution plan not generated");
  }

  execPlan = result.executionPlan;
  console.log("PLAN", execPlan);
}
