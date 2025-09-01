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

// Truck interface for type safety
export interface TruckTractor {
  id: number;
  truckName: string;
  truckCode: string;
  registrationNumber: string;
  haulierCompany: string;
  active: boolean;
}

// Interface for new trucks being created
export interface NewTruck {
  truckName: string;
  truckCode: string;
  registrationNumber: string;
  haulierCompany: string;
}

interface AddTruckDialogProps {
  onSave: (truck: NewTruck) => void;
}

export default function AddTruckDialog({ onSave }: AddTruckDialogProps) {
  const [open, setOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<NewTruck>({
    truckName: '',
    truckCode: '',
    registrationNumber: '',
    haulierCompany: '',
  });

  // Available haulier companies
  const haulierCompanies = [
    "Express Logistics",
    "Fast Transport", 
    "Mega Freight",
    "Prime Movers",
    "Swift Carriers",
    "Reliable Haulage"
  ];

  const handleInputChange = (field: keyof NewTruck, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.truckName || !formData.truckCode || !formData.registrationNumber || 
        !formData.haulierCompany) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
    
    // Reset form and close dialog
    setFormData({
      truckName: '',
      truckCode: '',
      registrationNumber: '',
      haulierCompany: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white flex items-center gap-2">
          <PlusSquare size={18} />
          Add Truck
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Truck</DialogTitle>
          <DialogDescription>
            Add a new truck (tractor) to your fleet. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Truck Name *</label>
              <Input
                placeholder="e.g., Heavy Hauler 1"
                value={formData.truckName}
                onChange={(e) => handleInputChange('truckName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Truck Code *</label>
              <Input
                placeholder="e.g., TK001"
                value={formData.truckCode}
                onChange={(e) => handleInputChange('truckCode', e.target.value.toUpperCase())}
              />
            </div>
          </div>

          {/* Registration Number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Registration Number *</label>
              <Input
                placeholder="e.g., ABC-123"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value.toUpperCase())}
              />
            </div>
          </div>

          {/* Haulier Company */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Haulier Company *</label>
            <Select
              value={formData.haulierCompany}
              onValueChange={(value) => handleInputChange('haulierCompany', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select haulier company" />
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

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary-custom hover:bg-primary-custom/90">
            Add Truck
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
