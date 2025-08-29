'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState('USA');
  const [selectedRegion, setSelectedRegion] = useState('West Coast');

  return (
    <AppContext.Provider value={{
      selectedCountry,
      setSelectedCountry,
      selectedRegion,
      setSelectedRegion,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
