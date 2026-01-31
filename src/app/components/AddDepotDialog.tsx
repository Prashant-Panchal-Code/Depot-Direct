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
import { PlusSquare } from "@phosphor-icons/react";

export interface NewDepot {
  depotCode: string;
  depotName: string;
}

interface AddDepotDialogProps {
  onSave: (depot: NewDepot) => void;
}

export default function AddDepotDialog({ onSave }: AddDepotDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewDepot>({
    depotCode: "",
    depotName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      depotCode: "",
      depotName: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><PlusSquare size={30} weight="fill" />Add New Depot</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Depot</DialogTitle>
          <DialogDescription>
            Enter the depot information below to add a new depot to the system.
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
