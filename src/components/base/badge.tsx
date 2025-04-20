import React from "react";

export default function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-full px-[10px] text-sm/5 py-[2px] font-medium text-gray-700 ring-1 ring-inset ring-gray-300 group-hover:bg-gray-900 group-hover:ring-gray-900 group-hover:text-gray-100 ${className}`}
    >
      {children}
    </span>
  );
}