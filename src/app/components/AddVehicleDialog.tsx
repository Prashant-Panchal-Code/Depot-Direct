"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusSquare } from "@phosphor-icons/react";

// Vehicle interface for type safety
export interface Vehicle {
  id: number;
  vehicleName: string;
  vehicleCode: string;
  truckId: number;
  trailerId: number;
  truckName: string;
  truckRegistration: string;
  trailerName: string;
  trailerRegistration: string;
  volumeCapacity: number;
  weightCapacity: number;
  numberOfTrailers: number;
  haulierCompany: string;
  baseLocation: string;
  active: boolean;
}

// Interface for new vehicles being created
export interface NewVehicle {
  vehicleName: string;
  vehicleCode: string;
  truckId: number;
  trailerId: number;
}

// Truck interface for selections
interface TruckOption {
  id: number;
  truckName: string;
  truckCode: string;
  registrationNumber: string;
  haulierCompany: string;
  active: boolean;
}

// Trailer interface for selections
interface TrailerOption {
  id: number;
  trailerName: string;
  trailerCode: string;
  registrationNumber: string;
  volumeCapacity: number;
  weightCapacity: number;
  haulierCompany: string;
  active: boolean;
}

interface AddVehicleDialogProps {
  trucks: TruckOption[];
  trailers: TrailerOption[];
  onSave: (vehicle: NewVehicle) => void;
}

