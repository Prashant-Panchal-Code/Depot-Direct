'use client';

import { useAppContext } from '../contexts/AppContext';

export default function TrucksContent() {
  const { selectedCountry, selectedRegion, sidebarCollapsed } = useAppContext();

  return (
    <main className={`pt-24 min-h-screen bg-gray-50 text-gray-900 overflow-y-auto transition-all duration-300 ${
      sidebarCollapsed ? 'ml-16' : 'ml-64'
    }`}>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Trucks</h1>
            <p className="text-gray-600 mt-2">
              Fleet management for {selectedRegion}, {selectedCountry}
            </p>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
          <div className="text-6xl mb-4">🚛</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Fleet Management</h2>
          <p className="text-gray-600 mb-6">
            This section will contain truck fleet management including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-900">🚚 Fleet Overview</h3>
              <p className="text-sm text-gray-600">Monitor all trucks and drivers</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-900">🔧 Maintenance</h3>
              <p className="text-sm text-gray-600">Track maintenance schedules</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-900">📍 GPS Tracking</h3>
              <p className="text-sm text-gray-600">Real-time truck locations</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
