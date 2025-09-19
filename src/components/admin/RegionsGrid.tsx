/**
 * RegionsGrid - AG-Grid for Region Management
 * 
 * Purpose: Admin interface for viewing and basic CRUD operations on regions
 * Features:
 * - ag-grid table with region data columns
 * - Filters by selected company
 * - Row selection with onSelect callback
 * - Create/Edit/Delete with RegionForm integration
 * - Real API integration for CRUD operations
 * 
 * Regions are connected to companies, not directly to countries
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent, RowClassParams, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { Button } from '@/components/ui/button'
import { CheckSquare, XCircle, Rows } from "@phosphor-icons/react"
import { showToast } from '@/components/ui/toast-placeholder'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

import RegionForm from './RegionForm'
import { adminApi } from '@/lib/api/service'

// Region data interface - updated to reflect company connection
interface Region {
  id: number
  region_code: string
  name: string
  company_id: number
  company_name: string
  country_id: number
  country_name: string
  description?: string
}

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

interface RegionsGridProps {
  selectedCompany?: SelectedCompany | null
  onSelect: (region: SelectedRegion | null) => void
  selectedRegionId?: number
}

// Mock regions data - updated to reflect company connections
const mockRegions: Region[] = [
  {
    id: 1,
    region_code: 'CA',
    name: 'California',
    company_id: 1,
    company_name: 'ACME Corporation',
    country_id: 1,
    country_name: 'United States',
    description: 'West Coast operations'
  },
  {
    id: 2,
    region_code: 'TX',
    name: 'Texas',
    company_id: 1,
    company_name: 'ACME Corporation',
    country_id: 1,
    country_name: 'United States',
    description: 'Central hub'
  },
  {
    id: 3,
    region_code: 'NY',
    name: 'New York',
    company_id: 1,
    company_name: 'ACME Corporation',
    country_id: 1,
    country_name: 'United States',
    description: 'East Coast operations'
  },
  {
    id: 5,
    region_code: 'ON',
    name: 'Ontario',
    company_id: 2,
    company_name: 'Global Logistics Ltd',
    country_id: 2,
    country_name: 'Canada',
    description: 'Primary Canadian region'
  },
  {
    id: 6,
    region_code: 'QC',
    name: 'Quebec',
    company_id: 2,
    company_name: 'Global Logistics Ltd',
    country_id: 2,
    country_name: 'Canada',
    description: 'French-speaking region'
  },
  {
    id: 8,
    region_code: 'JAL',
    name: 'Jalisco',
    company_id: 3,
    company_name: 'Mexico Transport Co',
    country_id: 3,
    country_name: 'Mexico',
    description: 'Western Mexico operations'
  }
]

// Map API response to Region interface
const mapApiResponseToRegion = (apiResponse: any): Region => {
  return {
    id: apiResponse.id,
    region_code: apiResponse.regionCode || '',
    name: apiResponse.name,
    company_id: apiResponse.companyId,
    company_name: apiResponse.companyName || 'Unknown',
    country_id: apiResponse.countryId,
    country_name: apiResponse.countryName || 'Unknown',
    description: apiResponse.description || ''
  }
}

export default function RegionsGrid({ selectedCompany, onSelect, selectedRegionId }: RegionsGridProps) {
  const [allRegions, setAllRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [showRegionForm, setShowRegionForm] = useState(false)
  const [editingRegion, setEditingRegion] = useState<Region | null>(null)
  const gridRef = useRef<AgGridReact>(null)
  const gridApiRef = useRef<GridApi | null>(null)

  // Filter regions by selected company
  const filteredRegions = selectedCompany 
    ? allRegions.filter(region => region.company_id === selectedCompany.id)
    : allRegions

  // Actions cell renderer
  const ActionsRenderer = useCallback((params: { data: Region }) => {
    const region = params.data

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation()
      setEditingRegion(region)
      setShowRegionForm(true)
    }

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation()
      
      if (!confirm(`Are you sure you want to delete region "${region.name}"?`)) {
        return
      }

      try {
        // Delete region using real API
        await adminApi.delete(`/Regions/${region.id}`)
        
        setAllRegions(prev => prev.filter(r => r.id !== region.id))
        showToast('Region deleted successfully', 'success')
        
        if (selectedRegionId === region.id) {
          onSelect(null)
        }
      } catch (error) {
        console.error('Delete region failed:', error)
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to delete region'
        showToast(errorMessage, 'error')
      }
    }

    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleEdit}
          className="h-7 px-2 text-xs"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
        >
          Delete
        </Button>
      </div>
    )
  }, [selectedRegionId, onSelect])

  // Handle create region
  const handleCreateRegion = () => {
    setEditingRegion(null)
    setShowRegionForm(true)
  }

  // Handle form save
  const handleFormSave = (savedRegion: Region) => {
    if (editingRegion) {
      // Update existing
      setAllRegions(prev => 
        prev.map(r => r.id === savedRegion.id ? savedRegion : r)
      )
      showToast('Region updated successfully', 'success')
    } else {
      // Add new
      setAllRegions(prev => [...prev, savedRegion])
      showToast('Region created successfully', 'success')
    }
    
    setShowRegionForm(false)
    setEditingRegion(null)
  }

  // Handle form close
  const handleFormClose = () => {
    setShowRegionForm(false)
    setEditingRegion(null)
  }

  // Column definitions
  const columnDefs: ColDef[] = [
    {
      field: 'region_code',
      headerName: 'Code',
      width: 100,
      pinned: 'left'
    },
    {
      field: 'name',
      headerName: 'Region Name',
      width: 180,
      pinned: 'left'
    },
    {
      field: 'company_name',
      headerName: 'Company',
      width: 160
    },
    {
      field: 'country_name',
      headerName: 'Country',
      width: 130
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      cellRenderer: (params: { value: string }) => (
        <span className="text-gray-600 text-sm" title={params.value || ''}>
          {params.value ? (params.value.length > 30 ? `${params.value.substring(0, 30)}...` : params.value) : '-'}
        </span>
      )
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

  // Fetch regions data
  const fetchRegions = useCallback(async () => {
    setLoading(true)
    try {
      if (selectedCompany) {
        // TODO: Fetch regions by company when API is available
        // const apiResponse = await adminApi.get(`/Regions/by-company/${selectedCompany.id}`)
        // const regions = Array.isArray(apiResponse) 
        //   ? apiResponse.map(mapApiResponseToRegion)
        //   : [mapApiResponseToRegion(apiResponse)]
        // setAllRegions(regions)
        
        // For now, use mock data
        setAllRegions(mockRegions)
      } else {
        // Fetch all regions - use mock data for now
        setAllRegions(mockRegions)
      }
    } catch (error) {
      console.warn('Regions API failed, using mock data:', error)
      setAllRegions(mockRegions)
      showToast('Using demo data - API unavailable', 'warning')
    } finally {
      setLoading(false)
    }
  }, [selectedCompany])

  // Auto-select first region when company changes or regions load
  useEffect(() => {
    if (selectedCompany && filteredRegions.length > 0 && !selectedRegionId) {
      const firstRegion = filteredRegions[0]
      onSelect({
        id: firstRegion.id,
        name: firstRegion.name,
        country_id: firstRegion.country_id
      })
    }
  }, [selectedCompany, filteredRegions, selectedRegionId, onSelect])

  // Initialize data
  useEffect(() => {
    fetchRegions()
  }, [fetchRegions])

  // Handle grid ready
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api
  }

  // Effect to select row in AG-Grid when selectedRegionId changes
  useEffect(() => {
    if (gridApiRef.current && selectedRegionId) {
      gridApiRef.current.forEachNode((node) => {
        if (node.data?.id === selectedRegionId) {
          node.setSelected(true)
          gridApiRef.current?.ensureNodeVisible(node)
        } else {
          node.setSelected(false)
        }
      })
    }
  }, [selectedRegionId, filteredRegions])

  // Handle row click for selection
  const onRowClicked = (event: RowClickedEvent) => {
    const region = event.data as Region
    onSelect({
      id: region.id,
      name: region.name,
      country_id: region.country_id
    })
  }

  // Default grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-gray-500">Loading regions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Compact Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="bg-gray-50 px-2 py-1 rounded text-xs flex items-center gap-1">
            <Rows size={14} color="#02589d" weight="duotone" />
            <span className="font-medium text-gray-700">{filteredRegions.length}</span>
          </div>
          {selectedCompany && (
            <div className="bg-blue-50 px-2 py-1 rounded text-xs">
              <span className="text-blue-600 font-medium">{selectedCompany.name}</span>
            </div>
          )}
        </div>
        <Button
          onClick={handleCreateRegion}
          className="bg-primary-custom hover:bg-primary-custom/90 text-white text-xs h-7 px-2"
          size="sm"
        >
          Add
        </Button>
      </div>

      {/* Filter Info */}
      {selectedCompany && (
        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs">
          <span className="text-blue-700">
            {selectedCompany.country_name} regions
          </span>
        </div>
      )}

      {/* Compact AG Grid */}
      <div style={{ height: '350px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredRegions}
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
            'ag-row-selected bg-blue-100 border-l-4 border-l-blue-500': (params: RowClassParams<Region>) => params.data?.id === selectedRegionId
          }}
        />
      </div>

      {/* RegionForm Modal */}
      {showRegionForm && (
        <RegionForm
          region={editingRegion}
          onSaved={handleFormSave}
          onClose={handleFormClose}
          selectedCompany={selectedCompany ? {
            id: selectedCompany.id,
            name: selectedCompany.name,
            country_id: selectedCompany.country_id,
            country_name: selectedCompany.country_name
          } : undefined}
        />
      )}
    </div>
  )
}
