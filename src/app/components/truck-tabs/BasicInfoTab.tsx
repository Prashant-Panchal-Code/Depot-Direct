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
import { UserApiService } from "@/lib/api/user";
import { useRegionContext } from "@/contexts/RoleBasedContext";
import { useEffect } from "react";

interface BasicInfoTabProps {
  truck: TruckDetails;
  onSave: (data: Partial<TruckDetails>) => void;
}

export default function BasicInfoTab({ truck, onSave }: BasicInfoTabProps) {
  const [formData, setFormData] = useState({
    truckName: truck.truckName,
    licensePlate: truck.licensePlate,
    curbWeightKg: truck.curbWeightKg,
    haulierCompany: truck.haulierCompany,
    active: truck.active,
    pumpAvailable: truck.pumpAvailable,
    pumpFlowRateLpm: truck.pumpFlowRateLpm || 0,
    numberOfAxles: truck.numberOfAxles || 0,
    metadata: truck.metadata || '',
    axleConfiguration: truck.axleConfiguration || '{}'
  });

  // Parse initial axle config
  const [axleConfigData, setAxleConfigData] = useState<any>(() => {
    try {
      return JSON.parse(truck.axleConfiguration || '{}');
    } catch {
      return {};
    }
  });

  const updateAxleConfig = (key: string, value: any) => {
    const updated = { ...axleConfigData, [key]: value };
    setAxleConfigData(updated);
    // Update main form data with stringified version
    handleInputChange('axleConfiguration', JSON.stringify(updated));
  };

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
      curbWeightKg: truck.curbWeightKg,
      haulierCompany: truck.haulierCompany,
      active: truck.active,
      pumpAvailable: truck.pumpAvailable,
      pumpFlowRateLpm: truck.pumpFlowRateLpm,
      numberOfAxles: truck.numberOfAxles,
      metadata: truck.metadata,
      axleConfiguration: truck.axleConfiguration
    });

    // Reset axle config state
    try {
      setAxleConfigData(JSON.parse(truck.axleConfiguration || '{}'));
    } catch {
      setAxleConfigData({});
    }
  };

  // Fetch hauliers from API
  const [haulierCompanies, setHaulierCompanies] = useState<string[]>([]);
  const { selectedRegions } = useRegionContext();

  useEffect(() => {
    const fetchHauliers = async () => {
      try {
        // Use region from truck data if available, or default context region
        const regionId = truck.regionId || (selectedRegions.length > 0 ? selectedRegions[0].id : 5);
        if (regionId) {
          const hauliers = await UserApiService.getHauliersByRegion(regionId);
          setHaulierCompanies(hauliers.map((h) => h.haulierName));
        }
      } catch (error) {
        console.error("Failed to fetch hauliers:", error);
        // Fallback to empty or predefined list if needed
        setHaulierCompanies([]);
      }
    };
    fetchHauliers();
  }, [truck.regionId, selectedRegions]);

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
              <Label htmlFor="curbWeightKg">Tare Weight (kg)</Label>
              <Input
                id="curbWeightKg"
                type="number"
                value={formData.curbWeightKg}
                onChange={(e) => handleInputChange('curbWeightKg', parseFloat(e.target.value) || 0)}
                className="mt-1"
                step="0.1"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="metadata">Metadata</Label>
              <textarea
                id="metadata"
                value={formData.metadata}
                onChange={(e) => handleInputChange('metadata', e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 min-h-[80px]"
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

            {/* Removed Parking Assigned select */}
            {/* Removed Owner select */}

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

            {formData.pumpAvailable && (
              <div>
                <Label htmlFor="pumpFlowRateLpm">Pump Flow Rate (LPM)</Label>
                <Input
                  id="pumpFlowRateLpm"
                  type="number"
                  value={formData.pumpFlowRateLpm}
                  onChange={(e) => handleInputChange('pumpFlowRateLpm', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="numberOfAxles">Number of Axles</Label>
              <Input
                id="numberOfAxles"
                type="number"
                value={formData.numberOfAxles}
                onChange={(e) => handleInputChange('numberOfAxles', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="axleConfiguration">Axle Configuration Description</Label>
              <Input
                id="axleConfigurationDescription"
                value={axleConfigData.description || ''}
                onChange={(e) => updateAxleConfig('description', e.target.value)}
                placeholder="e.g. 6x4 Heavy Hauler"
                className="mt-1"
              />
            </div>

            {/* Dynamic Axle Inputs could go here, simplified for now to just description or raw JSON if needed */}
            {/* For now, let's keep it simple with description and maybe a text area for raw metadata if requested, but prompt implies specific 'axle_1', etc keys. */}

            <div className="space-y-2">
              <Label>Axle Weights (kg)</Label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: formData.numberOfAxles || 0 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <Label className="text-xs">Axle {idx + 1}</Label>
                    <Input
                      type="number"
                      value={axleConfigData[`axle_${idx + 1}`] || 0}
                      onChange={(e) => updateAxleConfig(`axle_${idx + 1}`, parseInt(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Label className="w-20">Group Limit:</Label>
                <Input
                  type="number"
                  value={axleConfigData['group_limit'] || 0}
                  onChange={(e) => updateAxleConfig('group_limit', parseInt(e.target.value) || 0)}
                  className="w-32"
                />
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
