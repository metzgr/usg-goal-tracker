"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type TargetLineChartProps = {
  dataActuals: number[];
  dataTargets: number[];
};

export default function TargetLineChart({ dataActuals, dataTargets }: TargetLineChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 150 });

  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth || 300;
        const height = containerRef.current.clientHeight || 150;
        setDimensions({ width, height });
      }
    }
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;

    const trimmedActuals = dataActuals.slice(-7);
    const trimmedTargets = dataTargets.slice(-7);

    // Clear previous SVG and tooltip elements if they exist
    d3.select(containerRef.current).select("svg").remove();
    d3.select(containerRef.current).select(".d3tooltip").remove();

    // Create tooltip div and style with Tailwind
    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .attr("class", "d3tooltip absolute z-10 px-[5px] py-[5px] transition-opacity duration-300 bg-white")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Create SVG
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Check if there are targets; if none, mimic NoTargetLineChart styling exactly.
    if (!trimmedTargets || trimmedTargets.length === 0) {
      // --- Begin NoTargetLineChart Branch ---
      const yMax = d3.max(trimmedActuals) || 0;
      const actualColor = "#444CE7";
      const dotRadius = 2.8;
      const actualLineWidth = 5;
      const xScale = d3
        .scaleLinear()
        .domain([0, trimmedActuals.length - 1])
        .range([dotRadius, width - dotRadius]);
      const yScale = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([height - actualLineWidth, actualLineWidth]);
      const lineGen = d3
        .line()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d))
        .curve(d3.curveMonotoneX);
      
      // Draw vertical grid lines (skip first and last)
      d3.range(trimmedActuals.length).forEach((i) => {
        if (i === 0 || i === trimmedActuals.length - 1) return;
        svg
          .append("line")
          .attr("class", "grid-line")
          .attr("data-index", i)
          .attr("x1", xScale(i))
          .attr("x2", xScale(i))
          .attr("y1", 0)
          .attr("y2", height)
          .attr("stroke", "#D5D7DA")
          .attr("stroke-width", 1)
          .style("opacity", 1);
      });
      
      // Draw Actuals line with highlight effect (thick line)
      svg
        .append("path")
        .datum(lastActuals)
        .attr("fill", "none")
        .attr("stroke", "#D92D20")
        .attr("stroke-width", 10)
        .attr("class", "mix-blend-color-burn")
        .attr("d", lineGen)
        .style("opacity", 1);
      
      // Draw main Actuals line on top (thin line)
      svg
        .append("path")
        .datum(trimmedActuals)
        .attr("fill", "none")
        .attr("stroke", actualColor)
        .attr("stroke-width", 2)
        .attr("class", "actual-line")
        .attr("d", lineGen)
        .style("opacity", 1);
      
      // Instead of drawing dots for every data point, create one hover dot
      const hoverDot = svg
        .append("circle")
        .attr("class", "hover-dot")
        .attr("r", dotRadius)
        .attr("fill", actualColor)
        .style("opacity", 0);
      
      // Overlay rectangle to capture mouse events for tooltip
      svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mousemove", function (event) {
          svg.selectAll("line").style("opacity", 0.3);
          svg.selectAll("circle").style("opacity", 0.3);
          svg.selectAll("path").style("opacity", 0.3);
          
          const [mouseX] = d3.pointer(event);
          const index = Math.round(xScale.invert(mouseX));
          const clampedIndex = Math.max(0, Math.min(trimmedActuals.length - 1, index));
          const actualValue = trimmedActuals[clampedIndex];
          
          tooltip
            .html(`
              <div class="border border-gray-400 rounded-md">
                <div class="grid grid-cols-2 gap-2 px-2 py-[6px] flex items-center">
                  <div class="font-medium text-[13px] text-gray-900">Actual</div>
                  <div class="text-right text-[20px] font-black text-gray-950">${actualValue}</div>
                </div>
              </div>
            `)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px")
            .style("opacity", 0.9);
          
          svg
            .selectAll(".grid-line")
            .filter(function () {
              return d3.select(this).attr("data-index") == clampedIndex;
            })
            .style("opacity", 1);
          
          hoverDot
            .attr("cx", xScale(clampedIndex))
            .attr("cy", yScale(actualValue))
            .style("opacity", 1);
        })
        .on("mouseout", function () {
          svg.selectAll("line").style("opacity", 1);
          svg.selectAll("circle").style("opacity", 0);
          svg.selectAll("path").style("opacity", 1);
          tooltip.style("opacity", 0);
        });
      // --- End NoTargetLineChart Branch ---
    } else {
      // Normal treatment if targets exist.
      // Combine for y-domain
      const allValues = [...trimmedActuals, ...trimmedTargets];
      const yMax = d3.max(allValues) || 0;
      
      // Determine dynamic color for Actuals
      const secondLastIndex = trimmedActuals.length - 2;
      const lastIndex = trimmedActuals.length - 1;
      const prevActual = trimmedActuals[secondLastIndex];
      const finalActual = trimmedActuals[lastIndex];
      const prevTarget = trimmedTargets[secondLastIndex];
      const finalTarget = trimmedTargets[lastIndex];
      
      let actualColor = "#D92D20"; // default red
      
      if (finalTarget === prevTarget) {
        // When targets are constant, consider it moving correctly if actual increased and is at least at the target.
        if (finalActual > prevActual && finalActual >= finalTarget) {
          actualColor = "#444CE7";
        }
      } else {
        const targetCallsForIncrease = finalTarget > prevTarget;
        const targetCallsForDecrease = finalTarget < prevTarget;
        const actualIncreased = finalActual > prevActual;
        const actualDecreased = finalActual < prevActual;
        
        if ((targetCallsForIncrease && actualIncreased) || (targetCallsForDecrease && actualDecreased)) {
          actualColor = "#444CE7";
        }
      }
      
      // Scales with padding for dots
      const dotRadius = 2.8;
      const actualLineWidth = 5;
      const xScale = d3
        .scaleLinear()
        .domain([0, trimmedActuals.length - 1])
        .range([dotRadius, width - dotRadius]);
      const yScale = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([height - actualLineWidth, actualLineWidth]);
      
      // Line generator
      const lineGen = d3
        .line()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d))
        .curve(d3.curveMonotoneX);
      
      // Draw vertical grid lines (skip first and last)
      d3.range(trimmedActuals.length).forEach((i) => {
        if (i === 0 || i === trimmedActuals.length - 1) return;
        svg
          .append("line")
          .attr("class", "grid-line")
          .attr("data-index", i)
          .attr("x1", xScale(i))
          .attr("x2", xScale(i))
          .attr("y1", 0)
          .attr("y2", height)
          .attr("stroke", "#D5D7DA")
          .attr("stroke-width", 1)
          .style("opacity", 1);
      });
      
      // Draw Actuals line with highlight effect (thick line)
      svg
        .append("path")
        .datum(trimmedActuals)
        .attr("fill", "none")
        .attr("stroke", actualColor)
        .attr("stroke-width", 10)
        .attr("class", "mix-blend-color-burn")
        .attr("d", lineGen)
        .style("opacity", 1);
      
      // Draw main Actuals line on top (thin line)
      svg
        .append("path")
        .datum(trimmedActuals)
        .attr("fill", "none")
        .attr("stroke", actualColor)
        .attr("stroke-width", 2)
        .attr("class", "actual-line")
        .attr("d", lineGen)
        .style("opacity", 1);
      
      // Draw Targets line
      svg
        .append("path")
        .datum(trimmedTargets)
        .attr("fill", "none")
        .attr("stroke", "#0A0D12")
        .attr("stroke-width", 1)
        .attr("class", "target-line")
        .attr("d", lineGen)
        .style("opacity", 1);
      
      // Draw dots on Targets line
      svg
        .selectAll(".target-dot")
        .data(trimmedTargets)
        .enter()
        .append("circle")
        .attr("class", "target-dot")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", (d) => yScale(d))
        .attr("r", dotRadius)
        .attr("fill", "#0A0D12")
        .style("opacity", 1);
      
      // Append a dot for the Actuals line (initially hidden)
      const actualDot = svg
        .append("circle")
        .attr("class", "actual-dot")
        .attr("r", dotRadius)
        .attr("fill", actualColor)
        .style("opacity", 0);
      
      // Overlay rectangle to capture mouse events
      svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mousemove", function (event) {
          svg.selectAll("line").style("opacity", 0.3);
          svg.selectAll("circle").style("opacity", 0.3);
          svg.selectAll("path").style("opacity", 0.3);
          
          const [mouseX] = d3.pointer(event);
          const index = Math.round(xScale.invert(mouseX));
          const clampedIndex = Math.max(0, Math.min(trimmedActuals.length - 1, index));
          const actualValue = trimmedActuals[clampedIndex];
          const targetValue = trimmedTargets[clampedIndex];
          
          tooltip
            .html(`
              <div class="grid grid-rows-2 border border-gray-400 rounded-md">
                <div class="grid grid-cols-2 gap-2 px-2 pb-[2px] pt-[6px] flex items-center">
                  <div class="font-medium text-[13px] text-gray-900">Actual</div>
                  <div class="text-right text-[20px] font-black text-gray-950">${actualValue}</div>
                </div>
                <div class="grid grid-cols-2 gap-2 border-t border-gray-400 pt-[2px] pb-[6px] px-2 flex items-center">
                  <div class="font-medium text-[13px] text-gray-900">Target</div>
                  <div class="text-right text-[20px] font-black text-gray-950">${targetValue}</div>
                </div>
              </div>
            `)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px")
            .style("opacity", 0.9);
          
          svg
            .selectAll(".grid-line")
            .filter(function () {
              return d3.select(this).attr("data-index") == clampedIndex;
            })
            .style("opacity", 1);
          
          actualDot
            .attr("cx", xScale(clampedIndex))
            .attr("cy", yScale(actualValue))
            .style("opacity", 1);
          svg
            .selectAll(".target-dot")
            .filter((d, i) => i === clampedIndex)
            .style("opacity", 1);
        })
        .on("mouseout", function () {
          svg.selectAll("line").style("opacity", 1);
          svg.selectAll("circle").style("opacity", 1);
          svg.selectAll("path").style("opacity", 1);
          tooltip.style("opacity", 0);
        });
    }
  }, [dimensions, dataActuals, dataTargets]);

  return <div ref={containerRef} className="w-full h-[108px] cursor-default" />;
}