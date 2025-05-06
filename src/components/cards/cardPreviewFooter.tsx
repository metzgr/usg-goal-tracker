import React from "react";
import CardPreviewAvatar from "@/components/cards/cardPreviewAvatar";

// Accepts orgs (array of org acronyms) and orgNames (array of org names)
// Both arrays should be of the same length and correspond by index
export default function CardPreviewFooter({
  orgs,
  orgNames
}: {
  orgs: string[];
  orgNames: string[];
}) {
  return (
    <div className="w-full flex justify-between items-center">
      <div>
        <p className="text-sm font-semibold text-gray-900">{orgs.join(', ')}</p>
        <p className="text-xs text-gray-600">{orgNames.join(', ')}</p>
      </div>
      <div className="flex-1 flex justify-end">
        <CardPreviewAvatar orgs={orgs}/>
      </div>
    </div>
  );
}

