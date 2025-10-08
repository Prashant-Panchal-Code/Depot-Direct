/**
 * Higher-Order Components for Role-Based Access Control
 * 
 * These HOCs provide reusable role-based rendering logic
 * that can be used throughout the application.
 */

import React from 'react';
import { useRoleBasedContext, UserRole } from '@/contexts/RoleBasedContext';

interface RoleBasedRenderProps {
  children: React.ReactNode;
}

interface ConditionalRenderProps {
  allowedRoles?: UserRole[];
  requireDataManager?: boolean;
  requireCanAddEntities?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * HOC that only renders children for Data Manager role
 */
export function DataManagerOnly({ children, fallback = null }: RoleBasedRenderProps & { fallback?: React.ReactNode }) {
  const { isDataManager } = useRoleBasedContext();
  return isDataManager ? <>{children}</> : <>{fallback}</>;
}

/**
 * HOC that only renders children for non-Data Manager roles (Planner/Viewer)
 */
export function RegionBasedRoles({ children, fallback = null }: RoleBasedRenderProps & { fallback?: React.ReactNode }) {
  const { shouldFilterByRegion } = useRoleBasedContext();
  return shouldFilterByRegion ? <>{children}</> : <>{fallback}</>;
}

/**
 * HOC that only renders children if user can add entities
 */
export function CanAddEntities({ children, fallback = null }: RoleBasedRenderProps & { fallback?: React.ReactNode }) {
  const { canAddEntities } = useRoleBasedContext();
  return canAddEntities ? <>{children}</> : <>{fallback}</>;
}

/**
 * Generic role-based conditional rendering component
 */
export function RoleBasedRender({
  allowedRoles,
  requireDataManager,
  requireCanAddEntities,
  children,
  fallback = null
}: ConditionalRenderProps) {
  const { userRole, isDataManager, canAddEntities } = useRoleBasedContext();

  // Check role-based conditions
  const hasAllowedRole = !allowedRoles || (userRole && allowedRoles.includes(userRole));
  const meetsDataManagerRequirement = !requireDataManager || isDataManager;
  const meetsAddEntitiesRequirement = !requireCanAddEntities || canAddEntities;

  const shouldRender = hasAllowedRole && meetsDataManagerRequirement && meetsAddEntitiesRequirement;

  return shouldRender ? <>{children}</> : <>{fallback}</>;
}

/**
 * Hook for role-based conditional logic in components
 */
export function useRoleBasedLogic() {
  const context = useRoleBasedContext();
  
  return {
    ...context,
    // Helper functions for common role checks
    isPlanner: context.userRole === 'Planner',
    isViewer: context.userRole === 'Viewer',
    isAdmin: context.userRole === 'Admin',
    canOnlyRead: context.userRole === 'Viewer',
    canPlan: context.userRole === 'Planner' || context.userRole === 'Data Manager' || context.userRole === 'Admin',
    canManageData: context.isDataManager || context.userRole === 'Admin',
    
    // Data filtering helpers
    getFilteredData: <T extends { regionId: number }>(data: T[]) => {
      if (context.shouldFilterByRegion && context.selectedRegions.length > 0) {
        const selectedRegionIds = context.selectedRegions.map(r => r.id);
        return data.filter(item => selectedRegionIds.includes(item.regionId));
      }
      return data;
    }
  };
}

// Example usage components for documentation
export const RoleBasedExamples = {
  // Example: Add button only for Data Managers
  AddButton: () => (
    <DataManagerOnly>
      <button>Add New Item</button>
    </DataManagerOnly>
  ),

  // Example: Region selector only for Planner/Viewer
  RegionSelector: () => (
    <RegionBasedRoles>
      <div>Region Selector Component</div>
    </RegionBasedRoles>
  ),

  // Example: Action buttons based on multiple conditions
  ActionButtons: () => (
    <RoleBasedRender allowedRoles={['Data Manager', 'Planner']} requireCanAddEntities>
      <div>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </RoleBasedRender>
  ),

  // Example: Different content based on role
  DashboardContent: () => {
    const { userRole } = useRoleBasedContext();
    
    return (
      <div>
        <DataManagerOnly>
          <div>Data Manager Dashboard - Company Overview</div>
        </DataManagerOnly>
        
        <RegionBasedRoles>
          <div>Regional Dashboard - {userRole} View</div>
        </RegionBasedRoles>
      </div>
    );
  }
};