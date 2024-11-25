"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { credentialShema, credentialShemaType } from "@/schema/credentials";
import { auth } from "@clerk/nextjs/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";

export async function createCredential(form: credentialShemaType) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const { success, data } = credentialShema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const encryptedValue = symmetricEncrypt(data.value);

  try {
    const result = await prisma.credential.create({
      data: {
        userId,
        name: data.name,
        value: encryptedValue,
      },
    });
    if (!result) {
      throw new Error("Failed to create credential");
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Credential name already exist");
      }
    }
    throw new Error("Something went wrong");
  }

  redirect(`/credentials`);
}
