// Simple test page to verify API connectivity
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testDirectFetch = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const response = await fetch('http://localhost:5204/api/admin/countries/with-stats', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic YWRtaW46YWRtaW4xMjM=',
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setResult(`✅ Success! Got ${data.length} countries:\n${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`❌ HTTP Error: ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testProxy = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const response = await fetch('/api/proxy?path=' + encodeURIComponent('/api/admin/countries/with-stats'))
      
      if (response.ok) {
        const data = await response.json()
        setResult(`✅ Proxy Success! Got data:\n${JSON.stringify(data, null, 2)}`)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        setResult(`❌ Proxy Error: ${response.status} - ${JSON.stringify(errorData, null, 2)}`)
      }
    } catch (error) {
      setResult(`❌ Proxy Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="space-y-4 mb-6">
        <Button 
          onClick={testDirectFetch} 
          disabled={loading}
          className="mr-4"
        >
          {loading ? 'Testing...' : 'Test Direct API Call'}
        </Button>
        
        <Button 
          onClick={testProxy} 
          disabled={loading}
          variant="outline"
        >
          {loading ? 'Testing...' : 'Test Proxy API Call'}
        </Button>
      </div>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  )
}