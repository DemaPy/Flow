import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import ShowUserBalance from "./ShowUserBalance";
import { CoinsIcon } from "lucide-react";

async function BalanceCard() {
  const userBalance = await getAvailableCredits();
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col">
      <CardContent className="p-6 relative items-center">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Available credits
            </h3>
            <ShowUserBalance userBalance={userBalance} />
          </div>
          <CoinsIcon
            size={140}
            className="text-primary opacity-20 absolute bottom-0 right-0"
          />
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        When your credits balance reaches zero, your workflows will stop
        working.
      </CardFooter>
    </Card>
  );
}

export default BalanceCard;
