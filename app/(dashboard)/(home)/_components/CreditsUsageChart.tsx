"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnStacked, Layers2 } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import getCreditsUsageInPeriod from "@/actions/analytics/getCreditsUsageInPeriod";

type ChartDate = Awaited<ReturnType<typeof getCreditsUsageInPeriod>>;

interface CreditsUsageChartProps {
  title: string;
  description: string;
  data: ChartDate;
}
const chartConfig: ChartConfig = {
  success: {
    label: "Successfull Phase Credits",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed Phases Credits",
    color: "hsl(var(--chart-1))",
  },
};

function CreditsUsageChart({
  data,
  description,
  title,
}: CreditsUsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStacked className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[200px]" />}
            />
            <Bar
              type={"bump"}
              fill="var(--color-success)"
              dataKey={"success"}
              stroke="var(--color-success)"
              fillOpacity={0.6}
              stackId={"a"}
            />
            <Bar
              type={"bump"}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              fillOpacity={0.6}
              stackId={"b"}
              dataKey={"failed"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default CreditsUsageChart;
