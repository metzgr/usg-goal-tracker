import React from "react";
import IndicatorChangeLabel from "src/components/charts/indicator-change-label";

type StatHeaderProps = {
  mostRecentActual: number;
  percentChangeResult: number;
  unitFormat?: string;
};

export default function StatHeader({ mostRecentActual, percentChangeResult, unitFormat }: StatHeaderProps) {
  // Format the unit if provided and equal to "%"
  const formattedActual = mostRecentActual.toLocaleString() + (unitFormat === "%" ? "%" : "");

  return (
    <div className="flex justify-between mb-[10px]">
      <div>
        <h5 className="text-[28px] leading-[1] font-black text-gray-950">
          {formattedActual}
        </h5>
      </div>
      <IndicatorChangeLabel percentChangeResult={percentChangeResult} />
    </div>
  );
}