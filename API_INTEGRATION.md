# API Integration Documentation

## Overview

This document outlines the new API integration structure implemented for the Depot Direct application, replacing mock data with real API endpoints.

## Changes Made

### 1. API Configuration Structure

Created a centralized API configuration system in `/src/lib/api/`:

- **`config.ts`**: Contains base URLs, authentication settings, and endpoint definitions
- **`service.ts`**: Generic API service class for making HTTP requests
- **`admin.ts`**: Admin-specific API service functions
- **`user.ts`**: User-specific API service functions
- **`index.ts`**: Barrel export for easy imports

### 2. Configuration Details

#### Admin Module
- **Base URL**: `http://localhost:5204/api/admin`
- **Authentication**: Basic Auth with credentials `YWRtaW46YWRtaW4xMjM=`
- **Endpoints**:
  - `/countries/with-stats` - Get countries with statistics
  - `/countries` - Get countries
  - `/companies` - Get companies
  - `/regions` - Get regions
  - `/users` - Get users

#### User Module
- **Base URL**: `http://localhost:5204/api/user`
- **Authentication**: Bearer token (to be implemented)
- **Endpoints**: Dashboard, vehicles, sites, depot, parking, schedule, reports

### 3. Updated Organizational Setup Page

The `/src/app/(admin)/org-setup/page.tsx` has been updated to:

- Use real API data from `GET /api/admin/countries/with-stats`
- Display countries with proper statistics (companies, regions, depots counts)
- Include loading states and error handling
- Maintain the same UI/UX experience

### 4. Data Structure

The API response format is now properly typed:

```typescript
interface Country {
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
```

## Usage Examples

### Using Admin API

```typescript
import { AdminApiService } from '@/lib/api'

// Get countries with stats
const countries = await AdminApiService.getCountriesWithStats()

// Get companies for a specific country
const companies = await AdminApiService.getCompanies(countryId)

// Get users with filters
const users = await AdminApiService.getUsers({ 
  companyId: 1, 
  regionId: 2 
})
```

### Using User API

```typescript
import { UserApiService } from '@/lib/api'

// Get dashboard data
const dashboard = await UserApiService.getDashboardData(token)

// Get vehicles
const vehicles = await UserApiService.getVehicles(token)
```

## Configuration Management

The configuration is designed to be easily maintainable:

1. **Base URLs**: Change in one place (`API_CONFIG.BASE_URL`)
2. **Authentication**: Easily switch between Basic and Bearer auth
3. **Endpoints**: Centrally managed in the config file
4. **Environment-specific**: Can be extended for different environments

## Error Handling

The API service includes:

- Proper error catching and logging
- User-friendly error messages
- Toast notifications for failed requests
- Loading states in UI components

## Next Steps

1. Implement similar API integration for other admin pages
2. Add Bearer token authentication for user module
3. Add proper error boundaries for better UX
4. Implement retry logic for failed requests
5. Add API response caching where appropriate

## Testing

To test the implementation:

1. Ensure the API server is running on `http://localhost:5204`
2. Navigate to the Organizational Setup page
3. Verify countries are loaded from the API
4. Check browser network tab for proper API calls
5. Test error handling by stopping the API server

## Notes

- All API calls use proper TypeScript typing
- Authentication headers are automatically included
- The structure is scalable for future API endpoints
- Error handling provides user feedback