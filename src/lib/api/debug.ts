// Debug utility to test API authorization
import { AdminApiService } from './admin'

export const testApiAuth = async () => {
  console.log('Testing API authentication...')
  
  try {
    // First, test if the server is reachable at all
    const baseUrl = 'http://localhost:5204'
    console.log('Testing server connectivity to:', baseUrl)
    
    try {
      const pingResponse = await fetch(baseUrl, {
        method: 'GET',
        mode: 'no-cors' // Use no-cors to bypass CORS for connectivity test
      })
      console.log('Server ping successful')
    } catch (pingError) {
      console.error('Server is not reachable:', pingError)
      throw new Error('API server is not running on http://localhost:5204. Please start the server first.')
    }
    
    // Test the basic auth with simple fetch
    const url = 'http://localhost:5204/api/admin/countries/with-stats'
    const headers = {
      'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    
    console.log('Manual fetch test:', { url, headers })
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', [...response.headers.entries()])
    
    if (response.ok) {
      const data = await response.json()
      console.log('Success! Data:', data)
      return data
    } else {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
  } catch (error) {
    console.error('Fetch error:', error)
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to API server. Please ensure:\n1. API server is running on http://localhost:5204\n2. Server has CORS enabled\n3. No firewall blocking the connection')
    }
    
    throw error
  }
}

// Test using the API service
export const testApiService = async () => {
  console.log('Testing API service...')
  
  try {
    const data = await AdminApiService.getCountriesWithStats()
    console.log('API Service success:', data)
    return data
  } catch (error) {
    console.error('API Service error:', error)
    throw error
  }
}