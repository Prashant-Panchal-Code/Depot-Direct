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
import { Parking } from "./AddParkingDialog";
import BasicInfoTab from "./parking-tabs/BasicInfoTab";
import SettingsTab from "./parking-tabs/SettingsTab";

// Extended parking interface for internal use
interface ParkingWithId extends Parking {
  id: number;
  latLong: string;
}

export interface ParkingDetails extends ParkingWithId {
  // Add any additional properties specific to parking details
}

interface ParkingDetailsPageProps {
  parking: ParkingDetails;
  onBack: () => void;
  onSave: (updatedParking: ParkingDetails) => void;
}

export default function ParkingDetailsPage({
  parking,
  onBack,
  onSave,
}: ParkingDetailsPageProps) {
  const { setSidebarCollapsed, sidebarCollapsed } = useAppContext();
  const [activeTab, setActiveTab] = useState("basic-info");

  useEffect(() => {
    // Collapse sidebar when component mounts
    setSidebarCollapsed(true);
    
    // Cleanup: restore sidebar state when component unmounts
    return () => {
      setSidebarCollapsed(false);
    };
  }, [setSidebarCollapsed]);

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving parking:", parking);
    onSave(parking);
  };

  const handleBack = () => {
    setSidebarCollapsed(false); // Restore sidebar when going back
    onBack();
  };

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "settings", label: "Settings" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic-info":
        return <BasicInfoTab parking={parking} onSave={handleSave} />;
      case "settings":
        return <SettingsTab />;
      default:
        return <BasicInfoTab parking={parking} onSave={handleSave} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div 
        className={`h-[calc(100vh-5rem)] flex flex-col py-4 mt-20 transition-all duration-300 ${
          sidebarCollapsed 
            ? 'ml-16 w-[calc(100vw-4rem)] px-4' 
            : 'ml-64 w-[calc(100vw-16rem)] px-4'
        }`}
      >
        {/* Parking Header with Name and Code */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{parking.parkingName}-<span className="text-2xl text-gray-600">{parking.parkingCode}</span></h2>
          </div>
          <Button 
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Parking
          </Button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={handleBack}
                  className="cursor-pointer text-primary-custom hover:text-primary-custom/80"
                >
                  Parkings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900">Parking Details</BreadcrumbPage>
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
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
