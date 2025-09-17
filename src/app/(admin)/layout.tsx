/**
 * Admin Layout - Dedicated Layout for Admin Pages
 * 
 * Purpose: Provides Header/Sidebar specifically for admin pages
 * Features:
 * - Always shows Header and Sidebar for admin routes
 * - Admin role-based navigation (handled by Sidebar component)
 * - Consistent styling with main application
 */

import { headers } from 'next/headers'
import { getUserFromHeaders } from '@/lib/auth'
import AdminHeader from '@/components/admin/layout/AdminHeader'
import AdminSidebar from '@/components/admin/layout/AdminSidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Get user info from headers set by middleware
  const headersList = await headers()
  const _user = getUserFromHeaders(headersList)

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <AdminHeader />
      <AdminSidebar />
      <main>
        {children}
      </main>
    </div>
  )
}
