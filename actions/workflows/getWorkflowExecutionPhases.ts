"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function getWorkflowExecutionPhases(executionId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.workflowExecution.findUnique({
    where: {
      userId,
      id: executionId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}

export default getWorkflowExecutionPhases;
