/**
 * Data filtering utilities for role-based access control
 */

import { Region } from '@/lib/api/admin';

export interface BaseEntityWithRegion {
  id: number;
  regionId: number;
  regionName: string;
}

export interface FilterOptions {
  shouldFilterByRegion: boolean;
  selectedRegions: Region[];
  companyId?: number | null;
  isDataManager: boolean;
}

/**
 * Filter entities based on user role and selected regions
 */
export function filterEntitiesByRole<T extends BaseEntityWithRegion>(
  allEntities: T[],
  options: FilterOptions
): T[] {
  const { shouldFilterByRegion, selectedRegions, companyId, isDataManager } = options;

  if (isDataManager) {
    // Data Managers see all data for their company
    // In a real implementation, this would filter by companyId
    return allEntities;
  }

  if (shouldFilterByRegion && selectedRegions.length > 0) {
    // Filter by selected regions for Planner/Viewer roles
    const selectedRegionIds = selectedRegions.map(r => r.id);
    return allEntities.filter(entity => selectedRegionIds.includes(entity.regionId));
  }

  // Default: return all entities
  return allEntities;
}

/**
 * Hook for consistent data filtering across components
 */
export function useEntityFiltering() {
  return {
    filterEntitiesByRole
  };
}

/**
 * Generate mock region assignments for entities
 * This simulates how entities would be distributed across regions
 */
export function assignMockRegions<T extends { id: number }>(
  entities: T[],
  regionAssignments: { [key: number]: { regionId: number; regionName: string } } = {
    1: { regionId: 1, regionName: "West Coast" },
    2: { regionId: 1, regionName: "West Coast" },
    3: { regionId: 1, regionName: "West Coast" },
    4: { regionId: 2, regionName: "East Coast" },
    5: { regionId: 2, regionName: "East Coast" },
    6: { regionId: 3, regionName: "Central" },
  }
): (T & { regionId: number; regionName: string })[] {
  return entities.map(entity => ({
    ...entity,
    regionId: regionAssignments[entity.id % 6 + 1]?.regionId || 1,
    regionName: regionAssignments[entity.id % 6 + 1]?.regionName || "West Coast"
  }));
}