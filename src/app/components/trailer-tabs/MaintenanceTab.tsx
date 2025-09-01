"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TrailerDetails } from "../TrailerDetailsPage";
import { Wrench, Calendar, CheckCircle, Warning, Clock } from "@phosphor-icons/react";

interface MaintenanceTabProps {
  trailer: TrailerDetails;
  onSave: (data: Partial<TrailerDetails>) => void;
}

export default function MaintenanceTab({ trailer, onSave }: MaintenanceTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    lastServiceDate: trailer.maintenance?.lastServiceDate || '',
    nextServiceDue: trailer.maintenance?.nextServiceDue || '',
    serviceType: trailer.maintenance?.serviceType || 'Routine',
    mileage: trailer.maintenance?.mileage || 0,
    serviceProvider: trailer.maintenance?.serviceProvider || '',
    cost: trailer.maintenance?.cost || 0,
    workDescription: trailer.maintenance?.workDescription || '',
    status: trailer.maintenance?.status || 'Completed',
    notes: trailer.maintenance?.notes || '',
  });

  const handleSave = () => {
    const updatedMaintenance = {
      ...trailer.maintenance,
      ...formData,
      id: trailer.maintenance?.id || Date.now(),
    };
    onSave({ maintenance: updatedMaintenance });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      lastServiceDate: trailer.maintenance?.lastServiceDate || '',
      nextServiceDue: trailer.maintenance?.nextServiceDue || '',
      serviceType: trailer.maintenance?.serviceType || 'Routine',
      mileage: trailer.maintenance?.mileage || 0,
      serviceProvider: trailer.maintenance?.serviceProvider || '',
      cost: trailer.maintenance?.cost || 0,
      workDescription: trailer.maintenance?.workDescription || '',
      status: trailer.maintenance?.status || 'Completed',
      notes: trailer.maintenance?.notes || '',
    });
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={20} className="text-green-600" weight="fill" />;
      case "Scheduled":
        return <Clock size={20} className="text-blue-600" weight="fill" />;
      case "Overdue":
        return <Warning size={20} className="text-red-600" weight="fill" />;
      default:
        return <Wrench size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilService = (dateString: string) => {
    if (!dateString) return null;
    const serviceDate = new Date(dateString);
    const today = new Date();
    const diffTime = serviceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const serviceDays = getDaysUntilService(trailer.maintenance?.nextServiceDue || '');

  const serviceProviders = [
    "Authorized Service Center",
    "Main Depot Workshop",
    "Mobile Service Unit",
    "External Contractor",
    "Third Party Service"
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Maintenance Information</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary-custom hover:bg-primary-custom/90">
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-primary-custom hover:bg-primary-custom/90"
            >
              Edit Maintenance
            </Button>
          )}
        </div>
      </div>

      {/* Maintenance Status Overview */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon(trailer.maintenance?.status || 'Completed')}
          <div>
            <h3 className="font-semibold text-gray-900">Maintenance Status</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trailer.maintenance?.status || 'Completed')}`}>
              {trailer.maintenance?.status || 'Not Set'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Last Service</p>
              <p className="text-sm text-gray-600">
                {formatDate(trailer.maintenance?.lastServiceDate || '')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Next Service Due</p>
              <p className="text-sm text-gray-600">
                {formatDate(trailer.maintenance?.nextServiceDue || '')}
                {serviceDays !== null && (
                  <span className={`ml-2 ${serviceDays < 30 ? 'text-red-600' : serviceDays < 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                    ({serviceDays > 0 ? `${serviceDays} days left` : `${Math.abs(serviceDays)} days overdue`})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Service Type</p>
              <p className="text-sm text-gray-600">
                {trailer.maintenance?.serviceType || 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="lastServiceDate">Last Service Date</Label>
            {isEditing ? (
              <Input
                id="lastServiceDate"
                type="date"
                value={formData.lastServiceDate}
                onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{formatDate(trailer.maintenance?.lastServiceDate || '')}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nextServiceDue">Next Service Due</Label>
            {isEditing ? (
              <Input
                id="nextServiceDue"
                type="date"
                value={formData.nextServiceDue}
                onChange={(e) => setFormData({ ...formData, nextServiceDue: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{formatDate(trailer.maintenance?.nextServiceDue || '')}</p>
            )}
          </div>

          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            {isEditing ? (
              <Select
                value={formData.serviceType}
                onValueChange={(value: "Routine" | "Repair" | "Emergency" | "Compliance") => setFormData({ ...formData, serviceType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Routine">Routine</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{trailer.maintenance?.serviceType || 'Not set'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mileage">Mileage (km)</Label>
            {isEditing ? (
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                className="mt-1"
                placeholder="e.g., 150000"
              />
            ) : (
              <p className="mt-1 text-gray-900 font-medium">
                {trailer.maintenance?.mileage ? `${trailer.maintenance.mileage.toLocaleString()} km` : 'Not recorded'}
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="serviceProvider">Service Provider</Label>
            {isEditing ? (
              <Select
                value={formData.serviceProvider}
                onValueChange={(value) => setFormData({ ...formData, serviceProvider: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select service provider" />
                </SelectTrigger>
                <SelectContent>
                  {serviceProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{trailer.maintenance?.serviceProvider || 'Not set'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cost">Service Cost (£)</Label>
            {isEditing ? (
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                className="mt-1"
                placeholder="e.g., 1250.00"
              />
            ) : (
              <p className="mt-1 text-gray-900 font-medium">
                {trailer.maintenance?.cost ? `£${trailer.maintenance.cost.toFixed(2)}` : 'Not recorded'}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Maintenance Status</Label>
            {isEditing ? (
              <Select
                value={formData.status}
                onValueChange={(value: "Completed" | "Scheduled" | "Overdue") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trailer.maintenance?.status || 'Completed')}`}>
                  {trailer.maintenance?.status || 'Not Set'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Work Description */}
      <div className="mt-6">
        <Label htmlFor="workDescription">Work Description</Label>
        {isEditing ? (
          <textarea
            id="workDescription"
            value={formData.workDescription}
            onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
            className="mt-1 w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-custom focus:border-transparent resize-none"
            placeholder="Describe the work performed or scheduled..."
          />
        ) : (
          <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[60px]">
            <p className="text-gray-900">
              {trailer.maintenance?.workDescription || 'No work description recorded.'}
            </p>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mt-6">
        <Label htmlFor="notes">Maintenance Notes</Label>
        {isEditing ? (
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-custom focus:border-transparent resize-none"
            placeholder="Add any maintenance-related notes or observations..."
          />
        ) : (
          <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[60px]">
            <p className="text-gray-900">
              {trailer.maintenance?.notes || 'No maintenance notes recorded.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
