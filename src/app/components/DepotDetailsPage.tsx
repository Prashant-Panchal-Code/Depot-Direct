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
import { Depot } from "./AddDepotDialog";
import { SiteDetails } from "./SiteDetailsModal";
import BasicInfoTab from "./depot-tabs/BasicInfoTab";
import ProductsTab from "./depot-tabs/ProductsTab";
import LoadingsTab from "./depot-tabs/LoadingsTab";
import VehiclesDriversTab from "./depot-tabs/VehiclesDriversTab";
import DeliverySitesTab from "./depot-tabs/DeliverySitesTab";
import NotesTab, { Note } from "./site-tabs/NotesTab";
import SettingsTab from "./depot-tabs/SettingsTab";


// Extended depot interface for internal use
interface DepotWithId extends Depot {
  id: number;
  latLong: string;
}

export interface DepotDetails extends DepotWithId {
  products?: Product[];
  loadings?: Loading[];
}

export interface Product {
  id: number;
  productCode: string;
  productName: string;
  status: "Active" | "Inactive";
  costPerLiter: number;
  currentTemperature: number;
  density: number;
  loadingRate: number; // Ltr/min
  depotOfftakeLimit?: boolean;
  monthlyMaxLimit?: number; // Liters
  monthlyMinLimit?: number; // Liters
}

export interface Loading {
  id: number;
  truckId: string;
  truckNumber: string;
  productCode: string;
  productName: string;
  quantity: number;
  loadedDate?: string;
  plannedDate?: string;
  status: "Completed" | "Planned" | "In Progress";
  loadingRate: number;
  startTime?: string;
  endTime?: string;
}

interface DepotDetailsPageProps {
  depot: DepotDetails;
  onBack: () => void;
  onSave: (updatedDepot: DepotDetails) => void;
}

export default function DepotDetailsPage({
  depot,
  onBack,
  onSave,
}: DepotDetailsPageProps) {
  const { setSidebarCollapsed, sidebarCollapsed } = useAppContext();
  const [activeTab, setActiveTab] = useState("basic-info");

  // Notes state lifted up to manage count properly
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      createdDate: "2024-01-15 14:30",
      createdBy: "John Smith",
      comment: "Depot inspection completed. All loading bays operational.",
      priority: "Medium" as const,
      category: "Maintenance" as const,
      status: "Closed" as const,
      closedDate: "2024-01-16 10:30",
      closedBy: "John Smith",
      closingComment: "All issues resolved and documented"
    },
    {
      id: 2,
      createdDate: "2024-01-12 09:15",
      createdBy: "Sarah Johnson",
      comment: "New product line requires temperature monitoring system upgrade.",
      priority: "High" as const,
      category: "Operations" as const,
      status: "In Review" as const
    },
    {
      id: 3,
      createdDate: "2024-01-08 16:45",
      createdBy: "Mike Davis",
      comment: "Loading rate optimization completed for Bay 3.",
      priority: "Medium" as const,
      category: "Operations" as const,
      status: "Open" as const
    }
  ]);

  const openNotesCount = notes.filter(note => note.status !== "Closed").length;

  // Collapse sidebar when component mounts, restore when unmounting
  useEffect(() => {
    setSidebarCollapsed(true);
    
    return () => {
      setSidebarCollapsed(false);
    };
  }, [setSidebarCollapsed]);

  const handleSave = () => {
    onSave(depot);
  };

  const handleBack = () => {
    setSidebarCollapsed(false); // Restore sidebar when going back
    onBack();
  };

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "products", label: "Products" },
    { id: "loadings", label: "Loadings" },
    { id: "vehicles-drivers", label: "Vehicles & Drivers" },
    { id: "delivery-sites", label: "Delivery Sites" },
    { id: "notes", label: `Notes${openNotesCount > 0 ? ` (${openNotesCount})` : ''}` },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div 
        className={`h-[calc(100vh-5rem)] flex flex-col py-4 mt-20 transition-all duration-300 ${
          sidebarCollapsed 
            ? 'ml-16 w-[calc(100vw-4rem)] px-4' 
            : 'ml-64 w-[calc(100vw-16rem)] px-4'
        }`}
      >
        {/* Depot Header with Name and Code */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{depot.depotName}-<span className="text-2xl text-gray-600">{depot.depotCode}</span></h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              depot.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {depot.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <Button 
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Depot
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
                  Depots
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900">Depot Details</BreadcrumbPage>
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
          {activeTab === "basic-info" && (
            <BasicInfoTab depot={depot} onSave={handleSave} />
          )}
          {activeTab === "products" && (
            <ProductsTab onSave={handleSave} />
          )}
          {activeTab === "loadings" && (
            <LoadingsTab onSave={handleSave} />
          )}
          {activeTab === "vehicles-drivers" && (
            <VehiclesDriversTab onSave={handleSave} />
          )}
          {activeTab === "delivery-sites" && (
            <DeliverySitesTab onSave={handleSave} />
          )}
          {activeTab === "notes" && (
            <NotesTab 
              site={{
                ...depot,
                siteCode: depot.depotCode,
                siteName: depot.depotName,
                tanks: []
              } as SiteDetails} // Type compatibility - using depot as site for notes
              notes={notes} 
              setNotes={setNotes}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab />
          )}
        </div>
      </div>
    </div>
  );
}
