"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type BubbleDatum = {
  trend: string;
  count: number;
};

export default function BubbleChart({
  data,
  width = 400,
  height = 400,
}: {
  data: BubbleDatum[];
  width?: number;
  height?: number;
}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const margin = 1;

  useEffect(() => {
    if (!ref.current) return;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.append("circle")
      .attr("cx", (width + margin * 2) / 2)
      .attr("cy", (height + margin * 2) / 2)
      .attr("r", radius)
      .attr("fill", "#fff")
      .attr("stroke", "#0A0D12")
      .attr("stroke-width", 1);

    const color = d3.scaleOrdinal<string>()
      .domain(["Improved", "Worsened", "Unchanged", "No Data"])
      .range(["#C7D7FE", "#FECDCA", "#a3a3a3", "#e2e8f0"]);

    const pack = d3.pack<BubbleDatum>()
      .size([width, height])
      .padding(6);

    const root = d3.hierarchy({ children: data } as any)
      .sum(d => d.count);

    const nodes = pack(root).leaves();

    const node = svg
      .attr("viewBox", `0 0 ${width + margin * 2} ${height + margin * 2}`)
      .attr("width", "100%")
      .attr("height", "auto")
      .append("g")
      .attr("transform", `translate(${(width + margin * 2) / 2 - radius}, ${(height + margin * 2) / 2 - radius})`)
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("clipPath")
      .attr("id", d => `clip-${(d.data.trend || "unknown").replace(/\s+/g, "-")}`)
      .append("circle")
      .attr("r", d => d.r);

    // Background fill for all bubbles
    node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => {
        if (d.data.trend === "Improved") return "#444CE7";
        if (d.data.trend === "Worsened") return "#D92D20";
        return color(d.data.trend);
      });

    // Label text for each bubble
    node.append("text")
      .text(d => d.data.count)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#fff")
      .attr("font-size", d => Math.min(72, Math.max(10, d.r * 0.6)))
      .attr("font-weight", "900")
      .attr("pointer-events", "none");

  }, [data, width, height]);

  return <svg ref={ref} />;
}