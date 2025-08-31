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

// Trailer interface for type safety
export interface Trailer {
  id: number;
  trailerName: string;
  trailerCode: string;
  registrationNumber: string;
  volumeCapacity: number;
  weightCapacity: number;
  numberOfCompartments: number;
  haulierCompany: string;
  active: boolean;
}

// Interface for new trailers being created
export interface NewTrailer {
  trailerName: string;
  trailerCode: string;
  registrationNumber: string;
  volumeCapacity: number;
  weightCapacity: number;
  numberOfCompartments: number;
  haulierCompany: string;
}

interface AddTrailerDialogProps {
  onSave: (trailer: NewTrailer) => void;
}

export default function AddTrailerDialog({ onSave }: AddTrailerDialogProps) {
  const [open, setOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<NewTrailer>({
    trailerName: '',
    trailerCode: '',
    registrationNumber: '',
    volumeCapacity: 0,
    weightCapacity: 0,
    numberOfCompartments: 1,
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

  const handleInputChange = (field: keyof NewTrailer, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.trailerName || !formData.trailerCode || !formData.registrationNumber || 
        !formData.volumeCapacity || !formData.weightCapacity || !formData.numberOfCompartments ||
        !formData.haulierCompany) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
    
    // Reset form and close dialog
    setFormData({
      trailerName: '',
      trailerCode: '',
      registrationNumber: '',
      volumeCapacity: 0,
      weightCapacity: 0,
      numberOfCompartments: 1,
      haulierCompany: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white flex items-center gap-2">
          <PlusSquare size={18} />
          Add Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Trailer</DialogTitle>
          <DialogDescription>
            Add a new trailer to your fleet. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trailer Name *</label>
              <Input
                placeholder="e.g., Fuel Tanker 1"
                value={formData.trailerName}
                onChange={(e) => handleInputChange('trailerName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trailer Code *</label>
              <Input
                placeholder="e.g., TR001"
                value={formData.trailerCode}
                onChange={(e) => handleInputChange('trailerCode', e.target.value.toUpperCase())}
              />
            </div>
          </div>

          {/* Registration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Registration Number *</label>
            <Input
              placeholder="e.g., XYZ-111"
              value={formData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value.toUpperCase())}
            />
          </div>

          {/* Capacity Information */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Volume Capacity (L) *</label>
              <Input
                type="number"
                placeholder="e.g., 35000"
                value={formData.volumeCapacity || ''}
                onChange={(e) => handleInputChange('volumeCapacity', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weight Capacity (kg) *</label>
              <Input
                type="number"
                placeholder="e.g., 28000"
                value={formData.weightCapacity || ''}
                onChange={(e) => handleInputChange('weightCapacity', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">No. Compartments *</label>
              <Input
                type="number"
                min="1"
                placeholder="e.g., 4"
                value={formData.numberOfCompartments || ''}
                onChange={(e) => handleInputChange('numberOfCompartments', parseInt(e.target.value) || 1)}
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
            Add Trailer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
