import React, { Suspense } from "react";
import BalanceCard from "./_components/BalanceCard";
import { Skeleton } from "@/components/ui/skeleton";
import CreditsPurchase from "./_components/CreditsPurchase";
import CreditsUsageCard from "./_components/CreditsUsageCard";
import TransactionHistory from "./_components/TransactionHistory";

const Billing = () => {
  return (
    <div className="mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[160px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditsUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistory />
      </Suspense>
    </div>
  );
};

export default Billing;
