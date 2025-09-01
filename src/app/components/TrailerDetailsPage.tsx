"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft } from "@phosphor-icons/react";
import { useAppContext } from "../contexts/AppContext";
import { Trailer } from "./AddTrailerDialog";
import BasicInfoTab from "./trailer-tabs/BasicInfoTab";
import CompartmentsTab from "./trailer-tabs/CompartmentsTab";
import ComplianceTab from "./trailer-tabs/ComplianceTab";
import MaintenanceTab from "./trailer-tabs/MaintenanceTab";
import SettingsTab from "./trailer-tabs/SettingsTab";


// Extended trailer interface for detailed view
export interface TrailerDetails extends Trailer {
  compartments: TrailerCompartment[];
  compliance: ComplianceInfo;
  maintenance: MaintenanceInfo;
  latLong: string;
  owner: "Own" | "Third Party";
  depotAssigned: string;
}

export interface TrailerCompartment {
  id: number;
  compartmentNo: number;
  capacity: number; // in liters
  minVolume: number; // in liters
  maxVolume: number; // in liters
  allowedProducts: string[];
  partialLoadAllowed: boolean;
  mustUse: boolean;
}

export interface ComplianceInfo {
  id: number;
  adrExpiryDate: string;
  lastInspectionDate: string;
  nextInspectionDue: string;
  certificateNumber: string;
  inspectionType: "Annual" | "6-Monthly" | "Special";
  complianceStatus: "Compliant" | "Expired" | "Due Soon";
  notes?: string;
}

export interface MaintenanceInfo {
  id: number;
  lastServiceDate: string;
  nextServiceDue: string;
  serviceType: "Routine" | "Repair" | "Emergency" | "Compliance";
  mileage?: number;
  serviceProvider: string;
  cost?: number;
  workDescription: string;
  status: "Completed" | "Scheduled" | "Overdue";
  notes?: string;
}

interface TrailerDetailsPageProps {
  trailer: TrailerDetails;
  onBack: () => void;
  onSave: (updatedTrailer: TrailerDetails) => void;
}

export default function TrailerDetailsPage({
  trailer,
  onBack,
  onSave,
}: TrailerDetailsPageProps) {
  const { setSidebarCollapsed, sidebarCollapsed } = useAppContext();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [localTrailer, setLocalTrailer] = useState<TrailerDetails>(trailer);

  useEffect(() => {
    setLocalTrailer(trailer);
  }, [trailer]);

  // Collapse sidebar when component mounts, restore when unmounting
  useEffect(() => {
    setSidebarCollapsed(true);
    
    return () => {
      setSidebarCollapsed(false);
    };
  }, [setSidebarCollapsed]);

  // Tab configuration with counts
  const tabs = [
    { id: "basic-info", label: "Basic Information", count: null },
    { id: "compartments", label: "Compartments", count: localTrailer.compartments?.length || 0 },
    { id: "compliance", label: "Compliance", count: null },
    { id: "maintenance", label: "Maintenance", count: null },
    { id: "settings", label: "Settings", count: null },
  ];

  const handleSave = (updatedData: Partial<TrailerDetails>) => {
    const updatedTrailer = { ...localTrailer, ...updatedData };
    
    // Auto-calculate numberOfCompartments from compartments array
    if (updatedData.compartments) {
      updatedTrailer.numberOfCompartments = updatedData.compartments.length;
    }
    
    setLocalTrailer(updatedTrailer);
    onSave(updatedTrailer);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic-info":
        return <BasicInfoTab trailer={localTrailer} onSave={handleSave} />;
      case "compartments":
        return <CompartmentsTab trailer={localTrailer} onSave={handleSave} />;
      case "compliance":
        return <ComplianceTab trailer={localTrailer} onSave={handleSave} />;
      case "maintenance":
        return <MaintenanceTab trailer={localTrailer} onSave={handleSave} />;
      case "settings":
        return <SettingsTab trailer={localTrailer} onSave={handleSave} />;
      default:
        return <BasicInfoTab trailer={localTrailer} onSave={handleSave} />;
    }
  };

  return (
    <main
      className={`pt-20 h-screen bg-gray-50 text-gray-900 overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? "ml-16" : "ml-64"
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Header with Title and Back Button */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{localTrailer.trailerName}-<span className="text-2xl text-gray-600">{localTrailer.trailerCode}</span></h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              localTrailer.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {localTrailer.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <Button 
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Trailers
          </Button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={onBack}
                  className="cursor-pointer text-primary-custom hover:text-primary-custom/80"
                >
                  Trailers
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900">Trailer Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-4 flex-shrink-0">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-custom text-primary-custom"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-custom bg-primary-custom/10 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </main>
  );
}
