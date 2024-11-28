"use server";

import prisma from "@/lib/prisma";
import PeriodToDateRange from "@/lib/workflow/PeriodToDateRange";
import { Period } from "@/types/analytics";
import { ExecutionWorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

async function getWorkflowExecutionsStats(period: Period) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const dateRange = PeriodToDateRange(period);

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
    },
  });

  const formatDate = "yyyy-MM-dd";

  const stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((item) => format(item, formatDate))
    .reduce(
      (acc, item) => {
        acc[item] = {
          success: 0,
          failed: 0,
        };
        return acc;
      },
      {} as Record<
        string,
        {
          success: 0;
          failed: 0;
        }
      >
    );

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, formatDate);
    if (execution.status === ExecutionWorkflowStatus.COMPLETED) {
      stats[date].success += 1;
    }
    if (execution.status === ExecutionWorkflowStatus.FAILED) {
      stats[date].failed += 1;
    }
  });

  return stats;
}

export default getWorkflowExecutionsStats;
