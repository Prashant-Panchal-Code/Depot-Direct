/**
 * Organizational Setup Page - 3-Pane Admin Interface
 * 
 * Main admin page showing Companies, Regions, and Users in a responsive 3-pane layout.
 * Left pane: Companies grid with selection
 * Middle pane: Regions grid (filtered by selected company's country)
 * Right pane: Users grid (filtered by selected company/region)
 * 
 * Server component that renders the layout and imports client-side grid components.
 * State management for selections is handled by child components via callbacks.
 * 
 * TODO: Add loading states and error boundaries
 * TODO: Add breadcrumb navigation
 * TODO: Add real-time updates when data changes
 */

'use client'

import { useState } from 'react'
import CompaniesGrid from '@/components/admin/CompaniesGrid'
import RegionsGrid from '@/components/admin/RegionsGrid'
import UsersGrid from '@/components/admin/UsersGrid'
import AdminLayoutWrapper from '../../components/AdminLayoutWrapper'

// Types for the selected entities
interface SelectedCompany {
  id: number
  name: string
  country_id: number
  country_name: string
}

interface SelectedRegion {
  id: number
  name: string
  country_id: number
}

export default function OrgSetupPage() {
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(null)

  // Handle company selection - clear region when company changes
  const handleCompanySelect = (company: SelectedCompany | null) => {
    setSelectedCompany(company)
    setSelectedRegion(null) // Clear region selection when company changes
  }

  // Handle region selection
  const handleRegionSelect = (region: SelectedRegion | null) => {
    setSelectedRegion(region)
  }

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Organizational Setup
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage companies, regions, and users. Select a company to filter regions and users.
          </p>
        </div>

      {/* Selection Indicators */}
      {(selectedCompany || selectedRegion) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-4 text-sm">
            {selectedCompany && (
              <div className="flex items-center">
                <span className="font-medium text-blue-700">Company:</span>
                <span className="ml-1 text-blue-600">{selectedCompany.name}</span>
                <button
                  onClick={() => handleCompanySelect(null)}
                  className="ml-2 text-blue-400 hover:text-blue-600"
                  title="Clear selection"
                >
                  ×
                </button>
              </div>
            )}
            {selectedRegion && (
              <div className="flex items-center">
                <span className="font-medium text-blue-700">Region:</span>
                <span className="ml-1 text-blue-600">{selectedRegion.name}</span>
                <button
                  onClick={() => handleRegionSelect(null)}
                  className="ml-2 text-blue-400 hover:text-blue-600"
                  title="Clear selection"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        
        {/* Left Pane - Companies Grid */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Companies</h2>
            <p className="text-sm text-gray-500">Click a row to filter regions and users</p>
          </div>
          <div className="p-4">
            <CompaniesGrid 
              onSelect={handleCompanySelect}
              selectedCompanyId={selectedCompany?.id}
              compact={true}
            />
          </div>
        </div>

        {/* Middle Pane - Regions Grid */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Regions</h2>
            <p className="text-sm text-gray-500">
              {selectedCompany 
                ? `Showing regions for ${selectedCompany.country_name}` 
                : 'Select a company to filter regions'
              }
            </p>
          </div>
          <div className="p-4">
            <RegionsGrid 
              selectedCompany={selectedCompany}
              onSelect={handleRegionSelect}
              selectedRegionId={selectedRegion?.id}
            />
          </div>
        </div>

        {/* Right Pane - Users Grid */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <p className="text-sm text-gray-500">
              {selectedCompany 
                ? `Users for ${selectedCompany.name}` 
                : 'Select a company to filter users'
              }
            </p>
          </div>
          <div className="p-4">
            <UsersGrid 
              filterCompanyId={selectedCompany?.id}
              filterRegionId={selectedRegion?.id}
            />
          </div>
        </div>

      </div>
      </div>
    </AdminLayoutWrapper>
  )
}
