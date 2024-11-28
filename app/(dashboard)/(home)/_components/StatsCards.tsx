import getStatsCardsValues from "@/actions/analytics/getStatsCardsValues";
import { Period } from "@/types/analytics";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import React from "react";
import StartsCard from "./cards/StartsCard";

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getStatsCardsValues(selectedPeriod);

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      <StartsCard
        title="Workflow executions"
        value={data.workflowsExecutions}
        icon={
          <CirclePlayIcon
            size={120}
            className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
          />
        }
      />
      <StartsCard
        title="Phase executions"
        value={data.phaseExecutions}
        icon={
          <WaypointsIcon
            size={120}
            className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
          />
        }
      />
      <StartsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={
          <CoinsIcon
            size={120}
            className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
          />
        }
      />
    </div>
  );
}

export default StatsCards;
