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
import { UserApiService, Depot } from "@/lib/api/user";
import { useLoader } from "@/contexts/LoaderContext";
import { useNotification } from "@/hooks/useNotification";
import { SiteDetails } from "./SiteDetailsModal";
import BasicInfoTab from "./depot-tabs/BasicInfoTab";
import ProductsTab from "./depot-tabs/ProductsTab";
import LoadingsTab from "./depot-tabs/LoadingsTab";
import VehiclesDriversTab from "./depot-tabs/VehiclesDriversTab";
import DeliverySitesTab from "./depot-tabs/DeliverySitesTab";
import NotesTab, { Note } from "./site-tabs/NotesTab";
import SettingsTab from "./depot-tabs/SettingsTab";

export interface DepotDetails extends Depot {
  products?: Product[];
  loadings?: Loading[];
  // Ensure we have latLong as string for UI if needed, though API has it
  latLong?: string;
}

export interface Product {
  id: number;
  productId: number;
  productCode: string;
  productName: string;
  status: "Active" | "Inactive";
  costPerLiter: number;
  currentTemperature: number;
  density: number;
  loadingRate: number; // Ltr/min
  depotOfftakeLimit?: boolean;
  dailyMaxLimit?: number; // Liters
  dailyMinLimit?: number; // Liters
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
  const { showLoader, hideLoader } = useLoader();
  const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState("basic-info");

