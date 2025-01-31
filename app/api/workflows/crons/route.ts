import { getAppUrl } from "@/lib/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";

// GET WORKFLOWS THAT HAS LTE DATE

// CRONS WILL BE EXECUTED ONCE URL WILL BE VISITED -> /workflows/crons

export async function GET(req: Request) {
  const now = new Date();
  const workflowsId = await prisma.workflow.findMany({
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

  for (const id of workflowsId) {
    triggerWorkflow(id);
  }

  return Response.json({ workflowsToRun: workflowsId }, { status: 200 });
}

function triggerWorkflow({ id }: { id: Workflow["id"] }) {
  const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${id}`);
  fetch(triggerApiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.DEMA_SECRET}`,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  }).catch((err) => console.log(err.message));
}
