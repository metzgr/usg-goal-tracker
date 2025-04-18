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
        <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
          <div className="flex items-center">
            <div className="grid w-full grid-cols-1">
              <input
                type="search"
                placeholder="Search the U.S. government at work"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
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
