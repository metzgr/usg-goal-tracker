import Badge from "src/components/custom/badge";

export default function CardHeader({
  title,
  startDate,
  endDate,
  cardType,      // e.g., "Plan" or undefined
  orgAcronym = ""
}) {
  // Determine if the title is "short" based on a character limit (15 characters ~ 2.5 words)
  const isShort = title.length <= 15;
  const sizeClass = isShort ? "text-3xl" : "text-2xl";

  // If plan, title renders bold and uppercase; otherwise, normal.
  const weightClass = cardType === "Plan" ? "font-bold uppercase" : "";

  // Determine text alignment: center for plan, left otherwise.
  const alignClass = cardType === "Plan" ? "text-center" : "text-left";

  // Build the complete class string.
  const h2Classes = `mt-4 font-serif text-gray-950 ${sizeClass} ${weightClass} ${alignClass}`;

  // If cardType is "plan" and an orgAcronym is provided, prepend it (with a backslash separator) to the title.
  const displayTitle =
    cardType === "Plan" && orgAcronym
      ? (
        <>
          <span>{orgAcronym} <span className="text-gray-400 font-normal">\</span> </span>
          {title}
        </>
      )
      : title;

  return (
    <div className="px-5 pt-4 border-0 pb-3">
      <div className="flex justify-between">
        <Badge>{cardType}</Badge>
        <span className="text-sm text-gray-600">
          {startDate}&ndash;{endDate}
        </span>
      </div>
      <h2 className={h2Classes}>{displayTitle}</h2>
    </div>
  );
}