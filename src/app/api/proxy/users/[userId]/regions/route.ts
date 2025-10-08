import { NextRequest, NextResponse } from 'next/server';
import { Region } from '@/lib/api/admin';

// Mock regions data
const mockRegions: Region[] = [
  {
    id: 1,
    name: "West Coast",
    regionCode: "WC",
    companyId: 1,
    companyName: "Depot Direct Corp",
    countryId: 1,
    countryName: "United States",
    metadata: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    lastUpdatedBy: "system"
  },
  {
    id: 2,
    name: "East Coast",
    regionCode: "EC",
    companyId: 1,
    companyName: "Depot Direct Corp",
    countryId: 1,
    countryName: "United States",
    metadata: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    lastUpdatedBy: "system"
  },
  {
    id: 3,
    name: "Central",
    regionCode: "CEN",
    companyId: 1,
    companyName: "Depot Direct Corp",
    countryId: 1,
    countryName: "United States",
    metadata: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    lastUpdatedBy: "system"
  }
];

// Mock user-region assignments
const mockUserRegionAssignments: { [key: string]: number[] } = {
  'planner@example.com': [1, 2], // West Coast and East Coast
  'viewer@example.com': [3], // Central only
  'planner2@example.com': [1], // West Coast only
  'viewer2@example.com': [2, 3], // East Coast and Central
};

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    // For demo purposes, we'll use email patterns to determine regions
    // In a real implementation, this would query the actual user regions from the database
    
    // Mock user data lookup - in real implementation, you'd query by userId
    const userRegionIds = mockUserRegionAssignments['planner@example.com'] || [1]; // Default to West Coast
    
    const userRegions = mockRegions.filter(region => userRegionIds.includes(region.id));
    
    return NextResponse.json({
      success: true,
      data: userRegions,
      message: `Found ${userRegions.length} regions for user ${userId}`
    });
    
  } catch (error) {
    console.error('Error fetching user regions:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: 'Failed to fetch user regions'
      },
      { status: 500 }
    );
  }
}