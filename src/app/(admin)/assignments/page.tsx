/**
 * Assignments Admin Page - Manage entity relationships
 * 
 * Purpose: Central page for managing all system assignments and relationships
 * Features:
 * - Company ↔ Region assignments
 * - User ↔ Company assignments  
 * - User ↔ Region assignments
 * - Bulk assignment operations
 * 
 * TODO: Implement assignment interfaces with DualList components
 * TODO: Add assignment history and audit trails
 * TODO: Add assignment validation and conflict resolution
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminLayoutWrapper from '../../components/AdminLayoutWrapper'

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<'companies' | 'users' | 'bulk'>('companies')

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="mt-2 text-sm text-gray-600">
          Manage relationships between companies, regions, and users. Bulk assign and organize entities.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('companies')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'companies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Company Assignments
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Assignments
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bulk'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bulk Operations
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        
        {/* Company Assignments Tab */}
        {activeTab === 'companies' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company → Region Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Assign regions to companies for geographical organization.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">ACME Corporation (US)</span>
                    <span className="text-sm text-gray-500">3 regions</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Global Logistics (CA)</span>
                    <span className="text-sm text-gray-500">2 regions</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Company Assignments (TODO)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Companies:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Regions:</span>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Assignments:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unassigned Regions:</span>
                    <span className="font-medium text-orange-600">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Assignments Tab */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User → Company Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Assign users to companies and manage access levels.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">John Doe</span>
                    <span className="text-sm text-gray-500">ACME Corp</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Jane Smith</span>
                    <span className="text-sm text-gray-500">ACME Corp</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage User Assignments (TODO)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User → Region Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Assign users to specific regions within their companies.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">John Doe</span>
                    <span className="text-sm text-gray-500">2 regions</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">Jane Smith</span>
                    <span className="text-sm text-gray-500">1 region</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Region Access (TODO)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bulk Operations Tab */}
        {activeTab === 'bulk' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Company Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Import Companies (CSV)
                </Button>
                <Button variant="outline" className="w-full">
                  Export Company Data
                </Button>
                <Button variant="outline" className="w-full">
                  Bulk Region Assignment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk User Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Import Users (CSV)
                </Button>
                <Button variant="outline" className="w-full">
                  Export User Data
                </Button>
                <Button variant="outline" className="w-full">
                  Bulk User Assignment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Validate All Assignments
                </Button>
                <Button variant="outline" className="w-full">
                  Generate Reports
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                  Reset Assignments
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

      </div>

      {/* TODO Implementation Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Implementation TODO</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Implement DualList components for each assignment type</li>
          <li>• Add API endpoints for bulk operations</li>
          <li>• Add assignment validation and conflict detection</li>
          <li>• Add assignment history and audit logging</li>
          <li>• Add CSV import/export functionality</li>
        </ul>
      </div>
      </div>
    </AdminLayoutWrapper>
  )
}
