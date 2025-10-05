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
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  createdBy: string | null
  lastUpdatedBy: string | null
}

export interface Company {
  id: number
  name: string
  companyCode: string
  countryId: number
  description: string
  metadata: Record<string, unknown> | null
  createdBy: string | null
  lastUpdatedBy: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  country?: {
    id: number
    name: string
    isoCode: string
    metadata: Record<string, unknown> | null
    createdAt: string
    updatedAt: string
    createdBy: string | null
    lastUpdatedBy: string | null
  }
}

export interface Role {
  id: number
  name: string
}

export interface Region {
  id: number
  name: string
  regionCode?: string
  companyId: number
  companyName?: string
  countryId?: number
  countryName?: string
  metadata?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  createdBy?: string | null
  lastUpdatedBy?: string | null
}

// User DTO types
export interface AddUserDTO {
  companyId?: number
  roleId: number
  email: string
  password: string
  fullName: string
  phone?: string
  active?: boolean
  metadata?: string
}

export interface UpdateUserDTO {
  companyId?: number
  roleId?: number
  email?: string
  password?: string
  fullName?: string
  phone?: string
  active?: boolean
  metadata?: Record<string, unknown> | null
}

export interface User {
  id: number
  companyId?: number
  roleId: number
  email: string
  fullName: string
  phone?: string
  active: boolean
  metadata?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  createdBy?: string | null
  lastUpdatedBy?: string | null
  deletedAt?: string | null
  // Additional fields for display
  roleName?: string
  companyName?: string
  assignedRegions?: Region[]
}

// Interface for user-region assignment
export interface UserRegionAssignment {
  id: number
  userId: number
  regionId: number
  metadata: Record<string, unknown> | null
  createdBy: number
  createdAt: string
  updatedAt: string
  user: User
  region: Region
}

// Interface for region assignment operations
export interface AssignRegionsDTO {
  userId: number
  regionIds: number[]
}

// Interface for user with regions response from the new API
export interface UserWithRegions extends User {
  regions: Region[]
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
  static async getCompanies(countryId?: number): Promise<Company[]> {
    const endpoint = countryId 
      ? `${API_CONFIG.ADMIN.ENDPOINTS.COMPANIES}/by-country/${countryId}`
      : API_CONFIG.ADMIN.ENDPOINTS.COMPANIES
    return adminApi.get<Company[]>(endpoint)
  }

  // Get roles for user form dropdown
  static async getRoles(): Promise<Role[]> {
    return adminApi.get<Role[]>(API_CONFIG.ADMIN.ENDPOINTS.ROLES)
  }

  // Get regions for a specific company
  static async getRegions(companyId?: number): Promise<Region[]> {
    const endpoint = companyId 
      ? `${API_CONFIG.ADMIN.ENDPOINTS.REGIONS_BY_COMPANY}/${companyId}`
      : API_CONFIG.ADMIN.ENDPOINTS.REGIONS
    return adminApi.get<Region[]>(endpoint)
  }

  // Get users with optional filtering
  static async getUsers(filters?: { companyId?: number; regionId?: number; countryId?: number }): Promise<User[]> {
    // If countryId is provided, use the by-country endpoint
    if (filters?.countryId) {
      const byCountryEndpoint = `${API_CONFIG.ADMIN.ENDPOINTS.USERS_BY_COUNTRY}/${filters.countryId}`
      return adminApi.get<User[]>(byCountryEndpoint)
    }
    
    // Otherwise use the general users endpoint with filters
    let endpoint = API_CONFIG.ADMIN.ENDPOINTS.USERS
    
    if (filters) {
      const params = new URLSearchParams()
      if (filters.companyId) params.append('companyId', filters.companyId.toString())
      if (filters.regionId) params.append('regionId', filters.regionId.toString())
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`
      }
    }
    
    return adminApi.get<User[]>(endpoint)
  }

  // Create a new user
  static async createUser(userData: AddUserDTO): Promise<User> {
    return adminApi.post<User>(API_CONFIG.ADMIN.ENDPOINTS.USERS, userData)
  }

  // Update an existing user
  static async updateUser(userId: number, userData: UpdateUserDTO): Promise<User> {
    return adminApi.put<User>(`${API_CONFIG.ADMIN.ENDPOINTS.USERS}/${userId}`, userData)
  }

  // Delete a user
  static async deleteUser(userId: number): Promise<void> {
    return adminApi.delete<void>(`${API_CONFIG.ADMIN.ENDPOINTS.USERS}/${userId}`)
  }

  // Get a single user by ID
  static async getUser(userId: number): Promise<User> {
    return adminApi.get<User>(`${API_CONFIG.ADMIN.ENDPOINTS.USERS}/${userId}`)
  }

  // Toggle country status (if the API supports it)
  static async toggleCountryStatus(countryId: number, active: boolean): Promise<Country> {
    return adminApi.put<Country>(`${API_CONFIG.ADMIN.ENDPOINTS.COUNTRIES}/${countryId}`, { active })
  }

  // Assign a region to a user (using the real API endpoint)
  static async assignUserToRegion(userId: number, regionId: number): Promise<UserRegionAssignment> {
    return adminApi.post<UserRegionAssignment>(`/UserRegions/user/${userId}/regions`, { regionId })
  }

  // Remove a user from a region
  static async removeUserFromRegion(userId: number, regionId: number): Promise<void> {
    return adminApi.delete<void>(`/UserRegions/user/${userId}/regions/${regionId}`)
  }

  // Get user's assigned regions
  static async getUserRegions(userId: number): Promise<UserWithRegions> {
    return adminApi.get<UserWithRegions>(`/UserRegions/user/${userId}/regions`)
  }
}

export default AdminApiService