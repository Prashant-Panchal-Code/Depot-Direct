/**
 * Regions Admin Page - Dedicated page for region management
 * 
 * Purpose: Standalone page for full region CRUD operations
 * Features:
 * - Full-screen RegionsGrid component
 * - Shows all regions across all countries
 * - Direct access to region management functions
 * 
 * TODO: Add region-specific settings and configuration
 * TODO: Add bulk operations and data import/export
 */

'use client'

import RegionsGrid from '@/components/admin/RegionsGrid'

export default function RegionsPage() {
  // Simple region selection handler (optional for this page)
  const handleRegionSelect = (region: { id: number; name: string; country_id: number } | null) => {
    // This page doesn't use selection, but grid requires the prop
    console.log('Region selected:', region)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Regions</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage all regions across countries. Create, edit, and organize geographical regions.
        </p>
      </div>

      {/* Regions Grid */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <RegionsGrid 
          onSelect={handleRegionSelect}
        />
      </div>
    </div>
  )
}
