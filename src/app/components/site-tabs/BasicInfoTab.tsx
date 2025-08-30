"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";
import { useState } from "react";

interface BasicInfoTabProps {
  site: SiteDetails;
  onSave: () => void;
}

export default function BasicInfoTab({ site, onSave }: BasicInfoTabProps) {
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
    Monday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Tuesday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Wednesday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Thursday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Friday: { open: "08:00 AM", close: "11:00 PM", closed: false },
    Saturday: { open: "09:00 AM", close: "11:00 PM", closed: false },
    Sunday: { open: "09:00 AM", close: "09:00 PM", closed: false },
  };

  // Form state for all editable fields
  const [formData, setFormData] = useState({
    siteName: site.siteName,
    siteCode: site.siteCode || "",
    latitude: site.latLong?.split(',')[0]?.trim() || "",
    longitude: site.latLong?.split(',')[1]?.trim() || "",
    street: site.street,
    postalCode: site.postalCode || "",
    town: site.town || site.street?.split(',')[1]?.trim() || "",
    active: site.active !== undefined ? site.active : true,
    priority: site.priority || "Medium",
    phone: site.phone || "(555) 123-4567",
    email: site.email || `contact@${site.siteName?.toLowerCase().replace(/\s+/g, '') || 'site'}.com`,
    operatingHours: site.operatingHours || mockOperatingHours,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
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
    // Reset form data to original site values
    setFormData({
      siteName: site.siteName,
      siteCode: site.siteCode || "",
      latitude: site.latLong?.split(',')[0]?.trim() || "",
      longitude: site.latLong?.split(',')[1]?.trim() || "",
      street: site.street,
      postalCode: site.postalCode || "",
      town: site.town || site.street?.split(',')[1]?.trim() || "",
      active: site.active !== undefined ? site.active : true,
      priority: site.priority || "Medium",
      phone: site.phone || "(555) 123-4567",
      email: site.email || `contact@${site.siteName?.toLowerCase().replace(/\s+/g, '') || 'site'}.com`,
      operatingHours: site.operatingHours || mockOperatingHours,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          
          {/* Top Section - Site Information and Contact Information */}
          <div className="grid grid-cols-2 gap-8">
            
            {/* Left Column - Basic Site Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Site Information</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  formData.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formData.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <Label htmlFor="siteName" className="text-sm font-medium text-gray-700">
                  Site Name
                </Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  className="mt-1 bg-gray-100"
                  disabled={true}
                />
              </div>

              <div>
                <Label htmlFor="siteCode" className="text-sm font-medium text-gray-700">
                  Site Code
                </Label>
                <Input
                  id="siteCode"
                  value={formData.siteCode}
                  className="mt-1 bg-gray-100"
                  disabled={true}
                />
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange('active', !!checked)}
                />
                <Label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Site Active
                </Label>
              </div>
            </div>

            {/* Right Column - Contact Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Map Placeholder */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Location Map
                </Label>
                <div className="bg-green-100 border border-green-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 text-green-600" />
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
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Operating Hours (Delivery Openings)</h3>
            
            <div className="grid grid-cols-4 gap-3">
              {weekDays.map((day) => {
                const hours = formData.operatingHours[day as keyof typeof formData.operatingHours];
                return (
                  <div 
                    key={day} 
                    className={`border rounded-lg p-3 ${
                      hours.closed 
                        ? 'bg-red-50 border-red-200' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
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
                      <div className="space-y-2">
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

      {/* Footer Actions - Always Visible */}
      <div className="border-t border-gray-200 pt-3 mt-4 flex justify-end gap-2 flex-shrink-0 bg-gray-50">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
