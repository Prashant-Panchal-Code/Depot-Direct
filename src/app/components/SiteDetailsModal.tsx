"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Plus,
  MagnifyingGlass,
  FunnelSimple,
  SortAscending,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";

export interface Tank {
  id: number;
  tankNumber: string;
  status: "Active" | "Inactive" | "Normal" | "Low Stock" | "Critically Low";
  capacity: number;
  deadstock: number;
  currentVolume: number;
  averageDailySales: number;
  productCode: string;
  productName: string;
  plannedDeliveries: PlannedDelivery[];
}

export interface PlannedDelivery {
  id: number;
  quantity: number;
  eta: string;
  supplier: string;
  status: "Scheduled" | "In Transit" | "Delayed";
}

export interface HistoryEvent {
  id: number;
  dateTime: string;
  user: string;
  eventType: string;
  details: string;
}

export interface SiteDetails {
  id: number;
  siteCode: string;
  siteName: string;
  latLong: string;
  street: string;
  postalCode: string;
  town: string;
  active: boolean;
  priority: string;
  // Additional details
  contactPerson?: string;
  phone?: string;
  email?: string;
  operatingHours?: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  tanks?: Tank[];
  history?: HistoryEvent[];
  // New fields for depot and delivery management
  depotId?: number | null;
  deliveryStopped?: boolean;
  pumpedRequired?: boolean;
  // Notes for the site
  notes?: {
    id: number;
    createdDate: string;
    createdBy: string;
    comment: string;
    priority: "Low" | "Medium" | "High";
    category: "General" | "Maintenance" | "Safety" | "Delivery" | "Operations";
    status: "Open" | "In Review" | "Closed";
    closedDate?: string;
    closedBy?: string;
  }[];
}

interface SiteDetailsModalProps {
  site: SiteDetails | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedSite: SiteDetails) => void;
}

