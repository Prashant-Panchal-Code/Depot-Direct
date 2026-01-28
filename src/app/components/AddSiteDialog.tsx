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

export interface NewSite {
  siteCode: string;
  siteName: string;
}

interface AddSiteDialogProps {
  onSave: (site: NewSite) => void;
}

export default function AddSiteDialog({ onSave }: AddSiteDialogProps) {
  const [open, setOpen] = useState(false);

  // Depot list for the dropdown

  const [formData, setFormData] = useState<NewSite>({
    siteCode: "",
    siteName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      siteCode: "",
      siteName: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><PlusSquare size={30} weight="fill" />Add New Site</Button>
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
