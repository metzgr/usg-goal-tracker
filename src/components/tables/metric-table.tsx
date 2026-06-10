"use client";

import { Sparkline } from "@/components/charts/sparkline";
import CardPreviewAvatar from "@/components/cards/cardPreviewAvatar";

import metricResults from "@/data/metricResult.json";

// Shared column widths so the (sticky) header table and the body table line up.
const COL_WIDTHS = ["6%", "32%", "12%", "6%", "9%", "16%", "19%"];

function ColGroup() {
  return (
    <colgroup>
      {COL_WIDTHS.map((w, i) => (
        <col key={i} style={{ width: w }} />
      ))}
    </colgroup>
  );
}

export function MetricTable({ metrics }: { metrics: any[] }) {
  return (
    <div>
      {/* Sticky top: the white margin above, rounded top edge, the space above the
          headers, and the column-header row all travel together on scroll. */}
      <div className="sticky top-0 z-10 bg-white px-2 pt-2">
        <div className="rounded-t-[10px] border border-gray-300 border-b-0 px-5 pt-0">
        <table className="table-fixed w-full text-sm">
          <ColGroup />
          <thead>
            <tr className="text-left align-middle text-gray-950">
              <th className="h-10 pr-2 font-medium border-b-[3px] border-gray-800 pt-4 pb-2">Owner</th>
              <th className="h-10 pr-2 font-medium border-b-[3px] border-gray-800 pt-4 pb-2">Metric</th>
              <th className="h-10 pr-2 font-medium border-b-[3px] border-gray-800 pt-4 pb-2">Target</th>
              <th className="h-10 pr-2 font-medium border-b-[3px] border-gray-800 pt-4 pb-2">Actual</th>
              <th className="h-10 pr-4 font-medium border-b-[3px] border-gray-800 pt-4 pb-2">Trend</th>
              <th className="h-10 pl-4 pr-2 font-medium border-b-[3px] border-gray-800 py-4 pb-2">Goal</th>
              <th className="h-10 pr-2 font-medium border-b-[3px] border-gray-800 pt-4 pb-2">Objective</th>
            </tr>
          </thead>
        </table>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white px-2 pb-2">
        <div className="rounded-b-[10px] border border-gray-300 border-t-0 px-5 pb-2">
        <table className="table-fixed w-full text-sm">
          <ColGroup />
          <tbody>
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
                <tr key={m.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="pr-2 py-2 align-middle font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CardPreviewAvatar orgs={m.orgAcronym} size="sm" />
                      <span>{m.orgAcronym}</span>
                    </div>
                  </td>
                  <td className="pr-2 py-2 align-middle whitespace-normal" title={m.name}>{m.name}</td>
                  <td className="pr-2 py-2 align-middle whitespace-normal">{m.mostRecentTargetDirection} {m.targetDirectionStringInsert} {m.mostRecentTargetResult}</td>
                  <td className="pr-2 py-2 align-middle">{m.mostRecentResult}</td>
                  <td className="pr-4 py-2 align-middle">
                    {results.length > 0 ? (
                      <div className="relative">
                        <Sparkline data={results} mostRecentResultTrend={m.mostRecentResultTrend?.[0]} />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">No data</span>
                    )}
                  </td>
                  <td className="pl-4 pr-2 py-2 align-middle truncate border-l border-l-gray-300" title={m.goalName}>{m.goalName}</td>
                  <td className="pr-2 py-2 align-middle truncate" title={m.objectiveName}>{m.objectiveName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
