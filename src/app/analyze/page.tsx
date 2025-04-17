"use client";

import React, { useState } from "react";
import UsgBanner from "src/components/custom/usg-banner";
import Navigation from "src/components/custom/navigation";
import Header from "src/components/custom/header";
import metrics from "@/data/metric.json";
import metricResults from "@/data/metricResult.json";

export default function AnalyzePage() {
  const tableData = metrics.map((m) => ({ ...m, type: "metric" }));
  const groupedMetricResults = metricResults.reduce((acc, result) => {
    const metricId = result.metric?.[0];
    if (metricId) {
      if (!acc[metricId]) acc[metricId] = [];
      acc[metricId].push(result);
    }
    return acc;
  }, {});

  return (
    <div>
      <Header activeItem="Analyze"  />
      <main className="bg-[#F5F5F5] pb-12">
      </main>
    </div>
  );
}