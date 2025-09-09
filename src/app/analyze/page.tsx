"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/custom/header";
import FiltersBar from "@/components/filters/filters-bar";
import SunburstChart from "@/components/charts/sunburst-chart";
import BubbleChart from "@/components/charts/bubble-chart";
import BumpChart from "@/components/charts/bump-chart";
import metrics from "@/data/metric.json";
import metricResults from "@/data/metricResult.json";
import plans from "@/data/plan.json";
import tags from "@/data/tag.json";
import { ActiveFilters } from "@/components/filters/active-filters";
import { MetricTable } from "@/components/tables/metric-table";
import FilterTabs from "@/components/filters/filter-tabs";
import Placard from "@/components/base/placard";
import Badge from "@/components/base/badge";

export default function AnalyzePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusOption, setStatusOption] = useState<"Active" | "Inactive">("Active");
  const [sortOption, setSortOption] = useState("Trending");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Metrics");
  const possibleFilters = tags.map((t) => t.name);
  const metricsWithTags = useMemo(() => {
    return metrics.map((metric) => {
      const matchingTag = tags.find(tag => tag.metric?.includes(metric.id));
      return {
        ...metric,
        tag: matchingTag?.id ?? null,
      };
    });
  }, [metrics, tags]);
  
  const tabs = [
    { name: "Metrics", count: metrics.length },
    { name: "Projects", count: 0 }, // placeholder for now
  ];

  // 1) Always filter metrics by the selected status (Active or Inactive)
  const byStatus = useMemo(() => {
    return metricsWithTags.filter((m) => {
      return (m.plan || []).some((planId) => {
        const plan = plans.find((p) => p.id === planId);
        return plan?.status === statusOption;
      });
    });
  }, [statusOption]);

  // 2) Filter by tag pills
  const byTags = useMemo(() => {
    if (activeFilters.length === 0) return byStatus;
    return byStatus.filter((m) => {
      return activeFilters.some((name) => {
        const tag = tags.find(t => t.name === name);
        return tag?.id === m.tag;
      });
    });
  }, [byStatus, activeFilters, tags]);

  // 3) Filter by search string
  const displayedMetrics = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return activeTab === "Metrics" ? byTags.filter((m) => m.name.toLowerCase().includes(q)) : [];
  }, [byTags, searchQuery, activeTab]);

  // 4) Map latest results by metric ID
  const resultsByMetric = useMemo(() => {
    return metricResults.reduce<Record<string, typeof metricResults[0]>>((acc, r) => {
      const id = r.metric?.[0];
      if (id) acc[id] = r;
      return acc;
    }, {});
  }, []);

  // 5) Build the two‐level hierarchy for the sunburst
  const hierarchyData = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};

    for (const m of displayedMetrics) {
      const res = resultsByMetric[m.id];
      const trend = res?.resultTrend || "No Data";
      const org = m.orgAcronym?.[0] ?? "Unknown";

      if (!grouped[trend]) grouped[trend] = {};
      grouped[trend][org] = (grouped[trend][org] || 0) + 1;
    }

    return {
      name: "All Metrics",
      children: Object.entries(grouped).map(([trend, orgs]) => ({
        name: trend,
        children: Object.entries(orgs).map(([org, count]) => ({
          name: org,
          value: count,
        })),
      })),
    };
  }, [displayedMetrics, resultsByMetric]);

  const bubbleChartData = useMemo(() => {
    const trendCounts: Record<string, number> = {};
    for (const m of displayedMetrics) {
      const trend = resultsByMetric[m.id]?.resultTrend ?? "No Data";
      trendCounts[trend] = (trendCounts[trend] || 0) + 1;
    }
    return Object.entries(trendCounts).map(([trend, count]) => ({ trend, count }));
  }, [displayedMetrics, resultsByMetric]);

  const bumpChartData = useMemo(() => {
    const map = new Map<string, { trend: string; date: string; count: number }>();

    for (const res of metricResults) {
      const id = res.metric?.[0];
      if (!id || !res.fiscalYear || !res.fiscalQuarter || !res.resultTrend) continue;

      const metric = metricsWithTags.find(m => m.id === id);
      if (!metric) continue;

      const matchesStatus = (metric.plan || []).some(planId => {
        const plan = plans.find(p => p.id === planId);
        return plan?.status === statusOption;
      });
      if (!matchesStatus) continue;

      const matchesTags =
        activeFilters.length === 0 ||
        activeFilters.some(name => {
          const tag = tags.find(t => t.name === name);
          return tag?.id === metric.tag;
        });
      if (!matchesTags) continue;

      const matchesSearch = metric.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) continue;

      const date = `${res.fiscalYear}-Q${res.fiscalQuarter}`;
      const key = `${res.resultTrend}__${date}`;

      if (!map.has(key)) {
        map.set(key, { trend: res.resultTrend, date, count: 1 });
      } else {
        map.get(key)!.count += 1;
      }
    }

    const result = Array.from(map.values());
    console.log("bumpChartData", result);
    return result;
  }, [searchQuery, statusOption, activeFilters, metricResults, plans, tags, metrics]);

  return (
    <div>
      <Header activeItem="Analyze" />

      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusOption={statusOption}
        onStatusClick={() => { /* optional: toggle or open menu */ }}
        sortOption={sortOption}
        onSortClick={() => {}}
        possibleFilters={possibleFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
         placeholder="Search U.S. key performance indicators"
      />
      {/* display selected tag pills */}
      <ActiveFilters
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        resultCount={displayedMetrics.length}
      />
<div className="bg-[#F5F5F5] flex justify-center">
  <FilterTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
</div>
      <main className="bg-[#F5F5F5] px-8 py-[28px]">
        {activeTab === "Metrics" && (
          <>
          
<div className="grid grid-cols-1 md:grid-cols-3">
  <div className="md:pt-2 bg-white">
    <Placard>
      <div className="px-5">
        <Badge>Status</Badge>
        <div className="bg-gray-50 mt-4 px-6 py-4 flex justify-center" style={{ flexDirection: "column", alignItems: "center" }}>
          <BubbleChart data={bubbleChartData} />
          <div className="flex justify-center mt-[10px]">
            <p className="inline-flex items-center text-xs text-gray-950 mr-2">
              <svg className="w-[16px] h-[16px] fill-[#444ec7]" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="4" />
              </svg>
              <span className="font-medium">Improved</span>
            </p>
            <p className="inline-flex items-center text-xs text-gray-950">
              <svg className="w-[16px] h-[16px] fill-red-600" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="4" />
              </svg>
              <span className="font-medium">Worsened</span>
            </p>
          </div>
        </div>
      </div>
    </Placard>
  </div>
<div className="md:pt-2 bg-white"><Placard><div className="px-5"><Badge>Trend</Badge><div className="bg-gray-50 mt-4 px-6 py-4 flex flex-col items-center"><BumpChart data={bumpChartData} />

<div className="flex justify-center mt-[10px]"><p className="inline-flex items-center text-xs text-gray-950 mr-2"><svg className="w-[16px] h-[16px] fill-[#444ec7]" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="4"></circle></svg><span className="font-medium">Improved</span></p><p className="inline-flex items-center text-xs text-gray-950"><svg className="w-[16px] h-[16px] fill-red-600" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="4"></circle></svg><span className="font-medium">Worsened</span></p></div>


</div></div></Placard></div>
<div className="md:pt-2 bg-white"><Placard><div className="px-5"><Badge>Owners</Badge><div className="bg-gray-50 mt-4 px-6 py-4 flex flex-col items-center"><SunburstChart data={hierarchyData} />


<div className="flex justify-center mt-[10px]"><p className="inline-flex items-center text-xs text-gray-950 mr-2"><svg className="w-[16px] h-[16px] fill-[#444ec7]" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="4"></circle></svg><span className="font-medium">Improved</span></p><p className="inline-flex items-center text-xs text-gray-950"><svg className="w-[16px] h-[16px] fill-red-600" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="4"></circle></svg><span className="font-medium">Worsened</span></p></div>


</div></div></Placard></div>
</div>

<Placard><div className="px-5"><MetricTable metrics={displayedMetrics} /></div></Placard>
          </>
        )}
      </main>
    </div>
  );
}