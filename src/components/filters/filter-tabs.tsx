import React from 'react'
import clsx from 'clsx'

export default function FilterTabs({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: { name: string }[];
  activeTab: string;
  setActiveTab: (name: string) => void;
}) {
  return (
    <div className="flex gap-4">
      {tabs.map((tab) => {
        const isActive = tab.name === activeTab

        return (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={clsx(
              'relative px-[16px] py-1 rounded-full text-[15px] leading-[36px] font-medium transition',
              isActive
                ? 'bg-white text-gray-950'
                : 'text-gray-600 hover:bg-white hover:text-gray-950'
            )}
          >
            {tab.name}
        
          </button>
        )
      })}
    </div>
  )
}