import React from "react";
import Artwork from "@/components/charts/artwork";
import PieChart from "@/components/charts/pie-chart";
import LineChart from "@/components/charts/line-chart";
import ChartLegend from "@/components/charts/chart-legend";
import StatHeader from "@/components/charts/stat-header";
import ProgressBarChart from "@/components/charts/progress-bar-chart";

interface CardPreviewBodyProps {
  data: any;
}

export default function CardPreviewBody({ data }: CardPreviewBodyProps) {
  // PLAN
  if (data.objectType === "Plan") {
    const totalIndicators = data.indicatorCount || 0;
    const indicatorsProgressed = data.indicatorImprovedCount || 0;
    const changeIndicatorsProgressed =
      typeof data.indicatorImprovedCount === "number" && typeof data.previousIndicatorImprovedCount === "number"
        ? data.indicatorImprovedCount - data.previousIndicatorImprovedCount
        : 0;
    return (
      <div className="px-6 py-4 bg-gray-50">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 flex justify-between">
            <div>
              <p className="text-[28px] leading-[1] font-black text-gray-950">{totalIndicators}</p>
              <p className="mt-[2px] text-xs font-medium text-gray-900">Indicators</p>
            </div>
            <div className="text-right">
              <p className="text-[28px] leading-[1] font-black text-gray-950">
                {totalIndicators ? `${((indicatorsProgressed / totalIndicators) * 100).toFixed(0)}%` : "0%"}
                {changeIndicatorsProgressed !== 0 && changeIndicatorsProgressed !== null && (
                  <span className="ml-2 text-xs text-green-600 align-top font-medium">(+{changeIndicatorsProgressed})</span>
                )}
              </p>
              <p className="mt-[2px] text-xs font-medium text-gray-900">Improved</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="w-[188px] h-[188px]">
            <PieChart
              artwork={Array.isArray(data.image) ? data.image[0] : data.image}
              patternOption={data.patternOption}
              indicatorsProgressed={indicatorsProgressed}
              totalIndicators={totalIndicators}
            />
          </div>
        </div>
        <ChartLegend
          cardType="Plan"
          indicatorsProgressed={indicatorsProgressed}
          changeIndicatorsProgressed={changeIndicatorsProgressed}
          dataActuals={[]}
          dataTargets={[]}
        />
      </div>
    );
  }

  // GOAL
  if (data.objectType === "Goal") {
    return (
      <div className="px-6 py-4">
        <Artwork artwork={Array.isArray(data.image) ? data.image[0] : data.image} />
      </div>
    );
  }

  // METRIC
  if (data.objectType === "Metric") {
    return (
      <div className="px-6 py-4 bg-gray-50">
        <StatHeader
          dataActuals={data.result || []}
          dataTargets={data.targetResult || []}
          unitFormat={data.unitFormat}
        />
        <ProgressBarChart
          dataActuals={data.result || []}
          dataTargets={data.targetResult || []}
        />
        <LineChart
          dataActuals={data.result || []}
          dataTargets={data.targetResult || []}
        />
        <ChartLegend
          cardType="Metric"
          indicatorsProgressed={0}
          changeIndicatorsProgressed={0}
          dataActuals={data.result || []}
          dataTargets={data.targetResult || []}
        />
      </div>
    );
  }
  return <div className="mx-5">Unsupported object type</div>;
}
