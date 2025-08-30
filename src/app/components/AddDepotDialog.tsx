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

export interface Depot {
  depotCode: string;
  depotName: string;
  latitude: string;
  longitude: string;
  street: string;
  postalCode: string;
  town: string;
  active: boolean;
  priority: string;
}

interface AddDepotDialogProps {
  onSave: (depot: Depot) => void;
}

export default function AddDepotDialog({ onSave }: AddDepotDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Depot>({
    depotCode: "",
    depotName: "",
    latitude: "",
    longitude: "",
    street: "",
    postalCode: "",
    town: "",
    active: true,
    priority: "Medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      depotCode: "",
      depotName: "",
      latitude: "",
      longitude: "",
      street: "",
      postalCode: "",
      town: "",
      active: true,
      priority: "Medium",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Depot</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Depot</DialogTitle>
          <DialogDescription>
            Enter the depot information below to add a new fuel depot to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="depotCode" className="block text-sm font-medium text-gray-700 mb-1">
              Depot Code *
            </label>
            <Input
              id="depotCode"
              value={formData.depotCode}
              onChange={(e) => setFormData({ ...formData, depotCode: e.target.value })}
              placeholder="Enter depot code"
              required
            />
          </div>

          <div>
            <label htmlFor="depotName" className="block text-sm font-medium text-gray-700 mb-1">
              Depot Name *
            </label>
            <Input
              id="depotName"
              value={formData.depotName}
              onChange={(e) => setFormData({ ...formData, depotName: e.target.value })}
              placeholder="Enter depot name"
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Depot</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}