"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const getCredentialsForUser = async () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return prisma.credential.findMany({
    where: { userId },
    orderBy: {
      name: "asc",
    },
  });
};

export default getCredentialsForUser;
