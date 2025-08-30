"use client";

import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(site);
    setIsEditing(false);
  };

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "inventory", label: "Inventory" },
    { id: "deliveries", label: "Deliveries" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="h-[calc(100vh-5rem)] flex flex-col max-w-7xl mx-auto px-4 py-6 mt-20">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={onBack}
                  className="cursor-pointer text-blue-600 hover:text-blue-700"
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
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Sites
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Details</h1>
            <p className="text-gray-600 mt-1">
              View and manage details for this site
            </p>
          </div>
          {activeTab === "inventory" && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus size={16} className="mr-2" />
              Add New Tank
            </Button>
          )}
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
                    ? "border-blue-500 text-blue-600"
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
              onBack={onBack}
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