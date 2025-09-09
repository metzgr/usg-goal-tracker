import React from "react";

export default function CardPreviewTitle({
  name,
  startDate,
  endDate,
  objectType,
  orgAcronym = ""
}: {
  name: string;
  startDate?: string; // Added startDate
  endDate?: string;   // Added endDate
  objectType?: string;
  orgAcronym?: string;
}) {
  // If objectType is "Plan", title renders bold and uppercase; otherwise, normal.
  const weightClass = objectType === "Plan" ? "font-bold uppercase" : "";

  // Determine text alignment: center for plan, left otherwise.
  const alignClass = objectType === "Plan" ? "text-center" : "text-left";

  // Build the complete class string, with dynamic font size/leading by type.
  const fontSizeClass =
    objectType === "Plan" ? "text-3xl" : objectType === "Metric" ? "text-xl" : "text-2xl";
  const leadingClass = objectType === "Metric" ? "leading-tight" : "";
  const h2Classes = `mt-4 font-serif text-gray-950 ${fontSizeClass} ${leadingClass} ${weightClass} ${alignClass}`;

  // If objectType is "Plan" and an orgAcronym is provided, prepend it (with a backslash separator) to the name.
  const displayTitle =
    objectType === "Plan" && orgAcronym
      ? (
          <>
            <span>
              {orgAcronym} <span className="text-gray-400 font-normal">\</span>{" "}
            </span>
            {name}
          </>
        )
      : name;

  return (
    <h2 className={h2Classes}>
      {displayTitle}
    </h2>
  );
}
