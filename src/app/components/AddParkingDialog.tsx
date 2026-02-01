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

export interface NewParking {
  parkingCode: string;
  parkingName: string;
}

interface AddParkingDialogProps {
  onSave: (parking: NewParking) => void;
}

export default function AddParkingDialog({ onSave }: AddParkingDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewParking>({
    parkingCode: "",
    parkingName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      parkingCode: "",
      parkingName: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button> <PlusSquare size={30} weight="fill" /> Add New Parking</Button>
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
