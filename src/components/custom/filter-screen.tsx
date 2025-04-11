// src/components/custom/FilterScreen.tsx
"use client";

import React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "src/components/ui/sheet";
import { Checkbox } from "src/components/ui/checkbox";
import { Label } from "src/components/ui/label";
import { ScrollArea } from "src/components/ui/scroll-area";

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
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 h-[48px] rounded-[3px] px-[28px] py-2.5 font-bold text-gray-950 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 outline-1 -outline-offset-1 outline-gray-300"
        >
          <img src="/icons/filter-icon.svg" alt="Filter" width={20} height={20} />
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