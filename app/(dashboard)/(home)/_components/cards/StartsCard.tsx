"use client";

import { CountUpWrapper } from "@/components/CountUpWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React, { ReactElement } from "react";

interface StartsCard {
  title: string;
  value: number;
  icon: ReactElement;
}

function StartsCard({ icon, title, value }: StartsCard) {
  return (
    <Card className="relative overflow-hidden flex-grow basis-96">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <CountUpWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  );
}

export default StartsCard;
