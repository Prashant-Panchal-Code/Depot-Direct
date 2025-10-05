'use client';

// Vehicle Row Renderer Component
// Optional helper to render resource cell content

import React from 'react';
import { Vehicle } from '@/data/mock-scheduler';
import { getTrailerByVehicleId } from '@/data/mock-scheduler';

interface VehicleRowRendererProps {
  vehicle: Vehicle;
  utilization: number;
  hasConflicts: boolean;
}

export default function VehicleRowRenderer({
  vehicle,
  utilization,
  hasConflicts
}: VehicleRowRendererProps) {
  const trailer = getTrailerByVehicleId(vehicle.id);

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    offline: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    active: '✓',
    maintenance: '⚠',
    offline: '✗'
  };

  return (
    <div className="flex items-center justify-between p-2 h-full">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <div className="font-semibold text-sm text-gray-900">{vehicle.name}</div>
          {hasConflicts && (
            <span className="text-red-500 text-xs" title="Schedule conflicts">
              ⚠
            </span>
          )}
        </div>
        
        <div className="text-xs text-gray-500">{vehicle.driver || 'No driver'}</div>
        
        {trailer && (
          <div className="text-xs text-gray-400">{trailer.registration}</div>
        )}
        
        <div className="flex items-center space-x-2 mt-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[vehicle.status]}`}>
            <span className="mr-1">{statusIcons[vehicle.status]}</span>
            {vehicle.status}
          </span>
          
          <div className="flex items-center space-x-1">
            <div className="w-8 bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  utilization > 90 ? 'bg-red-500' :
                  utilization > 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(utilization, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{utilization}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}