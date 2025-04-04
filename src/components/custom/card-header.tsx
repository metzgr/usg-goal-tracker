import Badge from "src/components/custom/badge";

export default function CardHeader({
  title,
  startDate,
  endDate,
  cardType,      // e.g., "Plan" or undefined
  orgAcronym = ""
}: {
  title: string;
  startDate: string;
  endDate: string;
  cardType: string;
  orgAcronym?: string;
}) {
  // Only for Plan cards do we check if the title is "short".
  const isShort = cardType === "Plan" ? title.length <= 30 : false;
  const sizeClass = cardType === "Plan" 
    ? (isShort ? "text-3xl" : "text-2xl")
    : "text-2xl";

  // For Plan cards, title renders bold and uppercase; otherwise, normal.
  const weightClass = cardType === "Plan" ? "font-bold uppercase" : "";
  
  // For Plan cards, center; for others, left-align.
  const alignClass = cardType === "Plan" ? "text-center" : "text-left";
  
  // Build the complete class string.
  const h2Classes = `mt-4 font-serif text-gray-950 ${sizeClass} ${weightClass} ${alignClass}`;

  // For a Plan card, prepend the orgAcronym (with a backslash separator)
  // unless orgAcronym equals "Multiple Owners".
  const displayTitle =
    cardType === "Plan" && orgAcronym && orgAcronym !== "Multiple Owners"
      ? (
          <>
            <span>
              {orgAcronym} <span className="text-gray-400 font-normal">\</span>{" "}
            </span>
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