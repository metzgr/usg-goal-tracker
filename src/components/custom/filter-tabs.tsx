import React from 'react'
import clsx from 'clsx'

const tabs = [
  { name: 'Everything', count: 12 },
  { name: 'Agencies', count: 24 },
  { name: 'Plans', count: 24 },
  { name: 'Goals', count: 32 },
  { name: 'Indicators', count: 36 },
]

export default function FilterTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4">
      {tabs.map((tab) => {
        const isActive = tab.name === activeTab

        return (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={clsx(
              'relative px-[18px] py-1 rounded-full text-[15px] leading-[26px] font-medium transition',
              isActive
                ? 'bg-white text-gray-950'
                : 'text-gray-600 hover:bg-white hover:text-gray-950'
            )}
          >
            {tab.name}
            {isActive && tab.count !== undefined && (
              <span className="leading-0 align-top ml-[3px] text-[11px] text-gray-500 font-normal relative top-[9px]">
              {tab.count}
            </span>
            )}
          </button>
        )
      })}
    </div>
  )
}