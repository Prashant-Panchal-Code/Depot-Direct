/**
 * User Provider Component
 * 
 * Client-side provider that makes user authentication state available
 * throughout the application. Uses the useUser hook internally.
 * 
 * This is for UI conditional rendering only.
 * Server-side protection is handled by middleware.
 * 
 * TODO: Add global loading state management
 * TODO: Add error boundary for auth failures
 */

'use client'

import { createContext, useContext } from 'react'
import { useUser, type UseUserReturn } from '@/hooks/useUser'

const UserContext = createContext<UseUserReturn | null>(null)

interface UserProviderProps {
  children: React.ReactNode
}

/**
 * Provider component that wraps the app and provides user context
 */
export function UserProvider({ children }: UserProviderProps) {
  const userState = useUser()

  return (
    <UserContext.Provider value={userState}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * Hook to consume user context
 * Throws error if used outside of UserProvider
 */
export function useUserContext(): UseUserReturn {
  const context = useContext(UserContext)
  
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  
  return context
}

/*
TODO: Enhanced User Provider Features

1. Global Loading State:
```typescript
'use client'
import { createContext, useContext, useState } from 'react'

interface GlobalState {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<GlobalState | null>(null)

export function UserProvider({ children }: UserProviderProps) {
  const [isLoading, setLoading] = useState(false)
  const userState = useUser()

  return (
    <UserContext.Provider value={userState}>
      <LoadingContext.Provider value={{ isLoading, setLoading }}>
        {isLoading && <LoadingOverlay />}
        {children}
      </LoadingContext.Provider>
    </UserContext.Provider>
  )
}
```

2. Error Boundary Integration:
```typescript
'use client'
import { ErrorBoundary } from 'react-error-boundary'

function AuthErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        <button onClick={resetErrorBoundary}>Try Again</button>
      </div>
    </div>
  )
}

export function UserProvider({ children }: UserProviderProps) {
  const userState = useUser()

  return (
    <ErrorBoundary
      FallbackComponent={AuthErrorFallback}
      onReset={() => window.location.reload()}
    >
      <UserContext.Provider value={userState}>
        {children}
      </UserContext.Provider>
    </ErrorBoundary>
  )
}
```

3. Offline Support:
```typescript
'use client'
import { useState, useEffect } from 'react'

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

export function UserProvider({ children }: UserProviderProps) {
  const userState = useUser()
  const isOnline = useOnlineStatus()

  return (
    <UserContext.Provider value={{ ...userState, isOnline }}>
      {!isOnline && <OfflineBanner />}
      {children}
    </UserContext.Provider>
  )
}
```

Usage Examples:

```typescript
// In any component
function Header() {
  const { user, isAuthenticated, isAdmin, loading } = useUserContext()

  if (loading) return <HeaderSkeleton />

  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.name}</span>
          {isAdmin && <AdminBadge />}
          <LogoutButton />
        </div>
      ) : (
        <LoginButton />
      )}
    </header>
  )
}

// Conditional rendering
function AdminPanel() {
  const { isAdmin } = useUserContext()
  
  if (!isAdmin) return null
  
  return <div>Admin-only content</div>
}
```
*/
