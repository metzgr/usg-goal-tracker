"use client";

import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface SparklinePoint {
  result: number;
  targetResult?: number;
}

export function Sparkline({
  data,
  mostRecentResultTrend,
}: {
  data: SparklinePoint[];
  mostRecentResultTrend: "Improved" | "Unchanged" | "Worsened";
}) {
  const ref = useRef<SVGSVGElement | null>(null);
  let mostRecentIndex = data.length - 1;
  let mostRecentPoint = data[mostRecentIndex];

  useEffect(() => {
    if (!ref.current || !data?.length) return;

    const width = 100;
    const height = 30;
    const margin = { top: 4, right: 4, bottom: 4, left: 4 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const actualColor = mostRecentResultTrend === "Worsened" ? "#D92D20" : "#04236B";
    const hasTargets = data.some(d => typeof d.targetResult === "number");

    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max([
          ...data.map(d => d.result),
          ...(hasTargets ? data.map(d => d.targetResult ?? 0) : []),
        ]) || 1,
      ])
      .range([height - margin.bottom, margin.top]);

    const lineActual = d3
      .line<SparklinePoint>()
      .x((_, i) => x(i))
      .y(d => y(d.result))
      .curve(d3.curveMonotoneX);

    const areaActual = d3
      .area<SparklinePoint>()
      .x((_, i) => x(i))
      .y0(height)
      .y1(d => y(d.result))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", mostRecentResultTrend === "Worsened" ? "#F9D7D7" : "#DEE5F9")
      .attr("d", areaActual);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", actualColor)
      .attr("stroke-width", 1)
      .attr("class", "actual-line")
      .attr("d", lineActual)
      .style("opacity", 1);

    if (hasTargets) {
      const lineTarget = d3
        .line<SparklinePoint>()
        .x((_, i) => x(i))
        .y(d => y(d.targetResult ?? 0))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#535862")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "3,2")
        .attr("class", "target-line")
        .attr("d", lineTarget)
        .style("opacity", 1);
    }

    const tooltip = d3
      .select(svg.node()?.parentNode)
      .append("div")
      .attr("class", "d3tooltip absolute z-10 px-[5px] py-[5px] transition-opacity duration-300 bg-white")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const lastPoint = data[data.length - 1];
    const hoverDot = svg
      .append("circle")
      .attr("r", 2.9)
      .attr("fill", actualColor);

    if (typeof lastPoint.result === "number") {
      hoverDot
        .attr("cx", x(data.length - 1))
        .attr("cy", y(lastPoint.result))
        .style("opacity", 1);
    } else {
      hoverDot.style("opacity", 0);
    }

    svg
      .append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", function (event) {
        const [mouseX] = d3.pointer(event);
        const index = Math.round(x.invert(mouseX));
        const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
        const point = data[clampedIndex];

        const [tooltipX, tooltipY] = d3.pointer(event, ref.current);

        tooltip
          .html(`
            <div class="grid ${hasTargets ? 'grid-rows-2' : 'grid-rows-1'} border border-gray-400 rounded-md">
              <div class="grid grid-cols-2 gap-2 px-2 py-[6px] flex items-center">
                <div class="font-medium text-[13px] text-gray-900">Actual</div>
                <div class="text-right text-[20px] font-black text-gray-950">${point.result}</div>
              </div>
              ${
                hasTargets
                  ? `<div class="grid grid-cols-2 gap-2 border-t border-gray-400 px-2 py-[6px] flex items-center">
                      <div class="font-medium text-[13px] text-gray-900">Target</div>
                      <div class="text-right text-[20px] font-black text-gray-950">${point.targetResult ?? ''}</div>
                    </div>`
                  : ''
              }
            </div>
          `)
          .style("left", `${tooltipX + 10}px`)
          .style("top", `${tooltipY - 40}px`)
          .style("opacity", 0.9);

        hoverDot
          .attr("cx", x(clampedIndex))
          .attr("cy", y(point.result))
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        if (mostRecentIndex !== -1 && typeof mostRecentPoint.result === "number") {
          hoverDot
            .attr("cx", x(mostRecentIndex))
            .attr("cy", y(mostRecentPoint.result))
            .style("opacity", 1);
        } else {
          hoverDot.style("opacity", 0);
        }
      });
  }, [data, mostRecentResultTrend]);

  return <svg ref={ref} width={100} height={30} />;
}