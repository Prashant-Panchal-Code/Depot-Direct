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
import { Plus, ArrowLeft } from "@phosphor-icons/react";
import { SiteDetails } from "./SiteDetailsModal";
import { useAppContext } from "../contexts/AppContext";
import BasicInfoTab from "./site-tabs/BasicInfoTab";
import InventoryTab from "./site-tabs/InventoryTab";
import DeliveriesTab from "./site-tabs/DeliveriesTab";
import SettingsTab from "./site-tabs/SettingsTab";


interface SiteDetailsPageProps {
  site: SiteDetails;
  onBack: () => void;
  onSave: (updatedSite: SiteDetails) => void;
}

export default function SiteDetailsPage({
  site,
  onBack,
  onSave,
}: SiteDetailsPageProps) {
  const { setSidebarCollapsed, sidebarCollapsed } = useAppContext();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isEditing, setIsEditing] = useState(false);

  // Collapse sidebar when component mounts, restore when unmounting
  useEffect(() => {
    setSidebarCollapsed(true);
    
    return () => {
      setSidebarCollapsed(false);
    };
  }, [setSidebarCollapsed]);

  const handleSave = () => {
    onSave(site);
    setIsEditing(false);
  };

  const handleBack = () => {
    setSidebarCollapsed(false); // Restore sidebar when going back
    onBack();
  };

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "inventory", label: "Inventory" },
    { id: "deliveries", label: "Deliveries" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div 
        className={`h-[calc(100vh-5rem)] flex flex-col py-6 mt-20 transition-all duration-300 ${
          sidebarCollapsed 
            ? 'ml-16 w-[calc(100vw-4rem)] px-6' 
            : 'ml-64 w-[calc(100vw-16rem)] px-6'
        }`}
      >
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={handleBack}
                  className="cursor-pointer text-primary-custom hover:text-primary-custom/80"
                >
                  Sites
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900">Site Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button 
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Sites
          </Button>
        </div>

 

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6 flex-shrink-0">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
          {activeTab === "basic-info" && (
            <BasicInfoTab
              site={site}
              isEditing={isEditing}
              onSave={handleSave}
              onBack={handleBack}
            />
          )}
          
          {activeTab === "inventory" && <InventoryTab site={site} />}
          
          {activeTab === "deliveries" && <DeliveriesTab site={site} />}
          
          {activeTab === "settings" && <SettingsTab site={site} />}
        </div>
      </div>
    </div>
  );
}