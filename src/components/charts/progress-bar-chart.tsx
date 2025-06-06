"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type ProgressBarChartProps = {
  mostRecentResult: number;
  mostRecentTargetLevel: number;
  mostRecentTargetResult: number;
  mostRecentPercentProgress: number;
};

function formatNumber(num: number) {
  if (typeof num !== "number") return "-";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-US").format(num);
}

export default function ProgressBarChart({
  mostRecentResult,
  mostRecentTargetLevel,
  mostRecentTargetResult,
  mostRecentPercentProgress,
}: ProgressBarChartProps) {
  const capWidth = 6;
  const capHeight = 12;
  const hasTarget = typeof mostRecentTargetResult === "number";
  const rawProgressPercent = mostRecentPercentProgress;
  const progressPercent = Math.min(Math.max(mostRecentPercentProgress, 0), 100);
  const progressRatio = progressPercent / 100;
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

  useEffect(() => {
    const { width, height } = dimensions;
    const container = d3.select(containerRef.current);
    container.selectAll("*").remove();

    if (progressPercent <= 0) return;

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

    const filledWidthPx = progressRatio * width;
    const hasCap = hasTarget && filledWidthPx > capWidth;
    const barWidth = hasCap
      ? `calc(${progressPercent}% - ${capWidth}px)`
      : `${progressPercent}%`;

    const progressBar = container
      .append("div")
      .attr("class", "h-full bg-green-700 relative")
      .style("width", barWidth);

    setTimeout(() => {
      const barRect = progressBar.node()?.getBoundingClientRect();
      if (!barRect) return;

      if (progressPercent < 86) {
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
        container.select("span.progress-label").remove();
        container.classed("bg-green-striped", false);
      }

      if (hasCap) {
        container
          .append("svg")
          .attr("width", capWidth)
          .attr("height", capHeight)
          .attr("viewBox", `0 0 ${capWidth} ${capHeight}`)
          .style("position", "absolute")
          .style("left", `${barRect.width}px`)
          .style("top", "6px")
          .append("polygon")
          .attr("points", `0,0 ${capWidth},${capHeight / 2} 0,${capHeight}`)
          .attr("fill", "#067647");
      }
    }, 0);
  }, [progressPercent, dimensions, hasTarget, rawProgressPercent, progressRatio]);

  return (
    <div className="flex items-center mt-3">
      {/* Left: Target label */}
      <p className="flex-none whitespace-nowrap text-gray-950 font-medium text-sm mr-3">
        Target {typeof mostRecentTargetLevel === "number" ? formatNumber(mostRecentTargetLevel) : "-"}
      </p>

      {/* Middle: D3-powered progress bar */}
      <div className="flex flex-1 h-auto mr-1 relative">
        <div ref={containerRef} className="relative h-6 w-full bg-gray-200 py-[6px]"></div>
        <div className="bg-gray-950 h-6 w-[3px]" />
      </div>

      {/* Right: Actual / Target value */}
      <div className="flex-none flex items-center mr-[2px]">
        <img className="mr-[2px]" src="/icons/target.svg" alt="Target Icon" />
        <p className="flex items-center">
          <span className="text-xl text-gray-950 font-black">
            {typeof mostRecentResult === "number" ? formatNumber(mostRecentResult) : "-"}
          </span>
          <span className="text-sm text-gray-700 mx-[2px]">/</span>
          <span className="text-xl text-gray-950 font-black">
            {typeof mostRecentTargetResult === "number" ? formatNumber(mostRecentTargetResult) : "-"}
          </span>
        </p>
      </div>
    </div>
  );
}