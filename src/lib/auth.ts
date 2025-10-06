/**
 * JWT Authentication Utilities for Next.js App Router
 * 
 * Provides token signing/verification using jsonwebtoken.
 * Uses HTTP-only cookies for secure token storage.
 * 
 * TODO: Replace with NextAuth.js or other production auth provider
 * TODO: Implement refresh token rotation
 * TODO: Add token blacklisting for logout
 * TODO: Use secure cookie settings in production
 */

import jwt from 'jsonwebtoken'

// JWT secret - use environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

// Token expiration time
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

import { ALL_ROLES, type AllRole } from '@/lib/constants/roles'

/**
 * JWT Token Payload Interface
 */
export interface TokenPayload {
  sub: string         // Subject (user ID)
  role: AllRole       // User role (Admin, Viewer, Planner, Data Manager)
  email: string       // User email
  company_id?: number // Optional company ID
  iat: number         // Issued at
  exp: number         // Expiration time
}

/**
 * Sign a JWT token with the provided payload
 * 
 * @param payload - Token payload containing user information
 * @param options - Optional JWT sign options
 * @returns Signed JWT token string
 */
export function signToken(
  payload: Omit<TokenPayload, 'iat' | 'exp'>, 
  options?: jwt.SignOptions
): string {
  try {
    const signOptions: jwt.SignOptions = {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256',
      ...options
    }
    
    return jwt.sign(payload, JWT_SECRET, signOptions)
  } catch (error) {
    console.error('Error signing JWT token:', error)
    throw new Error('Failed to sign token')
  }
}

/**
 * Verify and decode a JWT token
 * 
 * @param token - JWT token string to verify
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    }) as TokenPayload
    
    return decoded
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Invalid token: ${error.message}`)
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired')
    } else {
      console.error('Token verification error:', error)
      throw new Error('Token verification failed')
    }
  }
}

/**
 * Set JWT token in HTTP-only cookie
 * Example helper for server-side usage
 * 
 * @param token - JWT token to set in cookie
 * @returns Cookie string for Set-Cookie header
 */
export function createTokenCookie(token: string): string {
  // Simplified cookie for debugging
  console.log('🍪 Creating cookie with token:', token.substring(0, 20) + '...')
  
  const cookieString = `token=${token}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}`
  console.log('🍪 Cookie string:', cookieString)
  
  return cookieString
}

/**
 * Create cookie string to clear the token
 */
export function clearTokenCookie(): string {
  return 'token=; Path=/; HttpOnly; Max-Age=0'
}

/**
 * Extract user ID from request headers (set by middleware)
 * Useful for server components that need user context
 */
export function getUserFromHeaders(headers: Headers): {
  id: string
  role: string
  email: string
} | null {
  const userId = headers.get('x-user-id')
  const userRole = headers.get('x-user-role')
  const userEmail = headers.get('x-user-email')
  
  if (!userId) return null
  
  return {
    id: userId,
    role: userRole || '',
    email: userEmail || ''
  }
}

/* 
Development Testing Helpers
Generate test tokens for local development:

// Admin token
const adminToken = signToken({
  sub: '1',
  role: ALL_ROLES.ADMIN,
  email: 'admin@example.com',
  company_id: 1
})

// Regular user token
const userToken = signToken({
  sub: '2', 
  role: ALL_ROLES.PLANNER,
  email: 'user@example.com',
  company_id: 1
})

// CURL example to test with generated token:
// curl -X GET http://localhost:3000/api/auth/session \
//   -H "Cookie: token=YOUR_TOKEN_HERE"

TODO Production Security Checklist:
- [ ] Set strong JWT_SECRET in environment variables
- [ ] Use HTTPS in production (required for Secure cookies)
- [ ] Implement refresh token rotation
- [ ] Add rate limiting to auth endpoints
- [ ] Consider shorter token expiration times
- [ ] Implement proper logout with token blacklisting
- [ ] Add CSRF protection
- [ ] Use SameSite=Strict in production
- [ ] Implement proper password hashing (bcrypt/argon2)
- [ ] Add audit logging for auth events
*/

/**
 * Get JWT token from browser cookies (client-side)
 * Returns null if no token is found
 */
export function getTokenFromCookies(): string | null {
  if (typeof document === 'undefined') {
    return null // Server-side
  }
  
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
  
  if (!tokenCookie) {
    return null
  }
  
  return tokenCookie.split('=')[1]
}
