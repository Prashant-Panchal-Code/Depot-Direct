"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Truck, User, Plus, MagnifyingGlass, Funnel, PencilSimple, Trash } from "@phosphor-icons/react";

interface Vehicle {
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface VehiclesDriversTabProps {
  // This interface is intentionally empty as no props are currently used
}

export default function VehiclesDriversTab({}: VehiclesDriversTabProps) {
  const [activeSubTab, setActiveSubTab] = useState("vehicles");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("");
  const [isAddDriverDialogOpen, setIsAddDriverDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedDriverAccessLevel, setSelectedDriverAccessLevel] = useState("");
  
  // Edit states
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [selectedVehicleStatus, setSelectedVehicleStatus] = useState("");
  const [selectedDriverStatus, setSelectedDriverStatus] = useState("");

  // Mock data for all available vehicles (pool of vehicles)
  const [allAvailableVehicles] = useState([
    { id: "VH006", name: "Reliable Truck 6 + Standard Tank 6", truck: "Reliable Truck 6", truckReg: "PQR-678", trailer: "Standard Tank 6", trailerReg: "XYZ-666", haulier: "Express Logistics" },
    { id: "VH007", name: "Power Truck 7 + Diesel Tank 7", truck: "Power Truck 7", truckReg: "STU-901", trailer: "Diesel Tank 7", trailerReg: "XYZ-777", haulier: "Fast Transport" },
    { id: "VH008", name: "Heavy Hauler 8 + Multi-Product 8", truck: "Heavy Hauler 8", truckReg: "VWX-234", trailer: "Multi-Product 8", trailerReg: "XYZ-888", haulier: "Mega Freight" },
    { id: "VH009", name: "Fleet Leader 9 + Standard Tank 9", truck: "Fleet Leader 9", truckReg: "YZA-567", trailer: "Standard Tank 9", trailerReg: "XYZ-999", haulier: "Prime Movers" },
    { id: "VH010", name: "Max Capacity 10 + Fuel Tanker 10", truck: "Max Capacity 10", truckReg: "BCD-890", trailer: "Fuel Tanker 10", trailerReg: "XYZ-101", haulier: "Express Logistics" },
  ]);

  // Mock data for all available drivers (pool of drivers)
  const [allAvailableDrivers] = useState([
    { id: 6, name: "Tom Wilson", licenseNumber: "DL12350" },
    { id: 7, name: "Emily Johnson", licenseNumber: "DL12351" },
    { id: 8, name: "David Martinez", licenseNumber: "DL12352" },
    { id: 9, name: "Anna Chen", licenseNumber: "DL12353" },
    { id: 10, name: "Robert Brown", licenseNumber: "DL12354" },
    { id: 11, name: "Lisa White", licenseNumber: "DL12355" },
  ]);

  // Mock data for vehicles with access to this depot
  const [vehicles, setVehicles] = useState<Vehicle[]>([
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

  // Mock data for drivers with access to this depot
  const [drivers, setDrivers] = useState<Driver[]>([
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

  // Filter out vehicles that already have access to this depot
  const availableVehicles = useMemo(() => 
    allAvailableVehicles.filter(
      vehicle => !vehicles.find(v => v.vehicleCode === vehicle.id)
    ), [allAvailableVehicles, vehicles]
  );

  // Filter out drivers that already have access to this depot
  const availableDrivers = useMemo(() => 
    allAvailableDrivers.filter(
      driver => !drivers.find(d => d.name === driver.name)
    ), [allAvailableDrivers, drivers]
  );

  const handleAddVehicleAccess = () => {
    if (selectedVehicle && selectedAccessLevel) {
      // Check if vehicle already exists
      const existingVehicle = vehicles.find(v => v.vehicleCode === selectedVehicle);
      if (existingVehicle) {
        alert("This vehicle already has access to this depot. Please select a different vehicle or edit the existing one.");
        return;
      }

      // Find the selected vehicle details
      const selectedVehicleDetails = allAvailableVehicles.find(v => v.id === selectedVehicle);
      if (!selectedVehicleDetails) return;

      const newVehicle: Vehicle = {
        id: vehicles.length + 1,
        vehicleCode: selectedVehicle,
        vehicleName: selectedVehicleDetails.name,
        truckName: selectedVehicleDetails.truck,
        truckRegistration: selectedVehicleDetails.truckReg,
        trailerName: selectedVehicleDetails.trailer,
        trailerRegistration: selectedVehicleDetails.trailerReg,
        haulierCompany: selectedVehicleDetails.haulier,
        driverName: "",
        driverPhone: "",
        accessLevel: selectedAccessLevel as "Authorized" | "Restricted" | "Temporary",
        status: "Active",
        lastAccess: new Date().toISOString().slice(0, 16).replace('T', ' '),
        volumeCapacity: 35000,
        weightCapacity: 28000,
        numberOfCompartments: 4,
        allowedProducts: ["Diesel", "Petrol Unleaded", "Petrol Super"],
        currentLocation: "Main Depot"
      };
      
      setVehicles(prev => [...prev, newVehicle]);
      setIsAddVehicleDialogOpen(false);
      setSelectedVehicle("");
      setSelectedAccessLevel("");
      // Don't call onSave to avoid navigation
    }
  };

  const handleAddDriverAccess = () => {
    if (selectedDriver && selectedDriverAccessLevel) {
      // Check if driver already exists
      const existingDriver = drivers.find(d => d.name === selectedDriver);
      if (existingDriver) {
        alert("This driver already has access to this depot. Please select a different driver or edit the existing one.");
        return;
      }

      const newDriver: Driver = {
        id: drivers.length + 1,
        name: selectedDriver,
        licenseNumber: `DL${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`, // Generate random license
        contactNumber: "+1-555-0000", // Default contact
        status: "Active",
        accessLevel: selectedDriverAccessLevel as "Full" | "Limited" | "Emergency Only",
        lastAccessed: new Date().toISOString().slice(0, 16).replace('T', ' '),
        certifications: ["CDL Class A"] // Default certification
      };
      
      setDrivers(prev => [...prev, newDriver]);
      setIsAddDriverDialogOpen(false);
      setSelectedDriver("");
      setSelectedDriverAccessLevel("");
      // Don't call onSave to avoid navigation
    }
  };

  // Vehicle handlers
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setSelectedVehicle(vehicle.vehicleCode);
    setSelectedAccessLevel(vehicle.accessLevel);
    setSelectedVehicleStatus(vehicle.status);
    setIsAddVehicleDialogOpen(true);
  };

  const handleUpdateVehicle = () => {
    if (editingVehicle && selectedVehicle && selectedAccessLevel) {
      const updatedVehicle: Vehicle = {
        ...editingVehicle,
        vehicleCode: selectedVehicle,
        accessLevel: selectedAccessLevel as "Authorized" | "Restricted" | "Temporary",
        status: selectedVehicleStatus as "Active" | "Inactive" | "Maintenance" | "On Route",
        lastAccess: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? updatedVehicle : v));
      setIsAddVehicleDialogOpen(false);
      setEditingVehicle(null);
      setSelectedVehicle("");
      setSelectedAccessLevel("");
      setSelectedVehicleStatus("");
    }
  };

  const handleRemoveVehicle = (vehicleId: number) => {
    if (confirm("Are you sure you want to remove this vehicle access? This action cannot be undone.")) {
      setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    }
  };

  // Driver handlers
  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setSelectedDriver(driver.name);
    setSelectedDriverAccessLevel(driver.accessLevel);
    setSelectedDriverStatus(driver.status);
    setIsAddDriverDialogOpen(true);
  };

  const handleUpdateDriver = () => {
    if (editingDriver && selectedDriver && selectedDriverAccessLevel) {
      const updatedDriver: Driver = {
        ...editingDriver,
        name: selectedDriver,
        accessLevel: selectedDriverAccessLevel as "Full" | "Limited" | "Emergency Only",
        status: selectedDriverStatus as "Active" | "Inactive",
        lastAccessed: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? updatedDriver : d));
      setIsAddDriverDialogOpen(false);
      setEditingDriver(null);
      setSelectedDriver("");
      setSelectedDriverAccessLevel("");
      setSelectedDriverStatus("");
    }
  };

  const handleRemoveDriver = (driverId: number) => {
    if (confirm("Are you sure you want to remove this driver access? This action cannot be undone.")) {
      setDrivers(prev => prev.filter(d => d.id !== driverId));
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vehicleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.haulierCompany.toLowerCase().includes(searchTerm.toLowerCase());
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
      case "Authorized":
        return "bg-green-100 text-green-800";
      case "Restricted":
        return "bg-yellow-100 text-yellow-800";
      case "Temporary":
        return "bg-orange-100 text-orange-800";
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
              {activeSubTab === "vehicles" && <SelectItem value="on route">On Route</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        {activeSubTab === "vehicles" ? (
          <Dialog open={isAddVehicleDialogOpen} onOpenChange={setIsAddVehicleDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary-custom hover:bg-primary-custom/90" 
                disabled={!editingVehicle && availableVehicles.length === 0}
                title={!editingVehicle && availableVehicles.length === 0 ? "No vehicles available to add" : ""}
              >
                <Plus size={16} className="mr-2" />
                Add Vehicle Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingVehicle ? 'Edit Vehicle Access' : 'Add Vehicle Access'}</DialogTitle>
                <DialogDescription>
                  {editingVehicle ? 'Update access level and status for this vehicle.' : 'Select a vehicle and assign access level to this depot.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-select">Vehicle</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle} disabled={!!editingVehicle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {editingVehicle && !availableVehicles.find(v => v.id === editingVehicle.vehicleCode) && (
                        <SelectItem key={`current-${editingVehicle.id}`} value={editingVehicle.vehicleCode}>
                          {editingVehicle.vehicleName} (Current)
                        </SelectItem>
                      )}
                      {!editingVehicle && availableVehicles.length > 0 && availableVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{vehicle.name}</span>
                            <span className="text-xs text-gray-500">{vehicle.haulier} • {vehicle.truckReg} / {vehicle.trailerReg}</span>
                          </div>
                        </SelectItem>
                      ))}
                      {!editingVehicle && availableVehicles.length === 0 && (
                        <SelectItem value="no-vehicles" disabled>
                          No available vehicles - all vehicles already have access
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access-select">Access Level</Label>
                  <Select value={selectedAccessLevel} onValueChange={setSelectedAccessLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Authorized">Authorized</SelectItem>
                      <SelectItem value="Restricted">Restricted</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingVehicle && (
                  <div className="space-y-2">
                    <Label htmlFor="status-select">Status</Label>
                    <Select value={selectedVehicleStatus} onValueChange={setSelectedVehicleStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="On Route">On Route</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddVehicleDialogOpen(false);
                      setEditingVehicle(null);
                      setSelectedVehicle("");
                      setSelectedAccessLevel("");
                      setSelectedVehicleStatus("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingVehicle ? handleUpdateVehicle : handleAddVehicleAccess}
                    disabled={!selectedVehicle || !selectedAccessLevel || (!!editingVehicle && !selectedVehicleStatus)}
                    className="bg-primary-custom hover:bg-primary-custom/90"
                  >
                    {editingVehicle ? 'Update Access' : 'Add Access'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={isAddDriverDialogOpen} onOpenChange={setIsAddDriverDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary-custom hover:bg-primary-custom/90"
                disabled={!editingDriver && availableDrivers.length === 0}
                title={!editingDriver && availableDrivers.length === 0 ? "No drivers available to add" : ""}
              >
                <Plus size={16} className="mr-2" />
                Add Driver Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingDriver ? 'Edit Driver Access' : 'Add Driver Access'}</DialogTitle>
                <DialogDescription>
                  {editingDriver ? 'Update access level and status for this driver.' : 'Select a driver and assign access level to this depot.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="driver-select">Driver</Label>
                  <Select value={selectedDriver} onValueChange={setSelectedDriver} disabled={!!editingDriver}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {editingDriver && !availableDrivers.find(d => d.name === editingDriver.name) && (
                        <SelectItem key={`current-${editingDriver.id}`} value={editingDriver.name}>
                          {editingDriver.name} - {editingDriver.licenseNumber} (Current)
                        </SelectItem>
                      )}
                      {!editingDriver && availableDrivers.length > 0 && availableDrivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.name}>
                          {driver.name} - {driver.licenseNumber}
                        </SelectItem>
                      ))}
                      {!editingDriver && availableDrivers.length === 0 && (
                        <SelectItem value="no-drivers" disabled>
                          No available drivers - all drivers already have access
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-access-select">Access Level</Label>
                  <Select value={selectedDriverAccessLevel} onValueChange={setSelectedDriverAccessLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full">Full Access</SelectItem>
                      <SelectItem value="Limited">Limited Access</SelectItem>
                      <SelectItem value="Emergency Only">Emergency Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingDriver && (
                  <div className="space-y-2">
                    <Label htmlFor="driver-status-select">Status</Label>
                    <Select value={selectedDriverStatus} onValueChange={setSelectedDriverStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDriverDialogOpen(false);
                      setEditingDriver(null);
                      setSelectedDriver("");
                      setSelectedDriverAccessLevel("");
                      setSelectedDriverStatus("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingDriver ? handleUpdateDriver : handleAddDriverAccess}
                    disabled={!selectedDriver || !selectedDriverAccessLevel || (!!editingDriver && !selectedDriverStatus)}
                    className="bg-primary-custom hover:bg-primary-custom/90"
                  >
                    {editingDriver ? 'Update Access' : 'Add Access'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSubTab === "vehicles" && (
          <div className="space-y-4">
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs h-6 px-2"
                      onClick={() => handleEditDriver(driver)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveDriver(driver.id)}
                    >
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
