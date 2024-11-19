"use client";

import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CountUpWrapper } from "./CountUpWrapper";
import { buttonVariants } from "./ui/button";

const UserAvailableCredits = () => {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => getAvailableCredits(),
    refetchInterval: 30 * 1000,
  });
  return (
    <Link
      href={"/billing"}
      className={cn(
        "w-full space-x-2 items-center",
        buttonVariants({
          variant: "outline",
        })
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="animate-spin w-4 h-4" />}
        {!query.isLoading && !query.data && "-"}
        {!query.isLoading && query.data && (
          <CountUpWrapper value={query.data} />
        )}
      </span>
    </Link>
  );
};

export default UserAvailableCredits;
