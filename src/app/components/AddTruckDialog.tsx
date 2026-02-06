"use client";

import { useState, useEffect } from "react";
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
import { UserApiService, Haulier } from "@/lib/api/user";
import { useLoader } from "@/contexts/LoaderContext";
import { useNotification } from "@/hooks/useNotification";

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
  regionId?: number;
}

export default function AddTruckDialog({ onSave, regionId = 5 }: AddTruckDialogProps) {
  const [open, setOpen] = useState(false);
  const [hauliers, setHauliers] = useState<Haulier[]>([]);
  const [loadingHauliers, setLoadingHauliers] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const { showSuccess, showError } = useNotification();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  // We'll map 'haulierCompany' to haulierId internally for the API call
  // but keep the state structure similar for now or update it
  const [formData, setFormData] = useState<NewTruck>({
    truckName: '',
    truckCode: '',
    registrationNumber: '',
    haulierCompany: '',
  });

  const [selectedHaulierId, setSelectedHaulierId] = useState<number>(0);

  // Fetch hauliers when dialog opens
  useEffect(() => {
    if (open && regionId) {
      setLoadingHauliers(true);
      UserApiService.getHauliersByRegion(regionId)
        .then(data => {
          setHauliers(data || []);
        })
        .catch(err => {
          console.error("Failed to fetch hauliers:", err);
          // Fallback to mock data if API fails to avoid breaking UI completely during dev
          setHauliers([]);
        })
        .finally(() => {
          setLoadingHauliers(false);
        });
    }
  }, [open, regionId]);


  const handleInputChange = (field: keyof NewTruck, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHaulierChange = (haulierName: string) => {
    // Find the haulier ID based on the name
    const haulier = hauliers.find(h => h.haulierName === haulierName);
    if (haulier) {
      setSelectedHaulierId(haulier.id);
      handleInputChange('haulierCompany', haulierName);
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.truckName || !formData.truckCode || !formData.registrationNumber ||
      !formData.haulierCompany || !selectedHaulierId) {
      showError('Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    showLoader("Creating new truck...");

    try {
      // Call API to create tractor
      const newTractor = await UserApiService.createTractor({
        tractorCode: formData.truckCode,
        tractorName: formData.truckName,
        licensePlate: formData.registrationNumber,
        haulierId: selectedHaulierId,
        regionId: regionId
      });

      // Pass the new tractor back to parent
      // We might need to map the response to NewTruck or adjust the parent to accept the full object
      // For now, pass the original formData as the parent likely adds it to a list
      // Ideally, the parent should refresh the list from the API
      onSave(formData);

      showSuccess("Truck Created", "The truck has been successfully added to your fleet.");

      // Reset form and close dialog
      setFormData({
        truckName: '',
        truckCode: '',
        registrationNumber: '',
        haulierCompany: '',
      });
      setSelectedHaulierId(0);
      setOpen(false);

    } catch (error) {
      console.error("Failed to create truck:", error);
      showError("Creation Failed", "Failed to create truck. Please try again.");
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
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
              onValueChange={(value) => handleHaulierChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingHauliers ? "Loading hauliers..." : "Select haulier company"} />
              </SelectTrigger>
              <SelectContent>
                {hauliers.map((haulier) => (
                  <SelectItem key={haulier.id} value={haulier.haulierName}>
                    {haulier.haulierName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary-custom hover:bg-primary-custom/90" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Truck"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
