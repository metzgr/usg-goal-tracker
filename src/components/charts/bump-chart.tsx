"use client";

import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface BumpData {
  trend: string;
  date: string; // format: "YYYY-QX"
  count: number;
}

interface Props {
  data: BumpData[];
  width?: number;
  height?: number;
}

const parseDate = d3.timeParse("%Y-Q%q");

function pivotData(data: BumpData[]) {
  const parsed = data
    .map(d => ({
      ...d,
      parsedDate: parseDate(d.date)
    }))
    .filter(d => d.parsedDate !== null) as (BumpData & { parsedDate: Date })[];

  const trends = Array.from(new Set(parsed.map(d => d.trend)));
  const dates = Array.from(new Set(parsed.map(d => +d.parsedDate!)))
    .sort()
    .map(d => new Date(d));

  const dateToEntry = new Map<string, any>();
  for (const date of dates) {
    const entry: any = { date };
    for (const trend of trends) {
      entry[trend] = 0;
    }
    dateToEntry.set(+date, entry);
  }

  for (const d of parsed) {
    const key = +d.parsedDate!;
    if (!dateToEntry.has(key)) continue;
    dateToEntry.get(key)[d.trend] += d.count;
  }

  return {
    dataByDate: Array.from(dateToEntry.values()),
    trends,
    dates
  };
}

export default function BumpChart({ data, width = 400, height = 400 }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const { dataByDate, trends, dates } = pivotData(data);
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 60, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const flatData = data.map(d => ({
      ...d,
      parsedDate: parseDate(d.date)
    })).filter(d => d.parsedDate !== null) as (BumpData & { parsedDate: Date })[];

    const x0 = d3.scaleBand()
      .domain(dates)
      .range([0, innerWidth])
      .paddingInner(0.3);

    const totalBarGap = 0;
    const barWidth = (x0.bandwidth() - totalBarGap) / 2;
    const x1 = (trend: string) => {
      return trend === "Improved" ? 0 : barWidth + totalBarGap;
    };

    const y = d3.scaleLinear()
      .domain([0, d3.max(flatData, d => d.count)!])
      .range([innerHeight, 0]);

    const g = svg
      .attr("width", width + 1)
      .attr("height", height + 1)
      .attr("viewBox", `0 0 ${width + 1} ${height + 1}`)
    .attr("style", "max-width: 100%; height: auto; display: block;")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const quartersByYear = d3.group(dates, d => d.getFullYear());
    const yearLabelGroup = g.append("g").attr("class", "fiscal-year-labels");

    yearLabelGroup.selectAll("text")
      .data(Array.from(quartersByYear.entries()))
      .join("text")
      .text(d => `${d[0]}`)
      .attr("x", d => {
        const quarterDates = d[1];
        const first = x0(quarterDates[0])!;
        const last = x0(quarterDates[quarterDates.length - 1])!;
        return first + (last - first + x0.bandwidth()) / 2;
      })
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .attr("font-size", "24px")
      .attr("font-family", "GT America")
      .attr("font-weight", "900");

    yearLabelGroup.selectAll("line")
      .data(Array.from(quartersByYear.entries()))
      .join("line")
      .attr("x1", d => x0(d[1][0])! - 1)
      .attr("x2", d => x0(d[1][d[1].length - 1])! + x0.bandwidth() + 1)
      .attr("y1", -12)
      .attr("y2", -12)
      .attr("stroke", "#0A0D12")
      .attr("stroke-width", 3);

    const backgroundGroup = g.append("g").attr("class", "bar-background");
    
    backgroundGroup.selectAll("rect")
      .data(dates)
      .join("rect")
      .attr("x", d => x0(d)!)
      .attr("y", 0)
      .attr("width", x0.bandwidth())
      .attr("height", innerHeight)
      .attr("fill", "#fff");
    
    g.selectAll("g.bar-group")
      .data(dates)
      .join("g")
      .attr("class", "bar-group")
      .attr("transform", d => `translate(${x0(d)},0)`)
      .selectAll("rect")
      .data(date => trends.map(trend => {
        const match = data.find(d => parseDate(d.date)?.getTime() === date.getTime() && d.trend === trend);
        return {
          trend,
          date,
          count: match ? match.count : 0
        };
      }))
      .join("rect")
      .attr("x", d => x1(d.trend))
      .attr("y", d => y(d.count))
      .attr("width", barWidth)
      .attr("height", d => innerHeight - y(d.count))
      .attr("fill", d => d.trend === "Improved" ? "#FFD6AE" : d.trend === "Worsened" ? "#D92D20" : "#aaa");

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0).tickFormat(d3.timeFormat("Q%q")))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll("text")
      .style("font-family", "GT America")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .attr("text-anchor", "middle")
        .attr("dy", "1.25em"));

    const overlayGroup = g.append("g").attr("class", "banding-overlay");

    overlayGroup.selectAll("rect")
      .data(dates)
      .join("rect")
      .attr("x", d => x0(d)!)
      .attr("y", 0)
      .attr("width", x0.bandwidth())
      .attr("height", innerHeight)
      .attr("fill", "none")
      .attr("stroke", "#0A0D12")
      .attr("stroke-width", 1);
  }, [data, width, height]);

  return <svg ref={ref} />;
}