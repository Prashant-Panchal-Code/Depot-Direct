/**
 * RegionsGrid - Skeleton but Usable AG-Grid for Region Management
 * 
 * Purpose: Admin interface for viewing and basic CRUD operations on regions
 * Features:
 * - ag-grid table with region data columns
 * - Filters by selected company's country_id client-side
 * - Row selection with onSelect callback
 * - Create button opens skeleton RegionForm
 * - Basic actions (Edit/Delete) with placeholder functionality
 * 
 * TODO: Implement full RegionForm with country/company assignments
 * TODO: Add region-specific permissions and validations
 * TODO: Add bulk operations and export functionality
 * TODO: Add real-time updates when data changes
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

// Region data interface
interface Region {
  id: number
  region_code: string
  name: string
  country_id: number
  country_name: string
  active: boolean
  description?: string
  company_count?: number
  user_count?: number
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

// Mock regions data
const mockRegions: Region[] = [
  {
    id: 1,
    region_code: 'CA',
    name: 'California',
    country_id: 1,
    country_name: 'United States',
    active: true,
    description: 'West Coast operations',
    company_count: 5,
    user_count: 23
  },
  {
    id: 2,
    region_code: 'TX',
    name: 'Texas',
    country_id: 1,
    country_name: 'United States',
    active: true,
    description: 'Central hub',
    company_count: 3,
    user_count: 15
  },
  {
    id: 3,
    region_code: 'NY',
    name: 'New York',
    country_id: 1,
    country_name: 'United States',
    active: false,
    description: 'East Coast operations',
    company_count: 2,
    user_count: 8
  },
  {
    id: 5,
    region_code: 'ON',
    name: 'Ontario',
    country_id: 2,
    country_name: 'Canada',
    active: true,
    description: 'Primary Canadian region',
    company_count: 2,
    user_count: 12
  },
  {
    id: 6,
    region_code: 'QC',
    name: 'Quebec',
    country_id: 2,
    country_name: 'Canada',
    active: true,
    description: 'French-speaking region',
    company_count: 1,
    user_count: 6
  },
  {
    id: 8,
    region_code: 'JAL',
    name: 'Jalisco',
    country_id: 3,
    country_name: 'Mexico',
    active: true,
    description: 'Western Mexico operations',
    company_count: 1,
    user_count: 9
  }
]

export default function RegionsGrid({ selectedCompany, onSelect, selectedRegionId }: RegionsGridProps) {
  const [allRegions, setAllRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [showRegionForm, setShowRegionForm] = useState(false) // TODO: Implement RegionForm
  const gridRef = useRef<AgGridReact>(null)
  const gridApiRef = useRef<GridApi | null>(null)

  // Filter regions by selected company's country
  const filteredRegions = selectedCompany 
    ? allRegions.filter(region => region.country_id === selectedCompany.country_id)
    : allRegions

  // Actions cell renderer
  const ActionsRenderer = useCallback((params: { data: Region }) => {
    const region = params.data

    const handleEdit = (e: React.MouseEvent) => {
      e.stopPropagation()
      // TODO: Implement RegionForm for editing
      showToast('Region editing not yet implemented', 'info')
    }

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation()
      
      if (!confirm(`Are you sure you want to delete region "${region.name}"?`)) {
        return
      }

      try {
        // TODO: Replace with real API call
        const response = await fetch(`/api/depotdirect/regions/${region.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // TODO: Add authorization header
          }
        })

        if (response.ok) {
          setAllRegions(prev => prev.filter(r => r.id !== region.id))
          showToast('Region deleted successfully', 'success')
          
          if (selectedRegionId === region.id) {
            onSelect(null)
          }
        } else {
          throw new Error('Failed to delete region')
        }
      } catch (error) {
        console.warn('Delete region API failed, simulating for demo:', error)
        setAllRegions(prev => prev.filter(r => r.id !== region.id))
        showToast('Region deleted (simulated)', 'success')
        
        if (selectedRegionId === region.id) {
          onSelect(null)
        }
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
      field: 'country_name',
      headerName: 'Country',
      width: 130
    },
    {
      field: 'company_count',
      headerName: 'Companies',
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
      field: 'active',
      headerName: 'Status',
      width: 100,
      cellRenderer: (params: { value: boolean }) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          params.value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {params.value ? 'Active' : 'Inactive'}
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
      // TODO: Add auth token and optimize query
      const response = await fetch('/api/depotdirect/regions?limit=100', {
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAllRegions(data.regions || data)
      } else {
        throw new Error('Regions API failed')
      }
    } catch (error) {
      console.warn('Regions API failed, using mock data:', error)
      setAllRegions(mockRegions)
      showToast('Using demo regions data - API unavailable', 'warning')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize data
  useEffect(() => {
    fetchRegions()
  }, [fetchRegions])

  // Handle grid ready
  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api
  }

  // Handle row click for selection
  const onRowClicked = (event: RowClickedEvent) => {
    const region = event.data as Region
    onSelect({
      id: region.id,
      name: region.name,
      country_id: region.country_id
    })
  }

  // Handle create new region
  const handleCreateRegion = () => {
    // TODO: Implement RegionForm component
    showToast('Region creation form not yet implemented', 'info')
    setShowRegionForm(true)
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
          <div className="bg-gray-50 px-2 py-1 rounded text-xs flex items-center gap-1">
            <CheckSquare size={14} weight="duotone" color="green" />
            <span className="font-medium text-green-600">{filteredRegions.filter(r => r.active).length}</span>
          </div>
          <div className="bg-gray-50 px-2 py-1 rounded text-xs flex items-center gap-1">
            <XCircle size={14} color="red" weight="duotone" />
            <span className="font-medium text-red-600">{filteredRegions.filter(r => !r.active).length}</span>
          </div>
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
          onGridReady={onGridReady}
          onRowClicked={onRowClicked}
          rowClassRules={{
            'bg-blue-50': (params: RowClassParams<Region>) => params.data?.id === selectedRegionId
          }}
        />
      </div>

      {/* TODO: Add RegionForm modal when implemented */}
      {showRegionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Region Form</h3>
            <p className="text-gray-600 mb-4">
              Region creation form will be implemented here.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Region name (required)</p>
              <p>• Region code (optional)</p>
              <p>• Country selection (required)</p>
              <p>• Description</p>
              <p>• Active status</p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowRegionForm(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-primary-custom hover:bg-primary-custom/90"
                onClick={() => setShowRegionForm(false)}
              >
                Create (TODO)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
