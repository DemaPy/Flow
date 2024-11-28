"use server";

import prisma from "@/lib/prisma";
import PeriodToDateRange from "@/lib/workflow/PeriodToDateRange";
import { Period } from "@/types/analytics";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

async function getCreditsUsageInPeriod(period: Period) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const dateRange = PeriodToDateRange(period);

  const executionsPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [ExecutionPhaseStatus.COMPLETED, ExecutionPhaseStatus.FAILED],
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

  executionsPhases.forEach((phase) => {
    const date = format(phase.startedAt!, formatDate);
    if (phase.status === ExecutionPhaseStatus.COMPLETED) {
      stats[date].success += phase.creditsConsumed || 0;
    }
    if (phase.status === ExecutionPhaseStatus.FAILED) {
      stats[date].failed += phase.creditsConsumed || 0;
    }
  });

  const result = Object.entries(stats).map(([key, value]) => {
    return {
      date: key,
      ...value,
    };
  });

  return result;
}

export default getCreditsUsageInPeriod;
