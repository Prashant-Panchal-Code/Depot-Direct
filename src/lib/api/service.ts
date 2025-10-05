import { getAuthHeaders, buildUrl } from './config'

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// HTTP methods type
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// API request options
export interface ApiRequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  token?: string
}

// Generic API service class
export class ApiService {
  private module: 'ADMIN' | 'USER'

  constructor(module: 'ADMIN' | 'USER') {
    this.module = module
  }

  async request<T>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers: customHeaders = {},
      token
    } = options

    const url = buildUrl(this.module, endpoint)
    const authHeaders = getAuthHeaders(this.module, token)
    
    // Simple fetch configuration that should work with Basic auth
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...authHeaders,
        ...customHeaders
      }
    }

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, requestOptions)
      
      if (!response.ok) {
        // Capture response details before consuming the body
        const responseDetails = {
          status: response.status,
          statusText: response.statusText,
          url: url
        }
        
        // Try to extract error message from response body
        let errorMessage = `HTTP error! status: ${responseDetails.status} - ${responseDetails.statusText}`
        
        try {
          const errorText = await response.text()
          if (errorText.trim()) {
            try {
              const errorData = JSON.parse(errorText)
              if (errorData.message) {
                errorMessage = errorData.message
              } else if (errorData.error) {
                errorMessage = errorData.error
              } else if (typeof errorData === 'string') {
                errorMessage = errorData
              }
            } catch (jsonError) {
              // If not JSON, use the text as-is if it's meaningful
              if (errorText.length < 200) {
                errorMessage = errorText
              }
            }
          }
        } catch (textError) {
          // If we can't read the response body, use the default HTTP error message
          console.warn('Could not read error response:', textError)
        }
        
        throw new Error(errorMessage)
      }

      // Handle empty responses (common for DELETE operations)
      const contentLength = response.headers.get('content-length')
      const contentType = response.headers.get('content-type')
      
      if (contentLength === '0' || !contentType?.includes('application/json')) {
        // Return undefined/null for empty responses (void operations)
        return undefined as T
      }
      
      // Check if response body is empty
      const responseText = await response.text()
      if (!responseText.trim()) {
        return undefined as T
      }
      
      // Parse as JSON if we have content
      try {
        const data = JSON.parse(responseText)
        return data
      } catch (parseError) {
        console.warn('Failed to parse response as JSON:', parseError)
        return undefined as T
      }
    } catch (error) {
      // If this is already an Error we threw from the response.ok check, re-throw as-is
      if (error instanceof Error && !error.message.includes('Failed to fetch')) {
        throw error
      }
      
      console.error(`API request failed for ${url}:`, error)
      
      // Handle network/connection errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API server at ${url}. Please ensure:\n1. API server is running on http://localhost:5204\n2. Server has CORS properly configured\n3. No firewall or network issues`)
      }
      
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', token })
  }

  async post<T>(endpoint: string, body: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, token })
  }

  async put<T>(endpoint: string, body: unknown, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, token })
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    // Special handling for DELETE requests to avoid JSON parsing issues
    const url = buildUrl(this.module, endpoint)
    const authHeaders = getAuthHeaders(this.module, token)
    
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: {
        ...authHeaders
      }
    }

    try {
      const response = await fetch(url, requestOptions)
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`
        
        try {
          const errorText = await response.text()
          if (errorText.trim()) {
            try {
              const errorData = JSON.parse(errorText)
              if (errorData.message) {
                errorMessage = errorData.message
              } else if (errorData.error) {
                errorMessage = errorData.error
              }
            } catch {
              // Use text as error message if not JSON
              if (errorText.length < 200) {
                errorMessage = errorText
              }
            }
          }
        } catch {
          // Use default error message
        }
        
        throw new Error(errorMessage)
      }

      // For successful DELETE operations, don't try to parse JSON
      // Just return undefined/null as most DELETE operations return empty responses
      return undefined as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }
}

// Pre-configured service instances
export const adminApi = new ApiService('ADMIN')
export const userApi = new ApiService('USER')