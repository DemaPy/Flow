import { Period } from "@/types/analytics";
import { endOfMonth, startOfMonth } from "date-fns";

function PeriodToDateRange(period: Period) {
  const startDate = startOfMonth(new Date(period.year, period.month));
  const endDate = endOfMonth(new Date(period.year, period.month));

  return {
    startDate,
    endDate,
  };
}

export default PeriodToDateRange;
