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

// Site interface for type safety
export interface Site {
  id: number; // Required for existing sites
  siteCode: string;
  siteName: string;
  latitude: string;
  longitude: string;
  street: string;
  postalCode: string;
  town: string;
  active: boolean;
  priority: string;
  depotId: number | null;
}

// Interface for new sites being created
export interface NewSite {
  siteCode: string;
  siteName: string;
  latitude: string;
  longitude: string;
  street: string;
  postalCode: string;
  town: string;
  active: boolean;
  priority: string;
  depotId: number | null;
}

interface AddSiteDialogProps {
  onSave: (site: NewSite) => void;
}

export default function AddSiteDialog({ onSave }: AddSiteDialogProps) {
  const [open, setOpen] = useState(false);

  // Depot list for the dropdown
  const depots = [
    { id: 1, depotCode: "DP001", depotName: "Main Distribution Center" },
    { id: 2, depotCode: "DP002", depotName: "Port Terminal Depot" },
    { id: 3, depotCode: "DP003", depotName: "Airport Fuel Terminal" },
    { id: 4, depotCode: "DP004", depotName: "Orange County Hub" },
    { id: 5, depotCode: "DP005", depotName: "Valley Distribution" },
    { id: 6, depotCode: "DP006", depotName: "Coastal Storage Facility" },
    { id: 7, depotCode: "DP007", depotName: "Industrial Park Depot" },
    { id: 8, depotCode: "DP008", depotName: "South Bay Terminal" },
    { id: 9, depotCode: "DP009", depotName: "Long Beach Facility" },
    { id: 10, depotCode: "DP010", depotName: "Irvine Tech Depot" },
  ];
  const [formData, setFormData] = useState<NewSite>({
    siteCode: "",
    siteName: "",
    latitude: "",
    longitude: "",
    street: "",
    postalCode: "",
    town: "",
    active: true,
    priority: "Medium",
    depotId: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      siteCode: "",
      siteName: "",
      latitude: "",
      longitude: "",
      street: "",
      postalCode: "",
      town: "",
      active: true,
      priority: "Medium",
      depotId: null,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><PlusSquare size={30}  weight="fill" />Add New Site</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Site</DialogTitle>
          <DialogDescription>
            Enter the site information below to add a new fuel site to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="siteCode" className="block text-sm font-medium text-gray-700 mb-1">
              Site Code *
            </label>
            <Input
              id="siteCode"
              value={formData.siteCode}
              onChange={(e) => setFormData({ ...formData, siteCode: e.target.value })}
              placeholder="Enter site code"
              required
            />
          </div>

          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
              Site Name *
            </label>
            <Input
              id="siteName"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              placeholder="Enter site name"
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

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Depot
              </label>
              <Select
                value={formData.depotId ? formData.depotId.toString() : "none"}
                onValueChange={(value: string) => setFormData({ ...formData, depotId: value === "none" ? null : parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a depot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Depot Assigned</SelectItem>
                  {depots.map((depot) => (
                    <SelectItem key={depot.id} value={depot.id.toString()}>
                      {depot.depotName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <Button type="submit">Add Site</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
