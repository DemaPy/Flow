"use client";

import { CountUpWrapper } from "@/components/CountUpWrapper";

const ShowUserBalance = ({ userBalance }: { userBalance: number }) => {
  return (
    <p className="text-4xl font-bold text-primary">
      <CountUpWrapper value={userBalance} />
    </p>
  );
};

export default ShowUserBalance;
