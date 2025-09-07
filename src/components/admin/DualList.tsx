/**
 * DualList - Reusable Accessible Dual List Component
 * 
 * Purpose: Generic component for managing assignments between available and assigned items
 * Features:
 * - Keyboard accessible (Arrow keys, Space, Enter, Tab)
 * - Multi-select with Ctrl+click and Shift+click
 * - Add/Remove single items and Add All/Remove All
 * - Proper ARIA labels and roles for screen readers
 * - Customizable titles and styling
 * 
 * TODO: Add drag and drop support
 * TODO: Add search/filter functionality
 * TODO: Add item ordering within lists
 */

'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DualListItem {
  id: number
  label: string
}

interface DualListProps {
  availableItems: DualListItem[]
  initialAssignedIds: number[]
  onChange: (assignedIds: number[]) => void
  titleLeft?: string
  titleRight?: string
  height?: string
}

export default function DualList({
  availableItems,
  initialAssignedIds,
  onChange,
  titleLeft = 'Available',
  titleRight = 'Assigned',
  height = '300px'
}: DualListProps) {
  const [assignedIds, setAssignedIds] = useState<number[]>(initialAssignedIds)
  const [selectedAvailable, setSelectedAvailable] = useState<number[]>([])
  const [selectedAssigned, setSelectedAssigned] = useState<number[]>([])
  
  const availableListRef = useRef<HTMLDivElement>(null)
  const assignedListRef = useRef<HTMLDivElement>(null)

  // Get available and assigned items
  const assignedItems = availableItems.filter(item => assignedIds.includes(item.id))
  const unassignedItems = availableItems.filter(item => !assignedIds.includes(item.id))

  // Update parent when assignments change
  useEffect(() => {
    onChange(assignedIds)
  }, [assignedIds, onChange])

  // Handle single item selection
  const handleItemClick = (
    itemId: number, 
    isAssigned: boolean, 
    event: React.MouseEvent,
    setSelected: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl+Click: Toggle selection
      setSelected(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else if (event.shiftKey) {
      // Shift+Click: Select range
      const currentList = isAssigned ? assignedItems : unassignedItems
      const currentSelected = isAssigned ? selectedAssigned : selectedAvailable
      
      if (currentSelected.length > 0) {
        const lastSelected = currentSelected[currentSelected.length - 1]
        const lastIndex = currentList.findIndex(item => item.id === lastSelected)
        const currentIndex = currentList.findIndex(item => item.id === itemId)
        
        if (lastIndex !== -1 && currentIndex !== -1) {
          const start = Math.min(lastIndex, currentIndex)
          const end = Math.max(lastIndex, currentIndex)
          const rangeIds = currentList.slice(start, end + 1).map(item => item.id)
          setSelected(rangeIds)
          return
        }
      }
      setSelected([itemId])
    } else {
      // Regular click: Single selection
      setSelected([itemId])
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (
    event: KeyboardEvent,
    items: DualListItem[],
    selected: number[],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    isAssigned: boolean
  ) => {
    if (items.length === 0) return

    const currentIndex = selected.length > 0 
      ? items.findIndex(item => item.id === selected[selected.length - 1])
      : -1

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (currentIndex < items.length - 1) {
          const nextItem = items[currentIndex + 1]
          setSelected(event.shiftKey ? [...selected, nextItem.id] : [nextItem.id])
        }
        break

      case 'ArrowUp':
        event.preventDefault()
        if (currentIndex > 0) {
          const prevItem = items[currentIndex - 1]
          setSelected(event.shiftKey ? [...selected, prevItem.id] : [prevItem.id])
        }
        break

      case ' ':
      case 'Enter':
        event.preventDefault()
        if (selected.length > 0) {
          if (isAssigned) {
            removeItems()
          } else {
            addItems()
          }
        }
        break

      case 'Escape':
        setSelected([])
        break
    }
  }

  // Add selected available items to assigned
  const addItems = () => {
    if (selectedAvailable.length > 0) {
      setAssignedIds(prev => [...prev, ...selectedAvailable])
      setSelectedAvailable([])
    }
  }

  // Remove selected assigned items
  const removeItems = () => {
    if (selectedAssigned.length > 0) {
      setAssignedIds(prev => prev.filter(id => !selectedAssigned.includes(id)))
      setSelectedAssigned([])
    }
  }

  // Add all available items
  const addAllItems = () => {
    const allIds = availableItems.map(item => item.id)
    setAssignedIds(allIds)
    setSelectedAvailable([])
  }

  // Remove all assigned items
  const removeAllItems = () => {
    setAssignedIds([])
    setSelectedAssigned([])
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Available Items List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {titleLeft} ({unassignedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={availableListRef}
              className="border rounded-md overflow-auto focus-within:ring-2 focus-within:ring-blue-500"
              style={{ height }}
              role="listbox"
              aria-label={titleLeft}
              aria-multiselectable="true"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, unassignedItems, selectedAvailable, setSelectedAvailable, false)}
            >
              {unassignedItems.length > 0 ? (
                <div className="p-2 space-y-1">
                  {unassignedItems.map((item) => (
                    <div
                      key={item.id}
                      className={`px-3 py-2 text-sm rounded cursor-pointer transition-colors ${
                        selectedAvailable.includes(item.id)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={(e) => handleItemClick(item.id, false, e, setSelectedAvailable)}
                      role="option"
                      aria-selected={selectedAvailable.includes(item.id)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No items available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assigned Items List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {titleRight} ({assignedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={assignedListRef}
              className="border rounded-md overflow-auto focus-within:ring-2 focus-within:ring-blue-500"
              style={{ height }}
              role="listbox"
              aria-label={titleRight}
              aria-multiselectable="true"
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, assignedItems, selectedAssigned, setSelectedAssigned, true)}
            >
              {assignedItems.length > 0 ? (
                <div className="p-2 space-y-1">
                  {assignedItems.map((item) => (
                    <div
                      key={item.id}
                      className={`px-3 py-2 text-sm rounded cursor-pointer transition-colors ${
                        selectedAssigned.includes(item.id)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={(e) => handleItemClick(item.id, true, e, setSelectedAssigned)}
                      role="option"
                      aria-selected={selectedAssigned.includes(item.id)}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No items assigned
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addItems}
            disabled={selectedAvailable.length === 0}
            title={`Add ${selectedAvailable.length} selected item(s)`}
          >
            Add →
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={removeItems}
            disabled={selectedAssigned.length === 0}
            title={`Remove ${selectedAssigned.length} selected item(s)`}
          >
            ← Remove
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={addAllItems}
            disabled={unassignedItems.length === 0}
            title="Add all items"
          >
            Add All ⇒
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={removeAllItems}
            disabled={assignedItems.length === 0}
            title="Remove all items"
          >
            ⇐ Remove All
          </Button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Instructions:</strong></p>
        <p>• Click to select, Ctrl+click for multi-select, Shift+click for range</p>
        <p>• Use arrow keys to navigate, Space/Enter to move items</p>
        <p>• Use action buttons to add/remove selected or all items</p>
      </div>
    </div>
  )
}
