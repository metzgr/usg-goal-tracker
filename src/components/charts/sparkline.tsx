

 "use client";
 
 import * as d3 from "d3";
 import React, { useEffect, useRef } from "react";
 
 interface SparklinePoint {
   actual: number;
   target: number;
 }
 
 export function Sparkline({ data }: { data: SparklinePoint[] }) {
   const ref = useRef<SVGSVGElement | null>(null);
 
   useEffect(() => {
     if (!ref.current || !data?.length) return;
 
     const width = 100;
     const height = 30;
     const margin = { top: 4, right: 4, bottom: 4, left: 4 };
 
     const svg = d3.select(ref.current);
     svg.selectAll("*").remove();
 
     const x = d3
       .scaleLinear()
       .domain([0, data.length - 1])
       .range([margin.left, width - margin.right]);
 
     const y = d3
       .scaleLinear()
       .domain([0, d3.max([...data.map(d => d.actual), ...data.map(d => d.target)]) || 1])
       .range([height - margin.bottom, margin.top]);
 
     const lineActual = d3
       .line<SparklinePoint>()
       .x((_, i) => x(i))
       .y(d => y(d.actual))
       .curve(d3.curveMonotoneX);
 
     const lineTarget = d3
       .line<SparklinePoint>()
       .x((_, i) => x(i))
       .y(d => y(d.target))
       .curve(d3.curveMonotoneX);
 
     svg
       .append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "#444CE7")
       .attr("stroke-width", 2)
       .attr("d", lineActual);
 
     svg
       .append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "#9CA3AF")
       .attr("stroke-width", 1)
       .attr("stroke-dasharray", "3,2")
       .attr("d", lineTarget);
   }, [data]);
 
   return <svg ref={ref} width={100} height={30} />;
 }