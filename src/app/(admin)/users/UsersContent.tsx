'use client';

import { useAppContext } from '@/app/contexts/AppContext';

export default function UsersContent() {
  const { selectedCountry, selectedRegion, sidebarCollapsed } = useAppContext();

  return (
    <main className={`pt-24 min-h-screen bg-gray-50 text-gray-900 overflow-y-auto transition-all duration-300 ${
      sidebarCollapsed ? 'ml-16' : 'ml-64'
    }`}>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-2">
              User management for {selectedRegion}, {selectedCountry}
            </p>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">User Management</h2>
          <p className="text-gray-600 mb-6">
            This section will contain user management functionality including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-900">👤 User Accounts</h3>
              <p className="text-sm text-gray-600">Manage user accounts and profiles</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-900">🔐 Permissions</h3>
              <p className="text-sm text-gray-600">Role-based access control</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="font-semibold mb-2 text-gray-900">📱 Activity Logs</h3>
              <p className="text-sm text-gray-600">Track user activity</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
