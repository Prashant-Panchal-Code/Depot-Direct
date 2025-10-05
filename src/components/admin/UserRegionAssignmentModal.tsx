'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckSquare, Square, Users, MapPin } from '@phosphor-icons/react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { showToast } from '@/components/ui/toast-placeholder'
import AdminApiService, { User, Region } from '@/lib/api/admin'

interface UserRegionAssignmentModalProps {
  open: boolean
  onClose: () => void
  user: User | null
  onSuccess: () => void
}

export default function UserRegionAssignmentModal({ 
  open, 
  onClose, 
  user, 
  onSuccess 
}: UserRegionAssignmentModalProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [availableRegions, setAvailableRegions] = useState<Region[]>([])
  const [assignedRegions, setAssignedRegions] = useState<Region[]>([])
  const [selectedRegions, setSelectedRegions] = useState<Set<number>>(new Set())

  // Load regions data when modal opens
  useEffect(() => {
    if (open && user) {
      loadRegionsData()
    }
  }, [open, user])

  const loadRegionsData = async () => {
    if (!user?.companyId) {
      console.warn('No companyId found for user:', user)
      showToast('User must be assigned to a company to manage regions', 'error')
      return
    }
    
    setLoading(true)
    try {
      // Get all regions for the user's company
      const allRegions = await AdminApiService.getRegions(user.companyId)
      setAvailableRegions(allRegions)
      
      // Try to get user's assigned regions (fallback to empty array if API doesn't exist yet)
      try {
        const userWithRegions = await AdminApiService.getUserRegions(user.id)
        
        // Extract the regions from the response
        const assignedRegionData = userWithRegions.regions || []
        setAssignedRegions(assignedRegionData)
        setSelectedRegions(new Set(assignedRegionData.map(r => r.id)))
      } catch {
        // If user has no region assignments yet, start with empty
        setAssignedRegions([])
        setSelectedRegions(new Set())
      }
    } catch (error) {
      console.error('Error loading regions data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load regions data'
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRegionToggle = (regionId: number) => {
    const newSelected = new Set(selectedRegions)
    if (newSelected.has(regionId)) {
      newSelected.delete(regionId)
    } else {
      newSelected.add(regionId)
    }
    setSelectedRegions(newSelected)
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const currentlyAssigned = new Set(assignedRegions.map(r => r.id))
      const newlySelected = selectedRegions
      
      // Regions to assign (selected but not currently assigned)
      const toAssign = Array.from(newlySelected).filter(id => !currentlyAssigned.has(id))
      
      // Regions to remove (currently assigned but not selected)
      const toRemove = Array.from(currentlyAssigned).filter(id => !newlySelected.has(id))

      // Assign new regions one by one
      for (const regionId of toAssign) {
        await AdminApiService.assignUserToRegion(user.id, regionId)
      }

      // Remove deselected regions one by one
      for (const regionId of toRemove) {
        await AdminApiService.removeUserFromRegion(user.id, regionId)
      }

      showToast('Region assignments updated successfully', 'success')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating region assignments:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update region assignments'
      showToast(errorMessage, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSelectAll = () => {
    setSelectedRegions(new Set(availableRegions.map(r => r.id)))
  }

  const handleDeselectAll = () => {
    setSelectedRegions(new Set())
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Users size={20} />
            Assign Regions to {user.fullName}
          </DialogTitle>
          <div className="text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <strong>Company:</strong> {user.companyName}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <strong>Email:</strong> {user.email}
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading regions...</div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Stats and Actions */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Available: {availableRegions.length}</span>
                <span>Selected: {selectedRegions.size}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="text-xs"
                >
                  Deselect All
                </Button>
              </div>
            </div>

            {/* Regions List */}
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
              {availableRegions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No regions found for this company.</p>
                  <p className="text-sm">Please add regions to the company first.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {availableRegions.map((region) => {
                    const isSelected = selectedRegions.has(region.id)
                    const wasAssigned = assignedRegions.some(r => r.id === region.id)
                    
                    return (
                      <div
                        key={region.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => handleRegionToggle(region.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0">
                              {isSelected ? (
                                <CheckSquare size={20} weight="fill" className="text-blue-600" />
                              ) : (
                                <Square size={20} className="text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{region.name}</div>
                              {region.regionCode && (
                                <div className="text-sm text-gray-500">Code: {region.regionCode}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {wasAssigned && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Currently Assigned
                              </span>
                            )}
                            {isSelected && !wasAssigned && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                To Be Assigned
                              </span>
                            )}
                            {!isSelected && wasAssigned && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                To Be Removed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t flex-shrink-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading || saving}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={loading || saving || availableRegions.length === 0}
            className="bg-primary-custom hover:bg-primary-custom/90"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Saving...
              </div>
            ) : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}