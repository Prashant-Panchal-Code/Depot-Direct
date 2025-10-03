'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast-placeholder'
import { useAppContext } from '@/app/contexts/AppContext'
import CompaniesGrid from '@/components/admin/CompaniesGrid'
import RegionsGrid from '@/components/admin/RegionsGrid'
import UsersGrid from '@/components/admin/UsersGrid'
import AdminLayoutWrapper from '../../components/AdminLayoutWrapper'
import AdminApiService, { Country } from '@/lib/api/admin'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community'


// Updated Country interface to match API response
interface CountryDisplay extends Country {
  // No additional properties needed, using API response as-is
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
  // Tabs within the detailed view
  const [activeTab, setActiveTab] = useState<'org' | 'users'>('org')

  // AG-Grid column definitions
  const columnDefs: ColDef[] = [
    {
      headerName: 'Country',
      field: 'name',
      flex: 1,
      sortable: true,
      filter: true,
      cellClass: 'font-medium text-gray-900 px-3 py-1',
      minWidth: 150
    },
    {
      headerName: 'ISO Code',
      field: 'isoCode',
      width: 100,
      sortable: true,
      filter: true,
      cellClass: 'px-3 py-1'
    },
    {
      headerName: 'Companies',
      field: 'companiesCount',
      width: 100,
      sortable: true,
      valueFormatter: (params) => params.value || '0',
      cellClass: 'px-3 py-1 text-center'
    },
    {
      headerName: 'Regions',
      field: 'regionsCount',
      width: 100,
      sortable: true,
      valueFormatter: (params) => params.value || '0',
      cellClass: 'px-3 py-1 text-center'
    }
  ]

  // Load countries data from API
  const loadCountries = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading countries from API...')
      const countriesData = await AdminApiService.getCountriesWithStats()
      
      console.log('Successfully loaded countries:', countriesData.length)
      setCountries(countriesData)
    } catch (err) {
      console.error('Failed to load countries:', err)
      setError(`Failed to load countries: ${err instanceof Error ? err.message : 'Unknown error'}`)
      showToast('Failed to load countries. Please check if the API server is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCountries()
  }, [loadCountries])

  // Auto-select first company when entering detailed view

  // Clear region selection when company changes and refresh data
  useEffect(() => {
    if (selectedCompany) {
      setSelectedRegion(null)
    }
  }, [selectedCompany])

  // Handle country double-click to go to detailed view
  const handleCountryDoubleClick = (country: CountryDisplay) => {
    setSelectedCountry(country)
    setCurrentView('detailed')
    setSelectedCompany(null)
    setSelectedRegion(null)
    setSidebarCollapsed(true)
  }

  // Handle back to countries view
  const handleBackToCountries = () => {
    setCurrentView('countries')
    setSelectedCountry(null)
    setSelectedCompany(null)
    setSelectedRegion(null)
    setSidebarCollapsed(false)
    // Refresh countries data to get updated company/region counts
    loadCountries()
  }

  // Handle company selection - clear region when company changes
  const handleCompanySelect = useCallback((company: SelectedCompany | null) => {
    setSelectedCompany(company)
  }, [])

  // Handle region selection - filters users by region
  const handleRegionSelect = useCallback((region: SelectedRegion | null) => {
    setSelectedRegion(region)
  }, [])

  // Handle row double click for AG-Grid
  const onRowDoubleClicked = useCallback((event: RowDoubleClickedEvent) => {
    if (event.data) {
      handleCountryDoubleClick(event.data)
    }
  }, [])

  // Grid ready event handler
  const onGridReady = useCallback((params: GridReadyEvent) => {
    // Auto-size columns to fit content
    params.api.sizeColumnsToFit()
  }, [])

  return (
    <AdminLayoutWrapper>
      {currentView === 'countries' ? (
        <div className="space-y-6">
          {/* Page Header */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Organizational Setup
            </h1>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Manage countries and organizations. Double-click on a country to view detailed setup.
              </p>
              {!loading && !error && (
                <span className="text-sm text-gray-600">
                  Total Countries: {countries.length}
                </span>
              )}
            </div>
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
              {/* Countries AG-Grid */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="ag-theme-alpine" 
                  style={{ height: 'calc(100vh - 280px)', width: '100%' }}
                >
                  <AgGridReact
                    rowData={countries}
                    columnDefs={columnDefs}
                    onRowDoubleClicked={onRowDoubleClicked}
                    onGridReady={onGridReady}
                    domLayout="normal"
                    suppressRowClickSelection={true}
                    rowHeight={36}
                    headerHeight={40}
                    enableCellTextSelection={true}
                    ensureDomOrder={true}
                    suppressColumnVirtualisation={true}
                    animateRows={true}
                    pagination={false}
                    suppressPaginationPanel={true}
                    defaultColDef={{
                      resizable: true,
                      sortable: true,
                      filter: false,
                      cellClass: 'text-sm text-gray-600 flex items-center'
                    }}
                    rowClass="hover:bg-gray-50 cursor-pointer"
                    getRowStyle={(params) => {
                      return { 
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer'
                      }
                    }}
                  />
                </div>                
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
                className="transition-colors cursor-pointer text-primary-custom hover:text-primary-custom/80 "
              >
                Countries
              </button>
              <span>›</span>
              <span className="text-gray-900 font-medium">{selectedCountry?.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Organization Setup - {selectedCountry?.name}
            </h1>
            
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('org')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'org'
                    ? 'border-primary-custom text-primary-custom'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Companies & Regions
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-primary-custom text-primary-custom'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users
              </button>
            </div>
          </div>

          {/* Tab Panels */}
          {activeTab === 'org' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-340px)]">
              {/* Left Pane - Companies Grid (2/3 width) */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
                <div className="border-b border-gray-200 p-4 flex-shrink-0">
                  <h2 className="text-lg font-semibold text-gray-900">Companies</h2>
                  <p className="text-sm text-gray-500">
                    Companies in {selectedCountry?.name}
                  </p>
                </div>
                <div className="p-4 flex-1 min-h-0">
                  <CompaniesGrid 
                    onSelect={handleCompanySelect}
                    selectedCompanyId={selectedCompany?.id}
                    compact={true}
                    selectedCountry={selectedCountry ? { id: selectedCountry.id, name: selectedCountry.name } : undefined}
                  />
                </div>
              </div>

              {/* Right Pane - Regions Grid (1/3 width) */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
                <div className="border-b border-gray-200 p-4 flex-shrink-0">
                  <h2 className="text-lg font-semibold text-gray-900">Regions</h2>
                  <p className="text-sm text-gray-500">
                    {selectedCompany 
                      ? `Regions for ${selectedCompany.name}` 
                      : 'Select a company to filter regions'}
                  </p>
                </div>
                <div className="p-4 flex-1 min-h-0">
                  <RegionsGrid 
                    onSelect={handleRegionSelect}
                    selectedRegionId={selectedRegion?.id}
                    selectedCompany={selectedCompany}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="h-[calc(100vh-340px)]">
              <div className="bg-white rounded-lg shadow border border-gray-200 h-full flex flex-col">
                <div className="border-b border-gray-200 p-4 flex-shrink-0">
                  <h3 className="text-lg font-medium text-gray-900">Users Management</h3>
                 
                </div>
                <div className="p-4 flex-1 min-h-0">
                  <UsersGrid 
                    filterCompanyId={selectedCompany?.id}
                    filterRegionId={selectedRegion?.id}
                    filterCountryId={selectedCountry?.id}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayoutWrapper>
  )
}