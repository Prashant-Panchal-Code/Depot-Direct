"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "@phosphor-icons/react";

import { useState } from "react";
import { ParkingDetails } from "../ParkingDetailsPage";

interface BasicInfoTabProps {
  parking: ParkingDetails;
  onSave: () => void;
}

export default function BasicInfoTab({ parking, onSave }: BasicInfoTabProps) {
  // Form state for all editable fields
  const [formData, setFormData] = useState({
    latitude: parking.latitude || 0,
    longitude: parking.longitude || 0,
    street: parking.street || "",
    postalCode: parking.postalCode || "",
    town: parking.town || "",
    active: parking.active !== undefined ? parking.active : true,
    managerName: parking.managerName || "",
    managerPhone: parking.managerPhone || "",
    managerEmail: parking.managerEmail || "",
    emergencyContact: parking.emergencyContact || "",
    parkingSpaces: parking.parkingSpaces || 0,
  });

  const handleInputChange = (field: string, value: string | boolean | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancel = () => {
    // Reset form data to original parking values
    setFormData({
      latitude: parking.latitude || 0,
      longitude: parking.longitude || 0,
      street: parking.street || "",
      postalCode: parking.postalCode || "",
      town: parking.town || "",
      active: parking.active !== undefined ? parking.active : true,
      managerName: parking.managerName || "",
      managerPhone: parking.managerPhone || "",
      managerEmail: parking.managerEmail || "",
      emergencyContact: parking.emergencyContact || "",
      parkingSpaces: parking.parkingSpaces || 0,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-4">

          {/* Top Section - Parking Information and Contact Information */}
          <div className="grid grid-cols-2 gap-6">

            {/* Left Column - Basic Parking Information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Parking Information</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${formData.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {formData.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="e.g. 40.7128"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="e.g. -74.0060"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                  Street Address
                </Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="town" className="text-sm font-medium text-gray-700">
                    Town/City
                  </Label>
                  <Input
                    id="town"
                    value={formData.town}
                    onChange={(e) => handleInputChange('town', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="parkingSpaces" className="text-sm font-medium text-gray-700">
                    Total Parking Spaces
                  </Label>
                  <Input
                    id="parkingSpaces"
                    type="number"
                    value={formData.parkingSpaces}
                    onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                    placeholder="e.g. 150"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange('active', !!checked)}
                />
                <Label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Parking Active
                </Label>
              </div>
            </div>

            {/* Right Column - Contact Information */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

              <div>
                <Label htmlFor="managerName" className="text-sm font-medium text-gray-700">
                  Facility Manager
                </Label>
                <Input
                  id="managerName"
                  value={formData.managerName}
                  onChange={(e) => handleInputChange('managerName', e.target.value)}
                  placeholder="Enter manager name"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="managerPhone" className="text-sm font-medium text-gray-700">
                    Manager Phone
                  </Label>
                  <Input
                    id="managerPhone"
                    value={formData.managerPhone}
                    onChange={(e) => handleInputChange('managerPhone', e.target.value)}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="managerEmail" className="text-sm font-medium text-gray-700">
                    Manager Email
                  </Label>
                  <Input
                    id="managerEmail"
                    type="email"
                    value={formData.managerEmail}
                    onChange={(e) => handleInputChange('managerEmail', e.target.value)}
                    placeholder="Enter email address"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                  Emergency Contact
                </Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Enter emergency contact"
                  className="mt-1"
                />
              </div>

              {/* Map Placeholder */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Location Map
                </Label>
                <div className="bg-blue-100 border border-blue-200 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 text-blue-600" />
                    <p className="text-gray-600 text-sm">Interactive Map</p>
                    <p className="text-xs text-gray-500">
                      {formData.latitude && formData.longitude
                        ? `${formData.latitude}, ${formData.longitude}`
                        : 'No coordinates set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions - Fixed */}
      <div className="border-t bg-white p-4">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-primary-custom hover:bg-primary-custom/90">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
