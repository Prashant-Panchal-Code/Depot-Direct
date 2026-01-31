import { api } from './client'
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
  id: number;
  siteCode: string;
  siteName: string;
  shortcode: string;
  latitude: number;
  longitude: number;
  latLong: string;
  street: string;
  postalCode: string;
  town: string;
  active: boolean;
  priority: string;
  contactPerson: string;
  phone: string;
  email: string;
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  } | string;
  depotId: number;
  deliveryStopped: boolean;
  pumpedRequired: boolean;
  countryId: number;
  companyId: number;
  metadata: string;
  createdBy: number;
  lastUpdatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  country: {
    id: number;
    name: string;
    isoCode: string;
    metadata: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    lastUpdatedBy: number;
  };
  company: {
    id: number;
    name: string;
    companyCode: string;
    countryId: number;
    description: string;
    metadata: string;
    createdBy: number;
    lastUpdatedBy: number;
    createdAt: string;
    updatedAt: string;
  };
  regions: Array<{
    id: number;
    name: string;
    regionCode: string;
    companyId: number;
    metadata: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    lastUpdatedBy: number;
  }>;
}

export interface SiteSummary {
  id: number;
  siteCode: string;
  siteName: string;
  town: string | null;
  active: boolean;
  priority: string;
  latitude: number | null;
  longitude: number | null;
  latLong: string | null;
  street: string | null;
  postalCode: string | null;
  companyId: number;
  companyName: string;
  countryId: number;
  countryName: string;
  createdAt: string;
  updatedAt: string;
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

export interface Depot {
  id: number;
  depotCode: string;
  depotName: string;
  shortcode?: string;
  latitude?: number;
  longitude?: number;
  latLong?: string;
  street?: string;
  postalCode?: string;
  town?: string;
  active: boolean;
  priority?: string;
  loadingBays?: number;
  operatingHours?: string;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
  emergencyContact?: string;
  averageLoadingTime?: number;
  maxTruckSize?: string;
  certifications?: string;
  regionId?: number;
  countryId?: number;
  companyId?: number;
  metadata?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isParking?: boolean; // Frontend specific or mapped property
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

// Tank-related interfaces matching API response
export interface TankReading {
  id: number;
  tankId: number;
  readingTimestamp: string;
  readingMethod: string;
  currentVolumeL: number;
  salesSinceLastReadingL: number;
  avgDailySalesL: number;
}

export interface TankDelivery {
  id: number;
  tankId: number;
  status: string;
  plannedQuantityL: number;
  confirmedQuantityL: number | null;
  scheduledArrival: string;
  actualArrival: string | null;
}

export interface SalesPattern {
  id: number;
  tankId: number;
  dayOfWeek: number;
  hourOfDay: number;
  weightFactor: number;
  avgHourlySalesL: number;
}

export interface TankFull {
  id: number;
  siteId: number;
  productId: number;
  tankCode: string;
  capacityL: number;
  safeFillL: number;
  deadstockL: number;
  dischargeRateLpm: number;
  active: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  lastReadings: TankReading[];
  deliveries: TankDelivery[];
  salesPatterns: SalesPattern[];
}

export interface Product {
  id: number;
  productCode: string;
  productName: string;
  shortName: string;
  companyId: number;
  companyName: string;
  regionId: number;
  regionName: string;
  active: boolean;
  isHazardous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTankRequest {
  tankCode: string;
  siteId: number;
  productId: number;
}

export interface UpdateTankRequest {
  productId: number;
  capacityL: number;
  safeFillL: number;
  deadstockL: number;
  dischargeRateLpm: number;
  active: boolean;
  metadata?: string;
}

// Note-related interfaces matching API response
export interface Note {
  id: number;
  category: "General" | "Maintenance" | "Safety" | "Delivery Operations";
  priority: "Low" | "Medium" | "High";
  comment: string;
  status: "Open" | "In Review" | "Closed";
  closingComment: string | null;
  closedAt: string | null;
  closedBy: number | null;
  siteId: number | null;
  depotId: number | null;
  parkingId: number | null;
  vehicleId: number | null;
  companyId: number;
  createdBy: number;
  createdByName: string;
  closedByName: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateNoteRequest {
  category: "General" | "Maintenance" | "Safety" | "Delivery Operations";
  priority: "Low" | "Medium" | "High";
  comment: string;
  siteId?: number;
  depotId?: number;
  parkingId?: number;
  vehicleId?: number;
  companyId: number;
}

export interface UpdateNoteStatusRequest {
  status: "Open" | "In Review" | "Closed";
  closingComment?: string;
}

export interface Tank {
  id: number;
  siteId: number;
  productId: number;
  tankCode: string;
  capacityL: number;
  safeFillL: number;
  deadstockL: number;
  dischargeRateLpm: number | null;
  active: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

// User API service functions
export class UserApiService {
  // Get dashboard data
  static async getDashboardData(token?: string): Promise<DashboardData> {
    const { data, error } = await api.get<DashboardData>('USER', API_CONFIG.USER.ENDPOINTS.DASHBOARD)
    if (error) throw new Error(error)
    return data!
  }

