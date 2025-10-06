/**
 * Role Mapping Utilities
 * 
 * Provides utilities to map between role names and IDs for backwards compatibility
 * with existing API endpoints that may use numeric role IDs.
 */

import { ALL_ROLES, type AllRole } from './roles'

// Role ID mapping (matches your database exactly)
export const ROLE_ID_MAP: Record<AllRole, number> = {
  [ALL_ROLES.ADMIN]: 1,        // ID: 1
  [ALL_ROLES.PLANNER]: 2,      // ID: 2  
  [ALL_ROLES.DATA_MANAGER]: 3, // ID: 3
  [ALL_ROLES.VIEWER]: 4        // ID: 4
}

// Reverse mapping (ID to role name)
export const ID_ROLE_MAP: Record<number, AllRole> = {
  1: ALL_ROLES.ADMIN,        // "Admin"
  2: ALL_ROLES.PLANNER,      // "Planner"
  3: ALL_ROLES.DATA_MANAGER, // "Data Manager"
  4: ALL_ROLES.VIEWER        // "Viewer"
}

// Helper functions
export const getRoleIdFromName = (roleName: AllRole): number => {
  return ROLE_ID_MAP[roleName]
}

export const getRoleNameFromId = (roleId: number): AllRole | undefined => {
  return ID_ROLE_MAP[roleId]
}

export const isValidRoleId = (roleId: number): boolean => {
  return roleId in ID_ROLE_MAP
}

// For dropdown components that expect { id, name } format
export const getRolesForDropdown = () => {
  return Object.entries(ROLE_ID_MAP).map(([roleName, roleId]) => ({
    id: roleId,
    name: roleName as AllRole
  }))
}

// Get user roles only (excluding admin) for regular user forms
export const getUserRolesForDropdown = () => {
  return getRolesForDropdown().filter(role => role.name !== ALL_ROLES.ADMIN)
}