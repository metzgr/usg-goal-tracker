"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import FilterTabs from "@/components/filters/filter-tabs";
import Placard from "@/components/base/placard";
import Badge from "@/components/base/badge";
import planData from "@/data/plan.json";
import goalData from "@/data/goal.json";
import metricData from "@/data/metric.json";
import CardPreviewBody from "@/components/cards/cardPreviewBody";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/cards/previewCard";
import CardPreviewTitle from "@/components/cards/cardPreviewTitle";
import CardPreviewFooter from "@/components/cards/cardPreviewFooter";
import CardPreviewAvatar from "@/components/cards/cardPreviewAvatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AnalyzePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusOption, setStatusOption] = useState<"Active" | "Inactive">("Active");
  const [sortOption, setSortOption] = useState("Trending");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Everything");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
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

  // Map latest results by metric ID (used for charts, can be defined early)
  const resultsByMetric = useMemo(() => {
    return metricResults.reduce<Record<string, typeof metricResults[0]>>((acc, r) => {
      const id = r.metric?.[0];
      if (id) acc[id] = r;
      return acc;
    }, {});
  }, [metricResults]);

  // Pre-calculate enriched results for metric cards (performance optimization)
  const enrichedMetricResultsById = useMemo(() => {
    const map = new Map<string, { result: any[], targetResult: any[] }>();
    const resultsGroupedByMetricId: Record<string, typeof metricResults> = {};

    for (const r of metricResults) {
      const metricId = r.metric?.[0];
      if (metricId) {
        if (!resultsGroupedByMetricId[metricId]) {
          resultsGroupedByMetricId[metricId] = [];
        }
        resultsGroupedByMetricId[metricId].push(r);
      }
    }

    for (const metricId in resultsGroupedByMetricId) {
      const sortedResults = resultsGroupedByMetricId[metricId]
        .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
      map.set(metricId, {
        result: sortedResults.map(r => r.result),
        targetResult: sortedResults.map(r => r.targetResult),
      });
    }
    return map;
  }, [metricResults]);

  // Centralized filtering and sorting logic
  const itemsToDisplay = useMemo(() => {
    // 1. Status Filtering
    const activePlans = planData.filter(p => p.status === statusOption);
    const activePlanIds = new Set(activePlans.map(p => p.id));

    let statusFilteredItems = [
      ...activePlans,
      ...goalData.filter(g => (g.plan || []).some(planId => activePlanIds.has(planId))),
      ...metricsWithTags.filter(m => (m.plan || []).some(planId => activePlanIds.has(planId)))
    ];

    // 2. Tag Filtering (Tag -> Goal relationship)
    let tagFilteredItems = statusFilteredItems;
    if (activeFilters.length > 0) {
      const goalIdsToFilterBy = new Set<string>();
      activeFilters.forEach(filterName => {
        const tagObject = tags.find(t => t.name === filterName);
        if (tagObject && 'goal' in tagObject && tagObject.goal && Array.isArray(tagObject.goal)) {
          // Now that 'goal' is confirmed to exist and be an array, we can safely iterate.
          // We might need to cast tagObject.goal if TS still infers it as 'unknown' or too broad after 'in' check.
          (tagObject.goal as string[]).forEach((goalId: string) => goalIdsToFilterBy.add(goalId));
        }
      });

      if (goalIdsToFilterBy.size > 0) {
        tagFilteredItems = statusFilteredItems.filter(item => {
          if (item.objectType === 'Plan') {
            // Plan is kept if any of its goals are in goalIdsToFilterBy
            return goalData.some(g => 
              (g.plan || []).includes(item.id) && goalIdsToFilterBy.has(g.id)
            );
          }
          if (item.objectType === 'Goal') {
            return goalIdsToFilterBy.has(item.id);
          }
          if (item.objectType === 'Metric') {
            let directTagMatch = false;
            if ('tag' in item && item.tag && typeof item.tag === 'string') {
              directTagMatch = activeFilters.some(name => {
                const t = tags.find(tag => tag.name === name);
                return t?.id === item.tag; // item.tag is known to be a string here
              });
            }

            let relatedToFilteredGoal = false;
            // Ensure 'goal' exists on item, is not null/undefined, and is an array before trying to use .some()
            if ('goal' in item && item.goal && Array.isArray(item.goal)) {
              relatedToFilteredGoal = (item.goal as string[]).some((goalId: string) => goalIdsToFilterBy.has(goalId));
            }
            return relatedToFilteredGoal || directTagMatch;
          }
          return false; // Should not happen if objectType is always set
        });
      } else {
        // If activeFilters are present but no matching tags/goals found, show nothing from tag filtering step
        tagFilteredItems = [];
      }
    }

    // 3. Search Filtering
    const trimmedQuery = searchQuery.trim().toLowerCase();
    let searchFilteredItems = tagFilteredItems;
    if (trimmedQuery) {
      searchFilteredItems = tagFilteredItems.filter(item => {
        const nameMatch = item.name?.toLowerCase().includes(trimmedQuery);
        let orgMatch = false;
        let orgNameMatch = false;

        if (Array.isArray(item.org)) {
          orgMatch = item.org.some(o => typeof o === 'string' && o.toLowerCase().includes(trimmedQuery));
        } else if (item.org) {
          orgMatch = (item.org as string).toLowerCase().includes(trimmedQuery);
        }

        if (Array.isArray(item.orgName)) {
          orgNameMatch = item.orgName.some(on => typeof on === 'string' && on.toLowerCase().includes(trimmedQuery));
        } else if (item.orgName) {
          orgNameMatch = (item.orgName as string).toLowerCase().includes(trimmedQuery);
        }
        
        // For Metrics, also check orgAcronym (assuming it's specific to metrics)
        if (item.objectType === 'Metric' && Array.isArray(item.orgAcronym)) {
            const acronymMatch = item.orgAcronym.some(acronym => typeof acronym === 'string' && acronym.toLowerCase().includes(trimmedQuery));
            return nameMatch || orgMatch || orgNameMatch || acronymMatch;
        }

        return nameMatch || orgMatch || orgNameMatch;
      });
    }

    // 4. Sorting
    let sortedItems = [...searchFilteredItems];
    if (sortOption === "A-Z") {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Z-A") {
      sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "Trending") {
      sortedItems.sort((a, b) => {
        const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
        const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
        if (dateA !== dateB) return dateB - dateA; // Descending for more recent
        return a.name.localeCompare(b.name);
      });
    }

    return sortedItems;
  }, [planData, goalData, metricsWithTags, statusOption, activeFilters, tags, searchQuery, sortOption, resultsByMetric]);

  // These are the tabs generated based on the content of itemsToDisplay
  const dynamicTabs = useMemo(() => {
    const counts: Record<string, number> = {
      Everything: itemsToDisplay.length, // Initialize with the total count for 'All'
    };
    itemsToDisplay.forEach(item => {
      const type = item.objectType as string;
      counts[type] = (counts[type] || 0) + 1;
    });
    const generatedTabs = Object.entries(counts)
      .map(([label, count]) => {
        let displayLabel = label;
        if (label === 'Plan') displayLabel = 'Plans';
        else if (label === 'Goal') displayLabel = 'Goals';
        else if (label === 'Metric') displayLabel = 'Metrics';
        // Ensure all tabs have a 'name' property for FilterTabs component
        return { name: displayLabel, count, originalLabel: label };
      })
      .filter(tab => tab.originalLabel !== 'Everything' && tab.count > 0); // Filter out 'Everything' here, it's added separately

    return [
      { name: "Everything", count: itemsToDisplay.length, originalLabel: "Everything" }, 
      ...generatedTabs
    ];
  }, [itemsToDisplay]);

  // Build the two‐level hierarchy for the sunburst
  const hierarchyData = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};

    for (const m of itemsToDisplay) {
      if (m.objectType === 'Metric') {
        const res = resultsByMetric[m.id];
        const trend = res?.resultTrend || "No Data";
        const org = m.orgAcronym?.[0] ?? "Unknown";

        if (!grouped[trend]) grouped[trend] = {};
        grouped[trend][org] = (grouped[trend][org] || 0) + 1;
      }
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
  }, [itemsToDisplay, resultsByMetric]);

  const bubbleChartData = useMemo(() => {
    const trendCounts: Record<string, number> = {};
    for (const m of itemsToDisplay) {
      if (m.objectType === 'Metric') {
        const trend = resultsByMetric[m.id]?.resultTrend ?? "No Data";
        trendCounts[trend] = (trendCounts[trend] || 0) + 1;
      }
    }
    return Object.entries(trendCounts).map(([trend, count]) => ({ trend, count }));
  }, [itemsToDisplay, resultsByMetric]);

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
    return result;
  }, [searchQuery, statusOption, activeFilters, metricResults, plans, tags, metricsWithTags]);

  const finalItemsForGrid = useMemo(() => {
    if (activeTab === "Everything") {
      return itemsToDisplay;
    }
    let singularActiveTab = activeTab;
    if (activeTab === "Plans") singularActiveTab = "Plan";
    else if (activeTab === "Goals") singularActiveTab = "Goal";
    else if (activeTab === "Metrics") singularActiveTab = "Metric";
    return itemsToDisplay.filter(item => item.objectType === singularActiveTab);
  }, [itemsToDisplay, activeTab]);

  const totalPages = useMemo(() => {
    return Math.ceil(finalItemsForGrid.length / ITEMS_PER_PAGE);
  }, [finalItemsForGrid, ITEMS_PER_PAGE]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return finalItemsForGrid.slice(startIndex, endIndex);
  }, [finalItemsForGrid, currentPage, ITEMS_PER_PAGE]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters or tabs change
  }, [finalItemsForGrid]); // finalItemsForGrid changes when filters/tabs change

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
        placeholder="Search priorities of the U.S. government"
      />
      {/* display selected tag pills */}
      <ActiveFilters
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        resultCount={itemsToDisplay.length}
      />
