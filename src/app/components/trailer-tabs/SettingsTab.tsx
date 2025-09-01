"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TrailerDetails } from "../TrailerDetailsPage";
import { Gear, Warning, CheckCircle, Archive, Trash } from "@phosphor-icons/react";

interface SettingsTabProps {
  trailer: TrailerDetails;
  onSave: (data: Partial<TrailerDetails>) => void;
}

export default function SettingsTab({ trailer, onSave }: SettingsTabProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: boolean) => {
    setIsUpdatingStatus(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSave({ active: newStatus });
    setIsUpdatingStatus(false);
  };

  const handleArchiveTrailer = () => {
    if (confirm("Are you sure you want to archive this trailer? This will deactivate it and move it to archived trailers.")) {
      onSave({ active: false });
      alert("Trailer has been archived successfully.");
    }
  };

  const handleDeleteTrailer = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    // In a real app, this would make an API call to delete the trailer
    alert("Trailer would be permanently deleted. This is a demo action.");
    setShowDeleteConfirmation(false);
    // You might want to navigate back to the trailers list here
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Trailer Settings</h2>
      </div>

      <div className="space-y-8">
        {/* Status Management */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-primary-custom" />
            <h3 className="text-lg font-semibold text-gray-900">Status Management</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Trailer Status</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {trailer.active ? "This trailer is currently active and available for scheduling" : "This trailer is inactive and not available for scheduling"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trailer.active 
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {trailer.active ? "Active" : "Inactive"}
                </span>
                <Button
                  onClick={() => handleStatusChange(!trailer.active)}
                  disabled={isUpdatingStatus}
                  variant={trailer.active ? "destructive" : "default"}
                  className={trailer.active ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  {isUpdatingStatus 
                    ? "Updating..." 
                    : trailer.active 
                      ? "Deactivate"
                      : "Activate"
                  }
                </Button>
              </div>
            </div>

            {trailer.active && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Warning size={16} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Before Deactivating</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Ensure this trailer has no active schedules or deliveries. Deactivating will prevent it from being used in future scheduling.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gear size={20} className="text-primary-custom" />
            <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Trailer Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Created:</span> System Record</p>
                  <p><span className="font-medium">Last Updated:</span> Recently</p>
                  <p><span className="font-medium">Compartments:</span> {trailer.compartments?.length || 0}</p>
                  <p><span className="font-medium">ID:</span> {trailer.id}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Usage Statistics</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Total Deliveries:</span> N/A</p>
                  <p><span className="font-medium">Total Volume:</span> N/A</p>
                  <p><span className="font-medium">Last Used:</span> N/A</p>
                  <p><span className="font-medium">Utilization:</span> N/A</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dangerous Actions */}
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Warning size={20} className="text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Dangerous Actions</h3>
          </div>

          <div className="space-y-4">
            {/* Archive Trailer */}
            <div className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div>
                <h4 className="font-medium text-orange-900">Archive Trailer</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Archive this trailer if it's no longer in active service but you want to keep historical records.
                </p>
              </div>
              <Button
                onClick={handleArchiveTrailer}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <Archive size={16} className="mr-2" />
                Archive
              </Button>
            </div>

            {/* Delete Trailer */}
            <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
              <div>
                <h4 className="font-medium text-red-900">Delete Trailer</h4>
                <p className="text-sm text-red-700 mt-1">
                  Permanently delete this trailer and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button
                onClick={handleDeleteTrailer}
                variant="destructive"
              >
                <Trash size={16} className="mr-2" />
                Delete
              </Button>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirmation && (
              <div className="p-4 border border-red-300 bg-red-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <Warning size={20} className="text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900 mb-2">Confirm Deletion</h4>
                    <p className="text-sm text-red-800 mb-4">
                      Are you absolutely sure you want to delete "{trailer.trailerName}"? This will:
                    </p>
                    <ul className="text-sm text-red-800 list-disc list-inside mb-4 space-y-1">
                      <li>Permanently remove all trailer data</li>
                      <li>Delete all compartment configurations</li>
                      <li>Remove maintenance and compliance records</li>
                      <li>Cannot be recovered once deleted</li>
                    </ul>
                    <div className="flex gap-2">
                      <Button
                        onClick={confirmDelete}
                        variant="destructive"
                        size="sm"
                      >
                        Yes, Delete Permanently
                      </Button>
                      <Button
                        onClick={() => setShowDeleteConfirmation(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">System Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><span className="font-medium">Version:</span> 1.0.0</p>
              <p><span className="font-medium">Last Backup:</span> System Automated</p>
            </div>
            <div>
              <p><span className="font-medium">Data Sync:</span> Real-time</p>
              <p><span className="font-medium">Access Level:</span> Full</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
