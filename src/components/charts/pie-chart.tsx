"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function PieChart({
  artwork = "",
  patternOption = "tile", // "tile" or "fill"
  totalIndicators = 0,
  indicatorsProgressed = 0,
}) {
  console.log('PieChart artwork prop:', artwork);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  // Update container dimensions on mount and on window resize.
  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    }
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Calculate progress percentage
    const progressPercent = totalIndicators ? (indicatorsProgressed / totalIndicators) * 100 : 0;
    // Create pie data: one slice for progress, the other for the remainder.
    const data = [progressPercent, 100 - progressPercent];

    const patternId = `artwork-pattern-${Math.random().toString(36).substr(2, 9)}`;

    // Clear previous SVG content.
    d3.select(containerRef.current).select("svg").remove();

    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2;

    // Create an SVG element and center the group.
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Append the base black circle.
    svg
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radius)
      .attr("fill", "var(--color-gray-950)");

    // Append a white circle on top, 1px smaller in radius.
    svg
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radius - 1)
      .attr("fill", "white");

    // If artwork is provided, define a pattern.
    if (artwork) {
      const patternTileWidth = patternOption === "tile" ? 30 : 1;
      const patternTileHeight = patternOption === "tile" ? 25 : 1;
      const patternUnits = patternOption === "tile" ? "userSpaceOnUse" : "objectBoundingBox";

      const defs = svg.append("defs");
      const pattern = defs
        .append("pattern")
        .attr("id", patternId)
        .attr("patternUnits", patternUnits)
        .attr("width", patternTileWidth)
        .attr("height", patternTileHeight);

      // Background rectangle for the pattern (orange)
      pattern
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", patternTileWidth)
        .attr("height", patternTileHeight)
        .attr("fill", "var(--color-orange-200)");

      if (patternOption === "tile") {
        // Adjust image size for tile option.
        const marginX = 0;
        const marginY = 2;
        const imgWidth = patternTileWidth - marginX;
        const imgHeight = patternTileHeight - marginY;
        const offsetX = (patternTileWidth - imgWidth) / 2;
        const offsetY = (patternTileHeight - imgHeight) / 2;
        pattern
          .append("image")
          .attr("xlink:href", `/artwork/pattern/${artwork}.jpg`)
          .attr("x", offsetX)
          .attr("y", offsetY)
          .attr("width", imgWidth)
          .attr("height", imgHeight)
          .attr("preserveAspectRatio", "xMidYMid slice");
      } else {
        // For "fill", let the image fill the shape.
        pattern
          .append("image")
          .attr("xlink:href", `/artwork/pattern/${artwork}.jpg`)
          .attr("width", radius * 2)
          .attr("height", radius * 2)
          .attr("preserveAspectRatio", "xMidYMid slice");
      }
    }

    // Create a pie generator.
    const pie = d3.pie();

    // Create an arc generator for the pie slices.
    // Outer radius is set to (radius - 6) to leave a white border.
    const arcGenerator = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius - 6);

    // Draw pie slices on top of the white circle.
    svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d, i) => {
        if (i === 0 && artwork) {
          return `url(#${patternId})`;
        }
        return i === 0 ? "var(--color-orange-200)" : "white";
      })
      .attr("stroke", "none");
  }, [dimensions, artwork, patternOption, totalIndicators, indicatorsProgressed]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}