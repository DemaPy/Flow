"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Workflow } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function deleteWorkflow(workflowId: Workflow["id"]) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await prisma.workflow.delete({
    where: {
      id: workflowId,
      userId: userId,
    },
  });

  revalidatePath("/workflows")
}

export default deleteWorkflow;
