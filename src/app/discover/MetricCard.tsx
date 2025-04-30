"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

export interface MetricCardProps {
  metric: any;
  results: any[];
  compressed?: boolean;
}

function getProgress(current: number, target: number, direction: string) {
  if (typeof current !== "number" || typeof target !== "number" || !direction) return null;
  if (direction === "Increase") return Math.round((current / target) * 100);
  if (direction === "Decrease") return Math.round((target / current) * 100);
  return null;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, results, compressed = false }) => {
  // Sort results by fiscalYear, fiscalQuarter ascending
  const sorted = [...results].sort((a, b) => {
    if (a.fiscalYear !== b.fiscalYear) return a.fiscalYear - b.fiscalYear;
    return a.fiscalQuarter - b.fiscalQuarter;
  });
  const latest = sorted[sorted.length - 1];
  const current = latest?.result;
  const target = latest?.targetResult;
  const direction = latest?.targetDirection || metric.targetDirection;
  const percent = getProgress(current, target, direction);

  // For chart: map to { label, value }
  const chartData = sorted.map((r) => ({
    label: `FY${r.fiscalYear} Q${r.fiscalQuarter}`,
    value: r.result,
  }));

  return (
    <Card className={`w-full bg-background border ${compressed ? 'mb-2 p-1' : 'mb-6 max-w-xl'}`}>
      <CardHeader className={`pb-2 ${compressed ? 'py-1 px-2' : ''}`}>
        <CardTitle className={compressed ? 'text-xs font-bold' : 'text-base font-bold'}>{metric.name}</CardTitle>
        <CardDescription className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>
          {direction}
        </CardDescription>
      </CardHeader>
      <CardContent className={`flex flex-col gap-1 ${compressed ? 'p-1' : ''}`}>
        <div className={`flex ${compressed ? 'gap-2' : 'gap-8'} items-center mb-1`}>
          <div>
            <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{current ?? "—"}</div>
            <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Current</div>
          </div>
          <div>
            <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{target ?? "—"}</div>
            <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Target</div>
          </div>
          <div>
            <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{percent !== null ? `${percent}%` : "—"}</div>
            <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Progress</div>
          </div>
        </div>
        <ChartContainer config={{ value: { label: "Value" } }} className={compressed ? 'h-[80px] w-full' : 'h-[180px] w-full'}>
          <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={4} minTickGap={8} hide={compressed} />
            <YAxis hide tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent className="w-[100px]" nameKey="value" />} />
            <Bar dataKey="value" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
