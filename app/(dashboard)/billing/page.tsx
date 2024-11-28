import React, { Suspense } from "react";
import BalanceCard from "./_components/BalanceCard";
import { Skeleton } from "@/components/ui/skeleton";
import CreditsPurchase from "./_components/CreditsPurchase";

const Billing = () => {
  return (
    <div className="mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[160px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
    </div>
  );
};

export default Billing;
