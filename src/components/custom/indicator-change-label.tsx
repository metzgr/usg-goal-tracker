"use client";

type IndicatorChangeLabelProps = {
  dataActuals?: number[];
  dataTargets?: number[];
};

export default function IndicatorChangeLabel({
  dataActuals = [],
  dataTargets = [],
}: IndicatorChangeLabelProps) {
  // Calculate percent change from the two most recent actual values.
  const changeValue =
    dataActuals.length >= 2
      ? ((dataActuals[dataActuals.length - 1] - dataActuals[dataActuals.length - 2]) /
          dataActuals[dataActuals.length - 2]) *
        100
      : 0;

  // For arrow rotation, we use posPctChange.
  const posPctChange = changeValue > 0;

  // Determine if target data exists.
  const hasTarget = dataTargets && dataTargets.length > 0;

  // Determine if the metric moved in the "right direction" (if target data is available).
  let movedCorrectly = false;
  if (hasTarget && dataActuals.length >= 2 && dataTargets.length >= 2) {
    const prevTarget = dataTargets[dataTargets.length - 2];
    const finalTarget = dataTargets[dataTargets.length - 1];
    const prevActual = dataActuals[dataActuals.length - 2];
    const finalActual = dataActuals[dataActuals.length - 1];

    if (finalTarget > prevTarget) {
      movedCorrectly = finalActual > prevActual;
    } else if (finalTarget < prevTarget) {
      movedCorrectly = finalActual < prevActual;
    } else {
      movedCorrectly = posPctChange;
    }
  } else {
    movedCorrectly = posPctChange;
  }

  // For text color, if targets exist use computed colors; otherwise, default to gray.
  const colorClass = hasTarget
    ? (movedCorrectly ? "text-indigo-600" : "text-red-600")
    : "text-gray-950";

  // Arrow rotation: if positive percent change then rotate -90°, else rotate 90°.
  const arrowRotation = posPctChange ? "rotate-[-90deg]" : "rotate-[90deg]";

  return (
    <div className="flex items-center">
      <span className={`material-icons-sharp !text-[18px] ${arrowRotation} mt-[4px] ${colorClass}`}>
        play_arrow
      </span>
      <span className={`text-sm font-medium text-center ${colorClass}`}>
        {Math.abs(changeValue).toFixed(0)}%
      </span>
    </div>
  );
}