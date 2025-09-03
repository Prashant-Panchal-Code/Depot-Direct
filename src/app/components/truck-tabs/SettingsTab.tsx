"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Gear, Warning, Info } from "@phosphor-icons/react";

interface SettingsTabProps {
  truck: TruckDetails;
  onSave: (data: Partial<TruckDetails>) => void;
}

export default function SettingsTab({ truck, onSave }: SettingsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    active: truck.active,
    owner: truck.owner,
    haulierCompany: truck.haulierCompany,
    parkingAssigned: truck.parkingAssigned,
    pumpAvailable: truck.pumpAvailable,
  });

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      active: truck.active,
      owner: truck.owner,
      haulierCompany: truck.haulierCompany,
      parkingAssigned: truck.parkingAssigned,
      pumpAvailable: truck.pumpAvailable,
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    "Main Parking",
    "North Parking",
    "South Parking",
    "Maintenance Bay",
    "Loading Dock"
  ];

  if (!isEditing) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Truck Settings</h2>
            <Button onClick={() => setIsEditing(true)} className="bg-primary-custom hover:bg-primary-custom/90 text-white">
              Edit Settings
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Gear size={20} className="text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Operational Status</h3>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  formData.active 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {formData.active ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Owner</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-900">{formData.owner}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Haulier Company</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-900">{formData.haulierCompany}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Parking Assigned</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-900">{formData.parkingAssigned}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Info size={20} className="text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Equipment</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    formData.pumpAvailable ? 'bg-primary-custom border-primary-custom' : 'border-gray-300'
                  }`}>
                    {formData.pumpAvailable && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-gray-900 text-sm">Pump Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Warning size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Important Settings Information</h4>
                <p className="text-sm text-yellow-700">
                  Changes to these settings may affect truck scheduling, assignments, and operational workflows. 
                  Please ensure all changes are coordinated with the operations team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Truck Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="status">Operational Status</Label>
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
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
              <Label className="text-sm font-medium text-gray-700">Equipment</Label>
              <div className="mt-3">
                <div className="flex items-center space-x-2">
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

        {/* Warning Section */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Warning size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Important Settings Information</h4>
              <p className="text-sm text-yellow-700">
                Changes to these settings may affect truck scheduling, assignments, and operational workflows. 
                Please ensure all changes are coordinated with the operations team.
              </p>
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
          Save Changes
        </Button>
      </div>
    </div>
  );
}
