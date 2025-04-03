"use client";

import React, { useState } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Card } from "src/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "src/components/ui/select";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "src/components/ui/sheet";
import { Checkbox } from "src/components/ui/checkbox";
import { Label } from "src/components/ui/label";

// Dummy card data for demonstration
const cardData = [
  { id: 1, title: "Goal One", description: "Description for goal one" },
  { id: 2, title: "Goal Two", description: "Description for goal two" },
  { id: 3, title: "Goal Three", description: "Description for goal three" },
  // ...more data as needed
];

// Header Component
function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
        <span className="font-bold">MyApp</span>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/">Home</a></li>
          <li><a href="/explore">Explore</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </nav>
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
    <div className="flex flex-wrap gap-2 p-4">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {cards.map((card) => (
        <Card key={card.id} className="p-4">
          <h3 className="font-bold mb-2">{card.title}</h3>
          <p>{card.description}</p>
        </Card>
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

  // Filter cards based on search query (active filters not applied to catalog yet)
  const filteredCards = cardData.filter((card) => {
    const query = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <Header />
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
      <CardCatalog cards={filteredCards} />
    </div>
  );
}