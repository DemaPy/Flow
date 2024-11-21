"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const getWorkflowExecutions = async (workflowId: string) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.workflowExecution.findMany({
    where: {
      userId,
      workflowId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export default getWorkflowExecutions;
