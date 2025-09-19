import { adminApi } from './service'
import { API_CONFIG } from './config'

// Types based on the API response you provided
export interface Country {
  id: number
  name: string
  isoCode: string
  companiesCount: number
  regionsCount: number
  depotsCount: number
  metadata: any
  createdAt: string
  updatedAt: string
  createdBy: string | null
  lastUpdatedBy: string | null
}

// Admin API service functions
export class AdminApiService {
  // Get all countries with statistics
  static async getCountriesWithStats(): Promise<Country[]> {
    return adminApi.get<Country[]>(API_CONFIG.ADMIN.ENDPOINTS.COUNTRIES_WITH_STATS)
  }

  // Get countries (without stats)
  static async getCountries(): Promise<Country[]> {
    return adminApi.get<Country[]>(API_CONFIG.ADMIN.ENDPOINTS.COUNTRIES)
  }

  // Get companies for a specific country
  static async getCompanies(countryId?: number): Promise<any[]> {
    const endpoint = countryId 
      ? `${API_CONFIG.ADMIN.ENDPOINTS.COMPANIES}?countryId=${countryId}`
      : API_CONFIG.ADMIN.ENDPOINTS.COMPANIES
    return adminApi.get<any[]>(endpoint)
  }

  // Get regions for a specific company
  static async getRegions(companyId?: number): Promise<any[]> {
    const endpoint = companyId 
      ? `${API_CONFIG.ADMIN.ENDPOINTS.REGIONS}?companyId=${companyId}`
      : API_CONFIG.ADMIN.ENDPOINTS.REGIONS
    return adminApi.get<any[]>(endpoint)
  }

  // Get users with optional filtering
  static async getUsers(filters?: { companyId?: number; regionId?: number }): Promise<any[]> {
    let endpoint = API_CONFIG.ADMIN.ENDPOINTS.USERS
    
    if (filters) {
      const params = new URLSearchParams()
      if (filters.companyId) params.append('companyId', filters.companyId.toString())
      if (filters.regionId) params.append('regionId', filters.regionId.toString())
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }
    
    return adminApi.get<any[]>(endpoint)
  }

  // Toggle country status (if the API supports it)
  static async toggleCountryStatus(countryId: number, active: boolean): Promise<Country> {
    return adminApi.put<Country>(`${API_CONFIG.ADMIN.ENDPOINTS.COUNTRIES}/${countryId}`, { active })
  }
}

export default AdminApiService