export default function AddVehicleDialog({ trucks, trailers, onSave }: AddVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<NewVehicle>({
    vehicleName: '',
    vehicleCode: '',
    truckId: 0,
    trailerId: 0,
  });

  // Get active trucks and trailers only
  const activeTrucks = trucks.filter(truck => truck.active);
  
  // Get trailers filtered by selected truck's haulier company
  const getFilteredTrailers = () => {
    const selectedTruck = activeTrucks.find(truck => truck.id === formData.truckId);
    if (!selectedTruck) return [];
    
    return trailers.filter(trailer => 
      trailer.active && trailer.haulierCompany === selectedTruck.haulierCompany
    );
  };

  const handleInputChange = (field: keyof NewVehicle, value: string | number) => {
    // Ensure truckId and trailerId are always numbers
    const processedValue = (field === 'truckId' || field === 'trailerId') && typeof value === 'string' 
      ? parseInt(value) 
      : value;

    // Reset trailer when truck changes
    if (field === 'truckId') {
      const newTruckId = typeof processedValue === 'number' ? processedValue : parseInt(processedValue as string);
      setFormData(prev => ({
        ...prev,
        truckId: newTruckId,
        trailerId: 0 // Reset trailer selection
      }));
      
      // Auto-generate vehicle name when truck changes (only if vehicle name is empty)
      if (!formData.vehicleName) {
        updateVehicleName(newTruckId, 0);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: processedValue
      }));

      // Auto-generate vehicle name when trailer is selected (only if vehicle name is empty)
      if (field === 'trailerId' && !formData.vehicleName) {
        const newTrailerId = typeof processedValue === 'number' ? processedValue : parseInt(processedValue as string);
        updateVehicleName(formData.truckId, newTrailerId);
      }
    }
  };

  const updateVehicleName = (truckId: number, trailerId: number) => {
    const selectedTruck = activeTrucks.find(truck => truck.id === truckId);
    const selectedTrailer = trailers.find(trailer => trailer.id === trailerId);
    
    if (selectedTruck && selectedTrailer && !formData.vehicleName) {
      setFormData(prev => ({
        ...prev,
        vehicleName: `${selectedTruck.truckName} + ${selectedTrailer.trailerName}`
      }));
    }
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.vehicleCode || !formData.truckId || !formData.trailerId) {
      alert('Please fill in all required fields');
      return;
    }

    // Use auto-generated name if vehicle name is empty
    let vehicleName = formData.vehicleName;
    if (!vehicleName) {
      const selectedTruck = activeTrucks.find(truck => truck.id === formData.truckId);
      const selectedTrailer = getFilteredTrailers().find(trailer => trailer.id === formData.trailerId);
      if (selectedTruck && selectedTrailer) {
        vehicleName = `${selectedTruck.truckName} + ${selectedTrailer.trailerName}`;
      }
    }

    const vehicleData: NewVehicle = {
      ...formData,
      vehicleName: vehicleName || formData.vehicleName,
    };

    onSave(vehicleData);
    
    // Reset form and close dialog
    setFormData({
      vehicleName: '',
      vehicleCode: '',
      truckId: 0,
      trailerId: 0,
    });
    setOpen(false);
  };

  const selectedTruck = activeTrucks.find(truck => truck.id === formData.truckId);
  const filteredTrailers = getFilteredTrailers();
  const selectedTrailer = filteredTrailers.find(trailer => trailer.id === formData.trailerId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white flex items-center gap-2">
          <PlusSquare size={18} />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Vehicle</DialogTitle>
          <DialogDescription>
            Create a new vehicle by combining a truck (tractor) with a trailer. Select from available active units.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Vehicle Information - First Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vehicle Name</label>
              <Input
                placeholder="Enter vehicle name or leave empty for auto-generation"
                value={formData.vehicleName}
                onChange={(e) => handleInputChange('vehicleName', e.target.value)}
              />
              <p className="text-xs text-gray-500">Will auto-generate from truck + trailer if left empty</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vehicle Code *</label>
              <Input
                placeholder="e.g., VH001"
                value={formData.vehicleCode}
                onChange={(e) => handleInputChange('vehicleCode', e.target.value.toUpperCase())}
              />
            </div>
          </div>

          {/* Vehicle Selection - Second Row */}
          <div className="grid grid-cols-2 gap-4">

          {/* Truck Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Truck (Tractor) *</label>
            <Select
              value={formData.truckId === 0 ? "" : formData.truckId.toString()}
              onValueChange={(value) => handleInputChange('truckId', parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a truck for this vehicle combination" />
              </SelectTrigger>
              <SelectContent>
                {activeTrucks.map((truck) => (
                  <SelectItem key={truck.id} value={truck.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{truck.truckName} ({truck.truckCode})</span>
                      <span className="text-sm text-gray-500">
                        {truck.registrationNumber} - {truck.haulierCompany}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeTrucks.length === 0 && (
              <p className="text-sm text-red-500">No active trucks available. Please add trucks first.</p>
            )}
          </div>

          {/* Trailer Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Trailer *</label>
            <Select
              value={formData.trailerId === 0 ? "" : formData.trailerId.toString()}
              onValueChange={(value) => handleInputChange('trailerId', parseInt(value))}
              disabled={!formData.truckId || filteredTrailers.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  !formData.truckId 
                    ? "First select a truck to see available trailers"
                    : filteredTrailers.length === 0 
                    ? "No matching trailers for selected haulier"
                    : "Choose a trailer for this vehicle combination"
                } />
              </SelectTrigger>
              <SelectContent>
                {filteredTrailers.map((trailer) => (
                  <SelectItem key={trailer.id} value={trailer.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{trailer.trailerName} ({trailer.trailerCode})</span>
                      <span className="text-sm text-gray-500">
                        {trailer.registrationNumber} - {trailer.volumeCapacity.toLocaleString()}L / {trailer.weightCapacity.toLocaleString()}kg
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          
          </div>
          </div>

          {/* Selected Combination Summary */}
          {selectedTruck && selectedTrailer && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Selected Combination</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-blue-800">Truck:</p>
                  <p>{selectedTruck.truckName} ({selectedTruck.registrationNumber})</p>
                  <p className="text-blue-600">{selectedTruck.haulierCompany}</p>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Trailer:</p>
                  <p>{selectedTrailer.trailerName} ({selectedTrailer.registrationNumber})</p>
                  <p className="text-blue-600">
                    {selectedTrailer.volumeCapacity.toLocaleString()}L / {selectedTrailer.weightCapacity.toLocaleString()}kg
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-primary-custom hover:bg-primary-custom/90"
            disabled={activeTrucks.length === 0 || filteredTrailers.length === 0}
          >
            Create Vehicle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
