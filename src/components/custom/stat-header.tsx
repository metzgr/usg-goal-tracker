import React from "react";
import IndicatorChangeLabel from "src/components/custom/indicator-change-label";

type StatHeaderProps = {
  dataActuals: number[];
  dataTargets: number[];
};

export default function StatHeader({ dataActuals, dataTargets }: StatHeaderProps) {
  // Get the most recent actual value (defaulting to 0 if the array is empty)
  const mostRecentActual = dataActuals.length > 0 ? dataActuals[dataActuals.length - 1] : 0;

  return (
    <div className="flex justify-between mb-[10px]">
      <div>
        <h5 className="text-[28px] leading-[1] font-black text-gray-950">
          {mostRecentActual.toLocaleString()}
        </h5>
      </div>
      <IndicatorChangeLabel 
         dataActuals={dataActuals} 
         dataTargets={dataTargets}
      />
    </div>
  );
}