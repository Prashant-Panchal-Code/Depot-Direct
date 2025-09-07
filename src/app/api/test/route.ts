/**
 * Simple test endpoint to verify API routes are working
 */

import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🚀 TEST API CALLED!')
  return NextResponse.json({ 
    message: 'Test API is working!',
    timestamp: new Date().toISOString()
  })
}

export async function POST() {
  console.log('🚀 TEST API POST CALLED!')
  return NextResponse.json({ 
    message: 'Test POST API is working!',
    timestamp: new Date().toISOString()
  })
}
