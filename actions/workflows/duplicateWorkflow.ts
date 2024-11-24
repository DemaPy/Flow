"use server";

import prisma from "@/lib/prisma";
import {
  workflowDuplicateShemaType,
  workflowSchemaDuplicate,
} from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function duplicateWorkflow(form: workflowDuplicateShemaType) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const { success, data } = workflowSchemaDuplicate.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }
  const result = await prisma.workflow.create({
    data: {
      userId,
      name: form.name,
      description: form.description,
      definition: workflow.definition,
      status: WorkflowStatus.DRAFT,
    },
  });
  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}
