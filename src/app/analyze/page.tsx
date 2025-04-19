"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/custom/header";
import FiltersBar from "@/components/filters/filters-bar";
import SunburstChart from "@/components/charts/sunburst-chart";
import metrics from "@/data/metric.json";
import metricResults from "@/data/metricResult.json";
import plans from "@/data/plan.json";
import tags from "@/data/tag.json";
import { ActiveFilters } from "@/components/filters/active-filters";

export default function AnalyzePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusOption, setStatusOption] = useState<"Active" | "Inactive">("Active");
  const [sortOption, setSortOption] = useState("Trending");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const possibleFilters = tags.map((t) => t.name);

  // 1) Always filter metrics by the selected status (Active or Inactive)
  const byStatus = useMemo(() => {
    return metrics.filter((m) => {
      return (m.plan || []).some((planId) => {
        const plan = plans.find((p) => p.id === planId);
        return plan?.status === statusOption;
      });
    });
  }, [statusOption]);

  // 2) Filter by tag pills
  const byTags = useMemo(() => {
    if (activeFilters.length === 0) return byStatus;
    return byStatus.filter((m) =>
      (m.tags || []).some((tagId) => {
        const tag = tags.find((t) => t.id === tagId);
        return tag && activeFilters.includes(tag.name);
      })
    );
  }, [byStatus, activeFilters]);

  // 3) Filter by search string
  const displayedMetrics = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return byTags.filter((m) => m.name.toLowerCase().includes(q));
  }, [byTags, searchQuery]);

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

  return (
    <div>
      <Header activeItem="Analyze" />

      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusOption={statusOption}
        onStatusChange={setStatusOption}
        sortOption={sortOption}
        onSortClick={() => {}}
        possibleFilters={possibleFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
      {/* display selected tag pills */}
      <ActiveFilters
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        resultCount={displayedMetrics.length}
      />

      <main className="bg-[#F5F5F5] py-12 px-6">
          <SunburstChart data={hierarchyData} />

      </main>
    </div>
  );
}