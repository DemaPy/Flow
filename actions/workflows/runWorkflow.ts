"use server";

import prisma from "@/lib/prisma";
import ExecuteWorkflow from "@/lib/workflow/ExecuteWorkflow";
import flowToExecutionPlan from "@/lib/workflow/flowToExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  ExecutionWorkflowStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionTrigger,
  WorkflowStatus,
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
  let workflowDefinition = flowDefinition;
  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("Execution plan found in published workflow");
    }
    workflowDefinition = workflow.definition;
    execPlan = JSON.parse(workflow.executionPlan).executionPlan
  } else {
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
  }
  console.log(execPlan);
  
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      definition: workflowDefinition,
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

  ExecuteWorkflow(execution.id);

  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
