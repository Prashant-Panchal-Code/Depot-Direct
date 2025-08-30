'use client';

import { useAppContext } from '../contexts/AppContext';

export default function UsersContent() {
  const { selectedCountry, selectedRegion } = useAppContext();

  return (
    <main className="ml-64 pt-20 min-h-screen bg-gray-50 text-gray-900 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Users</h1>
            <p className="text-gray-400 mt-2">
              User management for {selectedRegion}, {selectedCountry}
            </p>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <p className="text-gray-400 mb-6">
            This section will contain user management functionality including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-700/50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">👤 User Accounts</h3>
              <p className="text-sm text-gray-400">Manage user accounts and profiles</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">🔐 Permissions</h3>
              <p className="text-sm text-gray-400">Role-based access control</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">📱 Activity Logs</h3>
              <p className="text-sm text-gray-400">Track user activity</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
