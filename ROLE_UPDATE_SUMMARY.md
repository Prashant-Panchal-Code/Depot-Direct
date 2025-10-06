# User Roles Update

## New Role Structure

The user role system has been updated to use the following roles:

### User Roles (for regular users)
1. **Viewer** - View-only access to data and reports
2. **Planner** - Plan and schedule operations  
3. **Data Manager** - Manage data and configurations

### Admin Role (for administrators)
- **Admin** - Full system access and administration

## Implementation Details

### Files Updated:
- `src/lib/constants/roles.ts` - Central role definitions and utilities
- `src/lib/constants/role-mapping.ts` - Role ID mapping for API compatibility
- `src/lib/auth.ts` - Updated JWT token payload with proper role typing
- `src/hooks/useUser.ts` - Enhanced with role checking utilities
- `src/lib/api/admin.ts` - Updated to use local role constants

### New Utilities Available:

#### In `useUser` hook:
- `hasRole(role)` - Check if user has specific role
- `hasPermission(requiredRole)` - Check if user meets minimum permission level
- `isAdmin` - Boolean check for admin role

#### Role constants:
- `USER_ROLES` - Object with user role constants
- `ALL_ROLES` - Object with all role constants including admin
- `ROLE_HIERARCHY` - Permission level mapping

## Role Permissions (To Be Defined)

### Viewer
- TODO: Define specific permissions

### Planner  
- TODO: Define specific permissions

### Data Manager
- TODO: Define specific permissions

### Admin
- Full system access
- User management
- Organization setup
- All data access

## Migration Notes

- Existing role references have been updated to use the new constants
- API compatibility maintained through role ID mapping
- No database schema changes required at this time
- Role dropdowns will automatically show the new role names

## Next Steps

1. Define specific permissions for each role
2. Implement role-based UI conditional rendering
3. Add server-side permission checks in API routes
4. Update documentation with detailed role capabilities