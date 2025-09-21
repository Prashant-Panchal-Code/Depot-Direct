// Base configuration for API endpoints
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5204',
  USE_PROXY: false, // Set to true to use Next.js API proxy to avoid CORS issues
  ADMIN: {
    BASE_URL: 'http://localhost:5204/api/admin',
    PROXY_BASE_URL: '/api/proxy', // Next.js API route for proxying
    AUTH: {
      type: 'Basic' as const,
      credentials: 'YWRtaW46YWRtaW4xMjM='
    },
    ENDPOINTS: {
      COUNTRIES_WITH_STATS: '/countries/with-stats',
      COUNTRIES: '/countries',
      COMPANIES: '/companies',
      REGIONS: '/regions',
      USERS: '/users',
      ROLES: '/roles'
    }
  },
  USER: {
    BASE_URL: 'http://localhost:5204/api/user',
    PROXY_BASE_URL: '/api/proxy', // Next.js API route for proxying
    AUTH: {
      type: 'Bearer' as const,
      // Token will be set dynamically after login
      credentials: ''
    },
    ENDPOINTS: {
      DASHBOARD: '/dashboard',
      VEHICLES: '/vehicles',
      SITES: '/sites',
      DEPOT: '/depot',
      PARKING: '/parking',
      SCHEDULE: '/schedule',
      REPORTS: '/reports'
    }
  }
} as const

// Helper function to get auth headers
export const getAuthHeaders = (module: 'ADMIN' | 'USER', token?: string) => {
  // If using proxy, don't include auth headers (proxy handles auth)
  if (API_CONFIG.USE_PROXY) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  const config = API_CONFIG[module]
  
  let headers: Record<string, string>
  
  if (config.AUTH.type === 'Basic') {
    headers = {
      'Authorization': `Basic ${config.AUTH.credentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  } else {
    const authToken = token || config.AUTH.credentials
    headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  
  return headers
}

// Helper function to build full URL
export const buildUrl = (module: 'ADMIN' | 'USER', endpoint: string) => {
  if (API_CONFIG.USE_PROXY) {
    // Use Next.js API proxy to avoid CORS issues
    const basePath = module === 'ADMIN' ? '/api/admin' : '/api/user'
    const fullPath = `${basePath}${endpoint}`
    return `${API_CONFIG[module].PROXY_BASE_URL}?path=${encodeURIComponent(fullPath)}`
  } else {
    // Direct API call
    return `${API_CONFIG[module].BASE_URL}${endpoint}`
  }
}