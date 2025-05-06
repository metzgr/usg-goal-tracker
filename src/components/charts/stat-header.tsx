import React from "react";
import IndicatorChangeLabel from "src/components/custom/indicator-change-label";

type StatHeaderProps = {
  dataActuals: number[];
  dataTargets: number[];
  unitFormat?: string;
};

export default function StatHeader({ dataActuals, dataTargets, unitFormat }: StatHeaderProps) {
  // Get the most recent actual value (defaulting to 0 if the array is empty)
  const mostRecentActual = dataActuals.length > 0 ? dataActuals[dataActuals.length - 1] : 0;
  // Format the unit if provided and equal to "%"
  const formattedActual = mostRecentActual.toLocaleString() + (unitFormat === "%" ? "%" : "");

  return (
    <div className="flex justify-between mb-[10px]">
      <div>
        <h5 className="text-[28px] leading-[1] font-black text-gray-950">
          {formattedActual}
        </h5>
      </div>
      <IndicatorChangeLabel 
         dataActuals={dataActuals} 
         dataTargets={dataTargets}
      />
    </div>
  );
}