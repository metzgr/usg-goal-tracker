"use client";

import React, { useState } from "react";
import Header from "@/components/custom/header";
import Placard from "@/components/base/placard";
import LineChart from "@/components/charts/line-chart";
import PieChart from "@/components/charts/pie-chart";
import Artwork from "@/components/charts/artwork";
import ProgressBarChart from "@/components/charts/progress-bar-chart";
import CardPreviewAvatar from "@/components/cards/cardPreviewAvatar";
import FilterSidebar from "@/components/filters/filter-sidebar";
import { ActiveFilters } from "@/components/filters/active-filters";
import { DropdownButton } from "@/components/base/button";

/* ------------------------------------------------------------------ */
/*  Fake data — recreates the Explore mockup card-for-card             */
/* ------------------------------------------------------------------ */

type Owner = { acronym: string; name: string };

type BaseCard = {
  kind: "plan" | "indicator" | "goal" | "collection";
  badge: string;
  dateLabel: string;
  title: string;
  // footer
  ownerLabel: string; // "USDA" or "Multiple Owners"
  ownerSub: string; // "U.S. Department of Agriculture" or "ONDCP · DHS · DHS · DHS · DHS"
  seals: string[]; // seal acronyms that have a png in /avatars/seals
  overflow?: number; // "+5"
  tags?: string[]; // filter tags (from tag.json) — used to test the Filter sidebar
};

// Available filters (from src/data/tag.json)
const FILTERS = ["Agriculture", "Priority 1", "Priority 2", "Priority 3"];

type PlanCard = BaseCard & {
  kind: "plan";
  planTitlePrefix?: string; // e.g. "USDA"
  pattern: string; // /artwork/pattern/<pattern>.jpg
  patternOption?: "tile" | "fill"; // "tile" (default) repeats; "fill" stretches one image over the slice
  indicators: number;
  improved: number;
  previousImproved: number;
};

type IndicatorCard = BaseCard & {
  kind: "indicator";
  headline: string; // "89%", "80K", "80.1K"
  change: { value: string; direction: "up" | "down" } | null;
  actuals: number[];
  targets: number[]; // [] = no targets (actuals-only chart)
  progress: {
    targetLevel: number;
    result: number;
    targetResult: number;
    percent: number;
  } | null;
};

type ArtCard = BaseCard & {
  kind: "goal" | "collection";
  artwork: string; // /artwork/goal/<artwork>.jpg
};

type Card = PlanCard | IndicatorCard | ArtCard;

const usda = { ownerLabel: "USDA", ownerSub: "U.S. Department of Agriculture", seals: ["usda"] };
const multi = {
  ownerLabel: "Multiple Owners",
  ownerSub: "ONDCP · DHS · DHS · DHS · DHS…",
  seals: ["dhs", "dod", "hhs", "va"],
  overflow: 5,
};

/* ----- Column 1 ----- */
const col1: Card[] = [
  {
    kind: "plan",
    badge: "Plan",
    dateLabel: "2025–28",
    title: "AGENCY STRATEGIC PLAN",
    planTitlePrefix: "USDA",
    pattern: "recVAZIfBVTCQwHs6", // wheat
    indicators: 100,
    improved: 64,
    previousImproved: 61,
    ...usda,
  },
  {
    kind: "indicator",
    badge: "Indicator",
    dateLabel: "2024–24",
    title: "American households with consistent, dependable access to food",
    headline: "89%",
    change: { value: "20.3K", direction: "down" },
    actuals: [62, 74, 58, 80, 66, 72, 41],
    targets: [55, 55, 55, 55, 55, 55, 55],
    progress: { targetLevel: 7, result: 89, targetResult: 100, percent: 32 },
    ...usda,
  },
  {
    kind: "indicator",
    badge: "Indicator",
    dateLabel: "2024–24",
    title: "Number of kidney transplants performed",
    headline: "80K",
    change: { value: "20.3K", direction: "up" },
    actuals: [28, 52, 38, 64, 48, 70, 86],
    targets: [80, 80, 80, 80, 80, 80, 80],
    progress: { targetLevel: 7, result: 80, targetResult: 100, percent: 32 },
    ownerLabel: "HHS",
    ownerSub: "U.S. Department of Health and Human Services",
    seals: ["hhs"],
  },
  {
    kind: "collection",
    badge: "Collection",
    dateLabel: "2024–24",
    title: "U.S. Social Indicators",
    artwork: "usa",
    ...multi,
    tags: ["Agriculture", "Priority 1"],
  },
];

