"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type ProgressBarChartProps = {
  mostRecentResult: number;
  mostRecentTargetLevel: number;
  mostRecentTargetResult: number;
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

export default function ProgressBarChart({
  mostRecentResult,
  mostRecentTargetLevel,
  mostRecentTargetResult,
  mostRecentPercentProgress,
  unitFormat,
}: ProgressBarChartProps) {
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
            {typeof mostRecentTargetResult === 'number' ? formatNumber(mostRecentTargetResult, unitFormat) : "-"}
          </span>
        </p>
      </div>
    </div>
  );
  const capWidth = 6;
  const capHeight = 12;

  // For responsiveness, track container dimensions.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 40 });
  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth || 300;
        const height = containerRef.current.clientHeight || 40;
        setDimensions({ width, height });
      }
    }
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Build the progress bar using d3.
  useEffect(() => {
    const { width, height } = dimensions;
    const container = d3.select(containerRef.current);
    container.selectAll("*").remove();

    if (progressPercent <= 0) return;

    // If progressPercent is 100 or more, don't append a progress bar div.
    if (progressPercent >= 100) {
      container
        .classed("bg-gray-200", false)
        .classed("bg-green-700", false)
        .classed("bg-green-striped", true);
      let label = container.select("span.progress-label");
      if (label.empty()) {
        label = container
          .append("span")
          .attr("class", "progress-label absolute font-medium text-sm text-white leading-1 pr-[6px] right-0 mt-[4px]");
      }
      label.text(`${Math.round(rawProgressPercent)}%`);
      return;
    }

    // Otherwise, progress is less than 100%
    // Calculate the filled width in pixels.
    const filledWidthPx = progressRatio * width;
    // Only add a cap if targets exist and the filled width is greater than capWidth.
    const hasCap = hasTarget && filledWidthPx > capWidth;
    // Set the bar width: if there's a cap, subtract capWidth using calc().
    const barWidth = hasCap
      ? `calc(${progressPercent}% - ${capWidth}px)`
      : `${progressPercent}%`;

    // Append the progress bar div.
    const progressBar = container
      .append("div")
      .attr("class", "h-full bg-green-700 relative")
      .style("width", barWidth);

    // Use setTimeout to wait for rendering so we can measure the bar.
    setTimeout(() => {
      const barRect = progressBar.node()?.getBoundingClientRect();
      if (!barRect) return;

      if (progressPercent < 86) {
        // For progress less than 86%, use left alignment and green text.
        container
          .classed("bg-green-striped", false)
          .classed("bg-green-700", false)
          .classed("bg-gray-200", true);
        let label = container.select("span.progress-label");
        if (label.empty()) {
          label = container
            .append("span")
            .attr("class", "progress-label absolute font-medium text-sm text-green-800 leading-1 pt-[6px] ml-[9px]");
        }
        label
          .text(`${Math.round(rawProgressPercent)}%`)
          .style("left", `${barRect.width}px`)
          .style("top", "calc(50% - 0.5rem)");
      } else {
        // For progressPercent between 86 and 100, remove the label.
        container.select("span.progress-label").remove();
        container.classed("bg-green-striped", false);
      }

      // Append the triangle cap as inline SVG if applicable and if targets exist.
      if (hasCap) {
        container
          .append("svg")
          .attr("width", capWidth)
          .attr("height", capHeight)
          .attr("viewBox", `0 0 ${capWidth} ${capHeight}`)
          .style("position", "absolute")
          .style("left", `${barRect.width}px`)
          .style("top", "6px") // 6px top padding.
          .append("polygon")
          .attr("points", `0,0 ${capWidth},${capHeight / 2} 0,${capHeight}`)
          .attr("fill", "#067647");
      }
    }, 0);
  }, [progressPercent, dimensions, hasTarget, rawProgressPercent, progressRatio]);

  // Helper to format numbers.
  function formatNumber(num: number) {
    if (num >= 1000) {
      const result = num / 1000;
      return result % 1 === 0 ? `${result}K` : `${result.toFixed(1)}K`;
    }
    return num;
  }

  return (
    <div className="flex items-center mt-3">
      {/* Left: Display "Target 7" since there are 7 target values (if available) */}
      <p className="flex-none whitespace-nowrap text-gray-950 font-medium text-sm mr-3">
        Target {hasTarget ? dataTargets.length : "-"}
      </p>

      {/* Middle: Progress bar container */}
      <div className="flex flex-1 h-auto mr-1 relative">
        <div
          ref={containerRef}
          className="relative h-6 w-full bg-gray-200 py-[6px]"
        ></div>
        <div className="bg-gray-950 h-6 w-[3px]" />
      </div>

      {/* Right: Display the latest actual and target values */}
      <div className="flex-none flex items-center mr-[2px]">
        <img className="mr-[2px]" src="/icons/target.svg" alt="Target Icon" />
        <p className="flex items-center">
          <span className="text-xl text-gray-950 font-black">
            {formatNumber(latestActual)}
          </span>
          <span className="text-sm text-gray-700 mx-[2px]">/</span>
          <span className="text-xl text-gray-950 font-black">
            {hasTarget ? formatNumber(latestTarget) : "–"}
          </span>
        </p>
      </div>
    </div>
  );
}