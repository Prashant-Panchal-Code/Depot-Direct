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

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridApi, GridReadyEvent, ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { Button } from '@/components/ui/button'
import { Rows } from "@phosphor-icons/react"
import { PageLoading, LoadingOverlay } from '@/components/ui/loading-spinner'
import { showToast } from '@/components/ui/toast-placeholder'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

import RegionForm from './RegionForm'
import AdminApiService, { Region as ApiRegion } from '@/lib/api/admin'

// Region data interface - updated to reflect company connection
interface Region {
  id: number
  region_code: string
  name: string
  company_id: number
  company_name: string
  country_id: number
  country_name: string
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
    country_name: 'United States'
  },
  {
    id: 2,
    region_code: 'TX',
    name: 'Texas',
    company_id: 1,
    company_name: 'ACME Corporation',
    country_id: 1,
    country_name: 'United States'
  },
  {
    id: 3,
    region_code: 'NY',
    name: 'New York',
    company_id: 1,
    company_name: 'ACME Corporation',
    country_id: 1,
    country_name: 'United States'
  },
  {
    id: 5,
    region_code: 'ON',
    name: 'Ontario',
    company_id: 2,
    company_name: 'Global Logistics Ltd',
    country_id: 2,
    country_name: 'Canada'
  },
  {
    id: 6,
    region_code: 'QC',
    name: 'Quebec',
    company_id: 2,
    company_name: 'Global Logistics Ltd',
    country_id: 2,
    country_name: 'Canada'
  },
  {
    id: 8,
    region_code: 'JAL',
    name: 'Jalisco',
    company_id: 3,
    company_name: 'Mexico Transport Co',
    country_id: 3,
    country_name: 'Mexico'
  }
]

// Map API response to Region interface (commented out as not currently used)
// const mapApiResponseToRegion = (apiResponse: {
//   id: number;
//   regionCode?: string;
//   name: string;
//   companyId: number;
//   companyName?: string;
// }): Region => {
//   return {
//     id: apiResponse.id,
//     region_code: apiResponse.regionCode || '',
//     name: apiResponse.name,
//     company_id: apiResponse.companyId,  
//     company_name: apiResponse.companyName || 'Unknown',
//     // Note: API response doesn't include country info, using defaults
//     country_id: 0,
//     country_name: 'N/A'
//   }
// }

function RegionsGrid({ selectedCompany, onSelect, selectedRegionId }: RegionsGridProps) {
  const [allRegions, setAllRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
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

    // TODO: Implement delete functionality  
    // const handleDelete = async (e: React.MouseEvent) => {
    //   e.stopPropagation()
    //   if (!confirm(`Are you sure you want to delete region "${region.name}"?`)) {
    //     return
    //   }
    //   try {
    //     await adminApi.delete(`/Regions/${region.id}`)
    //     setAllRegions(prev => prev.filter(r => r.id !== region.id))
    //     showToast('Region deleted successfully', 'success')
    //     if (selectedRegionId === region.id) {
    //       onSelect(null)
    //     }
    //   } catch (error) {
    //     console.error('Delete region failed:', error)
    //     const errorMessage = error instanceof Error ? error.message : 'Failed to delete region'
    //     showToast(errorMessage, 'error')
    //   }
    // }

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
      </div>
    )
  }, [])

  // Handle create region
  const handleCreateRegion = () => {
    setEditingRegion(null)
    setShowRegionForm(true)
  }

  // Handle form save
  const handleFormSave = async (savedRegion: Region) => {
    setOperationLoading(true)
    try {
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
    } catch {
      showToast('Operation failed', 'error')
    } finally {
      setOperationLoading(false)
    }
  }

  // Handle form close
  const handleFormClose = () => {
    setShowRegionForm(false)
    setEditingRegion(null)
  }

  // Column definitions - memoized to prevent recreation on each render
  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'region_code',
      headerName: 'Code',
      pinned: 'left' as const
    },
    {
      field: 'name',
      headerName: 'Region Name',
      pinned: 'left' as const
    },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: ActionsRenderer,
      sortable: false,
      filter: false,
      pinned: 'right' as const
    }
  ], [ActionsRenderer])

  // Fetch regions data
  const fetchRegions = useCallback(async () => {
    setLoading(true)
    try {
      if (selectedCompany) {
        // Fetch regions by company using AdminApiService
        console.log('Fetching regions for company:', selectedCompany.id)
        const regions = await AdminApiService.getRegions(selectedCompany.id)
        console.log('Fetched regions:', regions)
        
        // Map API response to local Region interface
        const mappedRegions = regions.map((region: ApiRegion) => ({
          id: region.id,
          region_code: region.regionCode || '',
          name: region.name,
          company_id: region.companyId,
          company_name: region.companyName || selectedCompany.name,
          country_id: selectedCompany.country_id,
          country_name: selectedCompany.country_name
        }))
        
        setAllRegions(mappedRegions)
      } else {
        // If no company is selected, show empty list
        setAllRegions([])
      }
    } catch (error) {
      console.error('Failed to fetch regions:', error)
      // Fall back to mock data on error
      const filteredMockData = selectedCompany 
        ? mockRegions.filter(region => region.company_id === selectedCompany.id)
        : []
      setAllRegions(filteredMockData)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch regions from API'
      showToast(`${errorMessage}, using demo data`, 'warning')
    } finally {
      setLoading(false)
    }
  }, [selectedCompany])



  // Initialize data
  useEffect(() => {
    fetchRegions()
  }, [fetchRegions])

  // Handle grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api
  }, [])





  // Default grid options - memoized to prevent recreation
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true
  }), [])

  if (loading) {
    return <PageLoading text="Loading regions..." />
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Compact Stats Row */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex gap-2">
          <div className="bg-gray-50 px-2 py-1 rounded text-xs flex items-center gap-1">
            <Rows size={14} color="#02589d" weight="duotone" />
            <span className="font-medium text-gray-700">{filteredRegions.length}</span>
          </div>
         
        </div>
        <Button
          onClick={handleCreateRegion}
          disabled={!selectedCompany}
          className="bg-primary-custom hover:bg-primary-custom/90 text-white text-xs h-7 px-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          size="sm"
          title={!selectedCompany ? "Select a company first to add regions" : "Add new region"}
        >
          Add
        </Button>
      </div>

      {/* Compact AG Grid */}
      <div className="flex-1 min-h-0" style={{ width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={filteredRegions}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={false}
          pagination={false}
          rowHeight={40}
          headerHeight={35}
          suppressMenuHide={true}
          theme={themeQuartz}
          rowSelection={undefined}
          suppressRowClickSelection={true}
          onGridReady={onGridReady}
          suppressPaginationPanel={true}
          domLayout="normal"
          suppressRowTransform={true}
          suppressColumnVirtualisation={true}
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
      
      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={operationLoading} 
        text={editingRegion ? "Updating region..." : "Creating region..."} 
      />
    </div>
  )
}

export default React.memo(RegionsGrid)
