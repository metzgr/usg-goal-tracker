"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [open, setOpen] = React.useState(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className={`w-full bg-background shadow-none border border-white rounded-none transition-colors duration-200 hover:border-gray-300 cursor-pointer ${compressed ? 'mb-2 p-1' : 'mb-6 max-w-xl'}`}>
          <CardContent className={`flex items-center flex-col ${compressed ? 'py-3 px-2' : ''}`}>
            <div className="flex flex-col md:flex-row w-full items-stretch mb-4 gap-2 md:gap-0">
              {/* Left: Badge + Metric Name */}
              <div className="flex-1 flex flex-col items-center justify-center md:items-start md:justify-center pb-2 md:pb-0">
                <Badge className={compressed ? 'text-xs px-2 py-0.5 mb-3' : 'mb-3'} variant="outline">{direction}</Badge>
                <span className={compressed ? 'text-sm font-normal' : 'text-base font-normal'}>{metric.name}</span>
              </div>
              {/* Right: Values Row + Sparkline */}
              <div className="flex-[2] flex flex-row divide-x divide-gray-200 items-center">
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{current ?? "—"}</div>
                  <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Actual</div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{target ?? "—"}</div>
                  <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Target</div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{percent !== null ? `${percent}%` : "—"}</div>
                  <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Progress</div>
                </div>
                {/* Sparkline */}
                <div className="flex-1 flex flex-col items-center justify-center px-2">
                  <LineChart width={compressed ? 60 : 90} height={compressed ? 24 : 32} data={chartData} margin={{ top: 6, bottom: 6, left: 0, right: 0 }}>
                    <YAxis hide domain={['auto', 'auto']} />
                    <XAxis hide dataKey="label" />
                    <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={false} />
                  </LineChart>
                  <div className="text-[10px] text-muted-foreground mt-1">Trend</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="!max-w-[700px] w-full">
        <DialogHeader>
          <DialogTitle>Trend for {metric.name}</DialogTitle>
        </DialogHeader>
        <div className="w-full h-[350px] flex items-center justify-center">
          <LineChart width={600} height={300} data={chartData} margin={{ top: 30, right: 30, left: 0, bottom: 30 }}>
            <XAxis dataKey="label" angle={-30} textAnchor="end" height={60} interval={0} />
            <YAxis allowDecimals={false} />
            <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Tooltip formatter={(value: any) => value ?? "—"} />
          </LineChart>
        </div>
      </DialogContent>
    </Dialog>
  );
};
