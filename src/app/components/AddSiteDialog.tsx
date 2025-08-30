"use client";

import React, { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Site interface for type safety
export interface Site {
  siteCode: string;
  siteName: string;
  latitude: string;
  longitude: string;
  street: string;
  postalCode: string;
  town: string;
  active: boolean;
  priority: string;
}

interface AddSiteDialogProps {
  onSave: (site: Site) => void;
}

export default function AddSiteDialog({ onSave }: AddSiteDialogProps) {
  const [formData, setFormData] = useState({
    siteCode: "",
    siteName: "",
    latitude: "",
    longitude: "",
    street: "",
    postalCode: "",
    town: "",
    active: true,
    priority: "Medium",
  });
  const [isOpen, setIsOpen] = useState(false);

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
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus weight="fill" /> Add New Site
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Site</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Site Code *
              </label>
              <Input
                type="text"
                value={formData.siteCode}
                onChange={(e) =>
                  setFormData({ ...formData, siteCode: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Site Name *
              </label>
              <Input
                type="text"
                value={formData.siteName}
                onChange={(e) =>
                  setFormData({ ...formData, siteName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Latitude
              </label>
              <Input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Longitude
              </label>
              <Input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Street Address
              </label>
              <Input
                type="text"
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Postal Code
              </label>
              <Input
                type="text"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Town/City
              </label>
              <Input
                type="text"
                value={formData.town}
                onChange={(e) =>
                  setFormData({ ...formData, town: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Priority
              </label>
              <Select
                value={formData.priority}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
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
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <label
                htmlFor="active"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                Active
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Site</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
