/**
 * Test login endpoint - for debugging login issues
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🧪 Testing login API...')
    
    // Test the login API directly
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'test123'
      }),
    })

    console.log('🧪 Login API response status:', loginResponse.status)
    console.log('🧪 Login API response headers:', Object.fromEntries(loginResponse.headers.entries()))
    
    const loginData = await loginResponse.json()
    console.log('🧪 Login API response data:', loginData)

    // Check if Set-Cookie header is present
    const setCookieHeader = loginResponse.headers.get('Set-Cookie')
    console.log('🧪 Set-Cookie header:', setCookieHeader)

    return NextResponse.json({
      status: 'test completed',
      loginResponse: {
        status: loginResponse.status,
        headers: Object.fromEntries(loginResponse.headers.entries()),
        data: loginData,
        setCookie: setCookieHeader
      }
    })
  } catch (error) {
    console.error('🧪 Test error:', error)
    return NextResponse.json({
      status: 'test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
