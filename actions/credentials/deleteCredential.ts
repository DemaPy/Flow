"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Credential } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function deleteCredential(credentialId: Credential["id"]) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await prisma.credential.delete({
    where: {
      id: credentialId,
      userId: userId,
    },
  });

  revalidatePath("/credentials");
}

export default deleteCredential;