<div className="bg-[#F5F5F5] flex justify-center">
  <FilterTabs tabs={dynamicTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
</div>
      <main className="bg-[#F5F5F5] px-8 py-[28px]">
        {(finalItemsForGrid && finalItemsForGrid.length > 0) && (
          <>
          <div className="max-w-[1280px] mx-auto">
            <div className="columns-3 gap-5">
            {paginatedItems.map((item, idx) => {
  let enrichedData: any = item;
  if (item.objectType === "Metric") {
    const metricId = item.id;
    const precalculatedResults = enrichedMetricResultsById.get(metricId);
    enrichedData = {
      ...item,
      result: precalculatedResults ? precalculatedResults.result : [],
      targetResult: precalculatedResults ? precalculatedResults.targetResult : [],
    };
  }
  return (
    <div key={item.id || idx} className="break-inside-avoid mb-5">
      <Placard>
      <Card className="group">
        <CardHeader>
          <div className="flex items-top justify-between">
            <Badge variant="outline">{item.objectType}</Badge>
            <span className="text-sm text-gray-600">
              {item.startDate ? new Date(item.startDate).getFullYear() : ""}&ndash;{item.endDate ? new Date(item.endDate).getFullYear() : ""}
            </span>
          </div>
          <CardPreviewTitle
            name={item.name}
            startDate={item.startDate}
            endDate={item.endDate}
            objectType={item.objectType}
            orgAcronym={Array.isArray(item.orgAcronym) ? item.orgAcronym[0] : item.orgAcronym}
          />
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <CardPreviewBody data={enrichedData} />
        </CardContent>
        <hr className="border-t-1 border-gray-200 mx-[1px] group-hover:border-gray-400 mt-4" />
        <CardFooter>
          <CardPreviewFooter
            orgs={Array.isArray(item.orgAcronym) ? item.orgAcronym : (item.orgAcronym ? [item.orgAcronym] : [])}
            orgNames={Array.isArray(item.orgName) ? item.orgName : (item.orgName ? [item.orgName] : [])}
          />
        </CardFooter>
      </Card>
      </Placard>
    </div>
  );
})}
            </div>
          </div>
          </>
        )}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                {[...Array(totalPages).keys()].map(pageNumber => (
                  <PaginationItem key={pageNumber + 1}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentPage(pageNumber + 1); }}
                      isActive={currentPage === pageNumber + 1}
                    >
                      {pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {/* Basic ellipsis and next logic for now, can be expanded */}
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
}