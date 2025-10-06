import { NextResponse } from 'next/server'
import { signToken, createTokenCookie } from '@/lib/auth'
import { ALL_ROLES } from '@/lib/constants/roles'

export async function GET() {
  console.log('🧪 Manual login endpoint called - setting cookie and redirecting')
  
  try {
    // Generate a test token for admin user with the correct role format
    const token = signToken({
      sub: '1',
      role: ALL_ROLES.ADMIN, // This will be "Admin"
      email: 'admin@example.com',
      company_id: 1
    })
    
    console.log('🧪 Generated token for testing:', token.substring(0, 20) + '...')
    
    // Create response that redirects to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', 'http://localhost:3001'))
    
    // Set the authentication cookie
    const cookieString = createTokenCookie(token)
    console.log('🧪 Setting cookie and redirecting to dashboard:', cookieString)
    response.headers.set('Set-Cookie', cookieString)
    
    return response
  } catch (error) {
    console.error('🧪 Manual login error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
