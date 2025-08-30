'use client';

import { useAppContext } from '../contexts/AppContext';

export default function Header() {
  const { selectedCountry, setSelectedCountry, selectedRegion, setSelectedRegion } = useAppContext();

  return (
    <header className="fixed top-0 right-0 left-64 bg-white border-b border-gray-200 z-40 px-8 py-4 shadow-sm">
      <div className="flex justify-end items-center gap-4">
        <div className="relative w-40">
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="West Coast">West Coast</option>
            <option value="East Coast">East Coast</option>
            <option value="Midwest">Midwest</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
        </div>

        <div className="w-px h-8 bg-gray-300"></div>

        <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <span className="text-xl">🔔</span>
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
}