  // Get vehicles
  static async getVehicles(token?: string): Promise<Vehicle[]> {
    const { data, error } = await api.get<Vehicle[]>('USER', API_CONFIG.USER.ENDPOINTS.VEHICLES)
    if (error) throw new Error(error)
    return data!
  }

  // Get sites
  static async getSites(token?: string): Promise<Site[]> {
    const { data, error } = await api.get<Site[]>('USER', API_CONFIG.USER.ENDPOINTS.SITES)
    if (error) throw new Error(error)
    return data!
  }

  // Get sites by region
  static async getSitesByRegion(regionId: number, token?: string): Promise<SiteSummary[]> {
    const { data, error } = await api.get<SiteSummary[]>('USER', `${API_CONFIG.USER.ENDPOINTS.SITES}/by-region/${regionId}`)
    if (error) throw new Error(error)
    return data!
  }

  // Get a single site by ID
  static async getSiteById(siteId: number, token?: string): Promise<Site> {
    const { data, error } = await api.get<Site>('USER', `${API_CONFIG.USER.ENDPOINTS.SITES}/${siteId}`)
    if (error) throw new Error(error)
    return data!
  }

  // Get depot data
  static async getDepotData(token?: string): Promise<DepotData> {
    const { data, error } = await api.get<DepotData>('USER', API_CONFIG.USER.ENDPOINTS.DEPOT)
    if (error) throw new Error(error)
    return data!
  }

  // Get all depots
  static async getDepots(token?: string): Promise<Depot[]> {
    // Assuming /depots endpoint exists or using /depot if it returns a list
    // Based on typical REST patterns, let's try plural
    const { data, error } = await api.get<Depot[]>('USER', API_CONFIG.USER.ENDPOINTS.DEPOT + 's')
    if (error) throw new Error(error)
    return data!
  }

  // Get depot by ID
  static async getDepotById(depotId: number, token?: string): Promise<Depot> {
    const { data, error } = await api.get<Depot>('USER', `${API_CONFIG.USER.ENDPOINTS.DEPOT}s/${depotId}`)
    if (error) throw new Error(error)
    return data!
  }

  // Get depots by region
  static async getDepotsByRegion(regionId: number, token?: string): Promise<Depot[]> {
    const { data, error } = await api.get<Depot[]>('USER', `${API_CONFIG.USER.ENDPOINTS.DEPOT}s/by-region/${regionId}`)
    if (error) throw new Error(error)
    return data!
  }

  // Update depot
  static async updateDepot(depotId: number, depotData: Partial<Depot>, token?: string): Promise<Depot> {
    const { data, error } = await api.put<Depot>('USER', `${API_CONFIG.USER.ENDPOINTS.DEPOT}s/${depotId}`, depotData)
    if (error) throw new Error(error)
    return data!
  }

  // Get parking data
  static async getParkingData(token?: string): Promise<ParkingData> {
    const { data, error } = await api.get<ParkingData>('USER', API_CONFIG.USER.ENDPOINTS.PARKING)
    if (error) throw new Error(error)
    return data!
  }

  // Get schedule data
  static async getScheduleData(token?: string): Promise<ScheduleData> {
    const { data, error } = await api.get<ScheduleData>('USER', API_CONFIG.USER.ENDPOINTS.SCHEDULE)
    if (error) throw new Error(error)
    return data!
  }

