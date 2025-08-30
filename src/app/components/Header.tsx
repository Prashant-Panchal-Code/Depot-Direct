'use client';

import { useAppContext } from '../contexts/AppContext';
import { Button } from "@/components/ui/button";

export default function Header() {
  const { selectedCountry, setSelectedCountry, selectedRegion, setSelectedRegion, sidebarCollapsed, setSidebarCollapsed } = useAppContext();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-3 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        {/* Left side - Logo and Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold text-primary-custom">Depot Direct</h1>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-4">
          <div className="relative w-40">
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-custom focus:border-primary-custom"
            >
              <option value="USA">🇺🇸 USA</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Mexico">🇲🇽 Mexico</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
          </div>
          
          <div className="relative w-40">
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-custom focus:border-primary-custom"
            >
              <option value="West Coast">West Coast</option>
              <option value="East Coast">East Coast</option>
              <option value="Midwest">Midwest</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
          </div>

          <div className="w-px h-8 bg-gray-300"></div>

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <span className="text-xl">🔔</span>
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}
