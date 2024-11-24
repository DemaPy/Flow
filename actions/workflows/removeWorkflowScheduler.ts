"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const removeWorkflowScheduler = async ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });

  revalidatePath(`/workflows`);
};

export default removeWorkflowScheduler;
