"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "@phosphor-icons/react";
import { DepotDetails } from "../DepotDetailsPage";
import { useState } from "react";

interface BasicInfoTabProps {
  depot: DepotDetails;
  onSave: () => void;
}

export default function BasicInfoTab({ depot, onSave }: BasicInfoTabProps) {
  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  // Time options for the select dropdowns
  const timeOptions = [
    "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM",
    "03:00 AM", "03:30 AM", "04:00 AM", "04:30 AM", "05:00 AM", "05:30 AM",
    "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM",
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
    "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
  ];

  const mockOperatingHours = {
    Monday: { open: "06:00 AM", close: "10:00 PM", closed: false },
    Tuesday: { open: "06:00 AM", close: "10:00 PM", closed: false },
    Wednesday: { open: "06:00 AM", close: "10:00 PM", closed: false },
    Thursday: { open: "06:00 AM", close: "10:00 PM", closed: false },
    Friday: { open: "06:00 AM", close: "10:00 PM", closed: false },
    Saturday: { open: "08:00 AM", close: "08:00 PM", closed: false },
    Sunday: { open: "08:00 AM", close: "08:00 PM", closed: false }
  };

  // Form state for all editable fields
  const [formData, setFormData] = useState({
    latitude: depot.latitude || "",
    longitude: depot.longitude || "",
    street: depot.street,
    postalCode: depot.postalCode || "",
    town: depot.town || "",
    active: depot.active !== undefined ? depot.active : true,
    priority: depot.priority || "Medium",
    isParking: depot.isParking || false,
    managerName: "",
    managerPhone: "",
    managerEmail: "",
    emergencyContact: "",
    loadingBays: "",
    averageLoadingTime: "",
    maxTruckSize: "",
    certifications: "",
    operatingHours: mockOperatingHours,
  });

  const handleInputChange = (field: string, value: string | boolean | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOperatingHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [field]: value
        }
      }
    }));
  };

  const handleCancel = () => {
    // Reset form data to original depot values
    setFormData({
      latitude: depot.latitude || "",
      longitude: depot.longitude || "",
      street: depot.street,
      postalCode: depot.postalCode || "",
      town: depot.town || "",
      active: depot.active !== undefined ? depot.active : true,
      priority: depot.priority || "Medium",
      isParking: depot.isParking || false,
      managerName: "",
      managerPhone: "",
      managerEmail: "",
      emergencyContact: "",
      loadingBays: "",
      averageLoadingTime: "",
      maxTruckSize: "",
      certifications: "",
      operatingHours: mockOperatingHours,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-4">
          
          {/* Top Section - Depot Information and Contact Information */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Left Column - Basic Depot Information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Depot Information</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  formData.active 
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                    Priority Level
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Medium">Medium Priority</SelectItem>
                      <SelectItem value="Low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maxTruckSize" className="text-sm font-medium text-gray-700">
                    Max Truck Size
                  </Label>
                  <Select
                    value={formData.maxTruckSize}
                    onValueChange={(value) => handleInputChange('maxTruckSize', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (&lt; 10,000L)</SelectItem>
                      <SelectItem value="medium">Medium (10,000L - 25,000L)</SelectItem>
                      <SelectItem value="large">Large (25,000L - 40,000L)</SelectItem>
                      <SelectItem value="extra-large">Extra Large (&gt; 40,000L)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="loadingBays" className="text-sm font-medium text-gray-700">
                    Loading Bays
                  </Label>
                  <Input
                    id="loadingBays"
                    type="number"
                    value={formData.loadingBays}
                    onChange={(e) => handleInputChange('loadingBays', e.target.value)}
                    placeholder="e.g. 4"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="averageLoadingTime" className="text-sm font-medium text-gray-700">
                    Average Loading Time (mins)
                  </Label>
                  <Input
                    id="averageLoadingTime"
                    type="number"
                    value={formData.averageLoadingTime}
                    onChange={(e) => handleInputChange('averageLoadingTime', e.target.value)}
                    placeholder="e.g. 45"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleInputChange('active', !!checked)}
                  />
                  <Label htmlFor="active" className="text-sm font-medium text-gray-700">
                    Depot Active
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isParking"
                    checked={formData.isParking}
                    onCheckedChange={(checked) => handleInputChange('isParking', !!checked)}
                  />
                  <Label htmlFor="isParking" className="text-sm font-medium text-gray-700">
                    Is Parking
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="certifications" className="text-sm font-medium text-gray-700">
                  Safety Certifications
                </Label>
                <Input
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  placeholder="Enter certifications"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Right Column - Contact Information */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              
              <div>
                <Label htmlFor="managerName" className="text-sm font-medium text-gray-700">
                  Depot Manager
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

          {/* Bottom Section - Operating Hours */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Operating Hours (Loading Operations)</h3>
            
            <div className="grid grid-cols-4 gap-2">
              {weekDays.map((day) => {
                const hours = formData.operatingHours[day as keyof typeof formData.operatingHours];
                return (
                  <div 
                    key={day} 
                    className={`border rounded-lg p-2 ${
                      hours.closed 
                        ? 'bg-red-50 border-red-200' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900">{day.slice(0, 3)}</span>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`${day}-closed`}
                          checked={hours.closed}
                          onCheckedChange={(checked) => handleOperatingHoursChange(day, 'closed', !!checked)}                       
                        />
                        <Label htmlFor={`${day}-closed`} className="text-xs text-gray-600">
                          Closed
                        </Label>
                      </div>
                    </div>
                    
                    {!hours.closed && (
                      <div className="space-y-1">
                        <div>
                          <Label className="text-xs text-gray-600">Open</Label>
                          <Select
                            value={hours.open}
                            onValueChange={(value) => handleOperatingHoursChange(day, 'open', value)}
                          >
                            <SelectTrigger className="h-7 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time} className="text-xs">
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Close</Label>
                          <Select
                            value={hours.close}
                            onValueChange={(value) => handleOperatingHoursChange(day, 'close', value)}
                          >
                            <SelectTrigger className="h-7 text-xs w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time} className="text-xs">
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
