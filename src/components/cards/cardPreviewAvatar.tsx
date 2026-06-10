import React from "react";

// Usage: <CardPreviewAvatar orgs="USDA" /> or <CardPreviewAvatar orgs={["USDA", "HHS"]} />
// orgs: string or string[] of org acronyms (will be lowercased for .png)
// size: "sm" (default) or "lg" for larger avatars
export default function CardPreviewAvatar({
  orgs,
  size
}: {
  orgs: string | string[];
  size?: "sm" | "lg";
}) {
  // Normalize orgs to array
  const orgArray = Array.isArray(orgs) ? orgs : [orgs];
  // Dynamic sizing if size not provided
  const computedSize = size || (orgArray.length <= 2 ? "lg" : "sm");
  const sizeClass = computedSize === "lg" ? "w-8 h-8" : "w-6 h-6";
  const spaceClass = computedSize === "lg" ? "-space-x-2" : "-space-x-1";

  return (
    <div className={`flex ${spaceClass} overflow-hidden`}>
      {orgArray.filter(Boolean).slice(0, 4).map((org, index) => (
        <img
          key={index}
          className={`inline-block shrink-0 ${sizeClass} rounded-full bg-white ring-[1.5px] ring-white`}
          src={`/avatars/seals/${String(org).toLowerCase()}.png`}
          alt={`avatar ${org}`}
        />
      ))}
    </div>
  );
}

