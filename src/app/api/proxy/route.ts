// Next.js API route to proxy requests to the backend API
// Handles JWT authentication from HTTP-only cookies

import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/lib/api/config'

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET')
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    // Extract parameters from the request URL
    const { searchParams } = new URL(request.url)
    const module = searchParams.get('module') as 'ADMIN' | 'USER' | 'SHARED'
    const endpoint = searchParams.get('endpoint')

    if (!module || !endpoint) {
      return NextResponse.json({
        error: 'Module and endpoint parameters are required'
      }, { status: 400 })
    }

    // Get JWT token from HTTP-only cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({
        error: 'Authentication required - no token found'
      }, { status: 401 })
    }

    // Build the backend URL
    const moduleConfig = API_CONFIG[module]
    const backendUrl = `${moduleConfig.BASE_URL}${endpoint}`

    console.log(`🔍 PROXY: ${method} ${backendUrl}`)
    console.log(`🔍 PROXY: Token present: ${!!token}`)

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

    // Add body for POST/PUT requests
    if (method === 'POST' || method === 'PUT') {
      const body = await request.text()
      if (body) {
        requestOptions.body = body
      }
    }

    const response = await fetch(backendUrl, requestOptions)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`🚫 PROXY: Backend API error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { error: `Backend API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('content-type')
    let data

    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    console.log(`✅ PROXY: Success - returning data`)
    return NextResponse.json(data)

  } catch (error) {
    console.error('🚫 PROXY: Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}