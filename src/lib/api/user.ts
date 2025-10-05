import { userApi } from './service'
import { API_CONFIG } from './config'

// Type definitions for User API responses
export interface DashboardData {
  summary: {
    totalVehicles: number
    activeSites: number
    totalSchedules: number
    pendingReports: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
  metrics: Record<string, number>
}

export interface Vehicle {
  id: string
  code: string
  name: string
  type: string
  status: string
  location?: string
  assignedDriver?: string
  metadata?: Record<string, unknown>
}

export interface Site {
  id: string
  code: string
  name: string
  address: string
  status: string
  coordinates?: {
    lat: number
    lng: number
  }
  metadata?: Record<string, unknown>
}

export interface DepotData {
  id: string
  name: string
  location: string
  capacity: number
  currentLoad: number
  vehicles: Vehicle[]
  metadata?: Record<string, unknown>
}

export interface ParkingData {
  id: string
  name: string
  location: string
  totalSpaces: number
  availableSpaces: number
  reservations: Array<{
    id: string
    vehicleId: string
    startTime: string
    endTime: string
  }>
  metadata?: Record<string, unknown>
}

export interface ScheduleData {
  schedules: Array<{
    id: string
    title: string
    description?: string
    startTime: string
    endTime: string
    vehicleId?: string
    siteId?: string
    status: string
  }>
  metadata?: Record<string, unknown>
}

export interface ReportsData {
  reports: Array<{
    id: string
    title: string
    type: string
    generatedAt: string
    status: string
    downloadUrl?: string
  }>
  metadata?: Record<string, unknown>
}

// User API service functions
export class UserApiService {
  // Get dashboard data
  static async getDashboardData(token?: string): Promise<DashboardData> {
    return userApi.get<DashboardData>(API_CONFIG.USER.ENDPOINTS.DASHBOARD, token)
  }

  // Get vehicles
  static async getVehicles(token?: string): Promise<Vehicle[]> {
    return userApi.get<Vehicle[]>(API_CONFIG.USER.ENDPOINTS.VEHICLES, token)
  }

  // Get sites
  static async getSites(token?: string): Promise<Site[]> {
    return userApi.get<Site[]>(API_CONFIG.USER.ENDPOINTS.SITES, token)
  }

  // Get depot data
  static async getDepotData(token?: string): Promise<DepotData> {
    return userApi.get<DepotData>(API_CONFIG.USER.ENDPOINTS.DEPOT, token)
  }

  // Get parking data
  static async getParkingData(token?: string): Promise<ParkingData> {
    return userApi.get<ParkingData>(API_CONFIG.USER.ENDPOINTS.PARKING, token)
  }

  // Get schedule data
  static async getScheduleData(token?: string): Promise<ScheduleData> {
    return userApi.get<ScheduleData>(API_CONFIG.USER.ENDPOINTS.SCHEDULE, token)
  }

  // Get reports data
  static async getReportsData(token?: string): Promise<ReportsData> {
    return userApi.get<ReportsData>(API_CONFIG.USER.ENDPOINTS.REPORTS, token)
  }
}

export default UserApiService