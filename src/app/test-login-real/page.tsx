'use client'

import { useState } from 'react'
import { loginUser } from '@/hooks/useUser'

export default function LoginTestPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResults(null)

    try {
      console.log('🧪 Testing login with real credentials...')
      
      // Test login
      const loginResult = await loginUser('prashant619panchal@gmail.com', 'Ronaldo07!')
      console.log('🧪 Login result:', loginResult)

      if (loginResult.success) {
        // Test session
        const sessionResponse = await fetch('/api/auth/session', {
          credentials: 'include'
        })
        const sessionData = await sessionResponse.json()
        console.log('🧪 Session data:', sessionData)

        // Test API call with token
        let apiTestResult = null
        try {
          const { api } = await import('@/lib/api/client')
          const apiResponse = await api.get('ADMIN', '/countries/with-stats')
          apiTestResult = {
            success: !apiResponse.error,
            data: apiResponse.data?.slice(0, 3), // Just show first 3 countries
            error: apiResponse.error
          }
        } catch (apiError) {
          apiTestResult = {
            success: false,
            error: apiError instanceof Error ? apiError.message : 'API test failed'
          }
        }

        setResults({
          login: loginResult,
          session: sessionData,
          apiTest: apiTestResult,
          success: true
        })
      } else {
        setResults({
          login: loginResult,
          success: false
        })
      }

    } catch (error) {
      console.error('🧪 Test error:', error)
      setResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          .NET API Login Test
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Test the integration with your .NET API login endpoint
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                This will test login with:
              </p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
                Email: prashant619panchal@gmail.com<br />
                Password: Ronaldo07!
              </p>
            </div>

            <button
              onClick={testLogin}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login & API Call'}
            </button>

            {results && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Results:</h3>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(results, null, 2)}
                </pre>
                
                {results.success && results.session?.user && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <h4 className="text-green-800 font-medium">✅ Login Successful!</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Welcome, {results.session.user.name} ({results.session.user.role})
                    </p>
                    <p className="text-green-700 text-sm">
                      Company: {results.session.user.companyName || results.session.user.company_id}
                    </p>
                    
                    {results.apiTest && (
                      <div className="mt-2">
                        <h5 className="text-green-800 font-medium">API Test Result:</h5>
                        {results.apiTest.success ? (
                          <p className="text-green-700 text-sm">
                            ✅ API call successful! Retrieved {results.apiTest.data?.length || 0} countries
                          </p>
                        ) : (
                          <p className="text-red-700 text-sm">
                            ❌ API call failed: {results.apiTest.error}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!results.success && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                    <h4 className="text-red-800 font-medium">❌ Login Failed</h4>
                    <p className="text-red-700 text-sm mt-1">
                      {results.login?.error || results.error || 'Unknown error'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}