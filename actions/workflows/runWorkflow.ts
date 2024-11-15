"use server";

import prisma from "@/lib/prisma";
import flowToExecutionPlan from "@/lib/workflow/flowToExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  ExecutionWorkflowStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Workflow } from "@prisma/client";
import { redirect } from "next/navigation";

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
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: ExecutionWorkflowStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      phases: {
        create: execPlan.flatMap((phase) =>
          phase.nodes.flatMap((node) => ({
            userId,
            status: ExecutionPhaseStatus.CREATED,
            number: phase.phase,
            node: JSON.stringify(node),
            name: TaskRegistry[node.data.type].label,
          }))
        ),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error("Workflow execution not created");
  }

  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
  console.log("PLAN", execution);
}
