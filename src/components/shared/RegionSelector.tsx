'use client';

import { useState, useRef, useEffect } from 'react';
import { useRegionContext } from '@/contexts/RoleBasedContext';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2, ChevronDown, Check } from "lucide-react";
import { Region } from '@/lib/api/admin';

export default function RegionSelector() {
  const {
    selectedRegions,
    setSelectedRegions,
    availableRegions,
    regionsLoading,
    shouldFilterByRegion,
  } = useRegionContext();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't render if user shouldn't see region filtering
  if (!shouldFilterByRegion) {
    return null;
  }

  // Loading state
  if (regionsLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-md">
        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        <span className="text-sm text-gray-600">Loading regions...</span>
      </div>
    );
  }

  // No regions available
  if (availableRegions.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-md">
        <MapPin className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">No regions assigned</span>
      </div>
    );
  }

  const handleRegionToggle = (region: Region) => {
    const isSelected = selectedRegions.some(r => r.id === region.id);
    
    if (isSelected) {
      // Don't allow deselecting all regions - must have at least one
      if (selectedRegions.length > 1) {
        setSelectedRegions(selectedRegions.filter(r => r.id !== region.id));
      }
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  const displayText = selectedRegions.length === 1 
    ? selectedRegions[0].name
    : `${selectedRegions.length} regions`;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[150px] justify-between"
        size="sm"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">
            {displayText}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-2 border-b border-gray-100">
            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              Select Regions ({selectedRegions.length}/{availableRegions.length})
            </span>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {availableRegions.map((region) => {
              const isSelected = selectedRegions.some(r => r.id === region.id);
              const isLastSelected = selectedRegions.length === 1 && isSelected;
              
              return (
                <div
                  key={region.id}
                  onClick={() => !isLastSelected && handleRegionToggle(region)}
                  className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 ${
                    isLastSelected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{region.name}</span>
                    {region.regionCode && (
                      <span className="text-xs text-gray-500">{region.regionCode}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <>
                        <Check className="w-4 h-4 text-blue-600" />
                        <Badge variant="secondary" className="text-xs">
                          Selected
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            
            {availableRegions.length === 0 && (
              <div className="p-3 text-center">
                <span className="text-sm text-gray-500">No regions available</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}