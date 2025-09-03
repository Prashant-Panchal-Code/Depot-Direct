"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { MagnifyingGlass, Truck, Plus, Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";

interface VehicleAccessTabProps {
  site: SiteDetails;
}

interface VehicleAccess {
  id: number;
  vehicleCode: string;
  vehicleName: string;
  truckName: string;
  truckRegistration: string;
  trailerName: string;
  trailerRegistration: string;
  haulierCompany: string;
  driverName: string;
  driverPhone: string;
  accessLevel: "Authorized" | "Restricted" | "Temporary";
  status: "Active" | "Inactive" | "Maintenance" | "On Route";
  lastAccess?: string;
  volumeCapacity: number; // in liters
  weightCapacity: number; // in kg
  numberOfCompartments: number;
  allowedProducts: string[];
  specialRequirements?: string;
  accessRestrictions?: string;
  currentLocation?: string;
  nextScheduledDelivery?: string;
}

export default function VehicleAccessTab({ site }: VehicleAccessTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAccessLevel, setFilterAccessLevel] = useState("all");
  const [filterHaulier, setFilterHaulier] = useState("all");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleAccess | null>(null);

  // Mock data - would come from API based on site.id
  const [vehicleAccess, setVehicleAccess] = useState<VehicleAccess[]>([
    {
      id: 1,
      vehicleCode: "VH001",
      vehicleName: "Heavy Hauler 1 + Fuel Tanker 1",
      truckName: "Heavy Hauler 1",
      truckRegistration: "ABC-123",
      trailerName: "Fuel Tanker 1",
      trailerRegistration: "XYZ-111",
      haulierCompany: "Express Logistics",
      driverName: "John Driver",
      driverPhone: "+1 (555) 111-2233",
      accessLevel: "Authorized",
      status: "Active",
      lastAccess: "2024-01-15 10:30",
      volumeCapacity: 35000,
      weightCapacity: 28000,
      numberOfCompartments: 4,
      allowedProducts: ["Diesel", "Petrol Unleaded", "Petrol Super"],
      specialRequirements: "Must use designated loading bay #3",
      currentLocation: "Main Depot",
      nextScheduledDelivery: "2024-01-16 08:00"
    },
    {
      id: 2,
      vehicleCode: "VH002",
      vehicleName: "Power Truck 2 + Diesel Tank 2",
      truckName: "Power Truck 2",
      truckRegistration: "DEF-456",
      trailerName: "Diesel Tank 2",
      trailerRegistration: "XYZ-222",
      haulierCompany: "Fast Transport",
      driverName: "Mike Transport",
      driverPhone: "+1 (555) 222-3344",
      accessLevel: "Authorized",
      status: "On Route",
      lastAccess: "2024-01-14 14:20",
      volumeCapacity: 40000,
      weightCapacity: 32000,
      numberOfCompartments: 5,
      allowedProducts: ["Diesel"],
      specialRequirements: "Diesel only deliveries",
      currentLocation: "En route to site",
      nextScheduledDelivery: "2024-01-15 16:00"
    },
    {
      id: 3,
      vehicleCode: "VH005",
      vehicleName: "Fleet Leader 5 + Standard Tank 5",
      truckName: "Fleet Leader 5",
      truckRegistration: "MNO-345",
      trailerName: "Standard Tank 5",
      trailerRegistration: "XYZ-555",
      haulierCompany: "Prime Movers",
      driverName: "Sarah Prime",
      driverPhone: "+1 (555) 333-4455",
      accessLevel: "Restricted",
      status: "Active",
      lastAccess: "2024-01-12 09:15",
      volumeCapacity: 36000,
      weightCapacity: 29000,
      numberOfCompartments: 5,
      allowedProducts: ["Petrol Unleaded", "Petrol Super"],
      specialRequirements: "Petrol products only",
      accessRestrictions: "Daytime deliveries only (6 AM - 6 PM)",
      currentLocation: "West Terminal"
    },
    {
      id: 4,
      vehicleCode: "VH003",
      vehicleName: "Max Capacity 3 + Multi-Product 3",
      truckName: "Max Capacity 3",
      truckRegistration: "GHI-789",
      trailerName: "Multi-Product 3",
      trailerRegistration: "XYZ-333",
      haulierCompany: "Mega Freight",
      driverName: "David Mega",
      driverPhone: "+1 (555) 444-5566",
      accessLevel: "Temporary",
      status: "Maintenance",
      lastAccess: "2024-01-10 11:45",
      volumeCapacity: 38000,
      weightCapacity: 30000,
      numberOfCompartments: 6,
      allowedProducts: ["Diesel", "Petrol Unleaded", "AdBlue"],
      specialRequirements: "Multi-product capability",
      accessRestrictions: "Temporary access until Feb 1 - pending permanent authorization",
      currentLocation: "Maintenance Facility"
    }
  ]);

  const filteredVehicles = vehicleAccess.filter(vehicle => {
    const matchesSearch = vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vehicleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.haulierCompany.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || vehicle.status.toLowerCase() === filterStatus;
    const matchesAccessLevel = filterAccessLevel === "all" || vehicle.accessLevel.toLowerCase() === filterAccessLevel;
    const matchesHaulier = filterHaulier === "all" || vehicle.haulierCompany === filterHaulier;
    
    return matchesSearch && matchesStatus && matchesAccessLevel && matchesHaulier;
  });

  const uniqueHauliers = [...new Set(vehicleAccess.map(vehicle => vehicle.haulierCompany))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      case "On Route": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "Authorized": return "bg-green-100 text-green-800";
      case "Restricted": return "bg-yellow-100 text-yellow-800";
      case "Temporary": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsAddDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: VehicleAccess) => {
    setSelectedVehicle(vehicle);
    setIsViewDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: VehicleAccess) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleRemoveVehicle = (vehicleId: number) => {
    if (confirm("Are you sure you want to remove this vehicle access? This action cannot be undone.")) {
      setVehicleAccess(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
    }
  };

  const handleSaveVehicle = (vehicleData: Partial<VehicleAccess>) => {
    if (selectedVehicle) {
      // Edit existing vehicle
      setVehicleAccess(prev => 
        prev.map(vehicle => 
          vehicle.id === selectedVehicle.id 
            ? { ...vehicle, ...vehicleData }
            : vehicle
        )
      );
    } else {
      // Check if vehicle is already added
      const existingVehicle = vehicleAccess.find(v => v.vehicleCode === vehicleData.vehicleCode);
      if (existingVehicle) {
        alert(`Vehicle ${vehicleData.vehicleName} is already added to this site with ${existingVehicle.accessLevel} access level.`);
        return;
      }

      // Add new vehicle
      const newVehicle: VehicleAccess = {
        id: Math.max(...vehicleAccess.map(v => v.id), 0) + 1,
        vehicleCode: vehicleData.vehicleCode || `VH${String(Math.max(...vehicleAccess.map(v => v.id), 0) + 1).padStart(3, '0')}`,
        vehicleName: vehicleData.vehicleName || "",
        truckName: vehicleData.truckName || "",
        truckRegistration: vehicleData.truckRegistration || "",
        trailerName: vehicleData.trailerName || "",
        trailerRegistration: vehicleData.trailerRegistration || "",
        haulierCompany: vehicleData.haulierCompany || "",
        driverName: vehicleData.driverName || "",
        driverPhone: vehicleData.driverPhone || "",
        accessLevel: (vehicleData.accessLevel as "Authorized" | "Restricted" | "Temporary") || "Authorized",
        status: (vehicleData.status as "Active" | "Inactive" | "Maintenance" | "On Route") || "Active",
        volumeCapacity: vehicleData.volumeCapacity || 0,
        weightCapacity: vehicleData.weightCapacity || 0,
        numberOfCompartments: vehicleData.numberOfCompartments || 1,
        allowedProducts: vehicleData.allowedProducts || [],
        specialRequirements: vehicleData.specialRequirements || "",
        accessRestrictions: vehicleData.accessRestrictions || "",
        currentLocation: vehicleData.currentLocation || ""
      };
      setVehicleAccess(prev => [...prev, newVehicle]);
    }
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Access</h3>
        <p className="text-gray-600">
          Vehicles authorized to make deliveries to <strong>{site.siteName}</strong> ({site.siteCode})
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="on route">On Route</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAccessLevel} onValueChange={setFilterAccessLevel}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Access Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Access Levels</SelectItem>
              <SelectItem value="authorized">Authorized</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterHaulier} onValueChange={setFilterHaulier}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Haulier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hauliers</SelectItem>
              {uniqueHauliers.map((haulier) => (
                <SelectItem key={haulier} value={haulier}>
                  {haulier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddVehicle} className="bg-primary-custom hover:bg-primary-custom/90">
          <Plus size={16} className="mr-2" />
          Add Vehicle Access
        </Button>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredVehicles.length} of {vehicleAccess.length} vehicles with access to this site
        </p>
      </div>

      {/* Vehicle Cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg p-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-blue-100 p-1.5 rounded">
                    <Truck size={16} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{vehicle.vehicleName}</h4>
                    <p className="text-xs text-gray-600 truncate">({vehicle.vehicleCode})</p>
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
                  <span className="font-medium">{(vehicle.volumeCapacity / 1000).toFixed(0)}k L</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{(vehicle.weightCapacity / 1000).toFixed(0)}k kg</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-600">Access:</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getAccessLevelColor(vehicle.accessLevel)}`}>
                    {vehicle.accessLevel}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Compartments:</span>
                  <span className="font-medium">{vehicle.numberOfCompartments}</span>
                </div>
              </div>

              {/* Vehicle Details - compact */}
              <div className="mb-3">
                <div className="text-xs text-gray-600 truncate">
                  {vehicle.truckRegistration} / {vehicle.trailerRegistration}
                </div>
                <div className="text-xs text-gray-900 font-medium truncate">
                  {vehicle.haulierCompany}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 pt-2 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleViewVehicle(vehicle)}
                >
                  <Eye size={12} className="mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleEditVehicle(vehicle)}
                >
                  <PencilSimple size={12} className="mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-6 px-1 text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveVehicle(vehicle.id)}
                >
                  <Trash size={12} className="mr-1" />
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
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all" || filterAccessLevel !== "all" || filterHaulier !== "all"
                ? "No vehicles match your current filters."
                : "No vehicles have been configured with access to this site yet."}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Vehicle Access Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedVehicle(null);
        }
      }}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Add Vehicle Access" : "Edit Vehicle Access"}
            </DialogTitle>
          </DialogHeader>
          <VehicleAccessForm
            vehicle={selectedVehicle}
            existingVehicles={vehicleAccess}
            isEditing={isEditDialogOpen}
            onSave={handleSaveVehicle}
            onCancel={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedVehicle(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Vehicle Access Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vehicle Access Details</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <VehicleAccessDetails
              vehicle={selectedVehicle}
              onEdit={() => {
                setIsViewDialogOpen(false);
                handleEditVehicle(selectedVehicle);
              }}
              onClose={() => setIsViewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Available vehicles mock data - would come from API
const availableVehicles = [
  { id: "VH001", name: "Heavy Hauler 1 + Fuel Tanker 1", truck: "Heavy Hauler 1", truckReg: "ABC-123", trailer: "Fuel Tanker 1", trailerReg: "XYZ-111", haulier: "Express Logistics" },
  { id: "VH002", name: "Power Truck 2 + Diesel Tank 2", truck: "Power Truck 2", truckReg: "DEF-456", trailer: "Diesel Tank 2", trailerReg: "XYZ-222", haulier: "Fast Transport" },
  { id: "VH003", name: "Max Capacity 3 + Multi-Product 3", truck: "Max Capacity 3", truckReg: "GHI-789", trailer: "Multi-Product 3", trailerReg: "XYZ-333", haulier: "Mega Freight" },
  { id: "VH004", name: "Reliable Truck 4 + Standard Tank 4", truck: "Reliable Truck 4", truckReg: "JKL-012", trailer: "Standard Tank 4", trailerReg: "XYZ-444", haulier: "Express Logistics" },
  { id: "VH005", name: "Fleet Leader 5 + Standard Tank 5", truck: "Fleet Leader 5", truckReg: "MNO-345", trailer: "Standard Tank 5", trailerReg: "XYZ-555", haulier: "Prime Movers" },
];

// Vehicle Access Form Component - Enhanced version
interface VehicleAccessFormProps {
  vehicle: VehicleAccess | null;
  existingVehicles: VehicleAccess[];
  isEditing?: boolean;
  onSave: (vehicleData: Partial<VehicleAccess>) => void;
  onCancel: () => void;
}

function VehicleAccessForm({ vehicle, existingVehicles, isEditing = false, onSave, onCancel }: VehicleAccessFormProps) {
  const [formData, setFormData] = useState({
    vehicleCode: vehicle?.vehicleCode || "",
    vehicleName: vehicle?.vehicleName || "",
    truckName: vehicle?.truckName || "",
    truckRegistration: vehicle?.truckRegistration || "",
    trailerName: vehicle?.trailerName || "",
    trailerRegistration: vehicle?.trailerRegistration || "",
    haulierCompany: vehicle?.haulierCompany || "",
    accessLevel: vehicle?.accessLevel || ("Authorized" as "Authorized" | "Restricted" | "Temporary"),
    status: vehicle?.status || ("Active" as "Active" | "Inactive" | "Maintenance" | "On Route")
  });

  // Handle vehicle selection - auto-populate all vehicle details
  const handleVehicleSelect = (vehicleId: string) => {
    const selectedVehicle = availableVehicles.find(v => v.id === vehicleId);
    if (selectedVehicle) {
      setFormData(prev => ({
        ...prev,
        vehicleCode: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        truckName: selectedVehicle.truck,
        truckRegistration: selectedVehicle.truckReg,
        trailerName: selectedVehicle.trailer,
        trailerRegistration: selectedVehicle.trailerReg,
        haulierCompany: selectedVehicle.haulier
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleData: Partial<VehicleAccess> = {
      vehicleCode: formData.vehicleCode,
      vehicleName: formData.vehicleName,
      truckName: formData.truckName,
      truckRegistration: formData.truckRegistration,
      trailerName: formData.trailerName,
      trailerRegistration: formData.trailerRegistration,
      haulierCompany: formData.haulierCompany,
      accessLevel: formData.accessLevel,
      status: formData.status,
      // Set default values for other required fields from the existing interface
      driverName: "",
      driverPhone: "",
      volumeCapacity: 35000, // Default capacity
      weightCapacity: 28000,
      numberOfCompartments: 4,
      allowedProducts: ["Diesel", "Petrol Unleaded", "Petrol Super"],
      currentLocation: "Main Depot",
      specialRequirements: "", // Empty since we removed the field
      accessRestrictions: "" // Empty since we removed the field
    };

    onSave(vehicleData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Vehicle Selection */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Select Vehicle *</label>
        <Select 
          value={formData.vehicleCode} 
          onValueChange={handleVehicleSelect}
          disabled={isEditing}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a vehicle..." />
          </SelectTrigger>
          <SelectContent>
            {isEditing ? (
              // Show only the current vehicle when editing
              <SelectItem value={formData.vehicleCode}>
                <div className="flex flex-col">
                  <span className="font-medium">{formData.vehicleName}</span>
                  <span className="text-xs text-gray-500">{formData.haulierCompany} • {formData.truckRegistration} / {formData.trailerRegistration}</span>
                </div>
              </SelectItem>
            ) : (
              // Show available vehicles when adding
              <>
                {availableVehicles
                  .filter(vehicle => !existingVehicles.some((va: VehicleAccess) => va.vehicleCode === vehicle.id))
                  .map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{vehicle.name}</span>
                      <span className="text-xs text-gray-500">{vehicle.haulier} • {vehicle.truckReg} / {vehicle.trailerReg}</span>
                    </div>
                  </SelectItem>
                ))}
                {availableVehicles.filter(vehicle => !existingVehicles.some((va: VehicleAccess) => va.vehicleCode === vehicle.id)).length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">No available vehicles to add</div>
                )}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Access Level and Status */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Access Level *</label>
        <Select value={formData.accessLevel} onValueChange={(value: "Authorized" | "Restricted" | "Temporary") => setFormData(prev => ({ ...prev, accessLevel: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Authorized">Authorized</SelectItem>
            <SelectItem value="Restricted">Restricted</SelectItem>
            <SelectItem value="Temporary">Temporary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Status *</label>
        <Select value={formData.status} onValueChange={(value: "Active" | "Inactive" | "Maintenance" | "On Route") => setFormData(prev => ({ ...prev, status: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="On Route">On Route</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary-custom hover:bg-primary-custom/90">
          {vehicle ? "Update Access" : "Add Access"}
        </Button>
      </div>
    </form>
  );
}

// Vehicle Access Details Component
interface VehicleAccessDetailsProps {
  vehicle: VehicleAccess;
  onEdit: () => void;
  onClose: () => void;
}

function VehicleAccessDetails({ vehicle, onEdit, onClose }: VehicleAccessDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      case "On Route": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "Authorized": return "bg-green-100 text-green-800";
      case "Restricted": return "bg-yellow-100 text-yellow-800";
      case "Temporary": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{vehicle.vehicleName}</h3>
          <p className="text-sm text-gray-600">{vehicle.vehicleCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vehicle.status)}`}>
            {vehicle.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccessLevelColor(vehicle.accessLevel)}`}>
            {vehicle.accessLevel}
          </span>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Vehicle Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Truck:</span>
              <span className="text-gray-900 font-medium">{vehicle.truckName} ({vehicle.truckRegistration})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trailer:</span>
              <span className="text-gray-900 font-medium">{vehicle.trailerName} ({vehicle.trailerRegistration})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Haulier:</span>
              <span className="text-gray-900 font-medium">{vehicle.haulierCompany}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Volume Capacity:</span>
              <span className="text-gray-900 font-medium">{vehicle.volumeCapacity.toLocaleString()}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight Capacity:</span>
              <span className="text-gray-900 font-medium">{vehicle.weightCapacity.toLocaleString()}kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Compartments:</span>
              <span className="text-gray-900 font-medium">{vehicle.numberOfCompartments}</span>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Access Control</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Access Level:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getAccessLevelColor(vehicle.accessLevel)}`}>
                {vehicle.accessLevel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(vehicle.status)}`}>
                {vehicle.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit} className="bg-primary-custom hover:bg-primary-custom/90">
          Edit Access
        </Button>
      </div>
    </div>
  );
}
