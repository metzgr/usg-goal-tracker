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
      .range(["#067647", "#D92D20", "#a3a3a3", "#e2e8f0"]);

    const arc = d3.arc<d3.HierarchyRectangularNode<any>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove(); // clear previous renders

    svg.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => {
        const topLevel = d.ancestors().find(a => a.depth === 1);
        return color(topLevel?.data.name ?? "No Data");
      })
      .attr("d", arc)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .append("title")
      .text(d => `${d.ancestors().map(n => n.data.name).reverse().join(" → ")}\n${d.value}`);

    svg.append("g")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("transform", d => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-family", "GT America")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("fill", "#fff")
      .text(d => {
        const angle = d.x1 - d.x0;
        return angle > 0.05 ? d.data.name : "";
      });

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
      .attr("fill", "#717680")
      .attr("font-family", "GT America")
      .attr("font-weight", "500")
      .text("Metrics");
  }, [data, width, height]);

  return <svg ref={ref} />;
}