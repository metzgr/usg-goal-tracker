"use client";

import React, { useState } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Card } from "src/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "src/components/ui/select";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "src/components/ui/sheet";
import { Checkbox } from "src/components/ui/checkbox";
import { Label } from "src/components/ui/label";
import { ScrollArea } from "src/components/ui/scroll-area";
import UsgBanner from "src/components/custom/usg-banner";
import CardHeader from "src/components/custom/card-header";
import CardFooter from "src/components/custom/card-footer";
import CardBody from "src/components/custom/card-body";
import Placard from "src/components/custom/placard";
import Navigation from "src/components/custom/navigation";

// Format date helper.
const formatYear = (dateString: string) => new Date(dateString).getFullYear();

// Dummy card data for demonstration
const cardData = [
  { 
    id: 1, 
    title: "Strategic Plan", 
    topic: "Topic A",
    orgAcronym: "USDA",
    orgFullName: "U.S. Department of Agriculture",
    orgAvatar: "/org1.png",
    cardType: "Plan",
    startDate: "2023-01-01",
    endDate: "2023-06-30",
    totalIndicators: 100,
    indicatorsProgressed: 64,
    changeIndicatorsProgressed: 2,
    artwork: "wheat",
    patternOption: "tile",
    avatar1: "usda",
  },
  { 
    id: 2, 
    title: "American households with consistent, dependable access to food", 
    topic: "Topic B",
    orgAcronym: "USDA",
    orgFullName: "U.S. Department of Agriculture",
    orgAvatar: "usda",
    cardType: "Indicator",
    startDate: "2023-03-01",
    endDate: "2023-09-30",
    dataTargets: [1000, 1000, 1000, 1000, 1000, 1000, 1000],
    dataActuals: [200, 600, 1300, 700, 1800, 800, 600],
    progressPercent: 95,
    progressed: true,
    targetDirection: "increase",
    avatar1: "usda",
  },
  { 
    id: 4, 
    title: "Veteran Customer Experience", 
    topic: "Topic C",
    orgAcronym: "USDA",
    orgFullName: "U.S. Department of Veterans Affairs",
    orgAvatar: "usda",
    cardType: "Goal",
    startDate: "2023-05-01",
    endDate: "2023-12-31",
    artwork: "veteran",
    orgAcronym: "VA",
    avatar1: "va",
  },
  { 
    id: 3, 
    title: "Facilitate Rural Prosperity and Economic Development", 
    topic: "Topic C",
    orgAcronym: "USDA",
    orgFullName: "U.S. Department of Agriculture",
    orgAvatar: "usda",
    cardType: "Goal",
    startDate: "2023-05-01",
    endDate: "2023-12-31",
    artwork: "farmer",
    avatar1: "usda",
  },
  { 
    id: 8, 
    title: "Combat Human Traffiking", 
    topic: "Topic A",
    orgAcronym: "DHS",
    orgFullName: "U.S. Department of Homeland Security",
    avatar1: "dhs",
    cardType: "Goal",
    startDate: "2023-05-01",
    endDate: "2023-12-31",
    artwork: "hands",
  },

  { 
    id: 5, 
    title: "New small businesses", 
    topic: "Topic B",
    orgAcronym: "SBA",
    orgFullName: "Small Business Administration",
    orgAvatar: "usda",
    cardType: "Indicator",
    startDate: "2023-03-01",
    endDate: "2023-09-30",
    dataTargets: [200, 600, 1300, 700, 1800, 1000, 3000],
    dataActuals: [1800, 1200, 1600, 500, 1300, 700, 1700],
    progressPercent: 95,
    progressed: true,
    targetDirection: "increase",
    avatar1: "sba",
  },
  { 
    id: 7, 
    title: "Safeguard and Improve National Health", 
    topic: "Topic C",
    orgAcronym: "HHS",
    orgFullName: "U.S. Department of Health and Human Services",
    cardType: "Goal",
    startDate: "2023-05-01",
    endDate: "2023-12-31",
    artwork: "ambulance",
    avatar1: "hhs",
  },
  { 
    id: 6, 
    title: "Consumer Price Index", 
    topic: "Topic A",
    orgAcronym: "DOL",
    orgFullName: "U.S. Department of Labor",
    orgAvatar: "dol",
    cardType: "Indicator",
    startDate: "2023-03-01",
    endDate: "2023-09-30",
    dataTargets: [],
    dataActuals: [1800, 1200, 1600, 500, 1300, 700, 1700],
    progressPercent: 95,
    progressed: true,
    targetDirection: "increase",
    avatar1: "dol",
  },
  { 
    id: 9, 
    title: "Strategic Plan", 
    topic: "Topic C",
    orgAcronym: "HUD",
    orgFullName: "U.S. Department of Housing and Urban Development",
    cardType: "Plan",
    startDate: "2023-01-01",
    endDate: "2023-06-30",
    totalIndicators: 100,
    indicatorsProgressed: 75,
    changeIndicatorsProgressed: 2,
    artwork: "house",
    patternOption: "tile",
    avatar1: "hud",
  },
  { 
    id: 10, 
    title: "Highway Safety", 
    topic: "Topic C",
    orgAcronym: "DOT",
    orgFullName: "U.S. Department of Transportation",
    avatar1: "dot",
    cardType: "Goal",
    startDate: "2023-05-01",
    endDate: "2023-12-31",
    artwork: "highway",
  },
  
  // ...more dummy data as needed
];

