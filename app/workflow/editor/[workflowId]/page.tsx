import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Editor from "../../components/Editor";

async function page({ params }: { params: { workflowId: string } }) {
  const workflowId = params.workflowId;
  const { userId } = auth();
  if (!userId) {
    return <div>Unauthenticated</div>;
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found")
  }

  return <Editor workflow={workflow}/>
}

export default page;