/* ----- Column 2 ----- */
const col2: Card[] = [
  {
    kind: "goal",
    badge: "Goal",
    dateLabel: "2024–24",
    title: "Facilitate Rural Prosperity and Economic Development",
    artwork: "rectq3GGTbU7127Za", // farmer — matches "Stand Behind American Farmers" on /explore
    ...multi,
    tags: ["Agriculture", "Priority 1"],
  },
  {
    kind: "plan",
    badge: "Plan",
    dateLabel: "2024–24",
    title: "TRUMP 47 PRESIDENT'S MANAGEMENT AGENDA",
    pattern: "hand",
    patternOption: "fill",
    indicators: 100,
    improved: 72,
    previousImproved: 69,
    ownerLabel: "OMB",
    ownerSub: "Office of Management and Budget",
    seals: ["omb"],
  },
  {
    kind: "goal",
    badge: "Goal",
    dateLabel: "2024–24",
    title: "Safeguard and Improve National and Global Health Conditions and Outcomes",
    artwork: "recGpiVdPQNl5BdaS", // ambulance
    ...multi,
    tags: ["Priority 2", "Priority 3"],
  },
  {
    kind: "plan",
    badge: "Plan",
    dateLabel: "2024–24",
    title: "AGENCY STRATEGIC PLAN",
    planTitlePrefix: "HUD",
    pattern: "recy0JHpNRKuJGJQR", // house
    indicators: 100,
    improved: 64,
    previousImproved: 61,
    ...usda,
  },
];

/* ----- Column 3 ----- */
const col3: Card[] = [
  {
    kind: "indicator",
    badge: "Indicator",
    dateLabel: "2024–24",
    title: "Consumer Price Index",
    headline: "80.1K",
    change: { value: "4.1K", direction: "up" },
    actuals: [70, 40, 52, 30, 58, 48, 64],
    targets: [], // actuals-only
    progress: null,
    ownerLabel: "DOL",
    ownerSub: "U.S. Department of Labor",
    seals: ["dol"],
  },
  {
    kind: "goal",
    badge: "Goal",
    dateLabel: "2024–24",
    title: "Veteran Customer Experience",
    artwork: "veteran",
    ownerLabel: "Multiple Owners",
    ownerSub: "DOD · VA",
    seals: ["dod", "va"],
    tags: ["Priority 1"],
  },
  {
    kind: "plan",
    badge: "Plan",
    dateLabel: "2024–24",
    title: "NATIONAL DRUG CONTROL STRATEGY",
    pattern: "pills",
    patternOption: "fill",
    indicators: 100,
    improved: 58,
    previousImproved: 55,
    ownerLabel: "ONDCP",
    ownerSub: "Office of National Drug Control Policy",
    seals: ["dhs", "doj"],
  },
  {
    kind: "goal",
    badge: "Goal",
    dateLabel: "2024–24",
    title: "Combat Human Trafficking",
    artwork: "hands",
    ownerLabel: "DHS",
    ownerSub: "U.S. Department of Homeland Security",
    seals: ["dhs"],
    tags: ["Priority 2", "Priority 3"],
  },
  {
    kind: "indicator",
    badge: "Indicator",
    dateLabel: "2024–24",
    title: "Number of people experiencing homelessness",
    headline: "80K",
    change: { value: "20.3K", direction: "up" },
    actuals: [30, 55, 40, 66, 50, 72, 84],
    targets: [80, 80, 80, 80, 80, 80, 80],
    progress: { targetLevel: 7, result: 80, targetResult: 100, percent: 32 },
    ownerLabel: "HUD",
    ownerSub: "U.S. Department of Housing and Urban Development",
    seals: ["hud"],
  },
];

