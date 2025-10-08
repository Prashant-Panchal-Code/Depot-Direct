'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from '@/hooks/useUser';
import { useRoleBasedContext } from '@/contexts/RoleBasedContext';

const mockUsers = [
  {
    id: 1,
    email: 'datamanager@example.com',
    role: 'Data Manager',
    name: 'John Data Manager',
    company_id: 1,
    companyName: 'Depot Direct Corp'
  },
  {
    id: 2,
    email: 'planner@example.com',
    role: 'Planner',
    name: 'Jane Planner',
    company_id: 1,
    companyName: 'Depot Direct Corp'
  },
  {
    id: 3,
    email: 'viewer@example.com',
    role: 'Viewer',
    name: 'Bob Viewer',
    company_id: 1,
    companyName: 'Depot Direct Corp'
  }
];

export default function RoleDemoPage() {
  const { user } = useUser();
  const {
    userRole,
    isDataManager,
    canAddEntities,
    selectedRegions,
    availableRegions,
    shouldFilterByRegion,
    shouldFilterByCompany,
    companyName
  } = useRoleBasedContext();

  const [currentMockUser, setCurrentMockUser] = useState(mockUsers[0]);

  return (
    <main className="pt-20 px-4 h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Role-Based Access Control Demo
          </h1>
          <p className="text-gray-600">
            This page demonstrates how different user roles see data differently in the TMS system.
          </p>
        </div>

        {/* Mock User Switcher */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Switch Mock User Role</h2>
          <div className="flex gap-4">
            {mockUsers.map((mockUser) => (
              <Button
                key={mockUser.id}
                variant={currentMockUser.id === mockUser.id ? "default" : "outline"}
                onClick={() => setCurrentMockUser(mockUser)}
              >
                {mockUser.role}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Note:</strong> This is for demo purposes. In a real app, user roles are determined by authentication.
          </p>
        </Card>

        {/* Current User Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current User Context</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{user?.name || currentMockUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium">{userRole || currentMockUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium">{companyName || currentMockUser.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Is Data Manager:</span>
                <span className={`font-medium ${isDataManager ? 'text-green-600' : 'text-red-600'}`}>
                  {isDataManager ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Can Add Entities:</span>
                <span className={`font-medium ${canAddEntities ? 'text-green-600' : 'text-red-600'}`}>
                  {canAddEntities ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Data Filtering Context</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Filter by Region:</span>
                <span className={`font-medium ${shouldFilterByRegion ? 'text-green-600' : 'text-red-600'}`}>
                  {shouldFilterByRegion ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Filter by Company:</span>
                <span className={`font-medium ${shouldFilterByCompany ? 'text-green-600' : 'text-red-600'}`}>
                  {shouldFilterByCompany ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Regions:</span>
                <span className="font-medium">{availableRegions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Regions:</span>
                <span className="font-medium">{selectedRegions.length}</span>
              </div>
              {selectedRegions.length > 0 && (
                <div className="mt-2">
                  <span className="text-gray-600 text-sm">Selected:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRegions.map((region) => (
                      <span
                        key={region.id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {region.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Role-Based Behavior Explanation */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Role-Based Behavior</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-700">Data Manager Role</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Sees all data based on Company (not regions)</li>
                <li>• Can add Sites, Depots, Parkings, and Vehicles</li>
                <li>• Header shows "Company: [Company Name]"</li>
                <li>• No region selector is shown</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-700">Planner Role</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Sees data based on selected Region(s)</li>
                <li>• Cannot add entities (read/write for assignments)</li>
                <li>• Header shows Region selector</li>
                <li>• Can belong to multiple Regions</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-700">Viewer Role</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Sees data based on selected Region(s)</li>
                <li>• Cannot add entities (read-only)</li>
                <li>• Header shows Region selector</li>
                <li>• Can belong to multiple Regions</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Navigation Instructions */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Test the Implementation</h3>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>To see role-based functionality in action:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Navigate to the <strong>Parking</strong> page to see filtered data</li>
              <li>Navigate to the <strong>Depots</strong> page to see role-based add buttons</li>
              <li>Navigate to the <strong>Sites</strong> page to see region-based filtering</li>
              <li>Look at the header to see role-specific information display</li>
              <li>For Planner/Viewer roles, use the Region selector to change data view</li>
            </ol>
          </div>
        </Card>
      </div>
    </main>
  );
}