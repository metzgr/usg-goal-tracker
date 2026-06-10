// src/components/custom/FilterScreen.tsx
"use client";

import React from "react";
import { FilterButton } from "@/components/base/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/filters/sheet";
import { Checkbox } from "@/components/filters/checkbox";
import { Label } from "@/components/filters/label";
import { ScrollArea } from "@/components/filters/scroll-area";

type FilterScreenProps = {
  possibleFilters: string[];
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
};

export default function FilterScreen({ possibleFilters, activeFilters, setActiveFilters }: FilterScreenProps) {
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
        <FilterButton showDot={activeFilters.length > 0}>
          <img src="/icons/filter-icon.svg" alt="Filter" width={20} height={20} />
          Filters
        </FilterButton>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
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
          <SheetFooter className="border-t border-gray-200">
            <button
              onClick={() => setActiveFilters([])}
              className="flex w-full items-center justify-center rounded-[3px] bg-gray-950 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 cursor-pointer"
            >
              Clear all
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}