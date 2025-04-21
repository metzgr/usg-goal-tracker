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

    
    const patternId = "analyze-pattern-improved";
    const patternTileWidth = 30;
    const patternTileHeight = 25;
    const defs = svg.append("defs");
    const pattern = defs
      .append("pattern")
      .attr("id", patternId)
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", patternTileWidth)
      .attr("height", patternTileHeight);
    
    pattern
      .append("rect")
      .attr("width", patternTileWidth)
      .attr("height", patternTileHeight)
      .attr("fill", "#444CE7");
    
    const imgWidth = patternTileWidth - margin;
    const imgHeight = patternTileHeight - margin;
    const offsetXPattern = (patternTileWidth - imgWidth) / 2;
    const offsetYPattern = (patternTileHeight - imgHeight) / 2;
    
    pattern
      .append("image")
      .attr("xlink:href", "/artwork/pattern/yellow-arrow-2.jpg")
      .attr("x", offsetXPattern)
      .attr("y", offsetYPattern)
      .attr("width", imgWidth)
      .attr("height", imgHeight)
      .attr("preserveAspectRatio", "xMidYMid slice");
    
    svg.append("circle")
      .attr("cx", (width + margin * 2) / 2)
      .attr("cy", (height + margin * 2) / 2)
      .attr("r", radius)
      .attr("fill", "#fff")
      .attr("stroke", "#252B37")
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
      .attr("width", width + 1)
      .attr("height", height + 1)
      .attr("viewBox", `0 0 ${width + 2} ${height + 2}`)
      .attr("style", "max-width: 100%; height: auto;")
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
        if (d.data.trend === "Improved") return "url(#analyze-pattern-improved)";
        if (d.data.trend === "Worsened") return "#D92D20";
        return color(d.data.trend);
      });

    // Stroke text label for each bubble
    node.append("text")
      .text(d => d.data.count)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "none")
      .attr("stroke", d => d.data.trend === "Improved" ? "#444CE7" : "none")
      .attr("stroke-width", d => d.data.trend === "Improved" ? 8 : 0)
      .attr("font-size", d => Math.min(72, Math.max(10, d.r * 0.6)))
      .attr("font-weight", "900")
      .attr("pointer-events", "none");

    // Label text for each bubble
    node.append("text")
      .text(d => d.data.count)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", d => d.data.trend === "Improved" ? "#fff" : "#fff")
      .attr("font-size", d => Math.min(72, Math.max(10, d.r * 0.6)))
      .attr("font-weight", "900")
      .attr("pointer-events", "none");

  }, [data, width, height]);

  return <svg ref={ref} />;
}