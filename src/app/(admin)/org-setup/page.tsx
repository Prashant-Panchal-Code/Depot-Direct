'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast-placeholder'
import { useAppContext } from '@/app/contexts/AppContext'
import CompaniesGrid from '@/components/admin/CompaniesGrid'
import RegionsGrid from '@/components/admin/RegionsGrid'
import UsersGrid from '@/components/admin/UsersGrid'
import AdminLayoutWrapper from '../../components/AdminLayoutWrapper'

// Country interface
interface Country {
  id: number
  name: string
  iso_code: string
  active: boolean
  region_count?: number
  company_count?: number
  created_at: string
}

// Mock countries data
const mockCountries: Country[] = [
  {
    id: 1,
    name: 'United States',
    iso_code: 'US',
    active: true,
    region_count: 4,
    company_count: 8,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Canada',
    iso_code: 'CA',
    active: true,
    region_count: 3,
    company_count: 5,
    created_at: '2023-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'United Kingdom',
    iso_code: 'GB',
    active: true,
    region_count: 2,
    company_count: 3,
    created_at: '2023-01-03T00:00:00Z'
  },
  {
    id: 4,
    name: 'Australia',
    iso_code: 'AU',
    active: false,
    region_count: 1,
    company_count: 2,
    created_at: '2023-01-04T00:00:00Z'
  },
]

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
  const { setSidebarCollapsed } = useAppContext()
  const [currentView, setCurrentView] = useState<'countries' | 'detailed'>('countries')
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [countries, setCountries] = useState<Country[]>(mockCountries)
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(null)

  // Handle country double-click to go to detailed view
  const handleCountryDoubleClick = (country: Country) => {
    setSelectedCountry(country)
    setCurrentView('detailed')
    setSelectedCompany(null)
    setSelectedRegion(null)
    // Collapse sidebar when entering detailed view
    setSidebarCollapsed(true)
  }

  // Handle back to countries view
  const handleBackToCountries = () => {
    setCurrentView('countries')
    setSelectedCountry(null)
    setSelectedCompany(null)
    setSelectedRegion(null)
    // Expand sidebar when returning to countries view
    setSidebarCollapsed(false)
  }

  // Handle company selection
  const handleCompanySelect = (company: SelectedCompany | null) => {
    setSelectedCompany(company)
    setSelectedRegion(null)
  }

  // Handle region selection
  const handleRegionSelect = (region: SelectedRegion | null) => {
    setSelectedRegion(region)
  }

  // Handle country status toggle
  const handleCountryToggle = (countryId: number) => {
    setCountries(prev => 
      prev.map(country => 
        country.id === countryId 
          ? { ...country, active: !country.active }
          : country
      )
    )
    showToast('Country status updated successfully')
  }

  return (
    <AdminLayoutWrapper>
      {currentView === 'countries' ? (
        <div className="space-y-6">
          {/* Page Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Organizational Setup
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage countries and organizations. Double-click on a country to view detailed setup.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <Button className="bg-primary-custom hover:bg-blue-700 text-white">
                + Add Country
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Total Countries: {countries.length}</span>
              <span>•</span>
              <span>Active: {countries.filter(c => c.active).length}</span>
            </div>
          </div>

          {/* Countries Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISO Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Companies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Regions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {countries.map((country) => (
                  <tr 
                    key={country.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onDoubleClick={() => handleCountryDoubleClick(country)}
                    title="Double-click to view detailed setup"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{country.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {country.iso_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {country.company_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {country.region_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        country.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {country.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCountryToggle(country.id)
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        {country.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Breadcrumb and Page Header */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={handleBackToCountries}
                className="hover:text-blue-600 hover:underline"
              >
                Countries
              </button>
              <span>›</span>
              <span className="text-gray-900 font-medium">{selectedCountry?.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Organization Setup - {selectedCountry?.name}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage companies, regions, and users for {selectedCountry?.name}.
            </p>
          </div>

          {/* Three-Pane Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
            {/* Left Pane - Companies Grid */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900">Companies</h2>
                <p className="text-sm text-gray-500">
                  Companies in {selectedCountry?.name}
                </p>
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
                    ? `Regions for ${selectedCompany.name}` 
                    : 'Select a company to filter regions'
                  }
                </p>
              </div>
              <div className="p-4">
                <RegionsGrid 
                  onSelect={handleRegionSelect}
                  selectedRegionId={selectedRegion?.id}
                  selectedCompany={selectedCompany}
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
      )}
    </AdminLayoutWrapper>
  )
}