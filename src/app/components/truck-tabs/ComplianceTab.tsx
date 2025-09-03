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
import { Calendar, Shield, Warning, CheckCircle } from "@phosphor-icons/react";

interface ComplianceTabProps {
  truck: TruckDetails;
  onSave: (data: Partial<TruckDetails>) => void;
}

export default function ComplianceTab({ truck, onSave }: ComplianceTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    adrExpiryDate: truck.compliance?.adrExpiryDate || '',
    lastInspectionDate: truck.compliance?.lastInspectionDate || '',
    nextInspectionDue: truck.compliance?.nextInspectionDue || '',
    certificateNumber: truck.compliance?.certificateNumber || '',
    inspectionType: truck.compliance?.inspectionType || 'Annual',
    complianceStatus: truck.compliance?.complianceStatus || 'Compliant',
    notes: truck.compliance?.notes || '',
  });

  const handleSave = () => {
    const updatedCompliance = {
      ...truck.compliance,
      ...formData,
      id: truck.compliance?.id || Date.now(),
    };
    onSave({ compliance: updatedCompliance });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      adrExpiryDate: truck.compliance?.adrExpiryDate || '',
      lastInspectionDate: truck.compliance?.lastInspectionDate || '',
      nextInspectionDue: truck.compliance?.nextInspectionDue || '',
      certificateNumber: truck.compliance?.certificateNumber || '',
      inspectionType: truck.compliance?.inspectionType || 'Annual',
      complianceStatus: truck.compliance?.complianceStatus || 'Compliant',
      notes: truck.compliance?.notes || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Compliant":
        return <CheckCircle size={20} className="text-green-600" />;
      case "Due Soon":
        return <Warning size={20} className="text-yellow-600" />;
      case "Expired":
        return <Warning size={20} className="text-red-600" />;
      default:
        return <Shield size={20} className="text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "bg-green-100 text-green-800 border-green-200";
      case "Due Soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Expired":
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
            <h2 className="text-xl font-semibold text-gray-900">Compliance Information</h2>
            <Button onClick={() => setIsEditing(true)} className="bg-primary-custom hover:bg-primary-custom/90 text-white">
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(formData.complianceStatus)}
                  <h3 className="text-lg font-medium text-gray-900">Compliance Status</h3>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(formData.complianceStatus)}`}>
                  {formData.complianceStatus}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Certificate Number</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-900">{formData.certificateNumber || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Inspection Type</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-gray-900">{formData.inspectionType}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">ADR Expiry Date</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <p className="text-gray-900">{formData.adrExpiryDate ? new Date(formData.adrExpiryDate).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Last Inspection Date</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <p className="text-gray-900">{formData.lastInspectionDate ? new Date(formData.lastInspectionDate).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Next Inspection Due</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <p className="text-gray-900">{formData.nextInspectionDue ? new Date(formData.nextInspectionDue).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
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
          <h2 className="text-xl font-semibold text-gray-900">Edit Compliance Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="certificateNumber">Certificate Number</Label>
              <Input
                id="certificateNumber"
                value={formData.certificateNumber}
                onChange={(e) => handleInputChange('certificateNumber', e.target.value)}
                className="mt-1"
                placeholder="Enter certificate number"
              />
            </div>

            <div>
              <Label htmlFor="inspectionType">Inspection Type</Label>
              <Select
                value={formData.inspectionType}
                onValueChange={(value) => handleInputChange('inspectionType', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select inspection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual">Annual</SelectItem>
                  <SelectItem value="6-Monthly">6-Monthly</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="complianceStatus">Compliance Status</Label>
              <Select
                value={formData.complianceStatus}
                onValueChange={(value) => handleInputChange('complianceStatus', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Compliant">Compliant</SelectItem>
                  <SelectItem value="Due Soon">Due Soon</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="adrExpiryDate">ADR Expiry Date</Label>
              <Input
                id="adrExpiryDate"
                type="date"
                value={formData.adrExpiryDate}
                onChange={(e) => handleInputChange('adrExpiryDate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
              <Input
                id="lastInspectionDate"
                type="date"
                value={formData.lastInspectionDate}
                onChange={(e) => handleInputChange('lastInspectionDate', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nextInspectionDue">Next Inspection Due</Label>
              <Input
                id="nextInspectionDue"
                type="date"
                value={formData.nextInspectionDue}
                onChange={(e) => handleInputChange('nextInspectionDue', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-primary-custom focus:border-primary-custom"
            rows={4}
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
