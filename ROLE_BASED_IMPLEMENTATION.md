# Role-Based Access Control Implementation

## Overview

This implementation provides a comprehensive role-based access control system for the Transport Management System (TMS). Different user roles see data differently and have different permissions for adding entities.

## User Roles and Permissions

### 1. Data Manager Role
- **Data Visibility**: Sees all data based on **Company** (not regions)
- **Permissions**: Can add Sites, Depots, Parkings, and Vehicles
- **Header Display**: Shows "Company: [Company Name]" next to user name
- **UI Behavior**: No region selector is displayed

### 2. Planner Role
- **Data Visibility**: Sees data filtered by **selected Region(s)**
- **Permissions**: Cannot add entities (read/write for planning operations)
- **Header Display**: Shows Region selector next to user name
- **UI Behavior**: Can select multiple regions, data refreshes automatically when region changes

### 3. Viewer Role
- **Data Visibility**: Sees data filtered by **selected Region(s)**
- **Permissions**: Read-only access (cannot add entities)
- **Header Display**: Shows Region selector next to user name
- **UI Behavior**: Can select multiple regions, data refreshes automatically when region changes

## Implementation Architecture

### Core Context System

#### 1. RoleBasedContext (`/src/contexts/RoleBasedContext.tsx`)
- Central state management for role-based functionality
- Manages user role, permissions, and region selections
- Provides helper functions for data filtering

```typescript
// Key exports
export function useRoleBasedContext()
export function useDataManagerContext()
export function useRegionContext()
```

#### 2. Data Filtering Utilities (`/src/utils/roleBasedFiltering.ts`)
- Reusable filtering functions for entities
- Mock region assignment for demonstration
- Consistent filtering logic across components

### UI Components

#### 1. Region Selector (`/src/components/shared/RegionSelector.tsx`)
- Dropdown component for region selection
- Only visible for Planner/Viewer roles
- Supports multiple region selection
- Automatically refreshes data on change

#### 2. Role-Based HOCs (`/src/components/shared/RoleBasedComponents.tsx`)
- Higher-Order Components for conditional rendering
- Reusable role-based logic
- Examples: `DataManagerOnly`, `CanAddEntities`, `RegionBasedRoles`

### Updated Components

#### 1. Header (`/src/app/components/Header.tsx`)
- Shows company name for Data Managers
- Shows region selector for Planner/Viewer roles
- Role-specific information display

#### 2. Content Pages
- **ParkingContent**: Full role-based implementation with region filtering
- **DepotContent**: Role-based add buttons and data filtering
- **SitesContent**: Region-based data filtering and permissions

## Data Structure

### Entity with Regions
All entities now include region information:

```typescript
interface EntityWithRegion {
  id: number;
  // ... entity-specific fields
  regionId: number;
  regionName: string;
}
```

### Mock Region Data
Three regions are available for testing:
- **West Coast** (ID: 1)
- **East Coast** (ID: 2) 
- **Central** (ID: 3)

## API Integration

### Mock Endpoints
- `/api/proxy/users/[userId]/regions` - Returns user's assigned regions
- Mock user-region assignments for different role testing

## Usage Examples

### 1. Role-Based Component Rendering

```typescript
import { DataManagerOnly, CanAddEntities } from '@/components/shared/RoleBasedComponents';

// Only show for Data Managers
<DataManagerOnly>
  <AddEntityButton />
</DataManagerOnly>

// Only show if user can add entities
<CanAddEntities>
  <AddButton onClick={handleAdd} />
</CanAddEntities>
```

### 2. Data Filtering

```typescript
import { useRoleBasedContext } from '@/contexts/RoleBasedContext';
import { filterEntitiesByRole } from '@/utils/roleBasedFiltering';

const { selectedRegions, shouldFilterByRegion, isDataManager, companyId } = useRoleBasedContext();

const filteredData = filterEntitiesByRole(allData, {
  shouldFilterByRegion,
  selectedRegions,
  companyId,
  isDataManager
});
```

### 3. Context Usage

```typescript
import { useDataManagerContext, useRegionContext } from '@/contexts/RoleBasedContext';

// For Data Manager specific logic
const { isDataManager, canAddEntities, companyName } = useDataManagerContext();

// For region-based logic
const { selectedRegions, availableRegions, shouldFilterByRegion } = useRegionContext();
```

## Testing the Implementation

### Demo Page
Visit `/role-demo` to see:
- Current user role and permissions
- Data filtering context
- Role-based behavior explanations

### Manual Testing
1. **Data Manager Testing**:
   - Navigate to any entity page (Parking, Depots, Sites)
   - Verify "Add" buttons are visible
   - Check header shows company name
   - Confirm no region selector is shown

2. **Planner/Viewer Testing**:
   - Navigate to entity pages
   - Verify "Add" buttons are hidden for Viewers
   - Check region selector is visible in header
   - Test region switching and data refresh

## File Structure

```
src/
├── contexts/
│   └── RoleBasedContext.tsx          # Main context for role-based logic
├── components/shared/
│   ├── RegionSelector.tsx            # Region selection component
│   └── RoleBasedComponents.tsx       # HOCs and utilities
├── utils/
│   └── roleBasedFiltering.ts         # Data filtering utilities
├── app/
│   ├── components/Header.tsx         # Updated header with role logic
│   ├── (user)/
│   │   ├── parking/ParkingContent.tsx # Role-based parking page
│   │   ├── depot/DepotContent.tsx     # Role-based depot page
│   │   └── sites/SitesContent.tsx     # Role-based sites page
│   ├── role-demo/page.tsx            # Demo page for testing
│   └── api/proxy/users/[userId]/regions/route.ts # Mock regions API
```

## Key Features Implemented

✅ **Role-Based Data Visibility**
- Data Managers see company-wide data
- Planners/Viewers see region-filtered data

✅ **Permission-Based UI**
- Add buttons only for Data Managers
- Role-specific header information

✅ **Dynamic Region Filtering**
- Multi-region selection support
- Automatic data refresh on region change

✅ **Reusable Components**
- HOCs for consistent role-based rendering
- Utility functions for data filtering

✅ **Clean Architecture**
- Separation of role logic and UI components
- Context-based state management
- Modular and maintainable code

## Future Enhancements

- [ ] Real API integration for user regions
- [ ] Company-based filtering for Data Managers
- [ ] Role-based route protection
- [ ] Audit logging for role-based actions
- [ ] Advanced permission granularity
- [ ] Regional admin roles

## Development Notes

- All existing screens and layouts preserved
- No breaking changes to current functionality
- Role logic cleanly separated from UI components
- Mock data used for demonstration purposes
- Ready for real API integration