// Header Component
function Header() {
  return (
    <header>
      <UsgBanner />
      <Navigation />
    </header>
  );
}

// SearchBar Component
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

// FilterSidebar Component with checkable filters
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
          Topics
          {activeFilters.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Topics</SheetTitle>
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

// ActiveFilters Component displays selected filters above the catalog
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
    <div className="h-12 flex items-center gap-2 p-2 overflow-auto">
      {activeFilters.map((filter) => (
        <div key={filter} className="flex items-center space-x-1 bg-gray-200 px-2 py-1 rounded">
          <span>{filter}</span>
          <button onClick={() => removeFilter(filter)} className="text-sm text-red-500">
            x
          </button>
        </div>
      ))}
    </div>
  );
}

// CardCatalog Component that displays filtered cards
function CardCatalog({ cards }: { cards: typeof cardData }) {
  if (cards.length === 0) {
    return <p className="p-4">No results found.</p>;
  }
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-5">
      {cards.map((card) => (
        <div key={card.id} style={{ breakInside: "avoid" }} className="mb-5">
          <Placard className="group-hover:border-gray-700">
            <Card className="group-hover:border-gray-700">
              {/* Card Header */}
              <CardHeader
                title={card.title}
                startDate={formatYear(card.startDate)}
                endDate={formatYear(card.endDate)}
                cardType={card.cardType}
                orgAcronym={card.orgAcronym}
              />
              {/* Card Body */}
              {card.cardType === "Plan" && (
                <div>
                  <CardBody
                    cardType={card.cardType}
                    artwork={card.artwork}
                    patternOption={card.patternOption}
                    totalIndicators={card.totalIndicators}
                    indicatorsProgressed={card.indicatorsProgressed}
                    changeIndicatorsProgressed={card.changeIndicatorsProgressed}
                    dataActuals={card.dataActuals}
                    dataTargets={card.dataTargets}
                  />
                </div>
              )}
              {card.cardType === "Indicator" && (
                <CardBody
                  cardType={card.cardType}
                  artwork={card.artwork}
                  patternOption={card.patternOption}
                  totalIndicators={card.totalIndicators}
                  indicatorsProgressed={card.indicatorsProgressed}
                  changeIndicatorsProgressed={card.changeIndicatorsProgressed}
                  dataActuals={card.dataActuals}
                  dataTargets={card.dataTargets}
                />
              )}
              {card.cardType === "Goal" && (
                <div>
                  <CardBody
                    cardType={card.cardType}
                    artwork={card.artwork}
                    patternOption={card.patternOption}
                    totalIndicators={card.totalIndicators}
                    indicatorsProgressed={card.indicatorsProgressed}
                    changeIndicatorsProgressed={card.changeIndicatorsProgressed}
                    dataActuals={card.dataActuals}
                    dataTargets={card.dataTargets}
                  />
                </div>
              )}
              {/* Card Footer */}
              <CardFooter
                orgFullName={card.orgFullName}
                orgAcronym={card.orgAcronym}
                avatar1={card.avatar1}
                avatar2={card.avatar2}
                avatar3={card.avatar3}
                avatar4={card.avatar4}
              />
            </Card>
          </Placard>
        </div>
      ))}
    </div>
  );
}

// Explore Page
export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("Trending");
  const [statusOption, setStatusOption] = useState("Active");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const possibleFilters = ["Topic A", "Topic B", "Topic C"];

  // Filter cards based on search query and active topic filters
  const filteredCards = cardData.filter((card) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      card.title.toLowerCase().includes(query) ||
      card.orgFullName.toLowerCase().includes(query) ||
      card.orgAcronym.toLowerCase().includes(query);
    const matchesTopic = activeFilters.length === 0 || activeFilters.includes(card.topic);
    return matchesSearch && matchesTopic;
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
        </div>
        <ActiveFilters activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
        <div className="max-w-[1280px] mx-auto">
          <CardCatalog cards={filteredCards} />
        </div>
      </main>
    </div>
  );
}