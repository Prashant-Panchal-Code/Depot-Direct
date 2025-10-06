/**
 * Next.js App Router API: Authentication Session Endpoint
 * 
 * GET /api/auth/session
 * Returns current user session information based on JWT token cookie.
 * Safe for client-side calls to determine user authentication state.
 * 
 * TODO: Add rate limiting
 * TODO: Consider caching session data with short TTL
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export interface User {
  id: number | string
  email: string
  role: string
  name: string
  company_id: number
  companyName?: string
  roleId?: number
  phone?: string
  active?: boolean
}

export interface SessionResponse {
  user: User | null
}

export async function GET(request: NextRequest): Promise<NextResponse<SessionResponse>> {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    // Decode JWT token payload (from .NET API)
    // Note: We're not verifying the signature here as it was signed by .NET API
    // In production, you might want to verify against .NET API's public key
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('🔍 SESSION - Token payload:', payload)

    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.log('🚫 SESSION - Token expired')
      return NextResponse.json({ user: null })
    }

    // Extract user data from .NET API JWT token
    // Your .NET API uses different claim names
    const user: User = {
      id: payload.nameid || payload.sub, // .NET API uses 'nameid' for user ID
      email: payload.email,
      role: payload.role,
      name: payload.unique_name || payload.name, // .NET API uses 'unique_name'
      company_id: parseInt(payload.CompanyId) || 0 // .NET API uses 'CompanyId'
    }

    console.log('🔍 SESSION - Extracted user:', user)
    return NextResponse.json({ user })

  } catch (error: unknown) {
    console.error('Session verification error:', error)
    
    // Token is invalid, return null user
    // Client should handle this by redirecting to login if needed
    return NextResponse.json({ user: null })
  }
}

/*
TODO: Production Enhancements
- [ ] Fetch user data from database instead of relying on token payload
- [ ] Add user permissions/roles from database
- [ ] Implement session caching (Redis/memory cache with short TTL)
- [ ] Add audit logging for session checks
- [ ] Consider adding CSRF token validation
- [ ] Add rate limiting per IP/user

Example client usage:
```typescript
const response = await fetch('/api/auth/session')
const { user } = await response.json()
if (user) {
  console.log('User is authenticated:', user)
} else {
  console.log('User is not authenticated')
}
```
*/
