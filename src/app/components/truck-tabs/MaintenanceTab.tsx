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
import { TruckDetails } from "../TruckDetailsPage";
import { Wrench, Calendar, CurrencyDollar, CheckCircle, Clock, Warning } from "@phosphor-icons/react";

interface MaintenanceTabProps {
  truck: TruckDetails;
  onSave: (data: Partial<TruckDetails>) => void;
}

export default function MaintenanceTab({ truck, onSave }: MaintenanceTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    lastServiceDate: truck.maintenance?.lastServiceDate || '',
    nextServiceDue: truck.maintenance?.nextServiceDue || '',
    serviceType: truck.maintenance?.serviceType || 'Routine',
    mileage: truck.maintenance?.mileage || 0,
    serviceProvider: truck.maintenance?.serviceProvider || '',
    cost: truck.maintenance?.cost || 0,
    workDescription: truck.maintenance?.workDescription || '',
    status: truck.maintenance?.status || 'Completed',
    notes: truck.maintenance?.notes || '',
  });

  const handleSave = () => {
    const updatedMaintenance = {
      ...truck.maintenance,
      ...formData,
      id: truck.maintenance?.id || Date.now(),
    };
    onSave({ maintenance: updatedMaintenance });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      lastServiceDate: truck.maintenance?.lastServiceDate || '',
      nextServiceDue: truck.maintenance?.nextServiceDue || '',
      serviceType: truck.maintenance?.serviceType || 'Routine',
      mileage: truck.maintenance?.mileage || 0,
      serviceProvider: truck.maintenance?.serviceProvider || '',
      cost: truck.maintenance?.cost || 0,
      workDescription: truck.maintenance?.workDescription || '',
      status: truck.maintenance?.status || 'Completed',
      notes: truck.maintenance?.notes || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={20} className="text-green-600" />;
      case "Scheduled":
        return <Clock size={20} className="text-blue-600" />;
      case "Overdue":
        return <Warning size={20} className="text-red-600" />;
      default:
        return <Wrench size={20} className="text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isEditing) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Maintenance Information</h2>
            <Button onClick={() => setIsEditing(true)} className="bg-primary-custom hover:bg-primary-custom/90 text-white">
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(formData.status)}
                  <h3 className="text-lg font-medium text-gray-900">Maintenance Status</h3>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(formData.status)}`}>
                  {formData.status}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Service Type</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-900">{formData.serviceType}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Service Provider</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-900">{formData.serviceProvider || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Mileage</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-900">{formData.mileage ? formData.mileage.toLocaleString() + ' km' : 'Not recorded'}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Last Service Date</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <p className="text-gray-900">{formData.lastServiceDate ? new Date(formData.lastServiceDate).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Next Service Due</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <p className="text-gray-900">{formData.nextServiceDue ? new Date(formData.nextServiceDue).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Cost</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center gap-2">
                  <CurrencyDollar size={16} className="text-gray-500" />
                  <p className="text-gray-900">{formData.cost ? `$${formData.cost.toFixed(2)}` : 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Work Description */}
          <div className="mt-6">
            <Label className="text-sm font-medium text-gray-700">Work Description</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap">{formData.workDescription || 'No description provided'}</p>
            </div>
          </div>

          {/* Notes Section */}
          {formData.notes && (
            <div className="mt-6">
              <Label className="text-sm font-medium text-gray-700">Notes</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap">{formData.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Maintenance Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => handleInputChange('serviceType', value)}
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
            </div>

            <div>
              <Label htmlFor="serviceProvider">Service Provider</Label>
              <Input
                id="serviceProvider"
                value={formData.serviceProvider}
                onChange={(e) => handleInputChange('serviceProvider', e.target.value)}
                className="mt-1"
                placeholder="Enter service provider"
              />
            </div>

            <div>
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                className="mt-1"
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                className="mt-1"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="lastServiceDate">Last Service Date</Label>
              <Input
                id="lastServiceDate"
                type="date"
                value={formData.lastServiceDate}
                onChange={(e) => handleInputChange('lastServiceDate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nextServiceDue">Next Service Due</Label>
              <Input
                id="nextServiceDue"
                type="date"
                value={formData.nextServiceDue}
                onChange={(e) => handleInputChange('nextServiceDue', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
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
            </div>
          </div>
        </div>

        {/* Work Description */}
        <div className="mt-6">
          <Label htmlFor="workDescription">Work Description</Label>
          <textarea
            id="workDescription"
            value={formData.workDescription}
            onChange={(e) => handleInputChange('workDescription', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-primary-custom focus:border-primary-custom"
            rows={3}
            placeholder="Describe the work performed or scheduled..."
          />
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-primary-custom focus:border-primary-custom"
            rows={3}
            placeholder="Enter any additional notes or comments..."
          />
        </div>
      </div>

      {/* Footer Actions - Always Visible */}
      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-end gap-2 flex-shrink-0 bg-gray-50">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
