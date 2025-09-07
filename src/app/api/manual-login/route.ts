import { NextResponse } from 'next/server'
import { signToken, createTokenCookie } from '@/lib/auth'

export async function GET() {
  console.log('🧪 Manual login endpoint called - setting cookie and redirecting')
  
  try {
    // Generate a test token for admin user
    const token = signToken({
      sub: '1',
      role: 'admin',
      email: 'admin@example.com',
      company_id: 1
    })
    
    console.log('🧪 Generated token for testing:', token.substring(0, 20) + '...')
    
    // Create response that redirects to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', 'http://localhost:3000'))
    
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
