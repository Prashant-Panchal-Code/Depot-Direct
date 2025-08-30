"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CaretDown, CaretUp, Plus } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";

interface InventoryTabProps {
  site: SiteDetails;
}

export default function InventoryTab({ site }: InventoryTabProps) {
  const [expandedTanks, setExpandedTanks] = useState<{ [key: number]: boolean }>({});

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

  const calculateFillPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  // Mock data for demonstration
  const mockTanks = [
    {
      id: 1,
      tankNumber: "1",
      status: "Normal",
      capacity: 15000,
      deadstock: 500,
      currentVolume: 12000,
      averageDailySales: 2000,
      productCode: "P95",
      productName: "Premium Unleaded 95",
      plannedDeliveries: [
        {
          quantity: 5000,
          eta: "2024-07-20T08:00:00",
          supplier: "Shell Distribution",
          status: "Confirmed",
        },
      ],
    },
    {
      id: 2,
      tankNumber: "2",
      status: "Low Stock",
      capacity: 18000,
      deadstock: 800,
      currentVolume: 4500,
      averageDailySales: 1800,
      productCode: "DSL",
      productName: "Diesel",
      plannedDeliveries: [
        {
          quantity: 10000,
          eta: "2024-07-20T14:00:00",
          supplier: "BP Distribution",
          status: "Scheduled",
        },
        {
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
    {
      id: 4,
      tankNumber: "4",
      status: "Active",
      capacity: 20000,
      deadstock: 1000,
      currentVolume: 16500,
      averageDailySales: 2500,
      productCode: "P98",
      productName: "Premium Unleaded 98",
      plannedDeliveries: [],
    },
  ];

  const tanks = site.tanks || mockTanks;

  return (
    <div className="h-full flex flex-col">
      {/* Header with Add New Tank Button */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Tank Management</h3>
        <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white flex items-center gap-2">
          <Plus size={16} />
          Add New Tank
        </Button>
      </div>

      {/* Tank Grid - 2 Columns using Full Width */}
      <div className="flex-1 grid grid-cols-2 gap-6 overflow-y-auto">
        {tanks.map((tank) => {
          const isExpanded = expandedTanks[tank.id];
          const fillPercentage = calculateFillPercentage(tank.currentVolume, tank.capacity);
          
          return (
            <div key={tank.id} className="bg-white border border-gray-200 rounded-lg h-fit">
              {/* Tank Card Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleTankExpansion(tank.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">Tank {tank.tankNumber}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTankStatusColor(tank.status)}`}>
                      {tank.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{fillPercentage}% Full</span>
                    {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
                  </div>
                </div>
                
                {/* Tank Level Indicator */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{tank.productName}</span>
                    <span>{tank.currentVolume.toLocaleString()}L / {tank.capacity.toLocaleString()}L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        fillPercentage > 70 ? 'bg-green-500' :
                        fillPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Tank Details */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Tank Status</Label>
                      <Select defaultValue={tank.status}>
                        <SelectTrigger className="mt-1 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Product Code</Label>
                      <Input 
                        value={tank.productCode} 
                        className="mt-1 h-8 text-sm"
                        placeholder="e.g. P95"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Tank Capacity (L)</Label>
                      <Input 
                        type="number"
                        value={tank.capacity} 
                        className="mt-1 h-8 text-sm"
                        placeholder="e.g. 15000"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Current Volume (L)</Label>
                      <Input 
                        type="number"
                        value={tank.currentVolume} 
                        className="mt-1 h-8 text-sm"
                        placeholder="e.g. 12000"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Deadstock Volume (L)</Label>
                      <Input 
                        type="number"
                        value={tank.deadstock} 
                        className="mt-1 h-8 text-sm"
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Avg. Daily Sales (L)</Label>
                      <Input 
                        type="number"
                        value={tank.averageDailySales} 
                        className="mt-1 h-8 text-sm"
                        placeholder="e.g. 2000"
                      />
                    </div>
                  </div>

                  {/* Planned Deliveries for this tank */}
                  {tank.plannedDeliveries && tank.plannedDeliveries.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h5 className="text-xs font-semibold text-gray-900 mb-2">Planned Deliveries</h5>
                      <div className="space-y-2">
                        {tank.plannedDeliveries.map((delivery, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded p-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{delivery.quantity.toLocaleString()}L</span>
                              <span className="text-gray-600">{new Date(delivery.eta).toLocaleDateString()}</span>
                            </div>
                            <div className="text-gray-500 mt-1">{delivery.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tank Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Save Changes
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs text-red-600 hover:text-red-700">
                      Delete Tank
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
