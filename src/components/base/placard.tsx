import React from 'react';

export default function Placard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-2 group cursor-pointer">
      <div className="ring-1 ring-inset ring-gray-300 group-hover:ring-gray-400 py-4 rounded-[10px]">
      {children}
      </div>
    </div>
  );
}