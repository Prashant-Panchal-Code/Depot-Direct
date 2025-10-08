'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import { Region } from '@/lib/api/admin';
import { normalizeRole, UserRole, getRolePermissions } from '@/utils/roleUtils';

// Re-export UserRole for convenience
export type { UserRole } from '@/utils/roleUtils';

interface RoleBasedContextType {
  // Role-based visibility
  userRole: UserRole | null;
  isDataManager: boolean;
  canAddEntities: boolean;
  
  // Data filtering context
  selectedRegions: Region[];
  setSelectedRegions: (regions: Region[]) => void;
  availableRegions: Region[];
  setAvailableRegions: (regions: Region[]) => void;
  
  // Company context for Data Managers
  companyName: string | null;
  companyId: number | null;
  
  // Loading states
  regionsLoading: boolean;
  
  // Helper functions
  shouldFilterByRegion: boolean;
  shouldFilterByCompany: boolean;
  refreshRegions: () => Promise<void>;
}

const RoleBasedContext = createContext<RoleBasedContextType | undefined>(undefined);

export function RoleBasedProvider({ children }: { children: ReactNode }) {
  const { user, loading: userLoading } = useUser();
  
  // State management
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [availableRegions, setAvailableRegions] = useState<Region[]>([]);
  const [regionsLoading, setRegionsLoading] = useState(false);

  // Computed role properties with normalization
  const userRole = user?.role ? normalizeRole(user.role) : null;
  const rolePermissions = userRole ? getRolePermissions(userRole) : null;
  
  const isDataManager = userRole === 'Data Manager';
  const canAddEntities = rolePermissions?.canAddEntities || false;
  const companyName = user?.companyName || null;
  const companyId = user?.company_id || null;
  
  // Filtering logic
  const shouldFilterByRegion = rolePermissions?.needsRegionFiltering || false;
  const shouldFilterByCompany = rolePermissions?.canViewAllCompanyData || false;

  // Fetch user regions for non-Data Manager roles
  const fetchUserRegions = async () => {
    if (!user || isDataManager || userLoading) return;
    
    setRegionsLoading(true);
    try {
      // Fetch user's assigned regions
      const response = await fetch(`/api/proxy?endpoint=/users/${user.id}/regions`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user regions');
      }

      const data = await response.json();
      const regions = data.data || [];
      
      setAvailableRegions(regions);
      
      // Set first region as default if none selected
      if (regions.length > 0 && selectedRegions.length === 0) {
        setSelectedRegions([regions[0]]);
      }
    } catch (error) {
      console.error('Error fetching user regions:', error);
    } finally {
      setRegionsLoading(false);
    }
  };

  // Refresh regions function
  const refreshRegions = async () => {
    await fetchUserRegions();
  };

  // Effect to load regions when user changes or loads
  useEffect(() => {
    if (user && !userLoading) {
      fetchUserRegions();
    }
  }, [user, userLoading, isDataManager]);

  // Reset regions when user role changes to Data Manager
  useEffect(() => {
    if (isDataManager) {
      setSelectedRegions([]);
      setAvailableRegions([]);
    }
  }, [isDataManager]);

  const value: RoleBasedContextType = {
    // Role-based visibility
    userRole,
    isDataManager,
    canAddEntities,
    
    // Data filtering context
    selectedRegions,
    setSelectedRegions,
    availableRegions,
    setAvailableRegions,
    
    // Company context for Data Managers
    companyName,
    companyId,
    
    // Loading states
    regionsLoading,
    
    // Helper functions
    shouldFilterByRegion,
    shouldFilterByCompany,
    refreshRegions,
  };

  return (
    <RoleBasedContext.Provider value={value}>
      {children}
    </RoleBasedContext.Provider>
  );
}

export function useRoleBasedContext() {
  const context = useContext(RoleBasedContext);
  if (context === undefined) {
    throw new Error('useRoleBasedContext must be used within a RoleBasedProvider');
  }
  return context;
}

// Helper hooks for specific role checks
export function useDataManagerContext() {
  const context = useRoleBasedContext();
  return {
    isDataManager: context.isDataManager,
    canAddEntities: context.canAddEntities,
    companyName: context.companyName,
    companyId: context.companyId,
    shouldFilterByCompany: context.shouldFilterByCompany,
  };
}

export function useRegionContext() {
  const context = useRoleBasedContext();
  return {
    selectedRegions: context.selectedRegions,
    setSelectedRegions: context.setSelectedRegions,
    availableRegions: context.availableRegions,
    regionsLoading: context.regionsLoading,
    shouldFilterByRegion: context.shouldFilterByRegion,
    refreshRegions: context.refreshRegions,
  };
}