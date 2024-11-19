"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAvailableCredits() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: {
      userId,
    },
  });

  if (!balance) {
    return -1;
  }

  return balance.credits;
}
