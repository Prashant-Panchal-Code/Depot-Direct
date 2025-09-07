/**
 * Unauthorized Access Page
 * 
 * Displays when a user tries to access admin routes without proper permissions.
 * Middleware redirects non-admin users here for admin-only routes.
 * 
 * TODO: Add better error messaging based on specific permission failure
 * TODO: Add contact information for access requests
 */

import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Error Content */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            
            <p className="text-sm text-gray-600 mb-6">
              You don&apos;t have permission to access this page. This area is restricted to administrators only.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Return to Dashboard
              </Link>
              
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Go to Home
              </Link>
            </div>

            {/* Additional Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If you believe you should have access to this page, please contact your system administrator.
              </p>
              
              {/* TODO: Add contact information */}
              <p className="text-xs text-gray-400 mt-2">
                Error Code: 403 - Insufficient Privileges
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/*
TODO: Enhanced Unauthorized Page Features

1. Dynamic Error Messages:
```typescript
interface UnauthorizedPageProps {
  searchParams: {
    reason?: 'insufficient_role' | 'expired_token' | 'invalid_token'
    required_role?: string
    current_role?: string
  }
}

export default function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const getErrorMessage = () => {
    switch (searchParams.reason) {
      case 'insufficient_role':
        return `This page requires ${searchParams.required_role} privileges. You currently have ${searchParams.current_role} access.`
      case 'expired_token':
        return 'Your session has expired. Please log in again.'
      case 'invalid_token':
        return 'Your session is invalid. Please log in again.'
      default:
        return 'You don\'t have permission to access this page.'
    }
  }
  
  // Rest of component...
}
```

2. Role-based Suggestions:
```typescript
function getSuggestions(userRole: string, requiredRole: string) {
  if (userRole === 'planner' && requiredRole === 'admin') {
    return {
      title: 'Need Admin Access?',
      message: 'Contact your administrator to request elevated privileges.',
      action: 'Request Access'
    }
  }
  
  return {
    title: 'Access Restricted',
    message: 'This area is for authorized personnel only.',
    action: 'Return to Dashboard'
  }
}
```

3. Contact Form Integration:
```typescript
'use client'
import { useState } from 'react'

function AccessRequestForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Send access request
    await fetch('/api/access-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, requestedPage: window.location.pathname })
    })
    setIsOpen(false)
  }
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Request Access
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
            <h3>Request Access</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please explain why you need access..."
              required
            />
            <button type="submit">Send Request</button>
            <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </>
  )
}
```

Usage with Enhanced Middleware:
```typescript
// In middleware.ts
if (isAdminRoute && payload.role !== 'admin') {
  const url = new URL('/unauthorized', request.url)
  url.searchParams.set('reason', 'insufficient_role')
  url.searchParams.set('required_role', 'admin')
  url.searchParams.set('current_role', payload.role)
  return NextResponse.redirect(url)
}
```
*/
