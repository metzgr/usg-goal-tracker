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

    const color = d3.scaleOrdinal<string>()
      .domain(["Improved", "Worsened", "Unchanged", "No Data"])
      .range(["#FFD6AE", "#0A0D12", "#a3a3a3", "#e2e8f0"]);

    const arc = d3.arc<d3.HierarchyRectangularNode<any>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    // SVG setup
    const svg = d3.select(ref.current)
      .attr("width", width + 2.4)
      .attr("height", height + 2.4)
      .attr("viewBox", `${-(width + 2.4) / 2} ${-(height + 2.4) / 2} ${width + 2.4} ${height + 2.4}`)
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove(); // clear previous renders

    // defs for pattern fill
    const defs = svg.append("defs");

    defs.append("pattern")
      .attr("id", "improved-pattern")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", 30)
      .attr("height", 30);

    defs.select("pattern#improved-pattern")
      .append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", "#FFD6AE");

    defs.select("pattern#improved-pattern")
      .append("image")
      .attr("href", "/artwork/pattern/arrow-red-5-up.jpg")
      .attr("width", 30)
      .attr("height", 30);

    // arc rendering
    svg.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => {
        const topLevel = d.ancestors().find(a => a.depth === 1);
        const trend = topLevel?.data.name ?? "No Data";
        return trend === "Improved" ? "url(#improved-pattern)" : color(trend);
      })
      .attr("d", arc)
      .attr("stroke", "#0A0D12")
      .attr("stroke-width", 1.2)
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
        return trend === "Improved" ? "#0A0D12" : "#fff";
      })
      .text(d => d.data.name);

    labelGroup.each(function (d) {
      const trend = d.ancestors().find(a => a.depth === 1)?.data.name ?? "No Data";
      if (trend === "Improved") {
        const text = this.getElementsByTagName("text")[0];
        const textWidth = text.getComputedTextLength();
        d3.select(this)
          .insert("rect", "text")
          .attr("x", -textWidth / 2 - 3) // padding of 3
          .attr("y", -6)
          .attr("width", textWidth + 6) // padding of 3 on each side
          .attr("height", 12)
          .attr("fill", "#fff")
      }
    });

    // central count
    svg.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", "28px")
      .attr("fill", "#0A0D12")
      .attr("font-family", "GT America")
      .attr("font-weight", "900")
      .text(d3.format(",")(root.value ?? 0));

    svg.append("text")
      .attr("x", 0)
      .attr("y", 16)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", "#181D27")
      .attr("font-family", "GT America")
      .attr("font-weight", "400")
      .text("Metrics");
  }, [data, width, height]);

  return <svg ref={ref} />;
}