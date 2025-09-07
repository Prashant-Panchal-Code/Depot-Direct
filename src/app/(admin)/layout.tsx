/**
 * Admin Layout - Uses Root Layout Components
 * 
 * Purpose: Simple wrapper for admin pages that inherits Header/Sidebar from root layout
 * Features:
 * - Uses root layout's Header and Sidebar components
 * - Admin role-based navigation (handled by Sidebar component)
 * - Consistent styling with main application
 */

import { headers } from 'next/headers'
import { getUserFromHeaders } from '@/lib/auth'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Get user info from headers set by middleware
  const headersList = await headers()
  const _user = getUserFromHeaders(headersList)

  return (
    <>
      {children}
    </>
  )
}
