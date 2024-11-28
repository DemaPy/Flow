import getStatsCardsValues from "@/actions/analytics/getStatsCardsValues";
import { Period } from "@/types/analytics";
import React from "react";

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await getStatsCardsValues(selectedPeriod);

  return <pre>{JSON.stringify(data, null, 4)}</pre>;
}

export default StatsCards;
