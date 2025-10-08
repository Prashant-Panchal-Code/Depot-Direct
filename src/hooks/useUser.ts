/**
 * useUser Hook - Client-side Authentication State Management
 * 
 * Custom React hook for managing user authentication state on the client.
 * Uses SWR for efficient data fetching with automatic revalidation.
 * 
 * This hook calls /api/auth/session to get current user information
 * and provides loading states, error handling, and manual refresh capability.
 * 
 * Note: This is for UI conditional rendering only. 
 * Server-side protection is handled by middleware.
 * 
 * TODO: Add optimistic updates for login/logout
 * TODO: Consider adding offline support
 */

'use client'

import { useEffect, useState } from 'react'

export interface User {
  id: number | string
  email: string
  role: string
  name: string
  company_id: number
  companyName: string  // Make required since .NET API always provides it
  roleId: number
  phone?: string
  active?: boolean
}

export interface UseUserReturn {
  user: User | null
  loading: boolean
  error: Error | null
  mutate: () => Promise<void>
  isAdmin: boolean
  isAuthenticated: boolean
}

/**
 * Custom hook for managing user authentication state
 * 
 * @returns Object containing user data, loading state, and helper functions
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUser = async (): Promise<void> => {
    try {
      setError(null)
      const response = await fetch('/api/auth/session', {
        credentials: 'include', // Important: include cookies
        cache: 'no-store' // Ensure fresh data
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setUser(data.user)
    } catch (err) {
      console.error('Failed to fetch user:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch user'))
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchUser()
  }, [])

  // Manual refresh function
  const mutate = async (): Promise<void> => {
    setLoading(true)
    await fetchUser()
  }

  // Helper computed values - simple role check
  const isAdmin = user?.role === 'Admin'
  const isAuthenticated = !!user

  return {
    user,
    loading,
    error,
    mutate,
    isAdmin,
    isAuthenticated
  }
}

/**
 * Simple login helper function
 * Call this after successful login to refresh user state
 */
export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔍 loginUser called with:', { email, password: '***' })
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    console.log('🔍 Login API response status:', response.status)
    
    const data = await response.json()
    console.log('🔍 Login API response data:', data)
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' }
    }

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Network error' }
  }
}

/**
 * Simple logout helper function
 * Call this to logout and clear user state
 */
export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/login', {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (error) {
    console.error('Logout error:', error)
  }
  
  // Force page reload to clear all state and redirect via middleware
  window.location.href = '/login'
}

/*
TODO: Enhanced Features for Production

1. SWR Integration (install swr):
```typescript
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json())

export function useUser() {
  const { data, error, mutate } = useSWR('/api/auth/session', fetcher, {
    refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  return {
    user: data?.user || null,
    loading: !error && !data,
    error,
    mutate,
    isAdmin: data?.user?.role?.toLowerCase() === 'admin',
    isAuthenticated: !!data?.user
  }
}
```

2. React Query Integration:
```typescript
import { useQuery } from '@tanstack/react-query'

export function useUser() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/auth/session', { credentials: 'include' }).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  })

  return {
    user: data?.user || null,
    loading: isLoading,
    error,
    mutate: refetch,
    isAdmin: data?.user?.role?.toLowerCase() === 'admin',
    isAuthenticated: !!data?.user
  }
}
```

3. NextAuth.js Integration:
```typescript
import { useSession } from 'next-auth/react'

export function useUser() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user || null,
    loading: status === 'loading',
    error: null,
    mutate: () => {}, // NextAuth handles this internally
    isAdmin: session?.user?.role?.toLowerCase() === 'admin',
    isAuthenticated: !!session?.user
  }
}
```

Usage Examples:

```typescript
// Basic usage in a component
function Dashboard() {
  const { user, loading, isAdmin } = useUser()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      {isAdmin && <AdminPanel />}
    </div>
  )
}

// Login form
function LoginForm() {
  const { mutate } = useUser()
  
  const handleSubmit = async (email: string, password: string) => {
    const result = await loginUser(email, password)
    if (result.success) {
      await mutate() // Refresh user data
      router.push('/dashboard')
    }
  }
}
```
*/
