"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type NavigationContextType = {
  activeItem: 'Explore' | 'Analyze' | 'Discover';
  setActiveItem: React.Dispatch<React.SetStateAction<'Explore' | 'Analyze' | 'Discover'>>;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [activeItem, setActiveItem] = useState<'Explore' | 'Analyze' | 'Discover'>('Explore');
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