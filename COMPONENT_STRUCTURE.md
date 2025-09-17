# Component Structure Documentation

## Overview
The application has been restructured to provide clear separation between admin and user components, improving maintainability and code organization.

## New Folder Structure

```
src/
  components/
    admin/                    # Admin-specific components
      layout/                 # Admin layout components
        AdminHeader.tsx       # Header specific to admin interface
        AdminSidebar.tsx      # Sidebar with admin navigation
      CompaniesGrid.tsx       # (existing) Admin company management
      CompanyForm.tsx         # (existing) Admin company forms
      DualList.tsx           # (existing) Admin dual-list component
      ManageRegionsModal.tsx  # (existing) Admin region management
      RegionsGrid.tsx        # (existing) Admin regions grid
      UsersGrid.tsx          # (existing) Admin users grid
    
    user/                     # User-specific components
      layout/                 # User layout components
        UserHeader.tsx        # Header specific to user interface
        UserSidebar.tsx       # Sidebar with user navigation
      DashboardContent.tsx    # User dashboard (moved from app/components)
      depot/                  # User depot-related components (placeholder)
      vehicles/               # User vehicle-related components (placeholder)
      sites/                  # User site-related components (placeholder)
      parking/                # User parking-related components (placeholder)
    
    shared/                   # Shared components
      UserProvider.tsx        # User context provider (moved from app/components)
    
    ui/                       # UI library components (unchanged)
      (shadcn/ui components)
```

## Layout Architecture

### Admin Layout (`src/app/(admin)/layout.tsx`)
- Uses `AdminHeader` and `AdminSidebar` components
- Always shows admin-specific navigation
- Handles all routes under `(admin)` folder
- Distinctive admin branding and styling

### User Layout (`src/app/components/LayoutContent.tsx`)
- Uses `UserHeader` and `UserSidebar` components
- Shows user-specific navigation
- Handles all non-admin, non-auth routes
- Standard user interface styling

### Route Handling
- **Admin routes**: `/admin`, `/companies`, `/regions`, `/admin-users`, `/assignments`, `/countries`, `/import-export`, `/org-setup`
- **User routes**: `/dashboard`, `/schedule`, `/vehicles`, `/depot`, `/sites`, `/parking`, `/reports`
- **Auth routes**: `/login`, `/login-test`, `/unauthorized` (no header/sidebar)

## Key Features

### Admin Interface
- **Header**: Shows "Depot Direct - Admin" title with admin mode indicator
- **Sidebar**: Admin-specific navigation menu
- **Styling**: Red accent colors for admin mode identification
- **User Info**: Shows admin role prominently

### User Interface  
- **Header**: Shows "Depot Direct" title with user mode indicator
- **Sidebar**: User-specific navigation menu focused on operational tasks
- **Styling**: Blue accent colors for standard user identification
- **User Info**: Shows standard user role

### Benefits
1. **Clear Separation**: Admin and user components are completely separated
2. **Maintainability**: Easier to modify admin vs user interfaces independently
3. **Scalability**: Easy to add new admin or user-specific components
4. **Security**: Logical separation prevents accidental mixing of admin/user code
5. **Performance**: Each interface loads only its required components

## Migration Notes
- All existing admin components remain in `src/components/admin/`
- User-specific components moved to `src/components/user/`
- Shared components moved to `src/components/shared/`
- Import paths updated to use absolute imports (`@/components/...`)
- Both layouts maintain existing functionality while providing cleaner separation

## Next Steps
1. Move remaining user-specific components from `src/app/components/` to appropriate folders
2. Create additional shared components as needed
3. Consider adding user/admin-specific styling themes
4. Implement role-based component loading optimizations
