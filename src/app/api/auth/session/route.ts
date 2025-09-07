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
  id: string
  email?: string
  role?: string
  name?: string
  company_id?: number
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

    // Verify the token
    const payload = verifyToken(token)

    // TODO: In production, fetch additional user data from database
    // For now, return data from token payload
    const user: User = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.email?.split('@')[0], // Simple name extraction for demo
      company_id: payload.company_id
    }

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
