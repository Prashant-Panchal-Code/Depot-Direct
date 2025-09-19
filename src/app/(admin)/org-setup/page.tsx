'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast-placeholder'
import { useAppContext } from '@/app/contexts/AppContext'
import CompaniesGrid from '@/components/admin/CompaniesGrid'
import RegionsGrid from '@/components/admin/RegionsGrid'
import UsersGrid from '@/components/admin/UsersGrid'
import AdminLayoutWrapper from '../../components/AdminLayoutWrapper'
import AdminApiService, { Country } from '@/lib/api/admin'

// Updated Country interface to match API response
interface CountryDisplay extends Country {
  active: boolean // We'll derive this from the data or set a default
}

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
  const [selectedCountry, setSelectedCountry] = useState<CountryDisplay | null>(null)
  const [countries, setCountries] = useState<CountryDisplay[]>([])
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load countries data from API
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Loading countries from API...')
        const countriesData = await AdminApiService.getCountriesWithStats()
        
        // Transform API data to include active status (defaulting to true)
        const transformedCountries: CountryDisplay[] = countriesData.map(country => ({
          ...country,
          active: true // Default all countries to active for now
        }))
        
        console.log('Successfully loaded countries:', transformedCountries.length)
        setCountries(transformedCountries)
      } catch (err) {
        console.error('Failed to load countries:', err)
        setError(`Failed to load countries: ${err instanceof Error ? err.message : 'Unknown error'}`)
        showToast('Failed to load countries. Please check if the API server is running.')
      } finally {
        setLoading(false)
      }
    }

    loadCountries()
  }, [])

  // Auto-select first company when entering detailed view
  useEffect(() => {
    if (currentView === 'detailed' && selectedCountry && !selectedCompany) {
      // For now, we'll let the CompaniesGrid handle company selection
      // This will be updated when we have the companies API endpoint
    }
  }, [currentView, selectedCountry, selectedCompany])

  // Clear region selection when company changes and refresh data
  useEffect(() => {
    if (selectedCompany) {
      setSelectedRegion(null)
      // Regions will automatically refresh based on the selected company
    }
  }, [selectedCompany])

  // Handle country double-click to go to detailed view
  const handleCountryDoubleClick = (country: CountryDisplay) => {
    setSelectedCountry(country)
    setCurrentView('detailed')
    setSelectedCompany(null) // Will be auto-selected by useEffect
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

  // Handle company selection - clear region when company changes
  const handleCompanySelect = (company: SelectedCompany | null) => {
    setSelectedCompany(company)
    // Region will be cleared by useEffect when company changes
  }

  // Handle region selection - filters users by region
  const handleRegionSelect = (region: SelectedRegion | null) => {
    setSelectedRegion(region)
    // Users grid will automatically refresh based on selected region
  }

  // Handle country status toggle
  const handleCountryToggle = async (countryId: number) => {
    try {
      const country = countries.find(c => c.id === countryId)
      if (!country) return

      // For now, just update locally. Later, we can add API call for status toggle
      setCountries(prev => 
        prev.map(country => 
          country.id === countryId 
            ? { ...country, active: !country.active }
            : country
        )
      )
      showToast('Country status updated successfully')
    } catch (err) {
      console.error('Failed to toggle country status:', err)
      showToast('Failed to update country status')
    }
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

          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading countries...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Summary Info */}
              <div className="flex justify-end items-center">
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
                        Depots
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
                          {country.isoCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {country.companiesCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {country.regionsCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {country.depotsCount || 0}
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
            </>
          )}
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
              {selectedCompany && ` Currently viewing: ${selectedCompany.name}`}
              {selectedRegion && ` → ${selectedRegion.name}`}
            </p>
          </div>

          {/* Three-Pane Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
            {/* Left Pane - Companies Grid */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900">Companies</h2>
                <p className="text-sm text-gray-500">
                  Companies in {selectedCountry?.name} (first company auto-selected)
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
                  {selectedRegion 
                    ? `Users for ${selectedRegion.name} region` 
                    : selectedCompany 
                      ? `All users for ${selectedCompany.name}` 
                      : 'Select a company to view users'
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