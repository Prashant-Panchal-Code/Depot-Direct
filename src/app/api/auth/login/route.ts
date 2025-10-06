/**
 * Next.js App Router API: .NET API Login Integration
 * 
 * POST /api/auth/login
 * Integrates with .NET API for authentication and stores JWT token.
 * 
 * This endpoint calls the .NET API login endpoint and stores the returned
 * JWT token in an HTTP-only cookie for secure client-side access.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createTokenCookie } from '@/lib/auth'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  ok: boolean
  user?: {
    id: number
    email: string
    role: string
    name: string
    company_id: number
    companyName: string
    roleId: number
    phone: string
    active: boolean
  }
  token?: string
  error?: string
}

// .NET API Response interface
interface DotNetLoginResponse {
  success: boolean
  message: string
  token: string
  tokenType: string
  expiresAt: string
  user: {
    id: number
    companyId: number
    companyName: string
    roleId: number
    roleName: string
    email: string
    fullName: string
    phone: string
    active: boolean
    metadata: string
    createdBy: string | null
    lastUpdatedBy: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  console.log('🚀 LOGIN API CALLED!')
  
  try {
    const body: LoginRequest = await request.json()
    console.log('🚀 LOGIN API - Request body:', { email: body.email, password: '***' })
    const { email, password } = body

    // Basic input validation
    if (!email || !password) {
      console.log('🚀 LOGIN API - Missing email or password')
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('� LOGIN API - Calling .NET API...')
    
    // Call .NET API login endpoint
    const dotNetResponse = await fetch('http://localhost:5204/api/Auth/login', {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    console.log('🚀 LOGIN API - .NET API response status:', dotNetResponse.status)

    if (!dotNetResponse.ok) {
      const errorText = await dotNetResponse.text()
      console.log('🚀 LOGIN API - .NET API error:', errorText)
      return NextResponse.json(
        { ok: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const dotNetData: DotNetLoginResponse = await dotNetResponse.json()
    console.log('🚀 LOGIN API - .NET API response data:', {
      success: dotNetData.success,
      message: dotNetData.message,
      tokenType: dotNetData.tokenType,
      userEmail: dotNetData.user.email,
      userRole: dotNetData.user.roleName
    })

    if (!dotNetData.success) {
      return NextResponse.json(
        { ok: false, error: dotNetData.message || 'Login failed' },
        { status: 401 }
      )
    }

    // Transform .NET user data to our format
    const user = {
      id: dotNetData.user.id,
      email: dotNetData.user.email,
      role: dotNetData.user.roleName, // Keep original case from .NET API
      name: dotNetData.user.fullName,
      company_id: dotNetData.user.companyId,
      companyName: dotNetData.user.companyName,
      roleId: dotNetData.user.roleId,
      phone: dotNetData.user.phone,
      active: dotNetData.user.active
    }
    console.log('🚀 LOGIN API - Transformed user object:', user)
    console.log('🚀 LOGIN API - Role from .NET API:', dotNetData.user.roleName)

    // Create response with user data and token
    const response = NextResponse.json({ 
      ok: true, 
      user,
      token: dotNetData.token 
    })
    console.log('🚀 LOGIN API - Created response object')
    
    // Store the JWT token from .NET API in HTTP-only cookie
    console.log('🚀 LOGIN API - Setting JWT token cookie...')
    const cookieString = `token=${dotNetData.token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`
    response.headers.set('Set-Cookie', cookieString)
    console.log('🚀 LOGIN API - JWT token cookie set')

    return response

  } catch (error: unknown) {
    console.error('Login error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Development logout endpoint
 * Clears the authentication token cookie
 */
export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true })
  
  // Clear the token cookie
  response.headers.set('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0')
  
  return response
}

/*
🚨 DEVELOPMENT TESTING

Test admin login:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"any-password"}'

Test regular user login:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"any-password"}'

Test logout:
curl -X DELETE http://localhost:3000/api/auth/login

TODO: Production Security Implementation
- [ ] Replace with NextAuth.js or similar provider
- [ ] Implement proper database user lookup
- [ ] Add bcrypt/argon2 password hashing
- [ ] Add rate limiting (5 attempts per 15 minutes)
- [ ] Add CAPTCHA after failed attempts
- [ ] Implement account lockout mechanism
- [ ] Add proper input validation and sanitization
- [ ] Use secure cookie settings (Secure, SameSite=Strict)
- [ ] Implement refresh token rotation
- [ ] Add audit logging for all auth events
- [ ] Add CSRF protection
- [ ] Implement proper session management
- [ ] Add email verification for new accounts
- [ ] Add 2FA support
- [ ] Add proper error handling without information leakage

Example production integration with NextAuth.js:
```typescript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Implement proper user verification here
        const user = await verifyUserCredentials(credentials)
        return user ? { id: user.id, email: user.email, role: user.role } : null
      }
    })
  ]
})
```
*/
