"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { VehicleDetails } from "../VehicleDetailsPage";

interface BasicInfoTabProps {
  vehicle: VehicleDetails;
  onSave: (data: Partial<VehicleDetails>) => void;
}

export default function BasicInfoTab({ vehicle, onSave }: BasicInfoTabProps) {
  const [formData, setFormData] = useState({
    vehicleName: vehicle.vehicleName,
    active: vehicle.active,
  });

  // Log when rendered to help debug
  useEffect(() => {
    console.log("BasicInfoTab rendered with trailers:", vehicle.assignedTrailers?.length);
  }, [vehicle]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    // Reset form data to original vehicle values
    setFormData({
      vehicleName: vehicle.vehicleName,
      active: vehicle.active,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="vehicleName">Vehicle Name</Label>
              <Input
                id="vehicleName"
                value={formData.vehicleName}
                onChange={(e) => handleInputChange('vehicleName', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="vehicleCode">Vehicle Code</Label>
              <Input
                id="vehicleCode"
                value={vehicle.vehicleCode}
                disabled
                className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                title="Vehicle code is not editable"
              />
            </div>

            <div>
              <Label htmlFor="truckName">Truck (Tractor)</Label>
              <Input
                id="truckName"
                value={vehicle.truckName}
                disabled
                className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                title="Truck details are not editable"
              />
            </div>

            <div>
              <Label htmlFor="truckRegistration">Truck Registration</Label>
              <Input
                id="truckRegistration"
                value={vehicle.truckRegistration}
                disabled
                className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                title="Truck details are not editable"
              />
            </div>

            {/* Assigned Trailers Section */}
            <div>
              <Label>Assigned Trailers</Label>
              <div className="mt-2 space-y-2">
                {vehicle.assignedTrailers && vehicle.assignedTrailers.length > 0 ? (
                  vehicle.assignedTrailers
                    .sort((a, b) => a.trailerSequence - b.trailerSequence)
                    .map((trailer) => (
                      <div key={trailer.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <div>
                          <div className="font-medium text-gray-900">
                            {trailer.trailerName} ({trailer.trailerCode})
                          </div>
                          <div className="text-sm text-gray-600">
                            Sequence: {trailer.trailerSequence} | {trailer.isPrimary ? 'Primary' : 'Secondary'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {trailer.volumeCapacity.toLocaleString()}L / {trailer.weightCapacity.toLocaleString()}kg
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg border text-gray-500 text-sm">
                    No trailers assigned to this vehicle
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="volumeCapacity">Total Volume Capacity (L)</Label>
              <Input
                id="volumeCapacity"
                type="number"
                value={vehicle.assignedTrailers?.reduce((sum, trailer) => sum + trailer.volumeCapacity, 0) || vehicle.volumeCapacity || 0}
                disabled
                className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                title="Volume capacity is calculated from all assigned trailers"
              />
            </div>

            <div>
              <Label htmlFor="weightCapacity">Total Weight Capacity (kg)</Label>
              <Input
                id="weightCapacity"
                type="number"
                value={vehicle.assignedTrailers?.reduce((sum, trailer) => sum + trailer.weightCapacity, 0) || vehicle.weightCapacity || 0}
                disabled
                className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                title="Weight capacity is calculated from all assigned trailers"
              />
            </div>

            <div>
              <Label htmlFor="haulierCompany">Haulier Company</Label>
              <Input
                id="haulierCompany"
                value={vehicle.haulierCompany}
                disabled
                className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                title="Haulier company comes from tractor and is not editable"
              />
            </div>

            <div>
              <Label htmlFor="baseLocation">Parking Assigned (from Tractor)</Label>
              <Input
                id="baseLocation"
                value={vehicle.baseLocation}
                disabled
                className="mt-1 bg-gray-50 text-gray-500 cursor-not-allowed"
                title="Parking assigned comes from the tractor and is not editable"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange('active', checked as boolean)}
              />
              <Label htmlFor="active" className="text-sm font-medium">
                Active Vehicle
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 flex justify-end gap-3 pt-4 bg-gray-50 px-6 py-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-primary-custom hover:bg-primary-custom/90 text-white"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
