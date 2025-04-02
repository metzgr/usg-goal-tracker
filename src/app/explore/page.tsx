"use client";

import React, { useState } from "react";
import { Button } from "src/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "src/components/ui/dropdown-menu";
import { Input } from "src/components/ui/input";
import { Card } from "src/components/ui/card";

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
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOption: string;
  setFilterOption: (option: string) => void;
}) {
  return (
    <div className="flex items-center p-4">
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow mr-2"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{filterOption}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setFilterOption("Trending")}>Trending</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterOption("Latest")}>Latest</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterOption("Popular")}>Popular</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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

  // Filter cards based on search query (ignoring filterOption for now)
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
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />
      <CardCatalog cards={filteredCards} />
    </div>
  );
}