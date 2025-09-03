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
import { MagnifyingGlass, Buildings, MapPin, Phone, Envelope, Clock, Plus, Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";

interface DepotAccessTabProps {
  site: SiteDetails;
}

interface DepotAccess {
  id: number;
  depotId: number; // Reference to selected depot
  depotCode: string;
  depotName: string;
  address: string;
  town: string;
  distance: number; // km from site
  estimatedTravelTime: number; // minutes
  accessLevel: "Primary" | "Secondary" | "Emergency";
  lastDelivery?: string;
  status: "Active" | "Suspended" | "Maintenance";
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  operatingHours: string;
  specialInstructions?: string;
}

// Available depots for selection
interface AvailableDepot {
  id: number;
  code: string;
  name: string;
  address: string;
  town: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  operatingHours: string;
}

export default function DepotAccessTab({ site }: DepotAccessTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAccessLevel, setFilterAccessLevel] = useState("all");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDepot, setSelectedDepot] = useState<DepotAccess | null>(null);

  // Mock data - available depots to choose from (would come from API)
  const availableDepots: AvailableDepot[] = [
    {
      id: 1,
      code: "DP001",
      name: "Main Distribution Center",
      address: "123 Industrial Blvd, Industrial District",
      town: "Los Angeles",
      contactPerson: "John Manager",
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "john.manager@company.com",
      operatingHours: "06:00 AM - 10:00 PM"
    },
    {
      id: 2,
      code: "DP002",
      name: "Central Storage Facility", 
      address: "789 Warehouse Row, Storage District",
      town: "Los Angeles",
      contactPerson: "Lisa Supervisor",
      contactPhone: "+1 (555) 987-6543",
      contactEmail: "lisa.supervisor@company.com",
      operatingHours: "05:00 AM - 11:00 PM"
    },
    {
      id: 3,
      code: "DP003",
      name: "Airport Fuel Terminal",
      address: "456 Airport Way, Aviation District",
      town: "Long Beach",
      contactPerson: "Sarah Operations",
      contactPhone: "+1 (555) 234-5678",
      contactEmail: "sarah.ops@company.com",
      operatingHours: "24/7"
    },
    {
      id: 4,
      code: "DP004",
      name: "Port Distribution Hub",
      address: "321 Harbor Blvd, Port District",
      town: "Long Beach",
      contactPerson: "Mark Coordinator",
      contactPhone: "+1 (555) 456-7890",
      contactEmail: "mark.coord@company.com", 
      operatingHours: "06:00 AM - 8:00 PM"
    },
    {
      id: 5,
      code: "DP005",
      name: "Valley Distribution",
      address: "789 Valley Road, North Valley",
      town: "Burbank",
      contactPerson: "Mike Emergency",
      contactPhone: "+1 (555) 345-6789",
      contactEmail: "mike.emergency@company.com",
      operatingHours: "06:00 AM - 10:00 PM"
    }
  ];

  // Mock data - would come from API based on site.id
  const [depotAccess, setDepotAccess] = useState<DepotAccess[]>([
    {
      id: 1,
      depotId: 1,
      depotCode: "DP001",
      depotName: "Main Distribution Center",
      address: "123 Industrial Blvd, Industrial District",
      town: "Los Angeles",
      distance: 12.5,
      estimatedTravelTime: 25,
      accessLevel: "Primary",
      lastDelivery: "2024-01-15 08:30",
      status: "Active",
      contactPerson: "John Manager",
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "john.manager@company.com",
      operatingHours: "06:00 AM - 10:00 PM",
      specialInstructions: "Primary supplier - handles all regular deliveries"
    },
    {
      id: 2,
      depotId: 3,
      depotCode: "DP003",
      depotName: "Airport Fuel Terminal",
      address: "456 Airport Way, Aviation District",
      town: "Long Beach",
      distance: 8.2,
      estimatedTravelTime: 18,
      accessLevel: "Secondary",
      lastDelivery: "2024-01-10 14:15",
      status: "Active",
      contactPerson: "Sarah Operations",
      contactPhone: "+1 (555) 234-5678",
      contactEmail: "sarah.ops@company.com",
      operatingHours: "24/7",
      specialInstructions: "Backup supplier for premium fuels only"
    },
    {
      id: 3,
      depotId: 5,
      depotCode: "DP005",
      depotName: "Valley Distribution",
      address: "789 Valley Road, North Valley",
      town: "Burbank",
      distance: 22.8,
      estimatedTravelTime: 45,
      accessLevel: "Emergency",
      status: "Active",
      contactPerson: "Mike Emergency",
      contactPhone: "+1 (555) 345-6789",
      contactEmail: "mike.emergency@company.com",
      operatingHours: "06:00 AM - 10:00 PM",
      specialInstructions: "Emergency use only - call ahead"
    },
    {
      id: 4,
      depotId: 2,
      depotCode: "DP002",
      depotName: "Central Storage Facility",
      address: "789 Warehouse Row, Storage District", 
      town: "Los Angeles",
      distance: 15.6,
      estimatedTravelTime: 32,
      accessLevel: "Secondary",
      lastDelivery: "2024-01-08 16:45",
      status: "Maintenance",
      contactPerson: "Lisa Supervisor",
      contactPhone: "+1 (555) 987-6543",
      contactEmail: "lisa.supervisor@company.com",
      operatingHours: "05:00 AM - 11:00 PM",
      specialInstructions: "Currently under scheduled maintenance"
    }
  ]);

  const filteredDepots = depotAccess.filter(depot => {
    const matchesSearch = depot.depotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         depot.depotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         depot.town.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || depot.status.toLowerCase() === filterStatus;
    const matchesAccessLevel = filterAccessLevel === "all" || depot.accessLevel.toLowerCase() === filterAccessLevel;
    
    return matchesSearch && matchesStatus && matchesAccessLevel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Suspended": return "bg-red-100 text-red-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "Primary": return "bg-blue-100 text-blue-800";
      case "Secondary": return "bg-purple-100 text-purple-800";
      case "Emergency": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleAddDepot = () => {
    setSelectedDepot(null);
    setIsAddDialogOpen(true);
  };

  const handleViewDepot = (depot: DepotAccess) => {
    setSelectedDepot(depot);
    setIsViewDialogOpen(true);
  };

  const handleEditDepot = (depot: DepotAccess) => {
    setSelectedDepot(depot);
    setIsEditDialogOpen(true);
  };

  const handleRemoveDepot = (depotId: number) => {
    if (confirm("Are you sure you want to remove this depot access? This action cannot be undone.")) {
      setDepotAccess(prev => prev.filter(depot => depot.id !== depotId));
    }
  };

  const handleSaveDepot = (depotData: Partial<DepotAccess>) => {
    if (selectedDepot) {
      // Edit existing depot
      setDepotAccess(prev => 
        prev.map(depot => 
          depot.id === selectedDepot.id 
            ? { ...depot, ...depotData }
            : depot
        )
      );
    } else {
      // Add new depot - get depot info from selected depot
      const selectedAvailableDepot = availableDepots.find(d => d.id === depotData.depotId);
      if (selectedAvailableDepot) {
        const newDepot: DepotAccess = {
          id: Math.max(...depotAccess.map(d => d.id), 0) + 1,
          depotId: selectedAvailableDepot.id,
          depotCode: selectedAvailableDepot.code,
          depotName: selectedAvailableDepot.name,
          address: selectedAvailableDepot.address,
          town: selectedAvailableDepot.town,
          contactPerson: selectedAvailableDepot.contactPerson,
          contactPhone: selectedAvailableDepot.contactPhone,
          contactEmail: selectedAvailableDepot.contactEmail,
          operatingHours: selectedAvailableDepot.operatingHours,
          distance: depotData.distance || 0,
          estimatedTravelTime: depotData.estimatedTravelTime || 0,
          accessLevel: (depotData.accessLevel as "Primary" | "Secondary" | "Emergency") || "Secondary",
          status: (depotData.status as "Active" | "Suspended" | "Maintenance") || "Active",
          specialInstructions: depotData.specialInstructions || ""
        };
        setDepotAccess(prev => [...prev, newDepot]);
      }
    }
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedDepot(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Depot Access</h3>
        <p className="text-gray-600">
          Depots that have delivery access to <strong>{site.siteName}</strong> ({site.siteCode})
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search depots..."
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
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAccessLevel} onValueChange={setFilterAccessLevel}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Access Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Access Levels</SelectItem>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddDepot} className="bg-primary-custom hover:bg-primary-custom/90">
          <Plus size={16} className="mr-2" />
          Add Depot Access
        </Button>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredDepots.length} of {depotAccess.length} depots with access to this site
        </p>
      </div>

      {/* Depot Cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredDepots.map((depot) => (
            <div key={depot.id} className="bg-white border border-gray-200 rounded-lg p-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-blue-100 p-1.5 rounded">
                    <Buildings size={16} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{depot.depotName}</h4>
                    <p className="text-xs text-gray-600 truncate">({depot.depotCode})</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(depot.status)}`}>
                  {depot.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{depot.distance}km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Travel:</span>
                  <span className="font-medium">{depot.estimatedTravelTime}min</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-600">Access:</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getAccessLevelColor(depot.accessLevel)}`}>
                    {depot.accessLevel}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <MapPin size={12} className="text-gray-500 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-900 truncate">{depot.town}</p>
                  </div>
                </div>
              </div>

              {/* Contact - compact display */}
              <div className="mb-3">
                <div className="flex justify-between text-xs items-start">
                  <span className="text-gray-600">Contact:</span>
                  <div className="text-right min-w-0">
                    <p className="text-xs text-gray-900 truncate">{depot.contactPerson}</p>
                    <div className="relative group">
                      <p className="text-xs text-gray-600 truncate cursor-help">{depot.contactPhone}</p>
                      {/* Contact Tooltip */}
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                        <div>{depot.contactPerson}</div>
                        <div>{depot.contactPhone}</div>
                        <div>{depot.contactEmail}</div>
                        <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Delivery */}
              {depot.lastDelivery && (
                <div className="mb-3 text-xs">
                  <span className="text-gray-600">Last delivery: </span>
                  <span className="text-gray-900 font-medium">
                    {new Date(depot.lastDelivery).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Special Instructions - compact */}
              {depot.specialInstructions && (
                <div className="mb-3">
                  <div className="relative group">
                    <div className="text-xs text-blue-600 truncate cursor-help">
                      Instructions available
                    </div>
                    {/* Instructions Tooltip */}
                    <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-xs">
                      {depot.specialInstructions}
                      <div className="absolute top-full left-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-1 pt-2 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleViewDepot(depot)}
                >
                  <Eye size={12} className="mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleEditDepot(depot)}
                >
                  <PencilSimple size={12} className="mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-6 px-1 text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveDepot(depot.id)}
                >
                  <Trash size={12} className="mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredDepots.length === 0 && (
          <div className="text-center py-12">
            <Buildings size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No depots found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all" || filterAccessLevel !== "all"
                ? "No depots match your current filters."
                : "No depots have been configured with access to this site yet."}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Depot Access Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedDepot(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Add Depot Access" : "Edit Depot Access"}
            </DialogTitle>
          </DialogHeader>
          <DepotAccessForm
            depot={selectedDepot}
            onSave={handleSaveDepot}
            onCancel={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedDepot(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Depot Access Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Depot Access Details</DialogTitle>
          </DialogHeader>
          {selectedDepot && (
            <DepotAccessDetails
              depot={selectedDepot}
              onEdit={() => {
                setIsViewDialogOpen(false);
                handleEditDepot(selectedDepot);
              }}
              onClose={() => setIsViewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Depot Access Form Component
interface DepotAccessFormProps {
  depot: DepotAccess | null;
  onSave: (depotData: Partial<DepotAccess>) => void;
  onCancel: () => void;
}

function DepotAccessForm({ depot, onSave, onCancel }: DepotAccessFormProps) {
  const availableDepots: AvailableDepot[] = [
    {
      id: 1,
      code: "DP001",
      name: "Main Distribution Center",
      address: "123 Industrial Blvd, Industrial District",
      town: "Los Angeles",
      contactPerson: "John Manager",
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "john.manager@company.com",
      operatingHours: "06:00 AM - 10:00 PM"
    },
    {
      id: 2,
      code: "DP002",
      name: "Central Storage Facility", 
      address: "789 Warehouse Row, Storage District",
      town: "Los Angeles",
      contactPerson: "Lisa Supervisor",
      contactPhone: "+1 (555) 987-6543",
      contactEmail: "lisa.supervisor@company.com",
      operatingHours: "05:00 AM - 11:00 PM"
    },
    {
      id: 3,
      code: "DP003",
      name: "Airport Fuel Terminal",
      address: "456 Airport Way, Aviation District",
      town: "Long Beach",
      contactPerson: "Sarah Operations",
      contactPhone: "+1 (555) 234-5678",
      contactEmail: "sarah.ops@company.com",
      operatingHours: "24/7"
    },
    {
      id: 4,
      code: "DP004",
      name: "Port Distribution Hub",
      address: "321 Harbor Blvd, Port District",
      town: "Long Beach",
      contactPerson: "Mark Coordinator",
      contactPhone: "+1 (555) 456-7890",
      contactEmail: "mark.coord@company.com", 
      operatingHours: "06:00 AM - 8:00 PM"
    },
    {
      id: 5,
      code: "DP005",
      name: "Valley Distribution",
      address: "789 Valley Road, North Valley",
      town: "Burbank",
      contactPerson: "Mike Emergency",
      contactPhone: "+1 (555) 345-6789",
      contactEmail: "mike.emergency@company.com",
      operatingHours: "06:00 AM - 10:00 PM"
    }
  ];

  const [formData, setFormData] = useState({
    depotId: depot?.depotId?.toString() || "",
    distance: depot?.distance?.toString() || "",
    estimatedTravelTime: depot?.estimatedTravelTime?.toString() || "",
    accessLevel: depot?.accessLevel || ("Secondary" as "Primary" | "Secondary" | "Emergency"),
    status: depot?.status || ("Active" as "Active" | "Suspended" | "Maintenance"),
    specialInstructions: depot?.specialInstructions || ""
  });

  const selectedDepotInfo = availableDepots.find(d => d.id.toString() === formData.depotId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const depotData: Partial<DepotAccess> = {
      depotId: parseInt(formData.depotId),
      distance: parseFloat(formData.distance) || 0,
      estimatedTravelTime: parseInt(formData.estimatedTravelTime) || 0,
      accessLevel: formData.accessLevel as "Primary" | "Secondary" | "Emergency",
      status: formData.status as "Active" | "Suspended" | "Maintenance",
      specialInstructions: formData.specialInstructions
    };

    onSave(depotData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Depot Selection */}
      <div>
        <label className="text-sm font-medium text-gray-700">Select Depot *</label>
        <Select 
          value={formData.depotId} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, depotId: value }))}
          disabled={!!depot} // Disable dropdown when editing
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a depot..." />
          </SelectTrigger>
          <SelectContent>
            {availableDepots.map((availableDepot) => (
              <SelectItem key={availableDepot.id} value={availableDepot.id.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{availableDepot.name}</span>
                  <span className="text-sm text-gray-600">({availableDepot.code}) - {availableDepot.town}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Depot Info Display */}
      {selectedDepotInfo && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Selected Depot Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Code:</span> {selectedDepotInfo.code}
            </div>
            <div>
              <span className="text-blue-700 font-medium">Town:</span> {selectedDepotInfo.town}
            </div>
            <div>
              <span className="text-blue-700 font-medium">Contact:</span> {selectedDepotInfo.contactPerson}
            </div>
            <div>
              <span className="text-blue-700 font-medium">Hours:</span> {selectedDepotInfo.operatingHours}
            </div>
          </div>
          <div className="mt-2">
            <span className="text-blue-700 font-medium">Address:</span> {selectedDepotInfo.address}
          </div>
        </div>
      )}

      {/* Distance and Travel Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Distance (km) *</label>
          <Input
            type="number"
            step="0.1"
            value={formData.distance}
            onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
            placeholder="0.0"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Travel Time (min) *</label>
          <Input
            type="number"
            value={formData.estimatedTravelTime}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedTravelTime: e.target.value }))}
            placeholder="0"
            required
          />
        </div>
      </div>

      {/* Access Level and Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Access Level *</label>
          <Select value={formData.accessLevel} onValueChange={(value: "Primary" | "Secondary" | "Emergency") => setFormData(prev => ({ ...prev, accessLevel: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Primary">Primary</SelectItem>
              <SelectItem value="Secondary">Secondary</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Status *</label>
          <Select value={formData.status} onValueChange={(value: "Active" | "Suspended" | "Maintenance") => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Special Instructions */}
      <div>
        <label className="text-sm font-medium text-gray-700">Special Instructions</label>
        <textarea
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={formData.specialInstructions}
          onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
          placeholder="Any special instructions for this depot access..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary-custom hover:bg-primary-custom/90">
          {depot ? "Update Access" : "Add Access"}
        </Button>
      </div>
    </form>
  );
}

// Depot Access Details Component
interface DepotAccessDetailsProps {
  depot: DepotAccess;
  onEdit: () => void;
  onClose: () => void;
}

function DepotAccessDetails({ depot, onEdit, onClose }: DepotAccessDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Suspended": return "bg-red-100 text-red-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "Primary": return "bg-blue-100 text-blue-800";
      case "Secondary": return "bg-purple-100 text-purple-800";
      case "Emergency": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{depot.depotName}</h3>
          <p className="text-sm text-gray-600">{depot.depotCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(depot.status)}`}>
            {depot.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccessLevelColor(depot.accessLevel)}`}>
            {depot.accessLevel}
          </span>
        </div>
      </div>

      {/* Location Information */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Location Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-500 mt-0.5" />
              <div>
                <p className="text-gray-900">{depot.address}</p>
                <p className="text-gray-600">{depot.town}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance from site:</span>
              <span className="font-medium text-gray-900">{depot.distance} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated travel time:</span>
              <span className="font-medium text-gray-900">{depot.estimatedTravelTime} minutes</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-500" />
              <div>
                <span className="text-gray-900">{depot.contactPerson}</span>
                <span className="text-gray-600 ml-2">- {depot.contactPhone}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Envelope size={16} className="text-gray-500" />
              <span className="text-gray-600">{depot.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-gray-600">{depot.operatingHours}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Access Information */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Access Information</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Access Level:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(depot.accessLevel)}`}>
                {depot.accessLevel}
              </span>
            </div>
            {depot.lastDelivery && (
              <div className="flex justify-between col-span-2">
                <span className="text-gray-600">Last delivery:</span>
                <span className="text-gray-900 font-medium">
                  {new Date(depot.lastDelivery).toLocaleDateString()} at{' '}
                  {new Date(depot.lastDelivery).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      {depot.specialInstructions && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">{depot.specialInstructions}</p>
          </div>
        </div>
      )}

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
