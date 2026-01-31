"use client";

import { useState, useEffect } from "react";
import { UserApiService } from "@/lib/api/user";
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
import { SiteDetails } from "./SiteDetailsModal";
import { useAppContext } from "../contexts/AppContext";
import { useLoader } from "@/contexts/LoaderContext";
import { useNotification } from "@/hooks/useNotification";
import BasicInfoTab from "./site-tabs/BasicInfoTab";
import InventoryTab from "./site-tabs/InventoryTab";
import DeliveriesTab from "./site-tabs/DeliveriesTab";
import SettingsTab from "./site-tabs/SettingsTab";
import NotesTab, { Note } from "./site-tabs/NotesTab";
import DepotAccessTab from "./site-tabs/DepotAccessTab";
import VehicleAccessTab from "./site-tabs/VehicleAccessTab";


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
  const { showLoader, hideLoader } = useLoader();
  const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState("basic-info");

  // Notes state lifted up to manage count properly
  const [notes, setNotes] = useState<Note[]>([]);

  const openNotesCount = notes.filter(note => note.status !== "Closed").length;

  // Collapse sidebar when component mounts, restore when unmounting
  useEffect(() => {
    setSidebarCollapsed(true);

    return () => {
      setSidebarCollapsed(false);
    };
  }, [setSidebarCollapsed]);

  const handleSave = async (updatedSite: SiteDetails) => {
    try {
      showLoader("Saving site details...");
      // Helper function to convert 12-hour time to 24-hour format
      const convertTo24Hour = (time12h: string): string => {
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
      if (updatedSite.operatingHours) {
        let operatingHoursObj: any = {};

        // First, get the operating hours as an object
        if (typeof updatedSite.operatingHours === 'string') {
          try {
            operatingHoursObj = JSON.parse(updatedSite.operatingHours);
          } catch {
            operatingHoursObj = {};
          }
        } else {
          operatingHoursObj = updatedSite.operatingHours;
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
        siteCode: updatedSite.siteCode,
        siteName: updatedSite.siteName,
        shortcode: updatedSite.shortcode || "",
        latitude: parseFloat(updatedSite.latLong?.split(',')[0]?.trim() || "0"),
        longitude: parseFloat(updatedSite.latLong?.split(',')[1]?.trim() || "0"),
        street: updatedSite.street,
        postalCode: updatedSite.postalCode,
        town: updatedSite.town || "",
        active: updatedSite.active,
        priority: updatedSite.priority,
        contactPerson: updatedSite.contactPerson || "",
        phone: updatedSite.phone || "",
        email: updatedSite.email || "",
        operatingHours: formattedOperatingHours,
        depotId: updatedSite.depotId || 0,
        deliveryStopped: updatedSite.deliveryStopped || false,
        pumpedRequired: updatedSite.pumpedRequired || false,
        metadata: ""
      };

      // Call the update API
      await UserApiService.updateSite(updatedSite.id, updateData);

      // Call parent's onSave with the updated site
      onSave(updatedSite);

      showSuccess("Site updated successfully", `${updatedSite.siteName} has been updated`);
    } catch (error) {
      console.error("Failed to update site:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update site";
      showError("Failed to update site", errorMessage);
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
    { id: "inventory", label: "Inventory" },
    { id: "deliveries", label: "Deliveries" },
    { id: "depot-access", label: "Depot Access" },
    { id: "vehicle-access", label: "Vehicle Access" },
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
        {/* Site Header with Name and Code */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">{site.siteName}-<span className="text-2xl text-gray-600">{site.siteCode}</span></h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${site.active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}>
              {site.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <Button
            onClick={handleBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Sites
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
                  Sites
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900">Site Details</BreadcrumbPage>
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
            <BasicInfoTab
              site={site}
              onSave={handleSave}
            />
          )}

          {activeTab === "inventory" && <InventoryTab site={site} />}

          {activeTab === "deliveries" && <DeliveriesTab />}

          {activeTab === "depot-access" && <DepotAccessTab site={site} />}

          {activeTab === "vehicle-access" && <VehicleAccessTab site={site} />}

          {activeTab === "notes" && (
            <NotesTab
              site={site}
              notes={notes}
              setNotes={setNotes}
            />
          )}

          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}