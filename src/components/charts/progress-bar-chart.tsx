"use client";

type ProgressBarChartProps = {
  mostRecentResult: number;
  mostRecentTargetLevel: number;
  mostRecentPercentProgress: number;
  unitFormat?: string;
};

function formatNumber(num: number, unitFormat?: string) {
  if (unitFormat === "abbreviated") {
    if (num >= 1000) {
      const result = num / 1000;
      return result % 1 === 0 ? `${result}K` : `${result.toFixed(1)}K`;
    }
  }
  return num;
}

export default function ProgressBarChart({ mostRecentResult, mostRecentTargetLevel, mostRecentPercentProgress, unitFormat }: ProgressBarChartProps) {
  return (
    <div className="flex items-center mt-3">
      {/* Left: Target label */}
      <p className="flex-none whitespace-nowrap text-gray-950 font-medium text-sm mr-3">
        Target {typeof mostRecentTargetLevel === 'number' ? formatNumber(mostRecentTargetLevel, unitFormat) : "-"}
      </p>

      {/* Middle: Progress bar container */}
      <div className="flex flex-1 h-auto mr-1 relative">
        <div className="relative h-6 w-full bg-gray-200 py-[6px]">
          <div
            className="h-full bg-green-700 relative"
            style={{ width: `${mostRecentPercentProgress}%`, transition: 'width 0.5s' }}
          />
        </div>
        <div className="bg-gray-950 h-6 w-[3px]" />
      </div>

      {/* Right: Display the latest actual and target values */}
      <div className="flex-none flex items-center mr-[2px]">
        <img className="mr-[2px]" src="/icons/target.svg" alt="Target Icon" />
        <p className="flex items-center">
          <span className="text-xl text-gray-950 font-black">
            {typeof mostRecentResult === 'number' ? formatNumber(mostRecentResult, unitFormat) : "-"}
          </span>
          <span className="text-sm text-gray-700 mx-[2px]">/</span>
          <span className="text-xl text-gray-950 font-black">
            {typeof mostRecentTargetLevel === 'number' ? formatNumber(mostRecentTargetLevel, unitFormat) : "-"}
          </span>
        </p>
      </div>
    </div>
  );
}