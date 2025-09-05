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
import { Vehicle } from "./AddVehicleDialog";
import { TrailerCompartment } from "./TrailerDetailsPage";
import BasicInfoTab from "./vehicle-tabs/BasicInfoTab";
import TrailersTab from "./vehicle-tabs/TrailersTab";
import BlueprintTab, { Blueprint } from "./vehicle-tabs/BlueprintTab";


// Extended vehicle interface for detailed view
export interface VehicleDetails extends Vehicle {
  // Additional fields that might be needed for vehicle details
  lastMaintenanceDate?: string;
  nextMaintenanceDue?: string;
  totalMileage?: number;
  fuelEfficiency?: number;
  insuranceExpiryDate?: string;
  notes?: string;
  assignedTrailers?: VehicleTrailer[]; // Trailers assigned to this vehicle
  blueprint?: Blueprint; // Blueprint data for the vehicle
}

// Trailer assignment interface for vehicle trailers
export interface VehicleTrailer {
  id: number;
  trailerId: number;
  trailerName: string;
  trailerCode: string;
  registrationNumber: string;
  volumeCapacity: number;
  weightCapacity: number;
  trailerSequence: number; // Sequence/order of the trailer (1st, 2nd, 3rd, etc.)
  isPrimary: boolean; // First trailer attached during vehicle creation
  assignedDate: string;
  compartments?: TrailerCompartment[]; // Compartment details for this trailer
}

interface VehicleDetailsPageProps {
  vehicle: VehicleDetails;
  onBack: () => void;
  onSave: (vehicleId: number, data: Partial<VehicleDetails>) => void;
}

export default function VehicleDetailsPage({ vehicle, onBack, onSave }: VehicleDetailsPageProps) {
  const { sidebarCollapsed } = useAppContext();
  const [activeTab, setActiveTab] = useState("basic-info");
  
  // Add mock assigned trailers data directly during initialization
  const initialVehicle: VehicleDetails = {
    ...vehicle,
    assignedTrailers: [
      {
        id: 101,
        trailerId: 1,
        trailerName: "Standard Tank 1",
        trailerCode: "TRL001",
        registrationNumber: "XYZ-111",
        volumeCapacity: 35000,
        weightCapacity: 28000,
        trailerSequence: 1,
        isPrimary: true,
        assignedDate: "2024-01-15",
        compartments: [
          { id: 1, compartmentNo: 1, capacity: 17500, minVolume: 3000, maxVolume: 17500, allowedProducts: ["Diesel", "Heating Oil"], partialLoadAllowed: true, mustUse: false },
          { id: 2, compartmentNo: 2, capacity: 17500, minVolume: 3000, maxVolume: 17500, allowedProducts: ["Petrol Unleaded"], partialLoadAllowed: true, mustUse: false },
        ]
      },
      {
        id: 102,
        trailerId: 3,
        trailerName: "Multi-Product 3",
        trailerCode: "TRL003",
        registrationNumber: "XYZ-333",
        volumeCapacity: 38000,
        weightCapacity: 30000,
        trailerSequence: 2,
        isPrimary: false,
        assignedDate: "2024-01-18",
        compartments: [
          { id: 6, compartmentNo: 1, capacity: 12000, minVolume: 2000, maxVolume: 12000, allowedProducts: ["Diesel"], partialLoadAllowed: true, mustUse: false },
          { id: 7, compartmentNo: 2, capacity: 13000, minVolume: 2000, maxVolume: 13000, allowedProducts: ["Petrol Unleaded", "Petrol Super"], partialLoadAllowed: true, mustUse: false },
          { id: 8, compartmentNo: 3, capacity: 13000, minVolume: 2000, maxVolume: 13000, allowedProducts: ["Heating Oil", "Kerosene"], partialLoadAllowed: false, mustUse: true },
        ]
      }
    ]
  };
  
  const [localVehicle, setLocalVehicle] = useState<VehicleDetails>(initialVehicle);

  // Update local vehicle ONLY when prop vehicleId changes, but keep our assigned trailers
  useEffect(() => {
    if (vehicle.id !== localVehicle.id) {
      setLocalVehicle(prev => ({
        ...vehicle,
        assignedTrailers: prev.assignedTrailers
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle.id]);

  const handleSave = (data: Partial<VehicleDetails>) => {
    // Only update if there's actual data to update
    if (Object.keys(data).length > 0) {
      const updatedVehicle = { ...localVehicle, ...data };
      setLocalVehicle(updatedVehicle);
      onSave(vehicle.id, data);
    }
  };

  // Create tabs with dynamic counts - using a function to ensure we always get the latest count
  const getTabs = () => {
    // Force a re-calculation of the count each time this function is called
    const currentTrailerCount = localVehicle.assignedTrailers?.length || 0;
    
    return [
      { id: "basic-info", label: "Basic Information", count: null },
      { id: "blueprint", label: "Blueprint", count: null },
      { id: "trailers", label: "Trailers", count: currentTrailerCount },
      // Additional tabs can be added here in the future
      // { id: "maintenance", label: "Maintenance", count: null },
      // { id: "assignments", label: "Assignments", count: null },
      // { id: "settings", label: "Settings", count: null },
    ];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic-info":
        return <BasicInfoTab vehicle={localVehicle} onSave={handleSave} />;
      case "blueprint":
        return <BlueprintTab vehicle={localVehicle} onSave={handleSave} />;
      case "trailers":
        return <TrailersTab vehicle={localVehicle} onSave={handleSave} />;
      default:
        return <BasicInfoTab vehicle={localVehicle} onSave={handleSave} />;
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
            <h2 className="text-2xl font-bold text-gray-900">{localVehicle.vehicleName}</h2>
            <span className="text-2xl text-gray-600">-{localVehicle.vehicleCode}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              localVehicle.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {localVehicle.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <Button 
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Fleet
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
                  Vehicles
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900">Fleet Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-4 flex-shrink-0">
          <div className="flex space-x-6">
            {getTabs().map((tab) => (
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
                {tab.id === 'trailers' && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-custom bg-primary-custom/10 rounded-full">
                    {localVehicle.assignedTrailers?.length || 0}
                  </span>
                )}
                {tab.id !== 'trailers' && tab.count !== null && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-custom bg-primary-custom/10 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0">
          {renderTabContent()}
        </div>
      </div>
    </main>
  );
}
