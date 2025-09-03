"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VehicleDetails } from "../VehicleDetailsPage";
import { TrailerCompartment } from "../TrailerDetailsPage";
import { Trash, Plus, ArrowsDownUp, Check, Package } from "@phosphor-icons/react";

// Base trailer interface for available trailers
interface Trailer {
  id: number;
  trailerName: string;
  trailerCode: string;
  registrationNumber: string;
  volumeCapacity: number;
  weightCapacity: number;
  active: boolean;
  compartments: TrailerCompartment[]; // Available trailers also have compartment data
}

// Trailer assignment interface for vehicle trailers
interface VehicleTrailer {
  id: number;
  trailerId: number;
  trailerName: string;
  trailerCode: string;
  registrationNumber: string;
  volumeCapacity: number;
  weightCapacity: number;
  trailerSequence: number; // Sequence/order of the trailer (1st, 2nd, 3rd, etc.)
  isPrimary: boolean; // First trailer attached during vehicle creation
  assignedDate: string;
  compartments: TrailerCompartment[]; // Compartment details for this trailer
}

interface TrailersTabProps {
  vehicle: VehicleDetails;
  onSave: (data: Partial<VehicleDetails>) => void;
}

export default function TrailersTab({ vehicle, onSave }: TrailersTabProps) {
  // Mock data for available trailers (this would come from the parent component or API)
  const [availableTrailers] = useState<Trailer[]>([
    { 
      id: 1, 
      trailerName: "Standard Tank 1", 
      trailerCode: "TRL001", 
      registrationNumber: "XYZ-111", 
      volumeCapacity: 35000, 
      weightCapacity: 28000, 
      active: true,
      compartments: [
        { id: 1, compartmentNo: 1, capacity: 17500, minVolume: 3000, maxVolume: 17500, allowedProducts: ["Diesel", "Heating Oil"], partialLoadAllowed: true, mustUse: false },
        { id: 2, compartmentNo: 2, capacity: 17500, minVolume: 3000, maxVolume: 17500, allowedProducts: ["Petrol Unleaded"], partialLoadAllowed: true, mustUse: false },
      ]
    },
    { 
      id: 2, 
      trailerName: "Heavy Duty 2", 
      trailerCode: "TRL002", 
      registrationNumber: "XYZ-222", 
      volumeCapacity: 40000, 
      weightCapacity: 32000, 
      active: true,
      compartments: [
        { id: 4, compartmentNo: 1, capacity: 20000, minVolume: 5000, maxVolume: 20000, allowedProducts: ["Diesel"], partialLoadAllowed: true, mustUse: false },
        { id: 5, compartmentNo: 2, capacity: 20000, minVolume: 5000, maxVolume: 20000, allowedProducts: ["Diesel", "Heating Oil"], partialLoadAllowed: true, mustUse: false },
      ]
    },
    { 
      id: 3, 
      trailerName: "Multi-Product 3", 
      trailerCode: "TRL003", 
      registrationNumber: "XYZ-333", 
      volumeCapacity: 38000, 
      weightCapacity: 30000, 
      active: true,
      compartments: [
        { id: 6, compartmentNo: 1, capacity: 12000, minVolume: 2000, maxVolume: 12000, allowedProducts: ["Diesel"], partialLoadAllowed: true, mustUse: false },
        { id: 7, compartmentNo: 2, capacity: 13000, minVolume: 2000, maxVolume: 13000, allowedProducts: ["Petrol Unleaded", "Petrol Super"], partialLoadAllowed: true, mustUse: false },
        { id: 8, compartmentNo: 3, capacity: 13000, minVolume: 2000, maxVolume: 13000, allowedProducts: ["Heating Oil", "Kerosene"], partialLoadAllowed: false, mustUse: true },
      ]
    },
    { 
      id: 4, 
      trailerName: "Standard Tank 4", 
      trailerCode: "TRL004", 
      registrationNumber: "XYZ-444", 
      volumeCapacity: 32000, 
      weightCapacity: 26000, 
      active: true,
      compartments: [
        { id: 9, compartmentNo: 1, capacity: 16000, minVolume: 3000, maxVolume: 16000, allowedProducts: ["Diesel"], partialLoadAllowed: true, mustUse: false },
        { id: 10, compartmentNo: 2, capacity: 16000, minVolume: 3000, maxVolume: 16000, allowedProducts: ["Diesel"], partialLoadAllowed: true, mustUse: false },
      ]
    },
    { 
      id: 5, 
      trailerName: "Standard Tank 5", 
      trailerCode: "TRL005", 
      registrationNumber: "XYZ-555", 
      volumeCapacity: 36000, 
      weightCapacity: 29000, 
      active: true,
      compartments: [
        { id: 11, compartmentNo: 1, capacity: 18000, minVolume: 4000, maxVolume: 18000, allowedProducts: ["Petrol Unleaded"], partialLoadAllowed: true, mustUse: false },
        { id: 12, compartmentNo: 2, capacity: 18000, minVolume: 4000, maxVolume: 18000, allowedProducts: ["Petrol Super"], partialLoadAllowed: true, mustUse: false },
      ]
    },
  ]);

  // Use assigned trailers from vehicle props or fallback to empty array
  const [assignedTrailers, setAssignedTrailers] = useState<VehicleTrailer[]>(() => {
    return vehicle.assignedTrailers?.map(trailer => ({
      ...trailer,
      compartments: trailer.compartments || [],
    })) || [];
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTrailerId, setSelectedTrailerId] = useState<number | null>(null);
  
  // State for swapping trailers
  const [isSwapMode, setIsSwapMode] = useState(false);
  const [selectedForSwap, setSelectedForSwap] = useState<number[]>([]);
  
  // State for selected trailer to view compartments
  const [selectedTrailer, setSelectedTrailer] = useState<number | null>(null);

  // Sync with parent component only on initial mount
  useEffect(() => {
    // This runs only once on initial mount
    console.log("Initial trailers sync to parent:", assignedTrailers.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array is intentional - we only want this on mount

  // Auto-select the first trailer when component mounts or trailers change
  useEffect(() => {
    if (assignedTrailers.length > 0 && selectedTrailer === null) {
      const firstTrailer = assignedTrailers.sort((a, b) => a.trailerSequence - b.trailerSequence)[0];
      setSelectedTrailer(firstTrailer.id);
    }
  }, [assignedTrailers, selectedTrailer]);

  const handleAddTrailer = () => {
    if (selectedTrailerId) {
      const selectedTrailer = availableTrailers.find(t => t.id === selectedTrailerId);
      if (selectedTrailer && !assignedTrailers.find(at => at.trailerId === selectedTrailerId)) {
        const newAssignment: VehicleTrailer = {
          id: Date.now() + Math.random(), // Generate unique ID using timestamp and random number
          trailerId: selectedTrailer.id,
          trailerName: selectedTrailer.trailerName,
          trailerCode: selectedTrailer.trailerCode,
          registrationNumber: selectedTrailer.registrationNumber,
          volumeCapacity: selectedTrailer.volumeCapacity,
          weightCapacity: selectedTrailer.weightCapacity,
          trailerSequence: assignedTrailers.length + 1,
          isPrimary: assignedTrailers.length === 0, // First trailer is primary
          assignedDate: new Date().toISOString().split('T')[0],
          compartments: selectedTrailer.compartments // Copy compartment data
        };

        const updatedTrailers = [...assignedTrailers, newAssignment];
        setAssignedTrailers(updatedTrailers);
        setSelectedTrailerId(null);
        setIsAddDialogOpen(false);
        
        // If this is the first trailer, select it automatically
        if (assignedTrailers.length === 0) {
          setSelectedTrailer(newAssignment.id);
        }
        
        // Update vehicle data
        onSave({
          assignedTrailers: updatedTrailers
        });
      }
    }
  };

  const handleRemoveTrailer = (trailerId: number) => {
    const trailerToRemove = assignedTrailers.find(t => t.id === trailerId);
    if (!trailerToRemove) return;

    const updatedTrailers = assignedTrailers.filter(t => t.id !== trailerId);
    
    // If removing the primary trailer and there are other trailers, make the first remaining trailer primary
    if (trailerToRemove.isPrimary && updatedTrailers.length > 0) {
      updatedTrailers[0].isPrimary = true;
    }

    // Reassign sequences to maintain order
    const resequencedTrailers = updatedTrailers
      .sort((a, b) => a.trailerSequence - b.trailerSequence)
      .map((trailer, index) => ({
        ...trailer,
        trailerSequence: index + 1
      }));

    setAssignedTrailers(resequencedTrailers);
    
    // Clear selected trailer if it was the one removed, then select first remaining
    if (selectedTrailer === trailerId) {
      if (resequencedTrailers.length > 0) {
        setSelectedTrailer(resequencedTrailers[0].id);
      } else {
        setSelectedTrailer(null);
      }
    }
    
    // Update vehicle data once
    onSave({
      assignedTrailers: resequencedTrailers
    });
  };

  const handleTrailerSelect = (trailerId: number) => {
    if (isSwapMode) {
      if (selectedForSwap.includes(trailerId)) {
        setSelectedForSwap(prev => prev.filter(id => id !== trailerId));
      } else if (selectedForSwap.length < 2) {
        setSelectedForSwap(prev => [...prev, trailerId]);
      }
    }
  };

  const handleSwapTrailers = () => {
    if (selectedForSwap.length === 2) {
      const [id1, id2] = selectedForSwap;
      const trailer1 = assignedTrailers.find(t => t.id === id1);
      const trailer2 = assignedTrailers.find(t => t.id === id2);
      
      if (trailer1 && trailer2) {
        const sequence1 = trailer1.trailerSequence;
        const sequence2 = trailer2.trailerSequence;
        
        const updatedTrailers = assignedTrailers.map(trailer => {
          if (trailer.id === id1) {
            return { ...trailer, trailerSequence: sequence2 };
          }
          if (trailer.id === id2) {
            return { ...trailer, trailerSequence: sequence1 };
          }
          return trailer;
        });
        
        // Update local state and UI
        setAssignedTrailers(updatedTrailers);
        setSelectedForSwap([]);
        setIsSwapMode(false);
        
        // Update vehicle data once with final result
        onSave({
          assignedTrailers: updatedTrailers
        });
      }
    }
  };

  const cancelSwapMode = () => {
    setIsSwapMode(false);
    setSelectedForSwap([]);
  };

  const getAvailableTrailersForSelection = () => {
    return availableTrailers.filter(trailer => 
      trailer.active && 
      !assignedTrailers.find(at => at.trailerId === trailer.id)
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Trailer Assignments</h2>
              <p className="text-sm text-gray-600 mt-1">
                {isSwapMode 
                  ? `Select two trailers to swap their positions${selectedForSwap.length > 0 ? ` (${selectedForSwap.length}/2 selected)` : ''}` 
                  : "Manage trailers assigned to this vehicle. Click on a trailer to view its compartment details."
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Swap Mode Controls */}
              {isSwapMode ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelSwapMode}
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSwapTrailers}
                    disabled={selectedForSwap.length !== 2}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Swap
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSwapMode(true)}
                    disabled={assignedTrailers.length < 2}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <ArrowsDownUp size={16} className="mr-2" />
                    Reorder
                  </Button>

                  {/* Add Trailer Dialog */}
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus size={16} className="mr-2" />
                        Add Trailer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Trailer to Vehicle</DialogTitle>
                        <DialogDescription>
                          Select a trailer to assign to this vehicle. Only active, unassigned trailers are shown.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="trailer-select">Available Trailers</Label>
                          <Select onValueChange={(value) => setSelectedTrailerId(parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a trailer" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableTrailersForSelection().map(trailer => (
                                <SelectItem key={trailer.id} value={trailer.id.toString()}>
                                  {trailer.trailerName} ({trailer.trailerCode}) - {trailer.volumeCapacity.toLocaleString()}L
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddTrailer} disabled={!selectedTrailerId}>
                            Add Trailer
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex h-full">
          {/* Left Column - Trailers List */}
          <div className="w-1/2 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Assigned Trailers ({assignedTrailers.length})
              </h3>
              
              {/* Vehicle Capacity Summary - Compact Cards */}
              <div className="flex gap-2">
                <div className="bg-blue-50 rounded-lg border border-blue-200 px-3 py-1.5 min-w-[110px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-blue-700">Total Volume:</span>
                    <span className="text-xs font-semibold text-blue-900">
                      {assignedTrailers.reduce((sum, t) => sum + t.volumeCapacity, 0).toLocaleString()}L
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg border border-blue-200 px-3 py-1.5 min-w-[110px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-blue-700">Total Weight:</span>
                    <span className="text-xs font-semibold text-blue-900">
                      {assignedTrailers.reduce((sum, t) => sum + t.weightCapacity, 0).toLocaleString()}kg
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg border border-blue-200 px-3 py-1.5 min-w-[130px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-blue-700">Total Compartments:</span>
                    <span className="text-xs font-semibold text-blue-900">
                      {assignedTrailers.reduce((sum, t) => sum + (t.compartments?.length || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {assignedTrailers
                .sort((a, b) => a.trailerSequence - b.trailerSequence)
                .map((trailer) => {
                const isSelected = selectedForSwap.includes(trailer.id);
                const isSelectable = isSwapMode && selectedForSwap.length < 2;
                const isActive = selectedTrailer === trailer.id;
                
                return (
                  <div 
                    key={trailer.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      isSwapMode 
                        ? isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : isSelectable || selectedForSwap.includes(trailer.id)
                            ? 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
                            : 'border-gray-200 bg-gray-50 opacity-50'
                        : isActive
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => {
                      if (isSwapMode) {
                        handleTrailerSelect(trailer.id);
                      } else {
                        setSelectedTrailer(selectedTrailer === trailer.id ? null : trailer.id);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      {/* Selection indicator for swap mode */}
                      {isSwapMode && (
                        <div className="flex-shrink-0 mr-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-500 text-white' 
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <Check size={14} />}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">#{trailer.trailerSequence}</span>
                            <span className="font-semibold text-gray-900">{trailer.trailerName}</span>
                            {trailer.isPrimary && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                          
                          {/* Show delete button for all trailers except when there's only one trailer left */}
                          {assignedTrailers.length > 1 && !isSwapMode && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTrailer(trailer.id);
                              }}
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                              title={trailer.isPrimary ? "Remove primary trailer (next trailer will become primary)" : "Remove trailer"}
                            >
                              <Trash size={14} />
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>{trailer.trailerCode} | {trailer.registrationNumber}</div>
                          <div>{trailer.volumeCapacity.toLocaleString()}L / {trailer.weightCapacity.toLocaleString()}kg</div>
                          <div className="flex justify-between">
                            <span>Assigned: {trailer.assignedDate}</span>
                            <span>{trailer.compartments?.length || 0} compartments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Compartment Details */}
          <div className="w-1/2 p-6 overflow-y-auto bg-gray-50">
            {selectedTrailer ? (
              (() => {
                const trailer = assignedTrailers.find(t => t.id === selectedTrailer);
                if (!trailer) return null;
                
                return (
                  <div>
                    <div className="mb-3">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Compartment Details
                      </h3>
                      <p className="text-sm text-gray-600">
                        {trailer.trailerName} - {trailer.compartments?.length || 0} compartments
                      </p>
                    </div>
                    
                    {trailer.compartments && trailer.compartments.length > 0 ? (
                      <div className="space-y-2">
                        {trailer.compartments.map((compartment) => (
                          <div key={compartment.id} className="bg-white rounded-lg border border-gray-200 p-3">
                            {/* First div - Compartment header with icon, name, capacity and status badges */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Package size={12} className="text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-900 text-sm">
                                  Compartment {compartment.compartmentNo}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {compartment.capacity.toLocaleString()}L
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {compartment.partialLoadAllowed && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                    Partial OK
                                  </span>
                                )}
                                {compartment.mustUse && (
                                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                                    Must Use
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Second div - Volume range and products all inline */}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">
                                Range: {compartment.minVolume.toLocaleString()}L - {compartment.maxVolume.toLocaleString()}L
                              </span>
                              <div className="flex items-center gap-1">
                                {compartment.allowedProducts.slice(0, 3).map((product, productIndex) => (
                                  <span 
                                    key={productIndex} 
                                    className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                  >
                                    {product}
                                  </span>
                                ))}
                                {compartment.allowedProducts.length > 3 && (
                                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                    +{compartment.allowedProducts.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Package size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No compartment data available</p>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Package size={48} className="mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Trailer</h3>
                  <p className="text-gray-500 text-sm">
                    Click on a trailer from the left to view its compartment details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
