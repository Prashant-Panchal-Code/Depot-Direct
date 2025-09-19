import { userApi } from './service'
import { API_CONFIG } from './config'

// User API service functions
export class UserApiService {
  // Get dashboard data
  static async getDashboardData(token?: string): Promise<any> {
    return userApi.get(API_CONFIG.USER.ENDPOINTS.DASHBOARD, token)
  }

  // Get vehicles
  static async getVehicles(token?: string): Promise<any[]> {
    return userApi.get<any[]>(API_CONFIG.USER.ENDPOINTS.VEHICLES, token)
  }

  // Get sites
  static async getSites(token?: string): Promise<any[]> {
    return userApi.get<any[]>(API_CONFIG.USER.ENDPOINTS.SITES, token)
  }

  // Get depot data
  static async getDepotData(token?: string): Promise<any> {
    return userApi.get(API_CONFIG.USER.ENDPOINTS.DEPOT, token)
  }

  // Get parking data
  static async getParkingData(token?: string): Promise<any> {
    return userApi.get(API_CONFIG.USER.ENDPOINTS.PARKING, token)
  }

  // Get schedule data
  static async getScheduleData(token?: string): Promise<any> {
    return userApi.get(API_CONFIG.USER.ENDPOINTS.SCHEDULE, token)
  }

  // Get reports data
  static async getReportsData(token?: string): Promise<any> {
    return userApi.get(API_CONFIG.USER.ENDPOINTS.REPORTS, token)
  }
}

export default UserApiService