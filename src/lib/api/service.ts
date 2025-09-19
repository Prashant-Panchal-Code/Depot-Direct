import { API_CONFIG, getAuthHeaders, buildUrl } from './config'

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
  body?: any
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
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url
        })
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${url}:`, error)
      
      // Provide more specific error messages for common issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to API server at ${url}. Please ensure:\n1. API server is running on http://localhost:5204\n2. Server has CORS properly configured\n3. No firewall or network issues`)
      }
      
      if (error instanceof Error && error.message.includes('HTTP error')) {
        throw error // Re-throw HTTP errors as-is
      }
      
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', token })
  }

  async post<T>(endpoint: string, body: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, token })
  }

  async put<T>(endpoint: string, body: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, token })
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', token })
  }
}

// Pre-configured service instances
export const adminApi = new ApiService('ADMIN')
export const userApi = new ApiService('USER')