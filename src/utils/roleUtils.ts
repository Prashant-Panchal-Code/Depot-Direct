/**
 * Role normalization utilities
 * 
 * Handles inconsistencies in role naming between .NET API and frontend
 */

export type UserRole = 'Admin' | 'Data Manager' | 'Planner' | 'Viewer';

/**
 * Normalizes role names from various sources to ensure consistent casing
 * @param role - Raw role string from API or JWT token
 * @returns Normalized role string
 */
export function normalizeRole(role: string): UserRole {
  if (!role) return 'Viewer'; // Default fallback
  
  // Handle specific case inconsistencies from .NET API
  const roleLower = role.toLowerCase().trim();
  
  switch (roleLower) {
    case 'data manager':
      return 'Data Manager';
    case 'admin':
      return 'Admin';
    case 'planner':
      return 'Planner';
    case 'viewer':
      return 'Viewer';
    default:
      // Fallback: capitalize first letter of each word
      const normalized = role.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ') as UserRole;
      
      // Validate against known roles
      const validRoles: UserRole[] = ['Admin', 'Data Manager', 'Planner', 'Viewer'];
      if (validRoles.includes(normalized)) {
        return normalized;
      }
      
      // If still not valid, default to Viewer
      console.warn(`Unknown role: ${role}, defaulting to Viewer`);
      return 'Viewer';
  }
}

/**
 * Checks if a role has administrative privileges
 */
export function isAdministrativeRole(role: UserRole): boolean {
  return role === 'Admin' || role === 'Data Manager';
}

/**
 * Checks if a role can add/modify entities
 */
export function canManageEntities(role: UserRole): boolean {
  return role === 'Data Manager';
}

/**
 * Checks if a role should filter data by region
 */
export function shouldFilterByRegion(role: UserRole): boolean {
  return role === 'Planner' || role === 'Viewer';
}

/**
 * Gets role-specific permissions
 */
export function getRolePermissions(role: UserRole) {
  return {
    canAddEntities: canManageEntities(role),
    canViewAllCompanyData: role === 'Data Manager',
    needsRegionFiltering: shouldFilterByRegion(role),
    isReadOnly: role === 'Viewer',
    canPlan: role === 'Planner' || role === 'Data Manager' || role === 'Admin',
    isAdmin: role === 'Admin'
  };
}