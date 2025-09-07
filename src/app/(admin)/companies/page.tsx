/**
 * Companies Admin Page - Dedicated page for company management
 * 
 * Purpose: Standalone page for full company CRUD operations
 * Features:
 * - Full-screen CompaniesGrid component
 * - No filtering by selection (shows all companies)
 * - Direct access to company management functions
 * 
 * TODO: Add bulk operations and data export
 * TODO: Add company-specific analytics and reports
 */

'use client'

import CompaniesGrid from '@/components/admin/CompaniesGrid'

export default function CompaniesPage() {
  // Simple company selection handler (optional for this page)
  const handleCompanySelect = (company: { id: number; name: string; country_id: number; country_name: string } | null) => {
    // This page doesn't use selection, but grid requires the prop
    console.log('Company selected:', company)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage all companies in the system. Create, edit, and assign regions to companies.
        </p>
      </div>

      {/* Companies Grid */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <CompaniesGrid 
          onSelect={handleCompanySelect}
        />
      </div>
    </div>
  )
}
