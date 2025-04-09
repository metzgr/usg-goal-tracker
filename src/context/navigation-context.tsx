"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type NavigationContextType = {
  activeItem: 'Explore' | 'Analyze';
  setActiveItem: React.Dispatch<React.SetStateAction<'Explore' | 'Analyze'>>;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [activeItem, setActiveItem] = useState<'Explore' | 'Analyze'>('Explore');
  return (
    <NavigationContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};