"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

function getWorkflowPhaseDetails(phaseId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.executionPhase.findUnique({
    where: {
      userId,
      id: phaseId,
    },
  });
}

export default getWorkflowPhaseDetails;