  // Notes state lifted up to manage count properly
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      category: "Maintenance",
      priority: "Medium",
      comment: "Depot inspection completed. All loading bays operational.",
      status: "Closed",
      closingComment: "All issues resolved and documented",
      closedAt: "2024-01-16 10:30",
      closedBy: 0,
      siteId: null,
      depotId: depot.id,
      parkingId: null,
      vehicleId: null,
      companyId: 1,
      createdBy: 1,
      createdByName: "John Smith",
      closedByName: "John Smith",
      createdAt: "2024-01-15 14:30",
      createdDate: "2024-01-15 14:30", // Added to satisfy Note interface
      updatedAt: "2024-01-16 10:30",
      deletedAt: null
    },
    {
      id: 2,
      category: "Delivery Operations",
      priority: "High",
      comment: "New product line requires temperature monitoring system upgrade.",
      status: "In Review",
      closingComment: null,
      closedAt: null,
      closedBy: null,
      siteId: null,
      depotId: depot.id,
      parkingId: null,
      vehicleId: null,
      companyId: 1,
      createdBy: 2,
      createdByName: "Sarah Johnson",
      closedByName: null,
      createdAt: "2024-01-12 09:15",
      createdDate: "2024-01-12 09:15", // Added to satisfy Note interface
      updatedAt: "2024-01-12 09:15",
      deletedAt: null
    },
    {
      id: 3,
      category: "Delivery Operations",
      priority: "Medium",
      comment: "Loading rate optimization completed for Bay 3.",
      status: "Open",
      closingComment: null,
      closedAt: null,
      closedBy: null,
      siteId: null,
      depotId: depot.id,
      parkingId: null,
      vehicleId: null,
      companyId: 1,
      createdBy: 3,
      createdByName: "Mike Davis",
      closedByName: null,
      createdAt: "2024-01-08 16:45",
      createdDate: "2024-01-08 16:45", // Added to satisfy Note interface
      updatedAt: "2024-01-08 16:45",
      deletedAt: null
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

  const handleSave = async (updatedDepot?: DepotDetails) => {
    try {
      showLoader("Saving depot details...");
      const finalDepot = updatedDepot || depot;

      // Helper function to convert 12-hour time to 24-hour format
      const convertTo24Hour = (time12h: string): string => {
        if (!time12h || !time12h.includes(' ')) return "08:00";
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
          hours = '00';
        }

        if (modifier === 'PM') {
          hours = String(parseInt(hours, 10) + 12);
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
      };

      // Convert operating hours to .NET format
      let formattedOperatingHours: any = {};
      if (finalDepot.operatingHours) {
        let operatingHoursObj: any = {};

        // First, get the operating hours as an object
        if (typeof finalDepot.operatingHours === 'string') {
          try {
            operatingHoursObj = JSON.parse(finalDepot.operatingHours);
          } catch {
            operatingHoursObj = {};
          }
        } else {
          operatingHoursObj = finalDepot.operatingHours;
        }

        // Check if it's already in .NET format (has 'mon', 'tue', etc.)
        if (operatingHoursObj.mon || operatingHoursObj.tue || operatingHoursObj.wed) {
          // Already in .NET format, use as-is
          formattedOperatingHours = operatingHoursObj;
        } else {
          // Convert from UI format (Monday, Tuesday, etc.) to .NET format
          const dayMapping: { [key: string]: string } = {
            'Monday': 'mon',
            'Tuesday': 'tue',
            'Wednesday': 'wed',
            'Thursday': 'thu',
            'Friday': 'fri',
            'Saturday': 'sat',
            'Sunday': 'sun'
          };

          Object.entries(operatingHoursObj).forEach(([day, hours]: [string, any]) => {
            const shortDay = dayMapping[day];
            if (shortDay && hours) {
              formattedOperatingHours[shortDay] = {
                open: convertTo24Hour(hours.open),
                close: convertTo24Hour(hours.close),
                closed: hours.closed
              };
            }
          });
        }
      }

      // Prepare the data for the API
      const updateData = {
        depotCode: finalDepot.depotCode,
        depotName: finalDepot.depotName,
        shortcode: finalDepot.shortcode || "",
        latitude: finalDepot.latitude || 0,
        longitude: finalDepot.longitude || 0,
        street: finalDepot.street || "",
        postalCode: finalDepot.postalCode || "",
        town: finalDepot.town || "",
        active: finalDepot.active,
        priority: finalDepot.priority || "Medium",
        loadingBays: finalDepot.loadingBays || 0,
        operatingHours: formattedOperatingHours,
        managerName: finalDepot.managerName || "",
        managerPhone: finalDepot.managerPhone || "",
        managerEmail: finalDepot.managerEmail || "",
        emergencyContact: finalDepot.emergencyContact || "",
        averageLoadingTime: finalDepot.averageLoadingTime || 0,
        maxTruckSize: finalDepot.maxTruckSize || "",
        certifications: finalDepot.certifications || "",
        metadata: finalDepot.metadata || "{}"
      };

      // Call the update API
      await UserApiService.updateDepot(finalDepot.id, updateData);

      // Call parent's onSave with the updated depot
      onSave(finalDepot);

      showSuccess("Depot updated successfully", `${finalDepot.depotName} has been updated`);
    } catch (error) {
      console.error("Failed to update depot:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update depot";
      showError("Failed to update depot", errorMessage);
    } finally {
      hideLoader();
    }
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
        className={`h-[calc(100vh-5rem)] flex flex-col py-4 mt-20 transition-all duration-300 ${sidebarCollapsed
          ? 'ml-16 w-[calc(100vw-4rem)] px-4'
          : 'ml-64 w-[calc(100vw-16rem)] px-4'
          }`}
      >
        {/* Depot Header with Name and Code */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{depot.depotName}-<span className="text-2xl text-gray-600">{depot.depotCode}</span></h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${depot.active
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
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
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
            <ProductsTab
              depot={depot}
              onSave={(updatedProducts) => handleSave({ ...depot, products: updatedProducts })}
            />
          )}
          {activeTab === "loadings" && (
            <LoadingsTab onSave={() => handleSave()} />
          )}
          {activeTab === "vehicles-drivers" && (
            <VehiclesDriversTab />
          )}
          {activeTab === "delivery-sites" && (
            <DeliverySitesTab depot={depot} />
          )}
          {activeTab === "notes" && (
            <NotesTab
              site={{
                ...depot,
                // Map depot properties to SiteDetails just for the NotesTab
                siteCode: depot.depotCode,
                siteName: depot.depotName,
                tanks: [],
                street: depot.street || "",
                postalCode: depot.postalCode || "",
                active: depot.active,
                priority: depot.priority || "Medium",
                id: depot.id,
                latLong: depot.latLong || ""
              } as unknown as SiteDetails}
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