/* ------------------------------------------------------------------ */
/*  Card chrome                                                        */
/* ------------------------------------------------------------------ */

function CardBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-x-1.5 rounded-full px-[10px] text-sm/5 py-[2px] font-medium text-gray-700 ring-1 ring-inset ring-gray-300 group-hover:bg-gray-900 group-hover:ring-gray-900 group-hover:text-gray-100">
      {children}
    </span>
  );
}

function CardTitle({ card }: { card: Card }) {
  if (card.kind === "plan") {
    const fontSize = "text-3xl";
    return (
      <h2 className={`mt-4 font-serif text-gray-950 ${fontSize} font-bold uppercase text-center`}>
        {card.planTitlePrefix ? (
          <>
            <span>
              {card.planTitlePrefix} <span className="text-gray-400 font-normal">\</span>{" "}
            </span>
            {card.title}
          </>
        ) : (
          card.title
        )}
      </h2>
    );
  }
  const size = card.kind === "indicator" ? "text-xl leading-tight" : "text-2xl";
  return <h2 className={`mt-4 font-serif text-gray-950 ${size} text-left`}>{card.title}</h2>;
}

function CardFooter({ card }: { card: Card }) {
  return (
    <>
      <hr className="border-t-1 border-gray-200 mx-[1px] group-hover:border-gray-400 mt-4" />
      <div className="px-6">
        <div className="w-full flex justify-between items-center mt-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{card.ownerLabel}</p>
            <p className="text-xs text-gray-600">{card.ownerSub}</p>
          </div>
          <div className="flex-1 flex justify-end items-center">
            <CardPreviewAvatar orgs={card.seals} />
            {card.overflow ? (
              <span className="-ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-300 ring-[1.5px] ring-white text-[12px] font-medium text-gray-700">
                <span className="relative -left-[1px] -top-[0.75px]">+{card.overflow}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Card bodies                                                        */
/* ------------------------------------------------------------------ */

function PlanBody({ card }: { card: PlanCard }) {
  const pct = card.indicators ? Math.round((card.improved / card.indicators) * 100) : 0;
  const delta = card.improved - card.previousImproved;
  return (
    <div className="px-5">
    <div className="px-6 py-4 bg-gray-50">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          <div>
            <p className="text-[28px] leading-[1] font-black text-gray-950">{card.indicators}</p>
            <p className="mt-[2px] text-xs font-medium text-gray-900">Indicators</p>
          </div>
          <div className="text-right">
            <p className="text-[28px] leading-[1] font-black text-gray-950">{pct}%</p>
            <p className="mt-[2px] text-xs font-medium text-gray-900">Improving</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <div className="w-[188px] h-[188px]">
          <PieChart
            artwork={card.pattern}
            patternOption={card.patternOption ?? "tile"}
            indicatorsProgressed={card.improved}
            totalIndicators={card.indicators}
          />
        </div>
      </div>
      <div className="flex justify-center mt-[10px]">
        <p className="inline-flex items-center text-sm text-gray-950">
          <svg className="mr-[2px] w-[16px] h-[16px] fill-[#F9DBAF]" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="4" className="stroke-gray-900" strokeWidth="1" />
          </svg>
          <span className="font-bold mr-[2px]">{card.improved}</span> (+{delta}) went in the right direction
        </p>
      </div>
    </div>
    </div>
  );
}

function ChangeLabel({
  change,
  neutral = false,
}: {
  change: NonNullable<IndicatorCard["change"]>;
  neutral?: boolean;
}) {
  const up = change.direction === "up";
  // With no target, direction isn't good/bad — render brand black either way.
  const color = neutral ? "text-gray-950" : up ? "text-indigo-600" : "text-red-600";
  return (
    <div className={`flex items-center ${color}`}>
      <span className={`material-icons-sharp !text-[18px] ${up ? "rotate-[-90deg] mt-[4px]" : "rotate-[90deg] mt-[-4px]"}`}>
        play_arrow
      </span>
      <span className="text-sm font-medium">{change.value}</span>
    </div>
  );
}

// Mirrors LineChart's actual-line coloring: indigo when the latest value moved
// in the target's direction, red otherwise.
function actualsMovedCorrectly(actuals: number[], targets: number[]): boolean {
  const a = actuals.slice(-7);
  const t = targets.slice(-7);
  if (a.length < 2 || t.length < 2) return false;
  const last = a.length - 1;
  const prev = a.length - 2;
  const finalActual = a[last];
  const prevActual = a[prev];
  const finalTarget = t[last];
  const prevTarget = t[prev];
  if (finalTarget === prevTarget) {
    return finalActual > prevActual && finalActual >= finalTarget;
  }
  const targetUp = finalTarget > prevTarget;
  const targetDown = finalTarget < prevTarget;
  return (targetUp && finalActual > prevActual) || (targetDown && finalActual < prevActual);
}

function IndicatorBody({ card }: { card: IndicatorCard }) {
  const actualsColor =
    card.targets.length > 0 && actualsMovedCorrectly(card.actuals, card.targets)
      ? "fill-[#444ec7]"
      : "fill-red-600";
  return (
    <div className="px-5">
    <div className="px-6 py-4 bg-gray-50">
      <div className="flex justify-between mb-[10px]">
        <h5 className="text-[28px] leading-[1] font-black text-gray-950">{card.headline}</h5>
        {card.change && <ChangeLabel change={card.change} neutral={card.targets.length === 0} />}
      </div>
      <LineChart dataActuals={card.actuals} dataTargets={card.targets} />
      {card.targets.length > 0 ? (
        <div className="flex justify-center mt-[10px]">
          <p className="inline-flex items-center text-xs text-gray-950 mr-2">
            <svg className="w-[16px] h-[16px] fill-gray-950" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="4" />
            </svg>
            <span className="font-medium">Targets</span>
          </p>
          <p className="inline-flex items-center text-xs text-gray-950">
            <svg className={`w-[16px] h-[16px] ${actualsColor}`} viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="4" />
            </svg>
            <span className="font-medium">Actuals</span>
          </p>
        </div>
      ) : (
        <div className="flex justify-center mt-[10px]">
          <p className="inline-flex items-center text-xs text-gray-950">
            <svg className="w-[16px] h-[16px] fill-red-600" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="4" className="stroke-indigo-600" strokeWidth="2" />
            </svg>
            <span className="font-medium">Actuals</span>
          </p>
        </div>
      )}
      {card.progress && (
        <ProgressBarChart
          mostRecentResult={card.progress.result}
          mostRecentTargetLevel={card.progress.targetLevel}
          mostRecentTargetResult={card.progress.targetResult}
          mostRecentPercentProgress={card.progress.percent}
        />
      )}
    </div>
    </div>
  );
}

function ArtBody({ card }: { card: ArtCard }) {
  return (
    <div className="px-6 py-0">
      <Artwork artwork={card.artwork} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

function MockCard({ card }: { card: Card }) {
  return (
    <div className="break-inside-avoid mb-5">
      <Placard>
        <div className="group">
          <div className="px-6">
            <div className="flex items-top justify-between">
              <CardBadge>{card.badge}</CardBadge>
              <span className="text-sm text-gray-600">{card.dateLabel}</span>
            </div>
            <CardTitle card={card} />
          </div>
          <div className="mt-4">
            {card.kind === "plan" && <PlanBody card={card} />}
            {card.kind === "indicator" && <IndicatorBody card={card} />}
            {(card.kind === "goal" || card.kind === "collection") && <ArtBody card={card} />}
          </div>
          <CardFooter card={card} />
        </div>
      </Placard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const TABS = ["Everything", "Agencies", "Plans", "Goals", "Indicators"];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("Everything");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // A card passes the filter if no filters are active, or its tags intersect the active filters.
  const matchesFilters = (card: Card) =>
    activeFilters.length === 0 || (card.tags ?? []).some((t) => activeFilters.includes(t));

  const filteredCols = [col1, col2, col3].map((col) => col.filter(matchesFilters));
  const resultCount = filteredCols.reduce((n, col) => n + col.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeItem="Explore" />

      {/* Top filter bar */}
      <div className="flex items-center space-x-4 p-4 bg-white">
        <FilterSidebar possibleFilters={FILTERS} activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
        <div className="flex-1">
          <div className="grid w-full grid-cols-1">
            <input
              type="search"
              placeholder="Search the Great Experiment at work"
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
        <DropdownButton label="Status" value="Active" onClick={() => {}} icon="/icons/arrow-dropdown.svg" />
        <DropdownButton label="Sort" value="Popular" onClick={() => {}} icon="/icons/arrow-dropdown.svg" />
        {/* grid / list toggle */}
        <div className="flex items-center h-[48px] rounded-[3px] ring-1 ring-inset ring-gray-300 overflow-hidden bg-white">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`h-full px-3 flex items-center justify-center cursor-pointer border-r border-gray-300 hover:text-gray-950 ${view === "grid" ? "text-gray-950" : "text-gray-400"}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <rect x="3" y="3" width="6" height="6" rx="1" />
              <rect x="11" y="3" width="6" height="6" rx="1" />
              <rect x="3" y="11" width="6" height="6" rx="1" />
              <rect x="11" y="11" width="6" height="6" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`h-full px-3 flex items-center justify-center cursor-pointer hover:text-gray-950 ${view === "list" ? "text-gray-950" : "text-gray-400"}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <rect x="3" y="4" width="3" height="3" rx="0.5" />
              <rect x="8" y="4.75" width="9" height="1.5" rx="0.75" />
              <rect x="3" y="9" width="3" height="3" rx="0.5" />
              <rect x="8" y="9.75" width="9" height="1.5" rx="0.75" />
              <rect x="3" y="14" width="3" height="3" rx="0.5" />
              <rect x="8" y="14.75" width="9" height="1.5" rx="0.75" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selected filter pills + result count */}
      <ActiveFilters
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        resultCount={resultCount}
      />

      {/* Tabs */}
      <div className="bg-[#F5F5F5] flex justify-center pt-[28px]">
        <div className="flex gap-4">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative cursor-pointer px-[16px] py-1 rounded-full text-[15px] leading-[36px] font-medium transition ${
                  isActive ? "bg-white text-gray-950" : "text-gray-600 hover:bg-white hover:text-gray-950"
                }`}
              >
                {tab}
                {tab === "Everything" && <sup className="ml-[2px] text-[10px] text-gray-500">123</sup>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <main className="flex-1 bg-[#F5F5F5] px-8 py-[28px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            <div>{filteredCols[0].map((c, i) => <MockCard key={`c1-${i}`} card={c} />)}</div>
            <div>{filteredCols[1].map((c, i) => <MockCard key={`c2-${i}`} card={c} />)}</div>
            <div>{filteredCols[2].map((c, i) => <MockCard key={`c3-${i}`} card={c} />)}</div>
          </div>
        </div>

        {/* More button — hidden while filtering */}
        {activeFilters.length === 0 && (
          <div className="mt-6 flex justify-center">
            <button className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white text-sm font-medium px-5 py-2.5 hover:bg-gray-800 cursor-pointer">
              <span className="material-icons-sharp !text-[18px]">add_circle_outline</span>
              More
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
