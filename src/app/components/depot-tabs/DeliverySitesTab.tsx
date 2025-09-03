"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus, MagnifyingGlass, Funnel, Clock, CarSimple, Eye, PencilSimple, Trash } from "@phosphor-icons/react";

interface DeliverySite {
  id: number;
  siteCode: string;
  siteName: string;
  address: string;
  distance: number; // km from depot
  estimatedTravelTime: number; // minutes
  deliveryStatus: "Active" | "Suspended" | "Seasonal";
  lastDelivery: string;
  deliveryFrequency: "Daily" | "Weekly" | "Bi-weekly" | "Monthly" | "On-demand";
  priority: "High" | "Medium" | "Low";
  specialRequirements: string[];
  contactPerson: string;
  contactPhone: string;
  products: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeliverySitesTabProps {
  // This interface is intentionally empty as no props are currently used
}

export default function DeliverySitesTab({}: DeliverySitesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<DeliverySite | null>(null);

  // Mock depot products - in real implementation, this would come from props or context
  const depotProducts = ["Diesel", "Gasoline", "Heating Oil", "Marine Diesel", "DEF"];

  // Mock data for delivery sites served by this depot
  const [deliverySites, setDeliverySites] = useState<DeliverySite[]>([
    {
      id: 1,
      siteCode: "SITE-001",
      siteName: "Downtown Gas Station",
      address: "123 Main St, Downtown",
      distance: 15.5,
      estimatedTravelTime: 25,
      deliveryStatus: "Active",
      lastDelivery: "2024-01-15 14:30",
      deliveryFrequency: "Daily",
      priority: "High",
      specialRequirements: ["24/7 Access", "Hazmat Certified Driver"],
      contactPerson: "John Miller",
      contactPhone: "+1-555-0201",
      products: ["Gasoline", "Diesel", "Kerosene"]
    },
    {
      id: 2,
      siteCode: "SITE-002",
      siteName: "Airport Fuel Terminal",
      address: "456 Airport Blvd, Terminal Area",
      distance: 32.1,
      estimatedTravelTime: 45,
      deliveryStatus: "Active",
      lastDelivery: "2024-01-14 09:15",
      deliveryFrequency: "Daily",
      priority: "High",
      specialRequirements: ["Security Clearance", "Airport Access Badge"],
      contactPerson: "Sarah Wilson",
      contactPhone: "+1-555-0202",
      products: ["Jet Fuel", "Aviation Gas"]
    },
    {
      id: 3,
      siteCode: "SITE-003",
      siteName: "Industrial Complex A",
      address: "789 Industrial Way, Factory District",
      distance: 8.3,
      estimatedTravelTime: 18,
      deliveryStatus: "Active",
      lastDelivery: "2024-01-12 16:45",
      deliveryFrequency: "Weekly",
      priority: "Medium",
      specialRequirements: ["Weekend Access"],
      contactPerson: "Mike Thompson",
      contactPhone: "+1-555-0203",
      products: ["Diesel", "Heating Oil"]
    },
    {
      id: 4,
      siteCode: "SITE-004",
      siteName: "Marina Fuel Dock",
      address: "321 Harbor View, Marina District",
      distance: 22.7,
      estimatedTravelTime: 35,
      deliveryStatus: "Seasonal",
      lastDelivery: "2023-11-15 11:20",
      deliveryFrequency: "Bi-weekly",
      priority: "Low",
      specialRequirements: ["Seasonal Operations", "Marine Access"],
      contactPerson: "Lisa Garcia",
      contactPhone: "+1-555-0204",
      products: ["Marine Diesel", "Gasoline"]
    },
    {
      id: 5,
      siteCode: "SITE-005",
      siteName: "Emergency Services Center",
      address: "555 Emergency Ln, Public Safety District",
      distance: 12.8,
      estimatedTravelTime: 22,
      deliveryStatus: "Active",
      lastDelivery: "2024-01-13 08:30",
      deliveryFrequency: "On-demand",
      priority: "High",
      specialRequirements: ["Priority Access", "Emergency Response"],
      contactPerson: "Chief Roberts",
      contactPhone: "+1-555-0205",
      products: ["Diesel", "Gasoline"]
    },
    {
      id: 6,
      siteCode: "SITE-006",
      siteName: "Highway Rest Stop",
      address: "Mile Marker 45, Highway 101",
      distance: 45.2,
      estimatedTravelTime: 55,
      deliveryStatus: "Suspended",
      lastDelivery: "2023-12-20 10:15",
      deliveryFrequency: "Weekly",
      priority: "Low",
      specialRequirements: ["Highway Access"],
      contactPerson: "Tom Anderson",
      contactPhone: "+1-555-0206",
      products: ["Gasoline", "Diesel"]
    }
  ]);

  const filteredSites = deliverySites.filter(site => {
    const matchesSearch = site.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.siteCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = filterStatus === "all" || site.deliveryStatus.toLowerCase() === filterStatus;
    const matchesPriorityFilter = filterPriority === "all" || site.priority.toLowerCase() === filterPriority;
    return matchesSearch && matchesStatusFilter && matchesPriorityFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Seasonal":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "Daily":
        return "bg-purple-100 text-purple-800";
      case "Weekly":
        return "bg-blue-100 text-blue-800";
      case "Bi-weekly":
        return "bg-indigo-100 text-indigo-800";
      case "Monthly":
        return "bg-green-100 text-green-800";
      case "On-demand":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Action handlers
  const handleAddSite = () => {
    setSelectedSite(null);
    setIsAddDialogOpen(true);
  };

  const handleViewSite = (site: DeliverySite) => {
    setSelectedSite(site);
    setIsViewDialogOpen(true);
  };

  const handleEditSite = (site: DeliverySite) => {
    setSelectedSite(site);
    setIsEditDialogOpen(true);
  };

  const handleRemoveSite = (siteId: number) => {
    if (confirm("Are you sure you want to remove this delivery site? This action cannot be undone.")) {
      setDeliverySites(prev => prev.filter(site => site.id !== siteId));
    }
  };

  const handleSaveSite = (siteData: Partial<DeliverySite>) => {
    if (selectedSite) {
      // Edit existing site
      setDeliverySites(prev => 
        prev.map(site => 
          site.id === selectedSite.id 
            ? { ...site, ...siteData }
            : site
        )
      );
    } else {
      // Add new site
      const newSite: DeliverySite = {
        id: Math.max(...deliverySites.map(s => s.id), 0) + 1,
        siteCode: siteData.siteCode || `SITE-${String(Math.max(...deliverySites.map(s => s.id), 0) + 1).padStart(3, '0')}`,
        siteName: siteData.siteName || "",
        address: siteData.address || "",
        distance: siteData.distance || 0,
        estimatedTravelTime: siteData.estimatedTravelTime || 0,
        deliveryStatus: (siteData.deliveryStatus as "Active" | "Suspended" | "Seasonal") || "Active",
        lastDelivery: new Date().toISOString().slice(0, 16),
        deliveryFrequency: (siteData.deliveryFrequency as "Daily" | "Weekly" | "Bi-weekly" | "Monthly" | "On-demand") || "Weekly",
        priority: (siteData.priority as "High" | "Medium" | "Low") || "Medium",
        specialRequirements: siteData.specialRequirements || [],
        contactPerson: siteData.contactPerson || "",
        contactPhone: siteData.contactPhone || "",
        products: siteData.products || []
      };
      setDeliverySites(prev => [...prev, newSite]);
    }
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Statistics */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delivery Sites</h3>
            <p className="text-sm text-gray-600">
              Sites that this depot can deliver to, including delivery schedules and requirements.
            </p>
          </div>
          
          {/* Compact Statistics */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-lg font-bold text-gray-900">{deliverySites.length}</span>
              </div>
              <p className="text-xs text-gray-600">Total Sites</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {deliverySites.filter(s => s.deliveryStatus === "Active").length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Active Sites</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <CarSimple size={16} className="text-blue-600" />
                <span className="text-lg font-bold text-blue-600">
                  {Math.round(deliverySites.reduce((sum, site) => sum + site.distance, 0) / deliverySites.length)}km
                </span>
              </div>
              <p className="text-xs text-gray-600">Avg Distance</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-orange-600" />
                <span className="text-lg font-bold text-orange-600">
                  {Math.round(deliverySites.reduce((sum, site) => sum + site.estimatedTravelTime, 0) / deliverySites.length)}min
                </span>
              </div>
              <p className="text-xs text-gray-600">Avg Travel Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <Funnel size={16} />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="seasonal">Seasonal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddSite} className="bg-primary-custom hover:bg-primary-custom/90">
          <Plus size={16} className="mr-2" />
          Add Delivery Site
        </Button>
      </div>

      {/* Sites List */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredSites.map((site) => (
            <div key={site.id} className="bg-white border border-gray-200 rounded-lg p-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-blue-100 p-1.5 rounded">
                    <MapPin size={16} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{site.siteName}</h4>
                    <p className="text-xs text-gray-600 truncate">({site.siteCode})</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(site.deliveryStatus)}`}>
                  {site.deliveryStatus}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{site.distance}km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Travel:</span>
                  <span className="font-medium">{site.estimatedTravelTime}min</span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(site.priority)}`}>
                    {site.priority}
                  </span>
                </div>
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-600">Frequency:</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getFrequencyColor(site.deliveryFrequency)}`}>
                    {site.deliveryFrequency === "On-demand" ? "On-demand" : site.deliveryFrequency}
                  </span>
                </div>
              </div>

              {/* Compatible Products - compact display */}
              <div className="mb-3">
                <div className="flex justify-between text-xs items-start">
                  <span className="text-gray-600">Products:</span>
                  <div className="text-right">
                    {(() => {
                      const matchingProducts = site.products.filter(product => 
                        depotProducts.includes(product)
                      );
                      return (
                        <>
                          <span className={`font-medium text-xs ${matchingProducts.length === 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {matchingProducts.length} compatible
                          </span>
                          {matchingProducts.length > 0 && (
                            <div className="relative group">
                              <div className="text-xs text-green-600 truncate cursor-help">
                                {matchingProducts[0]}{matchingProducts.length > 1 ? ` +${matchingProducts.length - 1}` : ''}
                              </div>
                              {/* Compatible Products Tooltip */}
                              <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                                Compatible: {matchingProducts.join(', ')}
                                <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          )}
                          {matchingProducts.length === 0 && (
                            <div className="text-xs text-orange-600">
                              No match
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Special Requirements - compact display */}
              <div className="mb-3">
                <div className="flex justify-between text-xs items-start">
                  <span className="text-gray-600">Requirements:</span>
                  <div className="text-right">
                    <span className="font-medium text-xs">{site.specialRequirements.length} req{site.specialRequirements.length !== 1 ? 's' : ''}</span>
                    {site.specialRequirements.length > 0 && (
                      <div className="relative group">
                        <div className="text-xs text-yellow-600 truncate cursor-help">
                          {site.specialRequirements[0]}{site.specialRequirements.length > 1 ? ` +${site.specialRequirements.length - 1}` : ''}
                        </div>
                        {/* Requirements Tooltip */}
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          {site.specialRequirements.join(', ')}
                          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info - compact */}
              <div className="mb-3 text-xs">
                <div className="truncate">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium ml-1">{site.contactPerson.split(' ')[0]}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleViewSite(site)}
                >
                  <Eye size={12} className="mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-6 px-1"
                  onClick={() => handleEditSite(site)}
                >
                  <PencilSimple size={12} className="mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs h-6 px-1 text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveSite(site.id)}
                >
                  <Trash size={12} className="mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery sites found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                ? "Try adjusting your search or filters." 
                : "Add delivery sites to get started."
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Delivery Site Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedSite(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? "Add New Delivery Site" : "Edit Delivery Site"}
            </DialogTitle>
          </DialogHeader>
          <DeliverySiteForm
            site={selectedSite}
            onSave={handleSaveSite}
            onCancel={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedSite(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Delivery Site Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delivery Site Details</DialogTitle>
          </DialogHeader>
          {selectedSite && (
            <DeliverySiteDetails
              site={selectedSite}
              onEdit={() => {
                setIsViewDialogOpen(false);
                handleEditSite(selectedSite);
              }}
              onClose={() => setIsViewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Available Site interface for the dropdown
interface AvailableSite {
  id: string;
  siteCode: string;
  siteName: string;
  address: string;
  priority: "High" | "Medium" | "Low";
  deliveryFrequency: "Daily" | "Weekly" | "Bi-weekly" | "Monthly" | "On-demand";
  contactPerson: string;
  contactPhone: string;
  products: string[];
  specialRequirements: string[];
}

// Mock data for available sites to choose from
const availableSites: AvailableSite[] = [
  {
    id: "AS001",
    siteCode: "SITE-001",
    siteName: "Downtown Gas Station",
    address: "123 Main St, Downtown",
    priority: "High",
    deliveryFrequency: "Daily",
    contactPerson: "John Smith",
    contactPhone: "+1-555-0101",
    products: ["Gasoline", "Diesel"],
    specialRequirements: ["24/7 Access", "Hazmat Certified Driver"]
  },
  {
    id: "AS002",
    siteCode: "SITE-002",
    siteName: "Highway Truck Stop",
    address: "456 Highway 101, Mile 23",
    priority: "Medium",
    deliveryFrequency: "Weekly",
    contactPerson: "Sarah Johnson",
    contactPhone: "+1-555-0102",
    products: ["Diesel", "DEF"],
    specialRequirements: ["Large Vehicle Access"]
  },
  {
    id: "AS003",
    siteCode: "SITE-003",
    siteName: "Industrial Complex",
    address: "789 Industrial Blvd, Zone B",
    priority: "High",
    deliveryFrequency: "Bi-weekly",
    contactPerson: "Mike Wilson",
    contactPhone: "+1-555-0103",
    products: ["Heating Oil", "Diesel"],
    specialRequirements: ["Security Clearance", "Scheduled Delivery"]
  },
  {
    id: "AS004",
    siteCode: "SITE-004",
    siteName: "Marina Fuel Dock",
    address: "321 Harbor View Dr, Marina District",
    priority: "Low",
    deliveryFrequency: "Monthly",
    contactPerson: "Lisa Brown",
    contactPhone: "+1-555-0104",
    products: ["Marine Diesel", "Gasoline"],
    specialRequirements: ["Tide Schedule", "Weather Dependent"]
  },
  {
    id: "AS005",
    siteCode: "SITE-005",
    siteName: "Emergency Services Center",
    address: "555 Emergency Ln, Public Safety District",
    priority: "High",
    deliveryFrequency: "On-demand",
    contactPerson: "Chief Roberts",
    contactPhone: "+1-555-0105",
    products: ["Diesel", "Gasoline"],
    specialRequirements: ["Priority Access", "Emergency Response"]
  },
  {
    id: "AS006",
    siteCode: "SITE-006",
    siteName: "Airport Fuel Terminal",
    address: "100 Airport Rd, Terminal Area",
    priority: "High",
    deliveryFrequency: "Daily",
    contactPerson: "David Chen",
    contactPhone: "+1-555-0106",
    products: ["Jet Fuel", "Avgas"],
    specialRequirements: ["Airport Security", "FAA Compliance"]
  },
  {
    id: "AS007",
    siteCode: "SITE-007",
    siteName: "Construction Site Alpha",
    address: "777 Development Ave, Construction Zone",
    priority: "Medium",
    deliveryFrequency: "Weekly",
    contactPerson: "Tom Anderson",
    contactPhone: "+1-555-0107",
    products: ["Diesel", "Heating Oil"],
    specialRequirements: ["Site Safety Protocol", "Temporary Access"]
  }
];

// Delivery Site Form Component
interface DeliverySiteFormProps {
  site: DeliverySite | null;
  onSave: (siteData: Partial<DeliverySite>) => void;
  onCancel: () => void;
}

function DeliverySiteForm({ site, onSave, onCancel }: DeliverySiteFormProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [selectedSiteData, setSelectedSiteData] = useState<AvailableSite | null>(null);
  const [formData, setFormData] = useState({
    distance: site?.distance?.toString() || "",
    estimatedTravelTime: site?.estimatedTravelTime?.toString() || "",
    deliveryStatus: site?.deliveryStatus || "Active",
    specialRequirements: site?.specialRequirements?.filter(req => 
      // Filter out requirements that might be from the original site data
      !availableSites.some(as => as.specialRequirements.includes(req))
    ).join(", ") || ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSiteSelection = (siteId: string) => {
    setSelectedSiteId(siteId);
    const siteData = availableSites.find(s => s.id === siteId);
    setSelectedSiteData(siteData || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSiteData && !site) {
      alert("Please select a site");
      return;
    }

    const siteData: Partial<DeliverySite> = site ? {
      // For editing existing site, keep existing data and only update editable fields
      distance: parseFloat(formData.distance) || 0,
      estimatedTravelTime: parseInt(formData.estimatedTravelTime) || 0,
      deliveryStatus: formData.deliveryStatus as "Active" | "Suspended" | "Seasonal",
      specialRequirements: formData.specialRequirements ? formData.specialRequirements.split(",").map(s => s.trim()).filter(s => s) : []
    } : {
      // For new site, use selected site data
      siteCode: selectedSiteData!.siteCode,
      siteName: selectedSiteData!.siteName,
      address: selectedSiteData!.address,
      priority: selectedSiteData!.priority,
      deliveryFrequency: selectedSiteData!.deliveryFrequency,
      contactPerson: selectedSiteData!.contactPerson,
      contactPhone: selectedSiteData!.contactPhone,
      products: selectedSiteData!.products,
      distance: parseFloat(formData.distance) || 0,
      estimatedTravelTime: parseInt(formData.estimatedTravelTime) || 0,
      deliveryStatus: formData.deliveryStatus as "Active" | "Suspended" | "Seasonal",
      specialRequirements: formData.specialRequirements ? 
        [...selectedSiteData!.specialRequirements, ...formData.specialRequirements.split(",").map(s => s.trim()).filter(s => s)] :
        selectedSiteData!.specialRequirements
    };

    onSave(siteData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!site && (
        <div>
          <Label htmlFor="siteSelection">Select Site *</Label>
          <Select value={selectedSiteId} onValueChange={handleSiteSelection}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose a site from available options" />
            </SelectTrigger>
            <SelectContent>
              {availableSites.map((availableSite) => (
                <SelectItem key={availableSite.id} value={availableSite.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{availableSite.siteName}</span>
                    <span className="text-xs text-gray-500">{availableSite.siteCode} • {availableSite.address}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(selectedSiteData || site) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Site Information</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Site Name:</span>
              <span className="ml-2 font-medium">{site?.siteName || selectedSiteData?.siteName}</span>
            </div>
            <div>
              <span className="text-gray-600">Site Code:</span>
              <span className="ml-2 font-medium">{site?.siteCode || selectedSiteData?.siteCode}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Address:</span>
              <span className="ml-2 font-medium">{site?.address || selectedSiteData?.address}</span>
            </div>
            <div>
              <span className="text-gray-600">Priority:</span>
              <span className="ml-2 font-medium">{site?.priority || selectedSiteData?.priority}</span>
            </div>
            <div>
              <span className="text-gray-600">Frequency:</span>
              <span className="ml-2 font-medium">{site?.deliveryFrequency || selectedSiteData?.deliveryFrequency}</span>
            </div>
            <div>
              <span className="text-gray-600">Contact:</span>
              <span className="ml-2 font-medium">{site?.contactPerson || selectedSiteData?.contactPerson}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2 font-medium">{site?.contactPhone || selectedSiteData?.contactPhone}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Products:</span>
              <span className="ml-2 font-medium">{(site?.products || selectedSiteData?.products || []).join(", ")}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="distance">Distance (km) *</Label>
          <Input
            id="distance"
            type="number"
            step="0.1"
            min="0"
            value={formData.distance}
            onChange={(e) => handleInputChange('distance', e.target.value)}
            placeholder="0.0"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="estimatedTravelTime">Travel Time (mins) *</Label>
          <Input
            id="estimatedTravelTime"
            type="number"
            min="1"
            value={formData.estimatedTravelTime}
            onChange={(e) => handleInputChange('estimatedTravelTime', e.target.value)}
            placeholder="30"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="deliveryStatus">Delivery Status</Label>
        <Select value={formData.deliveryStatus} onValueChange={(value) => handleInputChange('deliveryStatus', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
            <SelectItem value="Seasonal">Seasonal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="specialRequirements">Additional Special Requirements (comma-separated)</Label>
        <Input
          id="specialRequirements"
          value={formData.specialRequirements}
          onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
          placeholder="Add any depot-specific requirements"
          className="mt-1"
        />
        {selectedSiteData && selectedSiteData.specialRequirements.length > 0 && (
          <p className="text-xs text-gray-600 mt-1">
            Existing requirements: {selectedSiteData.specialRequirements.join(", ")}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary-custom hover:bg-primary-custom/90">
          {site ? "Update Site" : "Add Site"}
        </Button>
      </div>
    </form>
  );
}

// Delivery Site Details Component
interface DeliverySiteDetailsProps {
  site: DeliverySite;
  onEdit: () => void;
  onClose: () => void;
}

function DeliverySiteDetails({ site, onEdit, onClose }: DeliverySiteDetailsProps) {
  // Mock depot products - in real implementation, this would come from props or context
  const depotProducts = ["Diesel", "Gasoline", "Heating Oil", "Marine Diesel", "DEF"];
  
  // Filter products to show only those that match between site and depot
  const matchingProducts = site.products.filter(product => 
    depotProducts.includes(product)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Suspended": return "bg-red-100 text-red-800";
      case "Seasonal": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-orange-100 text-orange-800";
      case "Low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{site.siteName}</h3>
          <p className="text-sm text-gray-600">{site.siteCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(site.deliveryStatus)}`}>
            {site.deliveryStatus}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(site.priority)}`}>
            {site.priority} Priority
          </span>
        </div>
      </div>

      {/* Location and Logistics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Location</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-500 mt-0.5" />
                <span className="text-gray-700">{site.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-600">Contact Person:</span>
                <span className="ml-2 text-gray-900">{site.contactPerson || "Not specified"}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2 text-gray-900">{site.contactPhone || "Not specified"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance from Depot:</span>
                <span className="font-medium text-gray-900">{site.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travel Time:</span>
                <span className="font-medium text-gray-900">{site.estimatedTravelTime} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Delivery:</span>
                <span className="font-medium text-gray-900">
                  {new Date(site.lastDelivery).toLocaleDateString()} at {new Date(site.lastDelivery).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compatible Products */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Compatible Products</h4>
        <p className="text-sm text-gray-600 mb-3">Products available at both this site and depot:</p>
        <div className="flex flex-wrap gap-2">
          {matchingProducts.map((product, index) => (
            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {product}
            </span>
          ))}
          {matchingProducts.length === 0 && (
            <span className="text-orange-600 text-sm bg-orange-100 px-3 py-1 rounded-full">
              No compatible products found
            </span>
          )}
        </div>
        
        {/* Show incompatible products for reference */}
        {site.products.length > matchingProducts.length && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Site products not available at depot:</p>
            <div className="flex flex-wrap gap-2">
              {site.products.filter(product => !depotProducts.includes(product)).map((product, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {product}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Special Requirements */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Special Requirements</h4>
        <div className="flex flex-wrap gap-2">
          {site.specialRequirements.map((requirement, index) => (
            <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              {requirement}
            </span>
          ))}
          {site.specialRequirements.length === 0 && (
            <span className="text-gray-500 text-sm">No special requirements</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit} className="bg-primary-custom hover:bg-primary-custom/90">
          <PencilSimple size={16} className="mr-2" />
          Edit Site
        </Button>
      </div>
    </div>
  );
}
