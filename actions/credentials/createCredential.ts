"use server";

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { credentialShema, credentialShemaType } from "@/schema/credentials";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function createCredential(form: credentialShemaType) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const { success, data } = credentialShema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  initialFlow.nodes.push(CreateFlowNode({ nodeType: TaskType.LAUNCH_BROWSER }));

  let result;
  try {
    result = await prisma.workflow.create({
      data: {
        userId,
        status: WorkflowStatus.DRAFT,
        definition: JSON.stringify(initialFlow),
        ...data,
      },
    });
    if (!result) {
      throw new Error("Failed to create workflow");
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Workflow name already exist");
      }
    }
    throw new Error("Something went wrong");
  }

  redirect(`/workflow/editor/${result.id}`);
}
