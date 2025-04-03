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
import Placard from "src/components/custom/placard";

// Format date

const formatYear = (dateString: string) => new Date(dateString).getFullYear();

// Dummy card data for demonstration
const cardData = [
    { 
      id: 1, 
      title: "Goal One", 
      // No longer using 'description' for card body; using new fields.
      topic: "Topic A",
      orgAcronym: "ABC",
      orgFullName: "Acme Business Corporation",
      orgAvatar: "/org1.png",
      cardType: "Plan",
      startDate: "2023-01-01",
      endDate: "2023-06-30",
      totalIndicators: 10,
      indicatorsProgressed: 6,
      changeIndicatorsProgressed: 2,
      artwork: "plan1.jpg",
      patternOption: "fill",
      avatar1: "usda",
    },
    { 
      id: 2, 
      title: "Goal Two", 
      topic: "Topic B",
      orgAcronym: "XYZ",
      orgFullName: "Xylophone Youth Zone",
      orgAvatar: "/org2.png",
      cardType: "Indicator",
      startDate: "2023-03-01",
      endDate: "2023-09-30",
      dataTargets: [100, 105, 110, 115, 120, 125, 130],
      dataActuals: [98, 107, 108, 116, 118, 127, 132],
      dataPercentChanges: [-2, 2, -1, 1, -2, 1, 2],
      progressPercent: 95,
      progressed: true,
      targetDirection: "increase"
    },
    { 
      id: 3, 
      title: "Goal Three", 
      topic: "Topic C",
      orgAcronym: "DEF",
      orgFullName: "Delta Enterprise Foundation",
      orgAvatar: "/org3.png",
      cardType: "Goal",
      startDate: "2023-05-01",
      endDate: "2023-12-31",
      artwork: "goal1.jpg"
    },
  // ...more data as needed
];

// Header Component
function Header() {
  return (

    <header>
        <UsgBanner />
        <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
        <span className="font-bold">MyApp</span>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/">Home</a></li>
          <li><a href="/explore">Explore</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </nav>
      </div>
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
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow"
      />
      <Select value={statusOption} onValueChange={setStatusOption}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterOption} onValueChange={setFilterOption}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Trending">Trending</SelectItem>
          <SelectItem value="Latest">Latest</SelectItem>
          <SelectItem value="Popular">Popular</SelectItem>
        </SelectContent>
      </Select>
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
        <Button variant="outline" className="relative">
          Topics
          {activeFilters.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
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
          <div key={card.id} style={{ breakInside: 'avoid' }} className="mb-5">
            <Placard>
            <Card className="">
              {/* Card Header: badge with card type and date range */}
              <CardHeader
  title={card.title}
  startDate={formatYear(card.startDate)}
  endDate={formatYear(card.endDate)}
  cardType= {card.cardType}

/>
              <h3 className="font-bold mb-2">{card.title}</h3>
              {/* Conditional Card Body based on card type */}
              {card.cardType === "Plan" && (
                <div>
                  <p>Total Indicators: {card.totalIndicators}</p>
                  <p>Indicators Progressed: {card.indicatorsProgressed}</p>
                  <p>Change in Progressed: {card.changeIndicatorsProgressed}</p>
                  <p>
                    % Progressed:{" "}
                    {card.totalIndicators
                      ? ((card.indicatorsProgressed / card.totalIndicators) * 100).toFixed(1)
                      : 0}
                    %
                  </p>
                  <p>Artwork: {card.artwork}</p>
                  <p>Pattern: {card.patternOption}</p>
                </div>
              )}
              {card.cardType === "Indicator" && (
                <div>
                  <p>Last 7 Targets: {card.dataTargets.join(", ")}</p>
                  <p>Last 7 Actuals: {card.dataActuals.join(", ")}</p>
                  <p>Last 7 % Change: {card.dataPercentChanges.join(", ")}%</p>
                  <p>% Progress: {card.progressPercent}%</p>
                  <p>Progressed: {card.progressed ? "Yes" : "No"}</p>
                  <p>Target Direction: {card.targetDirection}</p>
                </div>
              )}
              {card.cardType === "Goal" && (
                <div>
                  <p>Artwork: {card.artwork}</p>
                </div>
              )}
              {/* Card Footer: organization details */}
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
    const matchesSearch = (
      card.title.toLowerCase().includes(query) ||
      card.orgFullName.toLowerCase().includes(query) ||
      card.orgAcronym.toLowerCase().includes(query)
    );
    const matchesTopic = activeFilters.length === 0 || activeFilters.includes(card.topic);
    return matchesSearch && matchesTopic;
  });

  return (
    <div>
      <Header />
      <main className="bg-[#F5F5F5]">
    
      <div className="flex items-center space-x-4 p-4">
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