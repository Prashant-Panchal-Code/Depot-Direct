/**
 * Login Page
 * 
 * Simple development login page for testing authentication flow.
 * In production, replace with proper authentication provider.
 * 
 * TODO: Replace with NextAuth.js or other production auth solution
 * TODO: Add proper form validation and error handling
 * TODO: Add password strength requirements
 * TODO: Add "Remember me" functionality
 */

'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginUser } from '@/hooks/useUser'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 Form submitted with:', { email, password })
    setLoading(true)
    setError('')

    try {
      console.log('🔍 Calling loginUser...')
      const result = await loginUser(email, password)
      console.log('🔍 Login result:', result)
      
      if (result.success) {
        console.log('🔍 Login successful, checking user role for redirect...')
        
        // Get user info to determine redirect URL
        try {
          const userResponse = await fetch('/api/auth/user', {
            credentials: 'include'
          })
          
          if (userResponse.ok) {
            const userData = await userResponse.json()
            console.log('🔍 User data after login:', userData)
            
            // Determine redirect URL based on role
            let redirectUrl = callbackUrl
            if (callbackUrl === '/dashboard') {
              // Only change default redirect if it's the default dashboard
              redirectUrl = userData.role === 'admin' ? '/admin' : '/dashboard'
            }
            
            console.log('🔍 Redirecting to:', redirectUrl)
            window.location.href = redirectUrl
          } else {
            // Fallback to default redirect if user info fetch fails
            console.log('🔍 Could not fetch user info, using default redirect:', callbackUrl)
            window.location.href = callbackUrl
          }
        } catch (error) {
          console.log('🔍 Error fetching user info:', error)
          // Fallback to default redirect
          window.location.href = callbackUrl
        }
      } else {
        console.log('🔍 Login failed:', result.error)
        setError(result.error || 'Login failed')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Depot Direct
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Development login - use any password
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Development Testing Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800">🚨 Development Mode</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p className="mb-2">Test accounts:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Admin:</strong> admin@example.com (any password)</li>
                <li><strong>User:</strong> user@example.com (any password)</li>
              </ul>
              
              {/* Quick Test Button */}
              <button
                type="button"
                onClick={async () => {
                  setEmail('admin@example.com')
                  setPassword('test123')
                  console.log('🔍 Quick test button clicked')
                  
                  // Wait a moment then submit
                  setTimeout(() => {
                    const form = document.querySelector('form')
                    if (form) {
                      console.log('🔍 Submitting form programmatically')
                      form.requestSubmit()
                    }
                  }, 100)
                }}
                className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Quick Test Login
              </button>
            </div>
          </div>

          {/* Callback URL Display */}
          {callbackUrl !== '/dashboard' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-600">
                You&apos;ll be redirected to: <span className="font-medium">{callbackUrl}</span>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}

/*
TODO: Production Login Page Features

1. NextAuth.js Integration:
```typescript
import { signIn, getSession } from 'next-auth/react'

export default function LoginPage() {
  const handleSubmit = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(result.error)
    } else {
      router.push(callbackUrl)
    }
  }
}
```

2. Form Validation:
```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    // Handle login
  }
}
```

3. Social Login Integration:
```typescript
import { signIn } from 'next-auth/react'

function SocialLogin() {
  return (
    <div className="space-y-3">
      <button
        onClick={() => signIn('google')}
        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Sign in with Google
      </button>
      
      <button
        onClick={() => signIn('github')}
        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <GitHubIcon className="w-5 h-5 mr-2" />
        Sign in with GitHub
      </button>
    </div>
  )
}
```

4. Two-Factor Authentication:
```typescript
function TwoFactorStep({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState('')

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Enter verification code</h3>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit code"
        maxLength={6}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={() => onSubmit(code)}
        disabled={code.length !== 6}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        Verify
      </button>
    </div>
  )
}
```
*/
