/**
 * Admin Logout Button Component
 * 
 * Client component for handling logout in admin layout.
 * Separated from server component to enable client-side interactivity.
 */

'use client'

import { logoutUser } from '@/hooks/useUser'

export default function AdminLogoutButton() {
  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: force redirect to login
      window.location.href = '/login'
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
    >
      🚪 Logout
    </button>
  )
}
