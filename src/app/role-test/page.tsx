'use client';

import { useUser } from '@/hooks/useUser';
import { useRoleBasedContext } from '@/contexts/RoleBasedContext';
import { normalizeRole } from '@/utils/roleUtils';
import { Card } from "@/components/ui/card";

export default function RoleTestPage() {
  const { user, loading } = useUser();
  const {
    userRole,
    isDataManager,
    canAddEntities,
    shouldFilterByRegion,
    shouldFilterByCompany
  } = useRoleBasedContext();

  if (loading) {
    return (
      <main className="pt-20 px-4 h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading user data...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="pt-20 px-4 h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Role Normalization Test</h1>
            <p className="text-red-600">No user logged in. Please log in to test role normalization.</p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 px-4 h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Role Normalization Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-green-700">✅ Raw Data from API/JWT</h2>
              <div className="space-y-2 text-sm">
                <div><strong>Raw Role from Token:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{user.role}</code></div>
                <div><strong>User Name:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Company:</strong> {user.companyName}</div>
                <div><strong>Company ID:</strong> {user.company_id}</div>
                <div><strong>Role ID:</strong> {user.roleId}</div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-blue-700">🔧 Normalized Role Context</h2>
              <div className="space-y-2 text-sm">
                <div><strong>Normalized Role:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{userRole}</code></div>
                <div><strong>Is Data Manager:</strong> <span className={isDataManager ? 'text-green-600' : 'text-red-600'}>{isDataManager ? 'Yes' : 'No'}</span></div>
                <div><strong>Can Add Entities:</strong> <span className={canAddEntities ? 'text-green-600' : 'text-red-600'}>{canAddEntities ? 'Yes' : 'No'}</span></div>
                <div><strong>Filter by Region:</strong> <span className={shouldFilterByRegion ? 'text-green-600' : 'text-red-600'}>{shouldFilterByRegion ? 'Yes' : 'No'}</span></div>
                <div><strong>Filter by Company:</strong> <span className={shouldFilterByCompany ? 'text-green-600' : 'text-red-600'}>{shouldFilterByCompany ? 'Yes' : 'No'}</span></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Role Normalization Test</h3>
            <div className="text-sm space-y-1">
              <div>Direct normalization of raw role: <code className="bg-white px-2 py-1 rounded">{normalizeRole(user.role)}</code></div>
              <div>Context normalized role: <code className="bg-white px-2 py-1 rounded">{userRole}</code></div>
              <div className={`font-medium ${normalizeRole(user.role) === userRole ? 'text-green-600' : 'text-red-600'}`}>
                Normalization Status: {normalizeRole(user.role) === userRole ? '✅ CONSISTENT' : '❌ INCONSISTENT'}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">Expected Behavior for "{userRole}" Role:</h3>
            <ul className="text-sm space-y-1 text-blue-700">
              {userRole === 'Data Manager' && (
                <>
                  <li>• Should see all company data (no region filtering)</li>
                  <li>• Should be able to add Sites, Depots, Parkings, Vehicles</li>
                  <li>• Header should show "Company: {user.companyName}"</li>
                  <li>• No region selector should be visible</li>
                </>
              )}
              {(userRole === 'Planner' || userRole === 'Viewer') && (
                <>
                  <li>• Should see data filtered by selected regions</li>
                  <li>• {userRole === 'Viewer' ? 'Cannot' : 'Cannot'} add entities (only Data Managers can)</li>
                  <li>• Header should show region selector</li>
                  <li>• Data should refresh when regions change</li>
                </>
              )}
              {userRole === 'Admin' && (
                <>
                  <li>• Administrative access to system</li>
                  <li>• Can access admin-only features</li>
                  <li>• May have special permissions</li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="/parking" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Role-Based Parking Page →
            </a>
          </div>
        </Card>
      </div>
    </main>
  );
}