/**
 * User Layout - Dedicated Layout for User Pages
 * 
 * Purpose: Provides Header/Sidebar specifically for user pages
 * Features:
 * - Always shows Header and Sidebar for user routes
 * - User-specific navigation (handled by UserSidebar component)
 * - Consistent styling with user interface
 */

import { headers } from 'next/headers'
import { getUserFromHeaders } from '@/lib/auth'
import UserHeader from '@/components/user/layout/UserHeader'
import UserSidebar from '@/components/user/layout/UserSidebar'

interface UserLayoutProps {
  children: React.ReactNode
}

export default async function UserLayout({ children }: UserLayoutProps) {
  // Get user info from headers set by middleware
  const headersList = await headers()
  const _user = getUserFromHeaders(headersList)

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <UserHeader />
      <UserSidebar />
      <main>
        {children}
      </main>
    </div>
  )
}
