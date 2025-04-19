"use client";

interface ActiveFiltersProps {
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  resultCount: number;
}

function ActiveFilters({
  activeFilters,
  setActiveFilters,
  resultCount,
}: ActiveFiltersProps) {
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  return (
    <div className="flex justify-between items-center px-4 pb-4 pt-4 bg-[#F5F5F5]">
      <div className="h-6 flex items-center">
      <span className="text-[13px] text-gray-700">
        {resultCount} results
      </span>
      </div>
      <div className="flex items-center gap-1.5 overflow-auto">
        {activeFilters.map((filter) => (
          <span
            key={filter}
            className="inline-flex items-center gap-x-1 rounded-sm bg-gray-800 px-2 py-1 text-xs text-gray-50"
          >
            {filter}
            <button
              type="button"
              onClick={() => removeFilter(filter)}
              className="group relative -mr-1 size-3.5 rounded-sm hover:outline-1 hover:-outline-offset-1 hover:outline-gray-500"
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
            className="cursor-pointer inline-flex items-center gap-x-0.5 outline-1 -outline-offset-1 outline-gray-400 ml-3 px-2 py-1 text-xs text-gray-950 hover:bg-white hover:outline-gray-400"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

export { ActiveFilters };