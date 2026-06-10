"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableCaption,
} from "@/components/base/table";

import { Sparkline } from "@/components/charts/sparkline";
import CardPreviewAvatar from "@/components/cards/cardPreviewAvatar";

import metricResults from "@/data/metricResult.json";

export function MetricTable({ metrics }: { metrics: any[] }) {
  return (
    <Table className="overflow-auto">
      <TableCaption>All Metrics</TableCaption>
      <TableHeader className="">
        <TableRow className="sticky top-0 z-10 bg-white border-gray-800">
          <TableHead className="border-b-[3px] border-gray-800">Owner</TableHead>
          <TableHead className="border-b-[3px] border-gray-800">Objective</TableHead>
          <TableHead className="border-b-[3px] border-gray-800">Metric</TableHead>
          <TableHead className="border-b-[3px] border-gray-800">Target</TableHead>
          <TableHead className="border-b-[3px] border-gray-800">Actual</TableHead>
          <TableHead className="border-b-[3px] border-gray-800">Trend</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((m) => {
          // Find all results related to this metric
          const results = metricResults
            .filter((r) => r.metric?.[0] === m.id)
            .sort((a, b) => {
              // Sort by fiscalYear then fiscalQuarter
              if (a.fiscalYear === b.fiscalYear) {
                return Number(a.fiscalQuarter) - Number(b.fiscalQuarter);
              }
              return Number(a.fiscalYear) - Number(b.fiscalYear);
            })
            .map((r) => ({
              result: r.result,
              targetResult: r.targetResult,
            }));

          return (
            <TableRow key={m.id}>
              <TableCell className="font-medium whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <CardPreviewAvatar orgs={m.orgAcronym} size="sm" />
                  <span>{m.orgAcronym}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[225px]">{m.objectiveName}</TableCell>
              <TableCell className="max-w-[350px]">{m.name}</TableCell>
              <TableCell>{m.mostRecentTargetDirection} {m.targetDirectionStringInsert} {m.mostRecentTargetResult}</TableCell>
              <TableCell>{m.mostRecentResult}</TableCell>
              <TableCell>
                {results.length > 0 ? (
                  <div className="relative">
                    <Sparkline data={results} mostRecentResultTrend={m.mostRecentResultTrend?.[0]} />
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 italic">No data</span>
                )}
              </TableCell>
             </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}