"use client";

import React from "react";
import Artwork from "src/components/custom/artwork";
import PieChart from "src/components/custom/pie-chart";
import LineChart from "src/components/custom/line-chart";
import ChartLegend from "src/components/custom/chart-legend";
import StatHeader from "src/components/custom/stat-header";

type CardBodyProps = {
  cardType: string;
  artwork?: string;
  children?: React.ReactNode;
  totalIndicators?: number;
  indicatorsProgressed?: number;
  changeIndicatorsProgressed?: number;
  dataActuals?: number[];
  dataTargets?: number[];
};

export default function CardBody({
  cardType,
  artwork,
  children,
  totalIndicators,
  indicatorsProgressed,
  changeIndicatorsProgressed,
  dataActuals,
  dataTargets,
}: CardBodyProps) {
  if (cardType === "Goal") {
    return (
      <div className="mx-5">
        <Artwork artwork={artwork} />
      </div>
    );
  }

  // Shared container for "Indicator" and "Plan"
  return (
    <div className="px-6 py-4 bg-gray-50 mx-5">
      {cardType === "Indicator" ? (
  <>
    <StatHeader 
      dataActuals={dataActuals || []} 
      dataPercentChanges={dataPercentChanges || []} 
    />
    <LineChart dataActuals={dataActuals || []} dataTargets={dataTargets || []} />
  </>
      ) : cardType === "Plan" ? (
        <>
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 flex justify-between">
              <div>
                <p className="text-[28px] leading-[1] font-black text-gray-950">
                  {totalIndicators}
                </p>
                <p className="mt-[2px] text-xs font-medium text-gray-900">Indicators</p>
              </div>
              <div className="text-right">
                <p className="text-[28px] leading-[1] font-black text-gray-950">
                  {totalIndicators
                    ? `${((indicatorsProgressed || 0) / totalIndicators * 100).toFixed(0)}%`
                    : "0%"}
                </p>
                <p className="mt-[2px] text-xs font-medium text-gray-900">Improved</p>
              </div>
            </div>
          </div>
  
          <div className="flex justify-center mt-2">
            <div className="w-[188px] h-[188px]"> 
              <PieChart artworkFile="wheat" patternOption="tile" />
            </div>
          </div>
  
          <ChartLegend total={indicatorsProgressed || 0} posDifference={changeIndicatorsProgressed || 0} />
        </>
      ) : (
        // Fallback: render children if no specific type matches.
        children
      )}
    </div>
  );
}