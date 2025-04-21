"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

type SunburstData = {
  name: string;
  children: {
    name: string;
    value?: number;
  }[];
};

export default function SunburstChart({
  data,
  width = 400,
  height = 400,
}: {
  data: SunburstData;
  width?: number;
  height?: number;
}) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const radius = Math.min(width, height) / 2;

    const root = d3
      .hierarchy(data)
      .sum((d: any) => d.value || 0)
      .sort((a, b) => b.value! - a.value!);

    const partition = d3.partition<d3.HierarchyNode<any>>().size([2 * Math.PI, radius]);
    partition(root);

    const arc = d3.arc<d3.HierarchyRectangularNode<any>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    // SVG setup
    const svg = d3.select(ref.current)
      .attr("width", width + 1)
      .attr("height", height + 1)
      .attr("viewBox", `${-(width + 1) / 2} ${-(height + 1) / 2} ${width + 1} ${height + 1}`)
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove(); // clear previous renders
    

    // arc rendering
    svg.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => {
        const topLevel = d.ancestors().find(a => a.depth === 1);
        const trend = topLevel?.data.name ?? "No Data";
        if (trend === "Improved" && d.depth === 1) return "url(#analyze-pattern-improved)";
        if (trend === "Improved" && d.depth === 2) return "#444CE7";
        if (trend === "Worsened") return "#D92D20";
        return "#a3a3a3";
      })
      .attr("d", arc)
      .attr("stroke", "#fafafa")
      .attr("stroke-width", 1.25)
      .append("title")
      .text(d => `${d.ancestors().map(n => n.data.name).reverse().join(" → ")}\n${d.value}`);

    // label rendering
    const labelGroup = svg.append("g")
      .selectAll("g")
      .data(root.descendants().filter(d => d.depth === 2 && (d.x1 - d.x0) > 0.05))
      .join("g")
      .attr("transform", d => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      });

    labelGroup
    .append("text")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-family", "GT America")
      .attr("font-size", "11px")
      .attr("font-weight", "700")
      .attr("fill", d => {
        const trend = d.ancestors().find(a => a.depth === 1)?.data.name ?? "No Data";
        return trend === "Worsened" ? "#fff" : "#fff";
      })
      .text(d => d.data.name);

    // central count
    const totalMetrics = d3.sum(
      root.descendants().filter(d => d.depth === 2),
      d => d.value ?? 0
    );

    svg.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radius * 0.4) // adjust radius as needed
      .attr("fill", "#fff");

    svg.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", "32px")
      .attr("fill", "#181D27")
      .attr("font-family", "GT America")
      .attr("font-weight", "900")
      .text(d3.format(",")(totalMetrics));

    svg.append("text")
      .attr("x", 0)
      .attr("y", 17)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("fill", "#181D27")
      .attr("font-family", "GT America")
      .attr("font-weight", "400")
      .text("Metrics");
  }, [data, width, height]);

  return <svg ref={ref} />;
}