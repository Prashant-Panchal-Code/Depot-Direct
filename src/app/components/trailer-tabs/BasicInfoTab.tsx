"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TrailerDetails } from "../TrailerDetailsPage";

interface BasicInfoTabProps {
  trailer: TrailerDetails;
  onSave: (data: Partial<TrailerDetails>) => void;
}

export default function BasicInfoTab({ trailer, onSave }: BasicInfoTabProps) {
  const [formData, setFormData] = useState({
    trailerName: trailer.trailerName,
    registrationNumber: trailer.registrationNumber,
    volumeCapacity: trailer.volumeCapacity,
    weightCapacity: trailer.weightCapacity,
    haulierCompany: trailer.haulierCompany,
    depotAssigned: trailer.depotAssigned,
    owner: trailer.owner,
    active: trailer.active,
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
    // Reset form data to original trailer values
    setFormData({
      trailerName: trailer.trailerName,
      registrationNumber: trailer.registrationNumber,
      volumeCapacity: trailer.volumeCapacity,
      weightCapacity: trailer.weightCapacity,
      haulierCompany: trailer.haulierCompany,
      depotAssigned: trailer.depotAssigned,
      owner: trailer.owner,
      active: trailer.active,
    });
  };

  const depots = [
    "Main Depot",
    "North Terminal", 
    "South Hub",
    "West Terminal",
    "East Distribution"
  ];

  const haulierCompanies = [
    "Express Logistics",
    "Fast Transport", 
    "Mega Freight",
    "Prime Movers",
    "Swift Carriers",
    "Reliable Haulage"
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="trailerName">Trailer Name</Label>
            <Input
              id="trailerName"
              value={formData.trailerName}
              onChange={(e) => handleInputChange('trailerName', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="trailerCode">Trailer Code</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-gray-900 font-medium">{trailer.trailerCode}</p>
              <p className="text-xs text-gray-500 mt-1">Trailer code cannot be modified</p>
            </div>
          </div>

          <div>
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value.toUpperCase())}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="volumeCapacity">Volume Capacity (L)</Label>
            <Input
              id="volumeCapacity"
              type="number"
              value={formData.volumeCapacity}
              onChange={(e) => handleInputChange('volumeCapacity', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="weightCapacity">Weight Capacity (kg)</Label>
            <Input
              id="weightCapacity"
              type="number"
              value={formData.weightCapacity}
              onChange={(e) => handleInputChange('weightCapacity', parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="numberOfCompartments">Number of Compartments</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-gray-900 font-medium">{trailer.compartments?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Calculated from compartments configuration</p>
            </div>
          </div>

          <div>
            <Label htmlFor="depotAssigned">Depot Assigned</Label>
            <Select
              value={formData.depotAssigned}
              onValueChange={(value) => handleInputChange('depotAssigned', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select depot" />
              </SelectTrigger>
              <SelectContent>
                {depots.map((depot) => (
                  <SelectItem key={depot} value={depot}>
                    {depot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
        </div>
      </div>

      {/* Footer Actions - Always Visible */}
      <div className="border-t border-gray-200 pt-4 mt-6 flex justify-end gap-3 flex-shrink-0 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
