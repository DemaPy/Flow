import { getPeriods } from "@/actions/analytics/getPeriods";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import StatsCards from "./_components/StatsCards";

const HomePage = ({
  searchParams,
}: {
  searchParams: { year?: string; month?: string };
}) => {
  const currentDate = new Date();

  const period: Period = {
    month: searchParams.month
      ? parseInt(searchParams.month)
      : currentDate.getMonth(),
    year: searchParams.year
      ? parseInt(searchParams.year)
      : currentDate.getFullYear(),
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton />}>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <StatsCards selectedPeriod={period} />
    </div>
  );
};

async function PeriodSelectorWrapper({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const periods = await getPeriods();
  return <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />;
}

export default HomePage;