  // Get reports data
  static async getReportsData(token?: string): Promise<ReportsData> {
    const { data, error } = await api.get<ReportsData>('USER', API_CONFIG.USER.ENDPOINTS.REPORTS)
    if (error) throw new Error(error)
    return data!
  }

  // Create a new site
  static async createSite(siteData: { siteCode: string; siteName: string; regionId: number }, token?: string): Promise<Site> {
    const { data, error } = await api.post<Site>('USER', API_CONFIG.USER.ENDPOINTS.SITES, siteData)
    if (error) throw new Error(error)
    return data!
  }

  // Update an existing site
  static async updateSite(siteId: number, siteData: Partial<Site>, token?: string): Promise<Site> {
    const { data, error } = await api.put<Site>('USER', `${API_CONFIG.USER.ENDPOINTS.SITES}/${siteId}`, siteData)
    if (error) throw new Error(error)
    return data!
  }

  // Get tanks for a specific site with full details
  static async getTanksBySite(siteId: number, token?: string): Promise<TankFull[]> {
    const { data, error } = await api.get<TankFull[]>('USER', `/Tanks/site/${siteId}/full`)
    if (error) throw new Error(error)
    return data!
  }

  // Get products by region (from admin API)
  static async getProductsByRegion(regionId: number, token?: string): Promise<Product[]> {
    const { data, error } = await api.get<Product[]>('ADMIN', `/Products/by-region/${regionId}`)
    if (error) throw new Error(error)
    return data!
  }

  // Create a new tank
  static async createTank(tankData: CreateTankRequest, token?: string): Promise<Tank> {
    const { data, error } = await api.post<Tank>('USER', '/Tanks', tankData)
    if (error) throw new Error(error)
    return data!
  }

  // Update an existing tank
  static async updateTank(tankId: number, tankData: UpdateTankRequest, token?: string): Promise<Tank> {
    const { data, error } = await api.put<Tank>('USER', `/Tanks/${tankId}`, tankData)
    if (error) throw new Error(error)
    return data!
  }

  // Delete a tank
  static async deleteTank(tankId: number, token?: string): Promise<void> {
    const { error } = await api.delete('USER', `/Tanks/${tankId}`)
    if (error) throw new Error(error)
  }

  // Create a new note
  static async createNote(noteData: CreateNoteRequest, token?: string): Promise<Note> {
    const { data, error } = await api.post<Note>('USER', '/Notes', noteData)
    if (error) throw new Error(error)
    return data!
  }

  // Get notes by site ID
  static async getNotesBySite(siteId: number, token?: string): Promise<Note[]> {
    const { data, error } = await api.get<Note[]>('USER', `/Notes/by-site/${siteId}`)
    if (error) throw new Error(error)
    return data!
  }

  // Get notes by depot ID
  static async getNotesByDepot(depotId: number, token?: string): Promise<Note[]> {
    const { data, error } = await api.get<Note[]>('USER', `/Notes/by-depot/${depotId}`)
    if (error) throw new Error(error)
    return data!
  }

  static async addDepot(depotData: { depotCode: string; depotName: string; regionId: number }, token?: string): Promise<Depot> {
    const { data, error } = await api.post<Depot>('USER', '/Depots', depotData)
    if (error) throw new Error(error)
    return data!
  }

  // Get notes by parking ID
  static async getNotesByParking(parkingId: number, token?: string): Promise<Note[]> {
    const { data, error } = await api.get<Note[]>('USER', `/Notes/by-parking/${parkingId}`)
    if (error) throw new Error(error)
    return data!
  }

  // Get notes by vehicle ID
  static async getNotesByVehicle(vehicleId: number, token?: string): Promise<Note[]> {
    const { data, error } = await api.get<Note[]>('USER', `/Notes/by-vehicle/${vehicleId}`)
    if (error) throw new Error(error)
    return data!
  }

  // Update note status
  static async updateNoteStatus(noteId: number, statusData: UpdateNoteStatusRequest, token?: string): Promise<Note> {
    const { data, error } = await api.put<Note>('USER', `/Notes/${noteId}/status`, statusData)
    if (error) throw new Error(error)
    return data!
  }
}

export default UserApiService
// Force rebuild