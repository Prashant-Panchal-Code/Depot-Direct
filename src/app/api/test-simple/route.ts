import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🧪 Simple test endpoint called')
  
  // Test login internally
  try {
    console.log('🧪 Testing internal login...')
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: '123'
      })
    })
    
    const loginData = await loginResponse.json()
    console.log('🧪 Internal login response:', loginData)
    
    return NextResponse.json({ 
      test: 'working',
      loginTest: {
        status: loginResponse.status,
        data: loginData
      }
    })
  } catch (error) {
    console.log('🧪 Internal login error:', error)
    return NextResponse.json({ 
      test: 'working',
      loginTest: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}

export async function POST(request: Request) {
  console.log('🧪 Simple test POST endpoint called')
  try {
    const body = await request.json()
    console.log('🧪 Request body:', body)
    return NextResponse.json({ received: body })
  } catch (error) {
    console.log('🧪 Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
