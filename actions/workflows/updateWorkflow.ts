"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Workflow } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface UpdateWorkflowProps {
  id: Workflow["id"];
  definition: Workflow["definition"];
}

export async function updateWorkflow({ id, definition }: UpdateWorkflowProps) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not a draft");
  }

  await prisma.workflow.update({
    data: {
      definition,
    },
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/workflows");
}
