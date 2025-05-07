"use client";

type IndicatorChangeLabelProps = {
  percentChangeResult: number;
};

export default function IndicatorChangeLabel({ percentChangeResult }: IndicatorChangeLabelProps) {
  const changeValue = percentChangeResult;
  const posPctChange = changeValue > 0;
  const arrowRotation = posPctChange ? "rotate-[-90deg]" : "rotate-[90deg]";
  const arrowMargin = posPctChange ? "mt-[4px]" : "mt-[-4px]";
  let colorClass = "text-gray-950";
  if (changeValue > 0) colorClass = "text-indigo-600";
  else if (changeValue < 0) colorClass = "text-red-600";

  return (
    <div className="flex items-center">
      <span className={`material-icons-sharp !text-[18px] ${arrowRotation} ${arrowMargin} ${colorClass}`}>
        play_arrow
      </span>
      <span className={`text-sm font-medium text-center ${colorClass}`}>
        {(changeValue * 100).toFixed(0)}%
      </span>
    </div>
  );
}