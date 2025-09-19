// Next.js API route to proxy requests to the backend API
// This helps avoid CORS issues by making server-side requests

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'http://localhost:5204'
const BASIC_AUTH = 'Basic YWRtaW46YWRtaW4xMjM='

export async function GET(request: NextRequest) {
  try {
    // Extract the path from the request URL
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    
    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 })
    }

    // Make the request to the backend API
    const backendUrl = `${API_BASE_URL}${path}`
    
    console.log(`Proxying request to: ${backendUrl}`)
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': BASIC_AUTH,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Backend API error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { error: `Backend API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Proxy API error:', error)
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
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    
    if (!path) {
      return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 })
    }

    const body = await request.json()
    const backendUrl = `${API_BASE_URL}${path}`
    
    console.log(`Proxying POST request to: ${backendUrl}`)
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': BASIC_AUTH,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Backend API error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { error: `Backend API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Proxy API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}