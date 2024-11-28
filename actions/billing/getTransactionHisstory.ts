"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

async function getTransactionHistory() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.userPurchase.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export default getTransactionHistory;
