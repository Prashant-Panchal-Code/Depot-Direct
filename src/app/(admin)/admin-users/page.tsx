/**
 * Users Admin Page - Dedicated page for user management
 * 
 * Purpose: Standalone page for full user CRUD operations
 * Features:
 * - Full-screen UsersGrid component
 * - Shows all users across all companies
 * - Direct access to user management functions
 * 
 * TODO: Add user role management and permissions
 * TODO: Add user invitation and onboarding workflows
 * TODO: Add user activity monitoring and reporting
 */

'use client'

import UsersGrid from '@/components/admin/UsersGrid'
import AdminLayoutWrapper from '../../components/AdminLayoutWrapper'

export default function UsersPage() {
  return (
    <AdminLayoutWrapper>
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage all users in the system. Create, edit, and assign users to companies and regions.
        </p>
      </div>

      {/* Users Grid */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <UsersGrid />
      </div>
      </div>
    </AdminLayoutWrapper>
  )
}
