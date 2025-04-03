"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function PieChart({
  artwork = "",
  patternOption = "tile", // "tile" or "fill"
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  // Update container dimensions on mount and window resize.
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
    const patternId = `artwork-pattern-${Math.random().toString(36).substr(2, 9)}`;

    // Clear any previous SVG content.
    d3.select(containerRef.current).select("svg").remove();

    const { width, height } = dimensions;
    // Use the smaller dimension as the diameter.
    const radius = Math.min(width, height) / 2;

    // Create an SVG element and center the group.
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Append the base black circle (filled with fill-gray-950).
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

    // Dummy data for the pie chart: 75% and 25%.
    const data = [75, 25];

    // If an artwork file is provided, define a pattern in defs.
    if (artwork) {
        // Define different tile dimensions for horizontal vs. vertical spacing.
        const patternTileWidth = patternOption === "tile" ? 30 : 1;
        const patternTileHeight = patternOption === "tile" ? 25 : 1;
        const patternUnits = patternOption === "tile" ? "userSpaceOnUse" : "objectBoundingBox";
      
        const defs = svg.append("defs");
        const pattern = defs
          .append("pattern")
          .attr("id", patternId)
          .attr("patternUnits", patternUnits)
          .attr("width", patternOption === "tile" ? patternTileWidth : 1)
          .attr("height", patternOption === "tile" ? patternTileHeight : 1);
      
        // Draw a background rectangle in the pattern tile (orange)
        pattern
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", patternTileWidth)
          .attr("height", patternTileHeight)
          .attr("fill", "var(--color-orange-200)");
      
        // For the "tile" option, set the image dimensions smaller than the tile
        if (patternOption === "tile") {
          // For example, image size is reduced so there's some gap around it.
          const marginX = 0; // extra horizontal gap (tile width minus image width)
          const marginY = 2; // extra vertical gap (tile height minus image height)
          const imgWidth = patternTileWidth - marginX;  // 30 - 4 = 26px
          const imgHeight = patternTileHeight - marginY; // 20 - 2 = 18px
          const offsetX = (patternTileWidth - imgWidth) / 2; // centers image horizontally
          const offsetY = (patternTileHeight - imgHeight) / 2; // centers image vertically
          pattern
            .append("image")
            .attr("xlink:href", `/artwork/pattern/${artwork}.jpg`)
            .attr("x", offsetX)
            .attr("y", offsetY)
            .attr("width", imgWidth)
            .attr("height", imgHeight)
            .attr("preserveAspectRatio", "xMidYMid slice");
        } else {
          // For "fill", let the image fill the shape
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
    // Outer radius is set to (radius - 6) to leave a 6px white border.
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
        // The first slice (75%) uses either the pattern or fallback orange,
        // the second slice (25%) is white.
        if (i === 0 && artwork) {
          return `url(#${patternId})`;
        }
        return i === 0 ? "var(--color-orange-200)" : "white";
      })
      .attr("stroke", "none");
  }, [dimensions, artwork, patternOption]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}