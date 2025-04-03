import React from "react";
import IndicatorChangeLabel from "src/components/custom/indicator-change-label";

type StatHeaderProps = {
  dataActuals: number[];
  dataPercentChanges: number[];
};

export default function StatHeader({ dataActuals, dataPercentChanges }: StatHeaderProps) {
  // Get the most recent actual value (defaulting to 0 if the array is empty)
  const mostRecentActual = dataActuals.length > 0 ? dataActuals[dataActuals.length - 1] : 0;
  // Get the most recent percent change (defaulting to 0)
  const mostRecentPctChange = dataPercentChanges.length > 0 ? dataPercentChanges[dataPercentChanges.length - 1] : 0;
  
  // Determine direction based on the sign of the percent change
  const changeDirection = mostRecentPctChange >= 0 ? "up" : "down";

  return (
    <div className="flex justify-between mb-[10px]">
      <div>
        <h5 className="text-[28px] leading-[1] font-black text-gray-950">
          {mostRecentActual.toLocaleString()}
        </h5>
      </div>
      <IndicatorChangeLabel 
        changeValue={Math.abs(mostRecentPctChange)} 
        changeDirection={changeDirection} 
      />
    </div>
  );
}