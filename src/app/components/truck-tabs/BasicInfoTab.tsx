"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TruckDetails } from "../TruckDetailsPage";

interface BasicInfoTabProps {
  truck: TruckDetails;
  onSave: (data: Partial<TruckDetails>) => void;
}

export default function BasicInfoTab({ truck, onSave }: BasicInfoTabProps) {
  const [formData, setFormData] = useState({
    truckName: truck.truckName,
    licensePlate: truck.licensePlate,
    capacityKL: truck.capacityKL,
    haulierCompany: truck.haulierCompany,
    parkingAssigned: truck.parkingAssigned,
    owner: truck.owner,
    active: truck.active,
    pumpAvailable: truck.pumpAvailable,
  });

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
    // Reset form data to original truck values
    setFormData({
      truckName: truck.truckName,
      licensePlate: truck.licensePlate,
      capacityKL: truck.capacityKL,
      haulierCompany: truck.haulierCompany,
      parkingAssigned: truck.parkingAssigned,
      owner: truck.owner,
      active: truck.active,
      pumpAvailable: truck.pumpAvailable,
    });
  };

  const haulierCompanies = [
    "Express Logistics",
    "Fast Transport", 
    "Mega Freight",
    "Prime Movers",
    "Swift Carriers",
    "Reliable Haulage"
  ];

  const parkingAreas = [
    "Parking Zone A",
    "Parking Zone B", 
    "Parking Zone C",
    "Main Parking",
    "North Parking",
    "South Parking",
    "VIP Parking"
  ];

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
              <Label htmlFor="truckName">Truck Name</Label>
              <Input
                id="truckName"
                value={formData.truckName}
                onChange={(e) => handleInputChange('truckName', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="truckCode">Tractor Code</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-900 font-medium">{truck.truckCode}</p>
                <p className="text-xs text-gray-500 mt-1">Tractor code cannot be modified</p>
              </div>
            </div>

            <div>
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                className="mt-1"
                placeholder="ABC-123"
              />
            </div>

            <div>
              <Label htmlFor="capacityKL">Capacity (KL)</Label>
              <Input
                id="capacityKL"
                type="number"
                value={formData.capacityKL}
                onChange={(e) => handleInputChange('capacityKL', parseFloat(e.target.value) || 0)}
                className="mt-1"
                step="0.1"
                min="0"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="haulierCompany">Haulier Company</Label>
              <Select
                value={formData.haulierCompany}
                onValueChange={(value) => handleInputChange('haulierCompany', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select haulier" />
                </SelectTrigger>
                <SelectContent>
                  {haulierCompanies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="parkingAssigned">Parking Assigned</Label>
              <Select
                value={formData.parkingAssigned}
                onValueChange={(value) => handleInputChange('parkingAssigned', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select parking" />
                </SelectTrigger>
                <SelectContent>
                  {parkingAreas.map((parking) => (
                    <SelectItem key={parking} value={parking}>
                      {parking}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="owner">Owner</Label>
              <Select
                value={formData.owner}
                onValueChange={(value: "Own" | "Third Party") => handleInputChange('owner', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select owner type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Own">Own</SelectItem>
                  <SelectItem value="Third Party">Third Party</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.active ? "Active" : "Inactive"}
                onValueChange={(value) => handleInputChange('active', value === "Active")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center space-x-2 mt-1">
                <Checkbox
                  id="pumpAvailable"
                  checked={formData.pumpAvailable}
                  onCheckedChange={(checked) => handleInputChange('pumpAvailable', checked as boolean)}
                />
                <Label htmlFor="pumpAvailable" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Pump Available
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions - Always Visible */}
      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-end gap-2 flex-shrink-0 bg-gray-50">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
