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
import { Calendar, Shield, Warning, CheckCircle } from "@phosphor-icons/react";

interface ComplianceTabProps {
  trailer: TrailerDetails;
  onSave: (data: Partial<TrailerDetails>) => void;
}

export default function ComplianceTab({ trailer, onSave }: ComplianceTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    adrExpiryDate: trailer.compliance?.adrExpiryDate || '',
    lastInspectionDate: trailer.compliance?.lastInspectionDate || '',
    nextInspectionDue: trailer.compliance?.nextInspectionDue || '',
    certificateNumber: trailer.compliance?.certificateNumber || '',
    inspectionType: trailer.compliance?.inspectionType || 'Annual',
    complianceStatus: trailer.compliance?.complianceStatus || 'Compliant',
    notes: trailer.compliance?.notes || '',
  });

  const handleSave = () => {
    const updatedCompliance = {
      ...trailer.compliance,
      ...formData,
      id: trailer.compliance?.id || Date.now(),
    };
    onSave({ compliance: updatedCompliance });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      adrExpiryDate: trailer.compliance?.adrExpiryDate || '',
      lastInspectionDate: trailer.compliance?.lastInspectionDate || '',
      nextInspectionDue: trailer.compliance?.nextInspectionDue || '',
      certificateNumber: trailer.compliance?.certificateNumber || '',
      inspectionType: trailer.compliance?.inspectionType || 'Annual',
      complianceStatus: trailer.compliance?.complianceStatus || 'Compliant',
      notes: trailer.compliance?.notes || '',
    });
    setIsEditing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Compliant":
        return <CheckCircle size={20} className="text-green-600" weight="fill" />;
      case "Due Soon":
        return <Warning size={20} className="text-yellow-600" weight="fill" />;
      case "Expired":
        return <Warning size={20} className="text-red-600" weight="fill" />;
      default:
        return <Shield size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "bg-green-100 text-green-800";
      case "Due Soon":
        return "bg-yellow-100 text-yellow-800";
      case "Expired":
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

  const getDaysUntilExpiry = (dateString: string) => {
    if (!dateString) return null;
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const adrDays = getDaysUntilExpiry(trailer.compliance?.adrExpiryDate || '');
  const inspectionDays = getDaysUntilExpiry(trailer.compliance?.nextInspectionDue || '');

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Compliance Information</h2>
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
              Edit Compliance
            </Button>
          )}
        </div>
      </div>

      {/* Compliance Status Overview */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          {getStatusIcon(trailer.compliance?.complianceStatus || 'Compliant')}
          <div>
            <h3 className="font-semibold text-gray-900">Compliance Status</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trailer.compliance?.complianceStatus || 'Compliant')}`}>
              {trailer.compliance?.complianceStatus || 'Not Set'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">ADR Expiry</p>
              <p className="text-sm text-gray-600">
                {formatDate(trailer.compliance?.adrExpiryDate || '')}
                {adrDays !== null && (
                  <span className={`ml-2 ${adrDays < 30 ? 'text-red-600' : adrDays < 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                    ({adrDays > 0 ? `${adrDays} days left` : `${Math.abs(adrDays)} days overdue`})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Next Inspection</p>
              <p className="text-sm text-gray-600">
                {formatDate(trailer.compliance?.nextInspectionDue || '')}
                {inspectionDays !== null && (
                  <span className={`ml-2 ${inspectionDays < 30 ? 'text-red-600' : inspectionDays < 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                    ({inspectionDays > 0 ? `${inspectionDays} days left` : `${Math.abs(inspectionDays)} days overdue`})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="adrExpiryDate">ADR Certificate Expiry Date</Label>
            {isEditing ? (
              <Input
                id="adrExpiryDate"
                type="date"
                value={formData.adrExpiryDate}
                onChange={(e) => setFormData({ ...formData, adrExpiryDate: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{formatDate(trailer.compliance?.adrExpiryDate || '')}</p>
            )}
          </div>

          <div>
            <Label htmlFor="certificateNumber">Certificate Number</Label>
            {isEditing ? (
              <Input
                id="certificateNumber"
                value={formData.certificateNumber}
                onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value.toUpperCase() })}
                className="mt-1"
                placeholder="e.g., ADR-2024-001"
              />
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{trailer.compliance?.certificateNumber || 'Not set'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
            {isEditing ? (
              <Input
                id="lastInspectionDate"
                type="date"
                value={formData.lastInspectionDate}
                onChange={(e) => setFormData({ ...formData, lastInspectionDate: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{formatDate(trailer.compliance?.lastInspectionDate || '')}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="nextInspectionDue">Next Inspection Due</Label>
            {isEditing ? (
              <Input
                id="nextInspectionDue"
                type="date"
                value={formData.nextInspectionDue}
                onChange={(e) => setFormData({ ...formData, nextInspectionDue: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{formatDate(trailer.compliance?.nextInspectionDue || '')}</p>
            )}
          </div>

          <div>
            <Label htmlFor="inspectionType">Inspection Type</Label>
            {isEditing ? (
              <Select
                value={formData.inspectionType}
                onValueChange={(value: "Annual" | "6-Monthly" | "Special") => setFormData({ ...formData, inspectionType: value })}
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
            ) : (
              <p className="mt-1 text-gray-900 font-medium">{trailer.compliance?.inspectionType || 'Not set'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="complianceStatus">Compliance Status</Label>
            {isEditing ? (
              <Select
                value={formData.complianceStatus}
                onValueChange={(value: "Compliant" | "Expired" | "Due Soon") => setFormData({ ...formData, complianceStatus: value })}
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
            ) : (
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trailer.compliance?.complianceStatus || 'Compliant')}`}>
                  {trailer.compliance?.complianceStatus || 'Not Set'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-6">
        <Label htmlFor="notes">Compliance Notes</Label>
        {isEditing ? (
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-custom focus:border-transparent resize-none"
            placeholder="Add any compliance-related notes or special requirements..."
          />
        ) : (
          <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-[60px]">
            <p className="text-gray-900">
              {trailer.compliance?.notes || 'No compliance notes recorded.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
