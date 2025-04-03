
export default function CardTitle({
    title,
    startDate,
    endDate,
    cardType,      // e.g., "plan" or undefined
    titleLength,    // e.g., "short" or undefined
    orgAcronym = ""
  }) {
    // Determine font size: default is "text-2xl"; if titleLength is "short", use "text-3xl"
    const sizeClass = titleLength === "short" ? "text-3xl" : "text-2xl";
  
    // If plan, title renders bold and uppercase; otherwise, normal.
    const weightClass = cardType === "plan" ? "font-bold uppercase" : "";
  
    // Determine text alignment: center for plan, left otherwise.
    const alignClass = cardType === "plan" ? "text-center" : "text-left";
  
    // Build the complete class string.
    const h2Classes = `mt-4 font-serif text-gray-950 ${sizeClass} ${weightClass} ${alignClass}`;
  
    // If cardType is "plan" and an orgAcronym is provided, prepend it (with a backslash separator) to the title.
    const displayTitle =
      cardType === "plan" && orgAcronym
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
          <CustomBadge>{cardType}</CustomBadge>
          <span className="text-sm text-gray-600">
            {startDate}&ndash;{endDate}
          </span>
        </div>
        <h2 className={h2Classes}>{displayTitle}</h2>
      </div>
    );
  }