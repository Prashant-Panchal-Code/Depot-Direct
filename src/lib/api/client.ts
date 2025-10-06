/**
 * API Client utilities for making authenticated requests to .NET API
 * Uses proxy approach since HTTP-only cookies can't be accessed by client JS
 */

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

/**
 * Make an authenticated API request via proxy
 * Since HTTP-only cookies can't be accessed by client JS, we use a proxy endpoint
 */
export async function apiRequest<T = any>(
  module: 'ADMIN' | 'USER',
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Use proxy endpoint that can access HTTP-only cookies on the server side
    const proxyUrl = `/api/proxy?module=${module}&endpoint=${encodeURIComponent(endpoint)}`
    
    const response = await fetch(proxyUrl, {
      ...options,
      credentials: 'include', // Include HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    })

    const status = response.status

    if (!response.ok) {
      const errorText = await response.text()
      return {
        error: errorText || `Request failed with status ${status}`,
        status
      }
    }

    let data: T
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text() as T
    }

    return {
      data,
      status
    }

  } catch (error) {
    console.error('API request error:', error)
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0
    }
  }
}

/**
 * Convenience methods for common HTTP operations
 */
export const api = {
  get: <T = any>(module: 'ADMIN' | 'USER', endpoint: string) => 
    apiRequest<T>(module, endpoint, { method: 'GET' }),
    
  post: <T = any>(module: 'ADMIN' | 'USER', endpoint: string, data?: any) =>
    apiRequest<T>(module, endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    }),
    
  put: <T = any>(module: 'ADMIN' | 'USER', endpoint: string, data?: any) =>
    apiRequest<T>(module, endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    }),
    
  delete: <T = any>(module: 'ADMIN' | 'USER', endpoint: string) =>
    apiRequest<T>(module, endpoint, { method: 'DELETE' })
}

/**
 * Example usage:
 * 
 * // Get regions
 * const { data, error } = await api.get('ADMIN', '/regions')
 * 
 * // Create new company
 * const { data, error } = await api.post('ADMIN', '/companies', {
 *   name: 'New Company',
 *   country: 'US'
 * })
 */