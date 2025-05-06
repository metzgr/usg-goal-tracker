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
  const sizeClass = computedSize === "lg" ? "w-7 h-7" : "w-6 h-6";

  return (
    <div className="flex -space-x-1 overflow-hidden">
      {orgArray.filter(Boolean).slice(0, 4).map((org, index) => (
        <img
          key={index}
          className={`inline-block ${sizeClass} rounded-full ring-1 ring-white`}
          src={`/avatars/seals/${String(org).toLowerCase()}.png`}
          alt={`avatar ${org}`}
        />
      ))}
    </div>
  );
}

