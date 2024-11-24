import { getAppUrl } from "@/lib/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import { error } from "console";

export async function GET(req: Request) {
  const now = new Date();
  const workflows = await prisma.workflow.findMany({
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: {
        lte: now,
      },
    },
    select: {
      id: true,
    },
  });

  console.log("RUN workflow");
  for (const workflow of workflows) {
    triggerWorkflow(workflow);
  }

  return new Response(null, { status: 200 });
}

function triggerWorkflow({ id }: { id: Workflow["id"] }) {
  const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${id}`);
  fetch(triggerApiUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  }).catch((err) => console.log(err.message));
}
