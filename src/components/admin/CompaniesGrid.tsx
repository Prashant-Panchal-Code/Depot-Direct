/**
 * CompaniesGrid - Fully implemented AG-Grid for Company Management
 * 
 * Purpose: Admin interface for CRUD operations on companies with row selection
 * Features:
 * - ag-grid table with company data columns
 * - Row selection that triggers onSelect callback
 * - Create/Edit/Delete act  // Default column definitions
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  }lder API calls
 * - Graceful fallback to mock data if API fails
 * - Client-side filtering and pagination
 * 
 * TODO: Wire real API endpoints and authentication
 * TODO: Add row-level permissions for edit/delete
 * TODO: Add bulk operations and export functionality
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent, RowClassParams, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { Button } from '@/components/ui/button'
import { Rows } from "@phosphor-icons/react"

import { showToast } from '@/components/ui/toast-placeholder'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

import CompanyForm from './CompanyForm'
import { adminApi } from '@/lib/api/service'

// Company data interface
interface Company {
  id: number
  company_code: string
  name: string
  country_id: number
  country_name: string
  region_count: number
  user_count: number
  description?: string
}

interface CompaniesGridProps {
  onSelect: (company: { id: number; name: string; country_id: number; country_name: string } | null) => void
  selectedCompanyId?: number
  compact?: boolean // For 3-pane layout vs full-width layout
  selectedCountry?: { id: number; name: string } // For pre-selecting country in new company form
}

// Map API response to Company interface
const mapApiResponseToCompany = (apiResponse: any): Company => {
  return {
    id: apiResponse.id,
    company_code: apiResponse.companyCode || '',
    name: apiResponse.name,
    country_id: apiResponse.countryId,
    country_name: apiResponse.countryName || 'Unknown',
    region_count: 0, // Not provided in API response
    user_count: 0,   // Not provided in API response
    description: apiResponse.description || ''
  }
}

// Mock data fallback
const mockCompanies: Company[] = [
  {
    id: 1,
    company_code: 'ACME-US',
    name: 'ACME Corporation',
    country_id: 1,
    country_name: 'United States',
    region_count: 3,
    user_count: 45,
    description: 'Leading logistics provider'
  },
  {
    id: 2,
    company_code: 'GLB-CA',
    name: 'Global Logistics Ltd',
    country_id: 2,
    country_name: 'Canada',
    region_count: 2,
    user_count: 23,
    description: 'Canadian freight specialist'
  },
  {
    id: 3,
    company_code: 'MX-TRN',
    name: 'Mexico Transport Co',
    country_id: 3,
    country_name: 'Mexico',
    region_count: 4,
    user_count: 67,
    description: 'Cross-border transportation'
  }
]

export default function CompaniesGrid({ onSelect, selectedCompanyId, compact = false, selectedCountry }: CompaniesGridProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const gridRef = useRef<AgGridReact>(null)
  const gridApiRef = useRef<GridApi | null>(null)

  // Actions cell renderer component
  const ActionsRenderer = useCallback((params: { data: Company }) => {
    const company = params.data as Company

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent row selection
      setEditingCompany(company)
      setShowForm(true)
    }

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent row selection
      
      if (!confirm(`Are you sure you want to delete "${company.name}"?`)) {
        return
      }

      try {
        // Delete company using real API
        await adminApi.delete(`/Companies/${company.id}`)
        
        // Remove from local state
        setCompanies(prev => prev.filter(c => c.id !== company.id))
        showToast('Company deleted successfully', 'success')
        
        // Clear selection if deleted company was selected
        if (selectedCompanyId === company.id) {
          onSelect(null)
        }
      } catch (error) {
        console.error('Delete company failed:', error)
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to delete company'
        showToast(errorMessage, 'error')
      }
    }

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleEdit}
          className="h-7 px-2 text-xs border-primary-custom text-primary-custom hover:bg-primary-custom hover:text-white"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    )
  }, [selectedCompanyId, onSelect])

  // Column definitions
  const columnDefs: ColDef[] = [
    {
      field: 'company_code',
      headerName: 'Code',
      width: 120,
      pinned: 'left'
    },
    {
      field: 'name',
      headerName: 'Company Name',
      width: 200,
      pinned: 'left'
    },
    {
      field: 'country_name',
      headerName: 'Country',
      width: 130
    },
    {
      field: 'region_count',
      headerName: 'Regions',
      width: 100,
      type: 'numericColumn'
    },
    {
      field: 'user_count',
      headerName: 'Users',
      width: 100,
      type: 'numericColumn'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ]

  // Fetch companies data
  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      let companies: Company[]
      
      if (selectedCountry) {
        // Fetch companies for specific country using real API
        const apiResponse = await adminApi.get(`/Companies/by-country/${selectedCountry.id}`)
        companies = Array.isArray(apiResponse) 
          ? apiResponse.map(mapApiResponseToCompany)
          : [mapApiResponseToCompany(apiResponse)]
      } else {
        // Fetch all companies - fallback to mock data for now
        // TODO: Implement get all companies API endpoint
        companies = mockCompanies
      }
      
      setCompanies(companies)
    } catch (error) {
      console.warn('Companies API failed, using mock data:', error)
      setCompanies(mockCompanies)
      showToast('Using demo data - API unavailable', 'warning')
    } finally {
      setLoading(false)
    }
  }, [selectedCountry])

  // Auto-select first company when companies load and no selection exists
  useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      const firstCompany = companies[0]
      onSelect({
        id: firstCompany.id,
        name: firstCompany.name,
        country_id: firstCompany.country_id,
        country_name: firstCompany.country_name
      })
    }
  }, [companies, selectedCompanyId, onSelect])

  // Initialize data - call fetchCompanies only when selectedCountry changes
  useEffect(() => {
    fetchCompanies()
  }, [selectedCountry?.id]) // Only depend on the country ID, not the entire fetchCompanies function

  // Handle grid ready
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api
  }

  // Effect to select row in AG-Grid when selectedCompanyId changes
  useEffect(() => {
    if (gridApiRef.current && selectedCompanyId) {
      gridApiRef.current.forEachNode((node) => {
        if (node.data?.id === selectedCompanyId) {
          node.setSelected(true)
          gridApiRef.current?.ensureNodeVisible(node)
        } else {
          node.setSelected(false)
        }
      })
    }
  }, [selectedCompanyId, companies])

  // Handle row click for selection
  const onRowClicked = (event: RowClickedEvent) => {
    const company = event.data as Company
    onSelect({
      id: company.id,
      name: company.name,
      country_id: company.country_id,
      country_name: company.country_name
    })
  }

  // Handle form save
  const handleFormSave = (savedCompany: Company) => {
    if (editingCompany) {
      // Update existing
      setCompanies(prev => 
        prev.map(c => c.id === savedCompany.id ? savedCompany : c)
      )
      showToast('Company updated successfully', 'success')
    } else {
      // Add new
      setCompanies(prev => [...prev, savedCompany])
      showToast('Company created successfully', 'success')
    }
    
    setShowForm(false)
    setEditingCompany(null)
  }

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false)
    setEditingCompany(null)
  }

  // Default grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  }

  // Grid options
  const _gridOptions = {
    rowSelection: 'single' as const,
    suppressRowClickSelection: false,
    rowHeight: 50,
    headerHeight: 40,
    pagination: true,
    paginationPageSize: 20,
    suppressPaginationPanel: false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-gray-500">Loading companies...</div>
      </div>
    )
  }

  if (compact) {
    // Compact layout for 3-pane org-setup
    return (
      <div className="space-y-3">
        {/* Compact Stats Row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="bg-gray-50 px-2 py-1 rounded text-xs flex items-center gap-1">
              <Rows size={14} color="#02589d" weight="duotone" />
              <span className="font-medium text-gray-700">{companies.length}</span>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingCompany(null)
              setShowForm(true)
            }}
            className="bg-primary-custom hover:bg-primary-custom/90 text-white text-xs h-7 px-2"
            size="sm"
          >
            Add
          </Button>
        </div>

        {/* Compact AG Grid */}
        <div style={{ height: '350px', width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            rowData={companies}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            pagination={true}
            paginationPageSize={15}
            rowHeight={40}
            headerHeight={35}
            suppressMenuHide={true}
            theme={themeQuartz}
            rowSelection="single"
            suppressRowClickSelection={false}
            onGridReady={onGridReady}
            onRowClicked={onRowClicked}
            rowClassRules={{
              'ag-row-selected bg-blue-100 border-l-4 border-l-blue-500': (params: RowClassParams<Company>) => params.data?.id === selectedCompanyId
            }}
          />
        </div>

        {/* Company Form Modal */}
        {showForm && (
          <CompanyForm
            company={editingCompany}
            onSaved={handleFormSave}
            onClose={handleFormClose}
            selectedCountry={selectedCountry}
          />
        )}
      </div>
    )
  }

  // Full layout for standalone pages
  return (
    <div className="space-y-4">
      {/* Header with Stats and Add Button */}
      <div className="flex justify-between items-center mb-4">
        {/* Stats Cards */}
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2 h-10">
            <span className="text-base"><Rows size={25} color="#02589d" weight="duotone" /></span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-gray-900">
                {companies.length}
              </span>
              <span className="text-xs text-gray-600">Total</span>
            </div>
          </div>
        </div>

        {/* Add New Company Button */}
        <Button
          onClick={() => {
            setEditingCompany(null)
            setShowForm(true)
          }}
          className="bg-primary-custom hover:bg-primary-custom/90 text-white shadow-sm h-10"
        >
          Create Company
        </Button>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        {/* Tip Section */}
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Tip:</span> Click on any company row to select it and use the action buttons. Double-click to view detailed information.
          </p>
        </div>
        
        <div style={{ height: "500px", width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={companies}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            pagination={true}
            paginationPageSize={20}
            rowHeight={55}
            headerHeight={45}
            suppressMenuHide={true}
            theme={themeQuartz}
            rowSelection="single"
            suppressRowClickSelection={false}
            onGridReady={onGridReady}
            onRowClicked={onRowClicked}
            rowClassRules={{
              'ag-row-selected bg-blue-100 border-l-4 border-l-blue-500': (params: RowClassParams<Company>) => params.data?.id === selectedCompanyId
            }}
          />
        </div>
      </div>

      {/* Company Form Modal */}
      {showForm && (
        <CompanyForm
          company={editingCompany}
          onSaved={handleFormSave}
          onClose={handleFormClose}
          selectedCountry={selectedCountry}
        />
      )}
    </div>
  )
}
