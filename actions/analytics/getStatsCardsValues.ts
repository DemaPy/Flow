"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import PeriodToDateRange from "@/lib/workflow/PeriodToDateRange";
import { Period } from "@/types/analytics";
import { ExecutionWorkflowStatus } from "@/types/workflow";

const { COMPLETED, FAILED } = ExecutionWorkflowStatus;

async function getStatsCardsValues(period: Period) {
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
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    },
  });

  const stats = {
    workflowsExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };

  stats.creditsConsumed = executions.reduce((acc, item) => {
    return acc + item.creditsConsumed;
  }, 0);

  stats.phaseExecutions = executions.reduce((acc, item) => {
    return acc + item.phases.length;
  }, 0);

  return stats;
}

export default getStatsCardsValues;
