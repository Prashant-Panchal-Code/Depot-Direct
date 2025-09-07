/**
 * ManageRegionsModal - Company Region Assignment Modal
 * 
 * Purpose: Modal dialog for managing company ↔ region assignments using DualList
 * Features:
 * - Shows regions only for the company's country (enforced client-side)
 * - Uses DualList component for accessible assignment management
 * - Fetches current assignments and available regions
 * - Saves assignments via placeholder API calls
 * - Graceful fallback to mock data
 * 
 * TODO: Add server-side validation for country restrictions
 * TODO: Add bulk assignment operations
 * TODO: Add region creation from this modal
 */

'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import DualList from './DualList'
import { showToast } from '@/components/ui/toast-placeholder'

// Region interface
interface Region {
  id: number
  name: string
  region_code: string
  country_id: number
  country_name: string
  active: boolean
}

// Company interface
interface Company {
  id: number
  name: string
  country_id: number
  country_name: string
}

interface ManageRegionsModalProps {
  company: Company
  onClose: () => void
}

// Mock regions fallback
const mockRegions: Region[] = [
  { id: 1, name: 'California', region_code: 'CA', country_id: 1, country_name: 'United States', active: true },
  { id: 2, name: 'Texas', region_code: 'TX', country_id: 1, country_name: 'United States', active: true },
  { id: 3, name: 'New York', region_code: 'NY', country_id: 1, country_name: 'United States', active: true },
  { id: 4, name: 'Florida', region_code: 'FL', country_id: 1, country_name: 'United States', active: true },
  { id: 5, name: 'Ontario', region_code: 'ON', country_id: 2, country_name: 'Canada', active: true },
  { id: 6, name: 'Quebec', region_code: 'QC', country_id: 2, country_name: 'Canada', active: true },
  { id: 7, name: 'British Columbia', region_code: 'BC', country_id: 2, country_name: 'Canada', active: true },
  { id: 8, name: 'Jalisco', region_code: 'JAL', country_id: 3, country_name: 'Mexico', active: true },
  { id: 9, name: 'Nuevo León', region_code: 'NL', country_id: 3, country_name: 'Mexico', active: true }
]

export default function ManageRegionsModal({ company, onClose }: ManageRegionsModalProps) {
  const [allRegions, setAllRegions] = useState<Region[]>([])
  const [assignedRegionIds, setAssignedRegionIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Get regions for the company's country only
  const countryRegions = allRegions.filter(region => 
    region.country_id === company.country_id && region.active
  )

  // Prepare items for DualList
  const dualListItems = countryRegions.map(region => ({
    id: region.id,
    label: `${region.name} (${region.region_code})`
  }))

  // Fetch available regions and current assignments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // Fetch all regions for the country
        // TODO: Add auth token and optimize to fetch only for specific country
        const regionsResponse = await fetch(
          `/api/depotdirect/regions?country_id=${company.country_id}&active=true`,
          {
            headers: {
              'Content-Type': 'application/json',
              // TODO: Add authorization header
            }
          }
        )

        let regions: Region[] = []
        if (regionsResponse.ok) {
          const regionsData = await regionsResponse.json()
          regions = regionsData.regions || regionsData
        } else {
          throw new Error('Regions API failed')
        }

        // Fetch current company-region assignments
        const assignmentsResponse = await fetch(
          `/api/depotdirect/company_regions?company_id=${company.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              // TODO: Add authorization header
            }
          }
        )

        let currentAssignments: number[] = []
        if (assignmentsResponse.ok) {
          const assignmentsData = await assignmentsResponse.json()
          currentAssignments = assignmentsData.region_ids || assignmentsData.map((a: { region_id: number }) => a.region_id) || []
        } else {
          throw new Error('Assignments API failed')
        }

        setAllRegions(regions)
        setAssignedRegionIds(currentAssignments)

      } catch (error) {
        console.warn('Region/assignment API failed, using mock data:', error)
        
        // Use mock data
        const countryMockRegions = mockRegions.filter(r => r.country_id === company.country_id)
        setAllRegions(mockRegions)
        
        // Mock some assignments for demo
        const mockAssignments = countryMockRegions.slice(0, 2).map(r => r.id)
        setAssignedRegionIds(mockAssignments)
        
        showToast('Using demo data - API unavailable', 'warning')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [company.id, company.country_id])

  // Handle assignment changes from DualList
  const handleAssignmentChange = (newAssignedIds: number[]) => {
    setAssignedRegionIds(newAssignedIds)
  }

  // Save assignments
  const handleSave = async () => {
    setSaving(true)

    try {
      // TODO: Replace with real API call, add auth token, CSRF protection
      const response = await fetch('/api/depotdirect/company_regions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header and CSRF token
        },
        body: JSON.stringify({
          company_id: company.id,
          region_ids: assignedRegionIds
        })
      })

      if (response.ok) {
        showToast('Region assignments saved successfully', 'success')
        onClose()
      } else {
        throw new Error('Failed to save assignments')
      }

    } catch (error) {
      console.warn('Save assignments API failed, simulating success for UI demo:', error)
      showToast('Region assignments saved (simulated)', 'success')
      onClose()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-4xl">
          <div className="flex items-center justify-center h-40">
            <div className="text-gray-500">Loading regions...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-4xl" aria-describedby="manage-regions-description">
        <DialogHeader>
          <DialogTitle>
            Manage Regions for {company.name}
          </DialogTitle>
          <DialogDescription id="manage-regions-description">
            Assign regions to this company. Only regions from {company.country_name} are shown.
            {/* TODO: Add note about server-side validation */}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm">
              <div className="font-medium text-blue-800">Company: {company.name}</div>
              <div className="text-blue-600">Country: {company.country_name}</div>
              <div className="text-blue-600">
                Available Regions: {countryRegions.length} | 
                Currently Assigned: {assignedRegionIds.length}
              </div>
            </div>
          </div>

          {/* Region Assignment Interface */}
          {countryRegions.length > 0 ? (
            <DualList
              availableItems={dualListItems}
              initialAssignedIds={assignedRegionIds}
              onChange={handleAssignmentChange}
              titleLeft="Available Regions"
              titleRight="Assigned Regions"
              height="350px"
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">
                No regions found for {company.country_name}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Regions must be created for this country first
              </div>
              {/* TODO: Add "Create Region" button */}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || countryRegions.length === 0}
            >
              {saving ? 'Saving...' : 'Save Assignments'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
