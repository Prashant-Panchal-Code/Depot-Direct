"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tank Details</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {tanks.map((tank) => (
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
  );
}