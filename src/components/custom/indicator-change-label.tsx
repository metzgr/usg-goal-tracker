"use client";

type IndicatorChangeLabelProps = {
  dataActuals: number[];
  dataTargets: number[];
  dataPercentChanges: number[];
};

export default function IndicatorChangeLabel({
  dataActuals,
  dataTargets,
  dataPercentChanges,
}: IndicatorChangeLabelProps) {
  // Determine the most recent percent change value
  const changeValue = dataPercentChanges && dataPercentChanges.length > 0
    ? dataPercentChanges[dataPercentChanges.length - 1]
    : 0;

  // Determine if targets are provided
  const hasTarget = dataTargets && dataTargets.length > 0;

  // Simplified: posPctChange is true if the most recent percent change is positive
  const posPctChange = changeValue > 0;

  // Set color based on whether there's a target and if the percent change is positive
  const colorClass = hasTarget
    ? (posPctChange ? "text-indigo-600" : "text-red-600")
    : "text-gray-950";

  // Arrow rotation: if percent change is positive then rotate -90°, otherwise rotate 90°
  const arrowRotation = posPctChange ? "rotate-[-90deg]" : "rotate-[90deg]";

  return (
    <div className="flex items-center">
      <span className={`material-icons-sharp !text-[18px] ${arrowRotation} mt-[4px] ${colorClass}`}>
        play_arrow
      </span>
      <span className={`text-sm font-medium text-center ${colorClass}`}>
        {changeValue}%
      </span>
    </div>
  );
}