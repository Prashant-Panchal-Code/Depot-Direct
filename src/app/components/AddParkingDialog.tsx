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
import { Checkbox } from "@/components/ui/checkbox";
import { PlusSquare } from "@phosphor-icons/react";

export interface Parking {
  parkingCode: string;
  parkingName: string;
  latitude: string;
  longitude: string;
  street: string;
  postalCode: string;
  town: string;
  active: boolean;
  priority: string;
  isDepot: boolean;
}

interface AddParkingDialogProps {
  onSave: (parking: Parking) => void;
}

export default function AddParkingDialog({ onSave }: AddParkingDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Parking>({
    parkingCode: "",
    parkingName: "",
    latitude: "",
    longitude: "",
    street: "",
    postalCode: "",
    town: "",
    active: true,
    priority: "Medium",
    isDepot: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      parkingCode: "",
      parkingName: "",
      latitude: "",
      longitude: "",
      street: "",
      postalCode: "",
      town: "",
      active: true,
      priority: "Medium",
      isDepot: false,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button> <PlusSquare size={30}  weight="fill" /> Add New Parking</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Parking</DialogTitle>
          <DialogDescription>
            Enter the parking information below to add a new parking area to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="parkingCode" className="block text-sm font-medium text-gray-700 mb-1">
              Parking Code *
            </label>
            <Input
              id="parkingCode"
              value={formData.parkingCode}
              onChange={(e) => setFormData({ ...formData, parkingCode: e.target.value })}
              placeholder="Enter parking code"
              required
            />
          </div>

          <div>
            <label htmlFor="parkingName" className="block text-sm font-medium text-gray-700 mb-1">
              Parking Name *
            </label>
            <Input
              id="parkingName"
              value={formData.parkingName}
              onChange={(e) => setFormData({ ...formData, parkingName: e.target.value })}
              placeholder="Enter parking name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="0.000000"
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="0.000000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="Enter street address"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              placeholder="Enter postal code"
            />
          </div>

          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">
              Town/City
            </label>
            <Input
              id="town"
              value={formData.town}
              onChange={(e) => setFormData({ ...formData, town: e.target.value })}
              placeholder="Enter town or city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value: string) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
            />
            <label
              htmlFor="active"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Active
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDepot"
              checked={formData.isDepot}
              onCheckedChange={(checked) => setFormData({ ...formData, isDepot: checked as boolean })}
            />
            <label
              htmlFor="isDepot"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Is Depot
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Parking</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}