export default function SiteDetailsModal({
  site,
  open,
  onClose,
  onSave,
}: SiteDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isEditing, setIsEditing] = useState(false);
  // const [editedSite, setEditedSite] = useState<SiteDetails | null>(site); // Unused variable removed
  const [expandedTanks, setExpandedTanks] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");

  if (!site) return null;

  const handleSave = () => {
    if (site) {
      onSave(site);
      setIsEditing(false);
    }
  };

  // handleCancel function removed as it's not used

  const toggleTankExpansion = (tankId: number) => {
    setExpandedTanks(prev => ({
      ...prev,
      [tankId]: !prev[tankId]
    }));
  };

  const getTankStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "text-green-600 bg-green-100";
      case "Low Stock":
        return "text-yellow-600 bg-yellow-100";
      case "Critically Low":
        return "text-red-600 bg-red-100";
      case "Active":
        return "text-green-600 bg-green-100";
      case "Inactive":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // getDeliveryStatusColor function removed as it's not used

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "Operating hours updated":
        return "text-blue-800 bg-blue-100";
      case "Delivery completed":
        return "text-green-800 bg-green-100";
      case "Tank capacity adjusted":
        return "text-yellow-800 bg-yellow-100";
      case "Site information updated":
        return "text-purple-800 bg-purple-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  const calculateFillPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  // Mock data for demonstration
  const mockTanks: Tank[] = [
    {
      id: 1,
      tankNumber: "1",
      status: "Normal",
      capacity: 10000,
      deadstock: 500,
      currentVolume: 7500,
      averageDailySales: 350,
      productCode: "UNL87",
      productName: "Unleaded 87",
      plannedDeliveries: [
        {
          id: 1,
          quantity: 5000,
          eta: "2024-07-20T10:00:00",
          supplier: "Shell Refinery",
          status: "Scheduled",
        },
      ],
    },
    {
      id: 2,
      tankNumber: "2",
      status: "Low Stock",
      capacity: 8000,
      deadstock: 400,
      currentVolume: 2000,
      averageDailySales: 280,
      productCode: "DSL",
      productName: "Diesel",
      plannedDeliveries: [
        {
          id: 2,
          quantity: 3000,
          eta: "2024-07-21T02:00:00",
          supplier: "BP Distribution",
          status: "In Transit",
        },
      ],
    },
    {
      id: 3,
      tankNumber: "3",
      status: "Critically Low",
      capacity: 12000,
      deadstock: 600,
      currentVolume: 1200,
      averageDailySales: 420,
      productCode: "UNL91",
      productName: "Premium Unleaded 91",
      plannedDeliveries: [],
    },
  ];

  const mockHistory: HistoryEvent[] = [
    {
      id: 1,
      dateTime: "2024-03-15 10:30 AM",
      user: "Emily Carter",
      eventType: "Operating hours updated",
      details: "Updated operating hours to 8 AM - 6 PM"
    },
    {
      id: 2,
      dateTime: "2024-03-14 02:45 PM",
      user: "System",
      eventType: "Delivery completed",
      details: "Delivery of 5000 gallons completed"
    },
    {
      id: 3,
      dateTime: "2024-03-10 09:15 AM",
      user: "David Lee",
      eventType: "Tank capacity adjusted",
      details: "Adjusted tank capacity to 10000 gallons"
    },
    {
      id: 4,
      dateTime: "2024-03-05 11:00 AM",
      user: "System",
      eventType: "Delivery completed",
      details: "Delivery of 4500 gallons completed"
    },
    {
      id: 5,
      dateTime: "2024-03-01 04:00 PM",
      user: "Sarah Chen",
      eventType: "Site information updated",
      details: "Updated site address to 123 Elm Street"
    }
  ];

  const mockOperatingHours = {
    Monday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Tuesday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Wednesday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Thursday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Friday: { open: "08:00 AM", close: "11:00 PM", closed: false },
    Saturday: { open: "09:00 AM", close: "11:00 PM", closed: false },
    Sunday: { open: "09:00 AM", close: "09:00 PM", closed: false },
  };

  const siteWithDefaults = {
    ...site,
    contactPerson: site.contactPerson || "Manager " + site.siteCode,
    phone: site.phone || "(555) 123-4567",
    email: site.email || `contact@${site.siteName.toLowerCase().replace(/\s+/g, '')}.com`,
    tanks: site.tanks || mockTanks,
    operatingHours: site.operatingHours || mockOperatingHours,
    history: site.history || mockHistory,
  };

  const tabs = [
    { id: "basic-info", label: "Basic Info" },
    { id: "inventory", label: "Inventory" },
    { id: "deliveries", label: "Deliveries" },
    { id: "settings", label: "Settings" },
  ];

  const deliveryTabs = [
    { id: "all-events", label: "All Events" },
    { id: "site-updates", label: "Site Updates" },
    { id: "delivery-history", label: "Deliveries" },
    { id: "tank-adjustments", label: "Tank Adjustments" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 pb-4 mb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">Sites</span>
                <span className="text-sm text-gray-400">/</span>
                <span className="text-sm text-gray-500">Site Details</span>
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Site Details
              </DialogTitle>
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
        </DialogHeader>

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
          {/* Basic Info Tab */}
          {activeTab === "basic-info" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="siteName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Site Name
                  </Label>
                  <Input
                    id="siteName"
                    value={siteWithDefaults.siteName}
                    className="bg-gray-50 border-gray-300"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={siteWithDefaults.street}
                    className="bg-gray-50 border-gray-300"
                    disabled={!isEditing}
                  />
                </div>

                {/* Map Placeholder */}
                <div className="bg-green-100 border border-green-200 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-2 text-green-600" />
                    <p className="text-gray-600 text-sm">Interactive Map</p>
                    <p className="text-xs text-gray-500">{siteWithDefaults.latLong}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={siteWithDefaults.phone}
                    className="bg-gray-50 border-gray-300"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={siteWithDefaults.email}
                    className="bg-gray-50 border-gray-300"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Right Column - Operating Hours */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-3 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700">
                    <div>DAY</div>
                    <div>OPEN</div>
                    <div>CLOSE</div>
                  </div>
                  {weekDays.map((day) => {
                    const hours = (siteWithDefaults.operatingHours as Record<string, { open: string; close: string; closed: boolean }>)?.[day] || {
                      open: "08:00 AM",
                      close: "10:00 PM",
                      closed: false,
                    };
                    return (
                      <div key={day} className="grid grid-cols-3 px-4 py-3 border-b border-gray-200 last:border-b-0">
                        <div className="font-medium text-gray-900">{day}</div>
                        <div className="text-gray-600 flex items-center">
                          {hours.closed ? (
                            <span className="text-red-600">Closed</span>
                          ) : (
                            hours.open
                          )}
                        </div>
                        <div className="text-gray-600">
                          {!hours.closed && hours.close}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Tank Details</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {siteWithDefaults.tanks?.map((tank) => (
                    <div key={tank.id} className="bg-gray-50">
                      <button
                        onClick={() => toggleTankExpansion(tank.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">Tank {tank.tankNumber}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTankStatusColor(tank.status)}`}>
                            {tank.status}
                          </span>
                        </div>
                        {expandedTanks[tank.id] ? (
                          <CaretUp size={16} className="text-gray-400" />
                        ) : (
                          <CaretDown size={16} className="text-gray-400" />
                        )}
                      </button>
                      
                      {expandedTanks[tank.id] && (
                        <div className="px-6 pb-6 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled>
                                <option>{tank.status}</option>
                              </select>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Tank Capacity (gallons)</Label>
                              <Input value={tank.capacity.toLocaleString()} className="bg-gray-50" disabled />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Deadstock Volume (gallons)</Label>
                              <Input value={tank.deadstock.toLocaleString()} className="bg-gray-50" disabled />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Average Daily Sales (gallons)</Label>
                              <Input value={tank.averageDailySales.toLocaleString()} className="bg-gray-50" disabled />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Product Code</Label>
                              <Input value={tank.productCode} className="bg-gray-50" disabled />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Product Name</Label>
                              <Input value={tank.productName} className="bg-gray-50" disabled />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Current Tank Volume (gallons)</Label>
                            <Input value={tank.currentVolume.toLocaleString()} className="bg-gray-50" disabled />
                            
                            {/* Tank Fill Visual */}
                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Tank Level</span>
                                <span>{calculateFillPercentage(tank.currentVolume, tank.capacity)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${calculateFillPercentage(tank.currentVolume, tank.capacity)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-6">
                            <Button variant="outline" size="sm">Cancel</Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Deliveries Tab */}
          {activeTab === "deliveries" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Planned Deliveries</h2>
                  <p className="text-gray-600 mt-1">View and manage upcoming deliveries for this site.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus size={16} className="mr-2" />
                  Schedule Delivery
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                  <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search deliveries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <FunnelSimple size={16} />
                  Filter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <SortAscending size={16} />
                  Sort
                </Button>
              </div>

              {/* Deliveries Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-700 border-b border-gray-200">
                  <div>DELIVERY QUANTITY</div>
                  <div>ETA</div>
                  <div>PRODUCT NAME</div>
                  <div></div>
                </div>
                {siteWithDefaults.tanks?.flatMap(tank => 
                  tank.plannedDeliveries.map(delivery => (
                    <div key={delivery.id} className="grid grid-cols-4 px-6 py-4 border-b border-gray-100 last:border-b-0 items-center">
                      <div className="text-gray-900">{delivery.quantity.toLocaleString()} gallons</div>
                      <div className="text-gray-600">{new Date(delivery.eta).toLocaleString()}</div>
                      <div className="text-gray-600">{tank.productName}</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings Tab (Site History) */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Site History</h2>
                <p className="text-gray-600 mt-1">A chronological log of all significant site changes and delivery events.</p>
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    className="w-40"
                    placeholder="mm/dd/yyyy"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="date"
                    className="w-40"
                    placeholder="mm/dd/yyyy"
                  />
                </div>
                <div className="flex gap-2 ml-auto">
                  {deliveryTabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={tab.id === "all-events" ? "default" : "outline"}
                      size="sm"
                      className={tab.id === "all-events" ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* History Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-700 border-b border-gray-200">
                  <div>DATE & TIME</div>
                  <div>USER</div>
                  <div>EVENT TYPE</div>
                  <div>DETAILS</div>
                </div>
                {siteWithDefaults.history?.map((event) => (
                  <div key={event.id} className="grid grid-cols-4 px-6 py-4 border-b border-gray-100 last:border-b-0 items-center">
                    <div className="text-gray-900">{event.dateTime}</div>
                    <div className="text-gray-600">{event.user}</div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
                        {event.eventType}
                      </span>
                    </div>
                    <div className="text-gray-600">{event.details}</div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing 1 to 5 of 50 results
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    <Button size="sm" className="bg-blue-600 text-white">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <span className="px-2 text-gray-500">...</span>
                    <Button variant="outline" size="sm">10</Button>
                  </div>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {activeTab === "basic-info" && (
          <div className="border-t border-gray-200 pt-4 mt-6 flex justify-end gap-2 flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}