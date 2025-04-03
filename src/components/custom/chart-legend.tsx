"use client";

type ChartLegendProps = {
  cardType: string; // "Plan" or "Indicator"
  indicatorsProgressed: number;
  changeIndicatorsProgressed: number;
  dataActuals: number[];
  dataTargets: number[];
};

export default function ChartLegend({
  cardType,
  indicatorsProgressed,
  changeIndicatorsProgressed,
  dataActuals,
  dataTargets,
}: ChartLegendProps) {
  if (cardType === "Plan") {
    return (
      <div className="flex justify-center mt-[10px]">
        <p className="inline-flex items-center text-sm text-gray-950">
          <svg
            className="mr-[2px] w-[16px] h-[16px] fill-orange-200"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="4" className="stroke-gray-900" strokeWidth="1" />
          </svg>
          <span className="font-bold mr-[2px]">{indicatorsProgressed}</span> (+{changeIndicatorsProgressed}) went in the right direction
        </p>
      </div>
    );
  } else if (cardType === "Indicator") {
    // Determine if targets exist.
    const hasTarget = dataTargets && dataTargets.length > 0;

    let movedCorrectly = false;
    if (hasTarget && dataActuals.length >= 2 && dataTargets.length >= 2) {
      const secondLastIndex = dataActuals.length - 2;
      const lastIndex = dataActuals.length - 1;
      const prevActual = dataActuals[secondLastIndex];
      const finalActual = dataActuals[lastIndex];
      const prevTarget = dataTargets[secondLastIndex];
      const finalTarget = dataTargets[lastIndex];

      const targetCallsForIncrease = finalTarget > prevTarget;
      const targetCallsForDecrease = finalTarget < prevTarget;
      const actualIncreased = finalActual > prevActual;
      const actualDecreased = finalActual < prevActual;

      movedCorrectly =
        (targetCallsForIncrease && actualIncreased) ||
        (targetCallsForDecrease && actualDecreased);
    }

    // Compute color class based on whether the metric moved correctly.
    const colorClass = hasTarget
      ? (movedCorrectly ? "fill-indigo-600" : "fill-red-600")
      : "fill-gray-950";

    if (!hasTarget) {
      // Layout for Indicator with NO targets: only one label "Actual"
      return (
        <div className="flex justify-center mt-[10px]">
          <p className="inline-flex items-center text-xs text-gray-950">
            <svg
              className={`w-[16px] h-[16px] ${colorClass}`}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="4" />
            </svg>
            <span className="font-medium">Actual</span>
          </p>
        </div>
      );
    } else {
      // Layout for Indicator with targets: render two labels, one for Actual and one for Target.
      return (
        <div className="flex justify-center mt-[10px]">
          <p className="inline-flex items-center text-xs text-gray-950 mr-2">
            <svg
              className={`w-[16px] h-[16px] ${colorClass}`}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="4" className="stroke-current" strokeWidth="2" />
            </svg>
            <span className="font-medium">Actual</span>
          </p>
          <p className="inline-flex items-center text-xs text-gray-950">
            <svg
              className="w-[16px] h-[16px] fill-gray-950"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="4" />
            </svg>
            <span className="font-medium">Target</span>
          </p>
        </div>
      );
    }
  } else {
    return null;
  }
}