"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MagnifyingGlass, FunnelSimple, SortAscending } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";

interface DeliveriesTabProps {
  site: SiteDetails;
}

export default function DeliveriesTab({ site }: DeliveriesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const mockTanks = [
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

  const tanks = site.tanks || mockTanks;

  return (
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
        {tanks.flatMap(tank => 
          tank.plannedDeliveries.map(delivery => (
            <div key={delivery.id} className="grid grid-cols-4 px-6 py-4 border-b border-gray-100 last:border-b-0 items-center">
              <div className="text-gray-900">{delivery.quantity.toLocaleString()} gallons</div>
              <div className="text-gray-600">{new Date(delivery.eta).toLocaleString()}</div>
              <div className="text-gray-600">{tank.productName}</div>
              <div className="text-right">
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}