"use server";

import { PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";

async function purchaseCredits(id: PackId) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
}

export default purchaseCredits;
