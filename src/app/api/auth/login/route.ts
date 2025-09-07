/**
 * Next.js App Router API: Development Login Endpoint
 * 
 * POST /api/auth/login
 * Simple development-only login endpoint for testing authentication flow.
 * 
 * ⚠️  WARNING: This is for development only! Not suitable for production.
 * 
 * TODO: Replace with proper authentication provider (NextAuth.js, Auth0, etc.)
 * TODO: Implement proper password hashing and verification
 * TODO: Add rate limiting and brute force protection
 * TODO: Add proper input validation and sanitization
 * TODO: Implement secure session management
 */

import { NextRequest, NextResponse } from 'next/server'
import { signToken, createTokenCookie } from '@/lib/auth'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  ok: boolean
  user?: {
    id: string
    email: string
    role: string
    name: string
    company_id: number
  }
  error?: string
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

    // 🚨 DEVELOPMENT ONLY: Simple role assignment based on email
    // TODO: Replace with actual database user lookup and password verification
    const isAdmin = email.toLowerCase().includes('admin')
    const userId = isAdmin ? '1' : '2'
    const role = isAdmin ? 'admin' : 'planner'
    const companyId = 1 // TODO: Get from database

    // TODO: In production, verify password against hashed password in database
    // Example: const isValidPassword = await bcrypt.compare(password, user.hashedPassword)
    
    // For demo purposes, accept any password
    console.log(`🚨 DEV LOGIN: ${email} with password: ${password}`)

    console.log('🚀 LOGIN API - About to generate JWT token...')
    
    // Generate JWT token
    const token = signToken({
      sub: userId,
      role: role,
      email: email,
      company_id: companyId
    })
    console.log('🚀 LOGIN API - Generated token:', token.substring(0, 20) + '...')

    // Create user object for response
    const user = {
      id: userId,
      email: email,
      role: role,
      name: email.split('@')[0], // Simple name extraction
      company_id: companyId
    }
    console.log('🚀 LOGIN API - Created user object:', user)

    // Create response with cookie
    const response = NextResponse.json({ ok: true, user })
    console.log('🚀 LOGIN API - Created response object')
    
    // Set HTTP-only cookie with token
    // TODO: In production, use secure cookie settings
    console.log('🚀 LOGIN API - About to create cookie...')
    const cookieString = createTokenCookie(token)
    console.log('🚀 LOGIN API - Setting cookie:', cookieString)
    response.headers.set('Set-Cookie', cookieString)
    console.log('🚀 LOGIN API - Cookie set in response headers')

    return response

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
