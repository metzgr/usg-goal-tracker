"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type ProgressBarChartProps = {
  dataActuals: number[];
  dataTargets?: number[];
};

export default function ProgressBarChart({ dataActuals, dataTargets = [] }: ProgressBarChartProps) {
  // Use the latest values from the arrays.
  const latestActual = dataActuals[dataActuals.length - 1];
  const hasTarget = dataTargets && dataTargets.length > 0;
  const latestTarget = hasTarget ? dataTargets[dataTargets.length - 1] : 0;
  
  // Calculate progress ratio (capped at 1) and percentage.
  const progressRatio = hasTarget ? Math.min(latestActual / latestTarget, 1) : 1;
  const progressPercent = progressRatio * 100;

  // Fixed dimensions for the triangle cap.
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

      // Append or update the data label only if progress is less than 86%.
      if (progressPercent < 86) {
        let label = container.select("span.progress-label");
        if (label.empty()) {
          label = container
            .append("span")
            .attr("class", "progress-label absolute font-medium text-sm text-green-800 leading-1 pt-[6px] ml-[9px]");
        }
        label
          .text(`${Math.round(progressPercent)}%`)
          .style("left", `${barRect.width}px`)
          .style("top", "calc(50% - 0.5rem)");
      } else {
        // Remove label if progress is 86% or higher.
        container.select("span.progress-label").remove();
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
          .attr("fill", "#067647"); // Use your desired color.
      }
    }, 0);
  }, [progressPercent, dimensions, hasTarget]);

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
          id="barChartContainer"
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