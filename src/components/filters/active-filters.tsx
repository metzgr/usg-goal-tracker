"use client";

interface ActiveFiltersProps {
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  resultCount: number;
  resultNoun?: string;
}

function ActiveFilters({
  activeFilters,
  setActiveFilters,
  resultCount,
  resultNoun = "results",
}: ActiveFiltersProps) {
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  return (
    <div className="bg-[#F5F5F5] py-4">
    <div className="h-4 flex justify-between items-center px-4">
      <div className="">
      <span className="text-[13px] text-gray-700">
        {resultCount} {resultNoun}
      </span>
      </div>
      <div className="flex items-center gap-1.5">
        {activeFilters.map((filter) => (
          <span
            key={filter}
            className="inline-flex items-center gap-x-1 rounded-[3px] bg-gray-800 px-2 py-1 text-xs text-gray-50"
          >
            {filter}
            <button
              type="button"
              onClick={() => removeFilter(filter)}
              className="group relative -mr-1 size-3.5 rounded-xs hover:outline-1 hover:-outline-offset-1 hover:outline-gray-500 cursor-pointer"
            >
              <span className="sr-only">Remove</span>
              <svg
                viewBox="0 0 14 14"
                className="size-3.5 stroke-white/75 group-hover:stroke-white/100"
              >
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          </span>
        ))}
        {activeFilters.length >= 1 && (
          <button
            type="button"
            onClick={() => setActiveFilters([])}
            className="rounded-xs cursor-pointer inline-flex items-center gap-x-0.5 outline-1 -outline-offset-1 outline-gray-400 ml-3 px-2 py-1 text-xs text-gray-950 hover:bg-white hover:outline-gray-400"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
    </div>
  );
}

export { ActiveFilters };