"use client";

import React, { useState } from "react";
import tags from "@/data/tag.json";
import metrics from "@/data/metric.json";
import metricResults from "@/data/metricResult.json"; // Added import for metricResults
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "src/components/ui/table";
import { Input } from "src/components/ui/input";
import UsgBanner from "src/components/custom/usg-banner";
import Navigation from "src/components/custom/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "src/components/ui/sheet";
import { Checkbox } from "src/components/ui/checkbox";
import { Label } from "src/components/ui/label";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Button } from "src/components/ui/button";

// Format date helper.
const formatYear = (dateString: string) => new Date(dateString).getFullYear();

// Helper function to group metricResults by metric ID
const groupMetricResultsById = (results: any[]) => {
  return results.reduce((acc, result) => {
    const metricId = result.metric[0];
    if (!acc[metricId]) {
      acc[metricId] = [];
    }
    acc[metricId].push(result);
    return acc;
  }, {});
};

const groupedMetricResults = groupMetricResultsById(metricResults);

function Header() {
  return (
    <header>
      <UsgBanner />
      <Navigation activeItem="Explore" />
    </header>
  );
}

function SearchBar({
  searchQuery,
  setSearchQuery,
  filterOption,
  setFilterOption,
  statusOption,
  setStatusOption,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOption: string;
  setFilterOption: (option: string) => void;
  statusOption: string;
  setStatusOption: (option: string) => void;
}) {
  return (
    <div className="flex items-center flex-grow space-x-4">
      <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
        <div className="flex items-center">
          <div className="grid w-full grid-cols-1">
            <input
              name="search"
              type="search"
              placeholder="Search the U.S. government at work"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-start-1 row-start-1 block w-full rounded-[3px] bg-gray-50 py-1.5 pr-3 pl-13.5 text-base text-gray-950 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-950 font-bold placeholder:font-bold placeholder:text-[16px] focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-[16px]/6 h-[48px]"
            />
            <img
              src="/icons/search-icon.svg"
              alt="Magnify glass"
              width={20}
              height={20}
              className="pointer-events-none col-start-1 row-start-1 ml-7 self-center"
            />
          </div>
        </div>
      </div>
      <div className="relative flex items-stretch h-[48px]">
        <div className="absolute left-[22px] -top-[7px] h-[18px] px-[5px] bg-white text-xs text-gray-500 font-medium leading-none z-10">
          Status
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-[3px] px-[28px] py-2.5 font-bold text-gray-950 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 outline-1 -outline-offset-1 outline-gray-300 w-full"
        >
          {statusOption}
          <img
            src="/icons/arrow-dropdown.svg"
            alt="Arrow Dropdown"
            width={20}
            height={20}
          />
        </button>
      </div>

      <div className="relative flex items-stretch h-[48px]">
        <div className="absolute left-[22px] -top-[7px] h-[18px] px-[5px] bg-white text-xs text-gray-500 font-medium leading-none z-10">
          Sort
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-[3px] px-[28px] py-2.5 font-bold text-gray-950 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 outline-1 -outline-offset-1 outline-gray-300 w-full"
        >
          {filterOption}
          <img
            src="/icons/arrow-dropdown.svg"
            alt="Arrow Dropdown"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}

function FilterSidebar({
  possibleFilters,
  activeFilters,
  setActiveFilters,
}: {
  possibleFilters: string[];
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
}) {
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 h-[48px] rounded-[3px] px-[28px] py-2.5 font-bold text-gray-950 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 outline-1 -outline-offset-1 outline-gray-300"
        >
          <img
            src="/icons/filter-icon.svg"
            alt="Filter"
            width={20}
            height={20}
          />
          Filters
          {activeFilters.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-64">
          <div className="p-4 space-y-2">
            {possibleFilters.map((filter) => (
              <div key={filter} className="flex items-center space-x-2">
                <Checkbox
                  checked={activeFilters.includes(filter)}
                  onCheckedChange={() => toggleFilter(filter)}
                />
                <Label>{filter}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
        {activeFilters.length > 0 && (
          <div className="p-4">
            <button
              onClick={() => setActiveFilters([])}
              className="bg-red-500 text-white px-2 py-1 rounded w-full"
            >
              Clear All
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ActiveFilters({
  activeFilters,
  setActiveFilters,
}: {
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
}) {
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  return (
    <div className="h-12 flex items-center gap-2 p-4 overflow-auto">
      {activeFilters.map((filter) => (
        <span
          key={filter}
          className="mt-2 inline-flex items-center gap-x-0.5 rounded-sm bg-gray-800 px-2 py-1 text-xs text-gray-50"
        >
          {filter}
          <button
            type="button"
            onClick={() => removeFilter(filter)}
            className="group relative -mr-1 size-3.5 rounded-xs hover:bg-gray-500/20"
          >
            <span className="sr-only">Remove</span>
            <svg
              viewBox="0 0 14 14"
              className="size-3.5 stroke-white/75 group-hover:stroke-white/75"
            >
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
            <span className="absolute -inset-1" />
          </button>
        </span>
      ))}
    </div>
  );
}

function CardCatalog({ tableData }: { tableData: typeof tableData }) {
  if (tableData.length === 0) {
    return <p className="p-4">No results found.</p>;
  }
  return (
    <div className="mx-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Org</TableHead>
            <TableHead>Goal</TableHead>
            <TableHead>Objective</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Metric</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Trendline</TableHead> {/* Added TableHead for Trendline */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((data) => {
          const results = groupedMetricResults[data.id] || [];
            const actualResults = results
              .sort((a, b) => {
                const yearDiff = a.fiscalYear - b.fiscalYear;
                return yearDiff !== 0 ? yearDiff : a.fiscalQuarter - b.fiscalQuarter;
              })
              .map((r) => r.result);
            const maxY = Math.max(...actualResults);
            const minY = Math.min(...actualResults);
            const points = actualResults.map((value, index) => {
              const x = (index / (actualResults.length - 1)) * 100; // Scale to width
              const y = ((value - minY) / (maxY - minY)) * 40; // Scale to height
              return `${x},${40 - y}`; // Invert y for SVG coordinate system
            }).join(" ");

            return (
              <TableRow key={data.id}>
                <TableCell>{data.orgAcronym[0]}</TableCell><TableCell>{data.goalName[0]}</TableCell><TableCell>{data.objectiveName[0]}</TableCell><TableCell>{data.mostRecentTargetDirection}</TableCell><TableCell>{data.name}</TableCell><TableCell>{data.mostRecentPercentProgress}</TableCell><TableCell>
                  <svg width="100" height="40">
                    <polyline points={points} fill="none" stroke="blue" strokeWidth="2" />
                  </svg>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("Trending");
  const [statusOption, setStatusOption] = useState("Active");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // Use possible filters imported from tag.json
  const possibleFilters = tags;

  // Merge metrics data and add type field
  const tableData = metrics.map((m) => ({ ...m, type: "metric" }));

  // Filter table data based on search query, active filters, and active tab.
  const filteredTableData = tableData.filter((data) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (data.orgAcronym?.[0]?.toLowerCase().includes(query) ?? false) ||
      (data.name?.toLowerCase().includes(query) ?? false);
    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.some((filter) => data.tags?.includes(filter));
    return matchesSearch && matchesFilters;
  });

  return (
    <div>
      <Header />
      <main className="bg-[#F5F5F5] pb-12">
        <div className="flex items-center space-x-4 p-4 bg-white">
          <FilterSidebar
            possibleFilters={possibleFilters}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
            statusOption={statusOption}
            setStatusOption={setStatusOption}
          />

          <div className="flex items-stretch h-[48px]">
            <button
              type="button"
              className="inline-flex items-center gap-x-2 rounded-none rounded-l-[3px] px-3.5 py-2.5 font-bold text-gray-950 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 outline-1 -outline-offset-1 outline-gray-300 h-full"
            >
              <img
                src="/icons/card-filter-icon.svg"
                alt="Dropdown Arrow"
                width={20}
                height={20}
              />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-x-2 rounded-none rounded-r-[3px] px-3.5 py-2.5 font-bold text-gray-950 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 outline-1 -outline-offset-1 outline-gray-300 h-full -ml-px"
            >
              <img
                src="/icons/table-filter-icon.svg"
                alt="Dropdown Arrow"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
        <ActiveFilters activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
        <div className="">
          <CardCatalog tableData={filteredTableData} />
        </div>
      </main>
    </div>
  );
}