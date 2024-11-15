import { ExecutionPhase } from "@prisma/client";

const getPhasesTotalCost = (
  phases: Pick<ExecutionPhase, "creditsConsumed">[]
) => {
  return phases.reduce((acc, item) => acc + (item.creditsConsumed || 0), 0);
};

export default getPhasesTotalCost;
