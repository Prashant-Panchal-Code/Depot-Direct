"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";

interface DeliveriesTabProps {
  site: SiteDetails;
}

interface Delivery {
  id: number;
  tankNumber: string;
  productName: string;
  productCode: string;
  quantity: number;
  eta: string;
  supplier: string;
  status: string;
  driverName: string;
  truckPlate: string;
  notes: string;
}

export default function DeliveriesTab({ site }: DeliveriesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "text-green-600 bg-green-100";
      case "Scheduled":
        return "text-blue-600 bg-blue-100";
      case "In Transit":
        return "text-orange-600 bg-orange-100";
      case "Delivered":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Mock data for demonstration
  const mockDeliveries = [
    {
      id: 1,
      tankNumber: "1",
      productName: "Premium Unleaded 95",
      productCode: "P95",
      quantity: 5000,
      eta: "2024-07-20T08:00:00",
      supplier: "Shell Distribution",
      status: "Confirmed",
      driverName: "John Smith",
      truckPlate: "ABC-123",
      notes: "Standard delivery - Tank 1"
    },
    {
      id: 2,
      tankNumber: "2",
      productName: "Diesel",
      productCode: "DSL",
      quantity: 10000,
      eta: "2024-07-20T14:00:00",
      supplier: "BP Distribution",
      status: "Scheduled",
      driverName: "Mike Johnson",
      truckPlate: "DEF-456",
      notes: "Urgent delivery - Low stock"
    },
    {
      id: 3,
      tankNumber: "2",
      productName: "Diesel",
      productCode: "DSL",
      quantity: 3000,
      eta: "2024-07-21T02:00:00",
      supplier: "BP Distribution",
      status: "In Transit",
      driverName: "Robert Brown",
      truckPlate: "GHI-789",
      notes: "Follow-up delivery"
    },
    {
      id: 4,
      tankNumber: "4",
      productName: "Premium Unleaded 98",
      productCode: "P98",
      quantity: 8000,
      eta: "2024-07-22T10:00:00",
      supplier: "Mobil Distribution",
      status: "Scheduled",
      driverName: "Sarah Wilson",
      truckPlate: "JKL-012",
      notes: "Regular weekly delivery"
    },
    {
      id: 5,
      tankNumber: "1",
      productName: "Premium Unleaded 95",
      productCode: "P95",
      quantity: 6000,
      eta: "2024-07-23T09:00:00",
      supplier: "Shell Distribution",
      status: "Confirmed",
      driverName: "David Lee",
      truckPlate: "MNO-345",
      notes: "Peak weekend stock preparation"
    },
  ];

  const deliveries: Delivery[] = mockDeliveries;
  const filteredDeliveries: Delivery[] = deliveries.filter((delivery: Delivery) =>
    delivery.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Planned Deliveries</h3>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus size={16} />
          Schedule Delivery
        </Button>
      </div>

      {/* Filters and Search - Full Width */}
      <div className="grid grid-cols-4 gap-4 mb-6 flex-shrink-0">
        <div>
          <Label className="text-sm font-medium text-gray-700">Search Deliveries</Label>
          <Input 
            placeholder="Search by product, supplier, driver..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Status Filter</Label>
          <Select defaultValue="all">
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Product Filter</Label>
          <Select defaultValue="all">
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="P95">Premium Unleaded 95</SelectItem>
              <SelectItem value="DSL">Diesel</SelectItem>
              <SelectItem value="UNL91">Premium Unleaded 91</SelectItem>
              <SelectItem value="P98">Premium Unleaded 98</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Date Range</Label>
          <Input 
            type="date" 
            className="mt-1"
          />
        </div>
      </div>

      {/* Deliveries Table - Full Width */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-8 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-700 border-b border-gray-200">
          <div>TANK</div>
          <div>PRODUCT</div>
          <div>QUANTITY (L)</div>
          <div>SUPPLIER</div>
          <div>DRIVER</div>
          <div>ETA</div>
          <div>STATUS</div>
          <div>ACTIONS</div>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto max-h-96">
          {filteredDeliveries.map((delivery: Delivery) => (
            <div key={delivery.id} className="grid grid-cols-8 px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 text-sm">
              <div className="font-medium text-gray-900">
                Tank {delivery.tankNumber}
              </div>
              <div className="text-gray-600">
                <div className="font-medium">{delivery.productCode}</div>
                <div className="text-xs text-gray-500">{delivery.productName}</div>
              </div>
              <div className="font-medium text-gray-900">
                {delivery.quantity.toLocaleString()}
              </div>
              <div className="text-gray-600">
                {delivery.supplier}
              </div>
              <div className="text-gray-600">
                <div className="font-medium">{delivery.driverName}</div>
                <div className="text-xs text-gray-500">{delivery.truckPlate}</div>
              </div>
              <div className="text-gray-600">
                <div className="font-medium">{new Date(delivery.eta).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500">{new Date(delivery.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                  {delivery.status}
                </span>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards - Full Width */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Total Deliveries</h4>
          <p className="text-2xl font-bold text-blue-600">{filteredDeliveries.length}</p>
          <p className="text-xs text-gray-600">This month</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Total Volume</h4>
          <p className="text-2xl font-bold text-green-600">
            {filteredDeliveries.reduce((sum: number, d: Delivery) => sum + d.quantity, 0).toLocaleString()}L
          </p>
          <p className="text-xs text-gray-600">Planned volume</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">In Transit</h4>
          <p className="text-2xl font-bold text-orange-600">
            {filteredDeliveries.filter((d: Delivery) => d.status === "In Transit").length}
          </p>
          <p className="text-xs text-gray-600">Active deliveries</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Next Delivery</h4>
          <p className="text-sm font-bold text-purple-600">
            {filteredDeliveries.length > 0 
              ? new Date(Math.min(...filteredDeliveries.map((d: Delivery) => new Date(d.eta).getTime()))).toLocaleDateString()
              : "No deliveries"
            }
          </p>
          <p className="text-xs text-gray-600">Earliest ETA</p>
        </div>
      </div>
    </div>
  );
}
