"use server";

import prisma from "@/lib/prisma";
import { workflowSchema, workflowShemaType } from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { redirect } from "next/navigation";

export async function createWorkflow(form: workflowShemaType) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }
  const { success, data } = workflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  let result;
  try {
    result = await prisma.workflow.create({
      data: {
        userId,
        status: WorkflowStatus.DRAFT,
        definition: "TODO",
        ...data,
      },
    });
    if (!result) {
      throw new Error("Failed to create workflow");
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Workflow name already exist");
      }
    }
    throw new Error("Something went wrong");
  }

  redirect(`/workflow/editor/${result.id}`);
}
