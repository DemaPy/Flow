import { Period } from "@/types/analytics";
import getCreditsUsageInPeriod from "@/actions/analytics/getCreditsUsageInPeriod";
import CreditsUsageChart from "../../(home)/_components/CreditsUsageChart";

async function CreditsUsageCard() {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };
  const data = await getCreditsUsageInPeriod(period);

  return (
    <CreditsUsageChart
      title="Credits consumed"
      description="Daily credits consumed in the current card"
      data={data}
    />
  );
}

export default CreditsUsageCard;
