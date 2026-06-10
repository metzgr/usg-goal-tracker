"use client";

import React from "react";
import FilterSidebar from "./filter-sidebar";
import { DropdownButton } from "@/components/base/button";

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusOption: string;
  onStatusClick: () => void;
  sortOption: string;
  onSortClick: () => void;
  possibleFilters: string[];
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  placeholder?: string;
}

export default function FiltersBar({
  searchQuery,
  onSearchChange,
  statusOption,
  onStatusClick,
  sortOption,
  onSortClick,
  possibleFilters,
  activeFilters,
  setActiveFilters,
  placeholder = "Search the Great Experiment at work",
}: FiltersBarProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white">
      {/* Filters button opens the sidebar */}
      <FilterSidebar
        possibleFilters={possibleFilters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />

      {/* Search input */}
      <div className="flex-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <div className="grid w-full grid-cols-1">
              <input
                type="search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="peer col-start-1 row-start-1 block w-full rounded-[3px] bg-gray-50 py-1.5 pr-3 pl-[60px] text-[18px] tracking-tight text-gray-950 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 font-serif italic font-normal placeholder:font-serif placeholder:italic placeholder:font-normal placeholder:text-[18px] focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-[18px]/6 h-[48px]"
              />
              <img
                src="/icons/search-icon.svg"
                alt="Magnify glass"
                width={20}
                height={20}
                className="pointer-events-none col-start-1 row-start-1 ml-7 self-center opacity-40 peer-focus:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status dropdown */}
      <DropdownButton
        label="Status"
        value={statusOption}
        onClick={onStatusClick}
        icon="/icons/arrow-dropdown.svg"
      />

      {/* Sort dropdown */}
      <DropdownButton
        label="Sort"
        value={sortOption}
        onClick={onSortClick}
        icon="/icons/arrow-dropdown.svg"
      />
    </div>
  );
}
