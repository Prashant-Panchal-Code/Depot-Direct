/**
 * User Roles Constants
 * 
 * Defines the valid user roles in the system and their hierarchy.
 * These roles determine what features and data users can access.
 */

// Valid user roles (excluding admin which is handled separately)
export const USER_ROLES = {
  VIEWER: 'Viewer',
  PLANNER: 'Planner', 
  DATA_MANAGER: 'Data Manager'
} as const

// Admin role (separate from user roles)
export const ADMIN_ROLE = 'Admin'

// All valid roles
export const ALL_ROLES = {
  ...USER_ROLES,
  ADMIN: ADMIN_ROLE
} as const

// Type definitions
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
export type AdminRole = typeof ADMIN_ROLE
export type AllRole = UserRole | AdminRole

// Role hierarchy (lower number = higher permissions)
export const ROLE_HIERARCHY: Record<string, number> = {
  [ALL_ROLES.ADMIN]: 0,
  [ALL_ROLES.DATA_MANAGER]: 1,
  [ALL_ROLES.PLANNER]: 2,
  [ALL_ROLES.VIEWER]: 3
}

// Role descriptions (to be updated later with specific permissions)
export const ROLE_DESCRIPTIONS: Record<string, string> = {
  [ALL_ROLES.ADMIN]: 'Full system access and administration',
  [ALL_ROLES.DATA_MANAGER]: 'Manage data and configurations', 
  [ALL_ROLES.PLANNER]: 'Plan and schedule operations',
  [ALL_ROLES.VIEWER]: 'View-only access to data and reports'
}

// Helper functions
export const isValidRole = (role: string): role is AllRole => {
  return Object.values(ALL_ROLES).includes(role as AllRole)
}

export const isUserRole = (role: string): role is UserRole => {
  return Object.values(USER_ROLES).includes(role as UserRole)
}

export const isAdminRole = (role: string): role is AdminRole => {
  return role === ADMIN_ROLE
}

export const hasPermissionLevel = (userRole: string, requiredRole: string): boolean => {
  const userLevel = ROLE_HIERARCHY[userRole]
  const requiredLevel = ROLE_HIERARCHY[requiredRole]
  
  return userLevel != null && requiredLevel != null && userLevel <= requiredLevel
}

// Export user roles as array for dropdowns
export const getUserRolesList = (): Array<{ id: string; name: string }> => {
  return Object.values(USER_ROLES).map(role => ({
    id: role,
    name: role
  }))
}

// Export all roles as array for admin dropdowns
export const getAllRolesList = (): Array<{ id: string; name: string }> => {
  return Object.values(ALL_ROLES).map(role => ({
    id: role,
    name: role
  }))
}