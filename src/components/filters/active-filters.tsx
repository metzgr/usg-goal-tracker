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
    <div className="h-12 flex justify-between items-center p-4 bg-[#F5F5F5]">
      <span className="text-xs text-gray-600">
        {resultCount} results
      </span>
      <div className="flex items-center gap-2 overflow-auto">
        {activeFilters.map((filter) => (
          <span
            key={filter}
            className="mt-2 inline-flex items-center gap-x-0.5 rounded-sm bg-gray-800 px-2 py-1 text-xs text-gray-50"
          >
            {filter}
            <button
              type="button"
              onClick={() => removeFilter(filter)}
              className="group relative -mr-1 size-3.5 rounded-xs hover:bg-gray-500/20"
            >
              <span className="sr-only">Remove</span>
              <svg
                viewBox="0 0 14 14"
                className="size-3.5 stroke-white/75 group-hover:stroke-white/75"
              >
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export { ActiveFilters };