"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, User, Plus, MagnifyingGlass, Funnel } from "@phosphor-icons/react";

interface Vehicle {
  id: number;
  truckNumber: string;
  truckType: string;
  capacity: number;
  status: "Active" | "Maintenance" | "Inactive";
  driver: string;
  driverId: number;
  lastAccessed: string;
  accessLevel: "Full" | "Limited" | "Emergency Only";
}

interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  contactNumber: string;
  status: "Active" | "Inactive";
  accessLevel: "Full" | "Limited" | "Emergency Only";
  lastAccessed: string;
  certifications: string[];
}

interface VehiclesDriversTabProps {
  onSave: () => void;
}

export default function VehiclesDriversTab({ onSave }: VehiclesDriversTabProps) {
  const [activeSubTab, setActiveSubTab] = useState("vehicles");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data for vehicles with access to this depot
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 1,
      truckNumber: "TRK-001",
      truckType: "Tanker",
      capacity: 25000,
      status: "Active",
      driver: "John Smith",
      driverId: 1,
      lastAccessed: "2024-01-15 14:30",
      accessLevel: "Full"
    },
    {
      id: 2,
      truckNumber: "TRK-002",
      truckType: "Tanker",
      capacity: 35000,
      status: "Active",
      driver: "Mike Johnson",
      driverId: 2,
      lastAccessed: "2024-01-14 09:15",
      accessLevel: "Full"
    },
    {
      id: 3,
      truckNumber: "TRK-003",
      truckType: "Delivery",
      capacity: 15000,
      status: "Maintenance",
      driver: "Sarah Davis",
      driverId: 3,
      lastAccessed: "2024-01-10 16:45",
      accessLevel: "Limited"
    },
    {
      id: 4,
      truckNumber: "TRK-004",
      truckType: "Emergency",
      capacity: 10000,
      status: "Active",
      driver: "Robert Brown",
      driverId: 4,
      lastAccessed: "2024-01-12 11:20",
      accessLevel: "Emergency Only"
    }
  ]);

  // Mock data for drivers with access to this depot
  const [drivers] = useState<Driver[]>([
    {
      id: 1,
      name: "John Smith",
      licenseNumber: "DL12345",
      contactNumber: "+1-555-0101",
      status: "Active",
      accessLevel: "Full",
      lastAccessed: "2024-01-15 14:30",
      certifications: ["Hazmat", "CDL Class A"]
    },
    {
      id: 2,
      name: "Mike Johnson",
      licenseNumber: "DL12346",
      contactNumber: "+1-555-0102",
      status: "Active",
      accessLevel: "Full",
      lastAccessed: "2024-01-14 09:15",
      certifications: ["CDL Class A", "Defensive Driving"]
    },
    {
      id: 3,
      name: "Sarah Davis",
      licenseNumber: "DL12347",
      contactNumber: "+1-555-0103",
      status: "Active",
      accessLevel: "Limited",
      lastAccessed: "2024-01-10 16:45",
      certifications: ["CDL Class B"]
    },
    {
      id: 4,
      name: "Robert Brown",
      licenseNumber: "DL12348",
      contactNumber: "+1-555-0104",
      status: "Active",
      accessLevel: "Emergency Only",
      lastAccessed: "2024-01-12 11:20",
      certifications: ["Emergency Response", "CDL Class A"]
    },
    {
      id: 5,
      name: "Lisa Wilson",
      licenseNumber: "DL12349",
      contactNumber: "+1-555-0105",
      status: "Inactive",
      accessLevel: "Limited",
      lastAccessed: "2023-12-20 10:15",
      certifications: ["CDL Class B"]
    }
  ]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.truckNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || vehicle.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || driver.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "Full":
        return "bg-blue-100 text-blue-800";
      case "Limited":
        return "bg-orange-100 text-orange-800";
      case "Emergency Only":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const subTabs = [
    { id: "vehicles", label: "Vehicles", icon: Truck },
    { id: "drivers", label: "Drivers", icon: User },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Sub-tab Navigation */}
      <div className="border-b border-gray-200 mb-4 flex-shrink-0">
        <div className="flex space-x-6">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeSubTab === tab.id
                  ? "border-primary-custom text-primary-custom"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={`Search ${activeSubTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Funnel size={16} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              {activeSubTab === "vehicles" && <SelectItem value="maintenance">Maintenance</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-primary-custom hover:bg-primary-custom/90">
          <Plus size={16} className="mr-2" />
          Add {activeSubTab === "vehicles" ? "Vehicle" : "Driver"} Access
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSubTab === "vehicles" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1.5 rounded">
                        <Truck size={16} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{vehicle.truckNumber}</h4>
                        <p className="text-xs text-gray-600 truncate">{vehicle.truckType}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{(vehicle.capacity / 1000).toFixed(0)}k L</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Driver:</span>
                      <span className="font-medium truncate ml-2">{vehicle.driver.split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-gray-600">Access:</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getAccessLevelColor(vehicle.accessLevel)}`}>
                        {vehicle.accessLevel === "Emergency Only" ? "Emergency" : vehicle.accessLevel}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-6 px-2">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-6 px-2 text-red-600 hover:text-red-700">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <Truck size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your search or filters." 
                    : "Add vehicle access to get started."
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "drivers" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredDrivers.map((driver) => (
                <div key={driver.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-1.5 rounded">
                        <User size={16} className="text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{driver.name}</h4>
                        <p className="text-xs text-gray-600 truncate">{driver.licenseNumber}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                      {driver.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium truncate ml-2">{driver.contactNumber.split('-').slice(-1)[0]}</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-gray-600">Access:</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getAccessLevelColor(driver.accessLevel)}`}>
                        {driver.accessLevel === "Emergency Only" ? "Emergency" : driver.accessLevel}
                      </span>
                    </div>
                    
                    {/* Certifications - show count only */}
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Certs:</span>
                      <div className="relative group">
                        <span className="font-medium cursor-help">{driver.certifications.length} cert{driver.certifications.length !== 1 ? 's' : ''}</span>
                        {/* Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          {driver.certifications.join(', ')}
                          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-6 px-2">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-6 px-2 text-red-600 hover:text-red-700">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDrivers.length === 0 && (
              <div className="text-center py-12">
                <User size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your search or filters." 
                    : "Add driver access to get started."
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
