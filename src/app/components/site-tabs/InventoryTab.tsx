"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CaretDown, CaretUp,  PlusSquare } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";

interface InventoryTabProps {
  site: SiteDetails;
}

export default function InventoryTab({ site }: InventoryTabProps) {
  const [expandedTanks, setExpandedTanks] = useState<{ [key: number]: boolean }>({});
  const [isAddTankDialogOpen, setIsAddTankDialogOpen] = useState(false);
  const [newTankName, setNewTankName] = useState("");

  const toggleTankExpansion = (tankId: number) => {
    setExpandedTanks(prev => ({
      ...prev,
      [tankId]: !prev[tankId]
    }));
  };

  const handleAddTank = () => {
    // TODO: Add tank creation logic here
    console.log("Adding new tank:", newTankName);
    setNewTankName("");
    setIsAddTankDialogOpen(false);
  };

  const handleDialogClose = () => {
    setNewTankName("");
    setIsAddTankDialogOpen(false);
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
      currentVolumeDate: "2024-08-31",
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
        {
          quantity: 3000,
          eta: "2024-07-22T10:00:00",
          supplier: "Shell Distribution",
          status: "Scheduled",
        },
        {
          quantity: 4500,
          eta: "2024-07-25T14:00:00",
          supplier: "Mobil Supply",
          status: "In Transit",
        },
        {
          quantity: 6000,
          eta: "2024-07-28T09:00:00",
          supplier: "BP Distribution",
          status: "Confirmed",
        },
      ],
      stockHistory: [
        { date: "2024-08-30", volume: 11500, sales: 2100 },
        { date: "2024-08-29", volume: 13600, sales: 1950 },
        { date: "2024-08-28", volume: 15550, sales: 2200 },
        { date: "2024-08-27", volume: 13350, sales: 2000 },
        { date: "2024-08-26", volume: 15350, sales: 1850 },
        { date: "2024-08-25", volume: 13500, sales: 2150 },
        { date: "2024-08-24", volume: 15650, sales: 1900 },
        { date: "2024-08-23", volume: 13750, sales: 2300 },
        { date: "2024-08-22", volume: 16050, sales: 2050 },
        { date: "2024-08-21", volume: 14000, sales: 1980 },
      ],
      weeklySales: [
        { week: "Week 1", sales: 14000 },
        { week: "Week 2", sales: 13500 },
        { week: "Week 3", sales: 15200 },
        { week: "Week 4", sales: 14800 },
      ],
      dailySales: [
        { day: "Monday", avgSales: 2200 },
        { day: "Tuesday", avgSales: 2000 },
        { day: "Wednesday", avgSales: 1900 },
        { day: "Thursday", avgSales: 2100 },
        { day: "Friday", avgSales: 2300 },
        { day: "Saturday", avgSales: 2500 },
        { day: "Sunday", avgSales: 2000 },
      ],
    },
    {
      id: 2,
      tankNumber: "2",
      status: "Low Stock",
      capacity: 18000,
      deadstock: 800,
      currentVolume: 4500,
      currentVolumeDate: "2024-08-31",
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
      stockHistory: [
        { date: "2024-08-30", volume: 5200, sales: 1750 },
        { date: "2024-08-29", volume: 6950, sales: 1800 },
        { date: "2024-08-28", volume: 8750, sales: 1900 },
        { date: "2024-08-27", volume: 10650, sales: 1850 },
        { date: "2024-08-26", volume: 12500, sales: 1700 },
        { date: "2024-08-25", volume: 14200, sales: 1850 },
        { date: "2024-08-24", volume: 16050, sales: 1950 },
        { date: "2024-08-23", volume: 18000, sales: 1800 },
        { date: "2024-08-22", volume: 16200, sales: 1650 },
        { date: "2024-08-21", volume: 17850, sales: 1900 },
      ],
      weeklySales: [
        { week: "Week 1", sales: 12600 },
        { week: "Week 2", sales: 12000 },
        { week: "Week 3", sales: 13200 },
        { week: "Week 4", sales: 12800 },
      ],
      dailySales: [
        { day: "Monday", avgSales: 1900 },
        { day: "Tuesday", avgSales: 1700 },
        { day: "Wednesday", avgSales: 1650 },
        { day: "Thursday", avgSales: 1800 },
        { day: "Friday", avgSales: 1950 },
        { day: "Saturday", avgSales: 2100 },
        { day: "Sunday", avgSales: 1800 },
      ],
    },
    {
      id: 3,
      tankNumber: "3",
      status: "Critically Low",
      capacity: 12000,
      deadstock: 600,
      currentVolume: 1200,
      currentVolumeDate: "2024-08-31",
      averageDailySales: 420,
      productCode: "UNL91",
      productName: "Premium Unleaded 91",
      plannedDeliveries: [],
      stockHistory: [
        { date: "2024-08-30", volume: 1620, sales: 450 },
        { date: "2024-08-29", volume: 2070, sales: 420 },
        { date: "2024-08-28", volume: 2490, sales: 400 },
        { date: "2024-08-27", volume: 2890, sales: 380 },
        { date: "2024-08-26", volume: 3270, sales: 460 },
        { date: "2024-08-25", volume: 3730, sales: 440 },
        { date: "2024-08-24", volume: 4170, sales: 410 },
        { date: "2024-08-23", volume: 4580, sales: 430 },
        { date: "2024-08-22", volume: 5010, sales: 395 },
        { date: "2024-08-21", volume: 5405, sales: 425 },
      ],
      weeklySales: [
        { week: "Week 1", sales: 2940 },
        { week: "Week 2", sales: 2800 },
        { week: "Week 3", sales: 3100 },
        { week: "Week 4", sales: 2920 },
      ],
      dailySales: [
        { day: "Monday", avgSales: 450 },
        { day: "Tuesday", avgSales: 400 },
        { day: "Wednesday", avgSales: 380 },
        { day: "Thursday", avgSales: 420 },
        { day: "Friday", avgSales: 460 },
        { day: "Saturday", avgSales: 480 },
        { day: "Sunday", avgSales: 410 },
      ],
    },
    {
      id: 4,
      tankNumber: "4",
      status: "Active",
      capacity: 20000,
      deadstock: 1000,
      currentVolume: 16500,
      currentVolumeDate: "2024-08-31",
      averageDailySales: 2500,
      productCode: "P98",
      productName: "Premium Unleaded 98",
      plannedDeliveries: [],
      stockHistory: [
        { date: "2024-08-30", volume: 14000, sales: 2600 },
        { date: "2024-08-29", volume: 16600, sales: 2400 },
        { date: "2024-08-28", volume: 19000, sales: 2700 },
        { date: "2024-08-27", volume: 16300, sales: 2500 },
        { date: "2024-08-26", volume: 18800, sales: 2300 },
        { date: "2024-08-25", volume: 16500, sales: 2650 },
        { date: "2024-08-24", volume: 19150, sales: 2450 },
        { date: "2024-08-23", volume: 16700, sales: 2800 },
        { date: "2024-08-22", volume: 19500, sales: 2550 },
        { date: "2024-08-21", volume: 17450, sales: 2480 },
      ],
      weeklySales: [
        { week: "Week 1", sales: 17500 },
        { week: "Week 2", sales: 16800 },
        { week: "Week 3", sales: 18200 },
        { week: "Week 4", sales: 17800 },
      ],
      dailySales: [
        { day: "Monday", avgSales: 2600 },
        { day: "Tuesday", avgSales: 2400 },
        { day: "Wednesday", avgSales: 2300 },
        { day: "Thursday", avgSales: 2500 },
        { day: "Friday", avgSales: 2700 },
        { day: "Saturday", avgSales: 2800 },
        { day: "Sunday", avgSales: 2400 },
      ],
    },
  ];

  const tanks = site.tanks || mockTanks;

  return (
    <div className="h-full flex flex-col">
      {/* Header with Add New Tank Button */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Tank Management</h3>
        <Dialog open={isAddTankDialogOpen} onOpenChange={setIsAddTankDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white flex items-center gap-2">
            <PlusSquare size={30}  weight="fill" />
              Add New Tank
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Tank</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="tankName" className="text-sm font-medium text-gray-700">
                  Tank Name
                </Label>
                <Input
                  id="tankName"
                  value={newTankName}
                  onChange={(e) => setNewTankName(e.target.value)}
                  placeholder="Enter tank name (e.g., Tank 1, Tank A, etc.)"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddTank}
                disabled={!newTankName.trim()}
                className="bg-primary-custom hover:bg-primary-custom/90 text-white"
              >
                Add Tank
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tank Grid - Single Column using Full Width */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        {tanks.map((tank) => {
          const isExpanded = expandedTanks[tank.id];
          const fillPercentage = calculateFillPercentage(tank.currentVolume, tank.capacity);
          
          return (
            <div key={tank.id} className="bg-white border border-gray-200 rounded-lg">
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
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                      Active
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

              {/* Expanded Tank Details - Two Column Layout */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column - Tank Configuration */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Tank Configuration</h5>
                      <div className="space-y-4">
                        {/* Row 1: Tank Status, Product Code */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Tank Status</Label>
                            <Select defaultValue="Active">
                              <SelectTrigger className="mt-1 h-8 text-sm">
                                <SelectValue placeholder="Select status..." />
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
                            <Select defaultValue={tank.productCode}>
                              <SelectTrigger className="mt-1 h-8 text-sm">
                                <SelectValue placeholder="Select product..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="P95">P95 - Premium Unleaded 95</SelectItem>
                                <SelectItem value="P98">P98 - Premium Unleaded 98</SelectItem>
                                <SelectItem value="UNL91">UNL91 - Premium Unleaded 91</SelectItem>
                                <SelectItem value="DSL">DSL - Diesel</SelectItem>
                                <SelectItem value="E10">E10 - Ethanol 10</SelectItem>
                                <SelectItem value="LPG">LPG - Liquid Petroleum Gas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Row 2: Tank Capacity, Deadstock Volume */}
                        <div className="grid grid-cols-2 gap-4">
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
                            <Label className="text-xs font-medium text-gray-700">Deadstock Volume (L)</Label>
                            <Input 
                              type="number"
                              value={tank.deadstock} 
                              className="mt-1 h-8 text-sm"
                              placeholder="e.g. 500"
                            />
                          </div>
                        </div>

                        {/* Row 3: Volume Date, Current Volume */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-medium text-gray-700">Volume Date</Label>
                            <Input 
                              type="date"
                              value={tank.currentVolumeDate} 
                              className="mt-1 h-8 text-sm"
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
                        </div>

                        {/* Row 4: Average Daily Sales (single column for now) */}
                        <div className="grid grid-cols-1 gap-4">
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
                      </div>

                      {/* Planned Deliveries - 4 Cards per Row */}
                      {tank.plannedDeliveries && tank.plannedDeliveries.length > 0 && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <h5 className="text-xs font-semibold text-gray-900 mb-2">Planned Deliveries</h5>
                          <div className="grid grid-cols-4 gap-2">
                            {tank.plannedDeliveries.map((delivery, idx) => (
                              <div key={idx} className="bg-white border border-gray-200 rounded p-2 text-xs">
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900 text-center">{delivery.quantity.toLocaleString()}L</span>
                                  <span className={`px-1 py-0.5 rounded text-xs font-medium text-center mt-1 ${
                                    delivery.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                    delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {delivery.status}
                                  </span>
                                </div>
                                <div className="text-gray-600 mt-1 text-center">{new Date(delivery.eta).toLocaleDateString()}</div>
                                <div className="text-gray-500 text-xs text-center truncate">{delivery.supplier}</div>
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

                    {/* Right Column - Data Analytics */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Sales Analytics & History</h5>
                      
                      {/* Stock History - Last 10 Records */}
                      {tank.stockHistory && tank.stockHistory.length > 0 && (
                        <div className="mb-3">
                          <h6 className="text-xs font-semibold text-gray-900 mb-2">Last 10 Stock Records</h6>
                          <div className="bg-white border border-gray-200 rounded overflow-hidden">
                            <div className="grid grid-cols-3 gap-2 p-2 bg-gray-50 text-xs font-medium text-gray-700 border-b">
                              <div>Date</div>
                              <div>Volume (L)</div>
                              <div>Sales (L)</div>
                            </div>
                            <div className="max-h-28 overflow-y-auto">
                              {tank.stockHistory.slice(0, 10).map((record, idx) => (
                                <div key={idx} className="grid grid-cols-3 gap-2 p-1.5 text-xs border-b border-gray-100 hover:bg-gray-50">
                                  <div className="text-gray-900">{new Date(record.date).toLocaleDateString()}</div>
                                  <div className="text-gray-700">{record.volume.toLocaleString()}</div>
                                  <div className="text-gray-700">{record.sales.toLocaleString()}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Weekly Sales Pattern - Compact Cards */}
                      {tank.weeklySales && tank.weeklySales.length > 0 && (
                        <div className="mb-3">
                          <h6 className="text-xs font-medium text-gray-700 mb-2">Weekly Sales (L)</h6>
                          <div className="grid grid-cols-2 gap-2">
                            {tank.weeklySales.map((record, idx) => (
                              <div key={idx} className="bg-white border border-gray-200 rounded p-2 text-center">
                                <div className="text-xs font-medium text-gray-700">{record.week}</div>
                                <div className="text-sm font-semibold text-gray-900">{record.sales.toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Daily Sales Pattern - 7 Column Compact Cards */}
                      {tank.dailySales && tank.dailySales.length > 0 && (
                        <div>
                          <h6 className="text-xs font-medium text-gray-700 mb-2">Daily Sales Average (L)</h6>
                          <div className="grid grid-cols-7 gap-1">
                            {tank.dailySales.map((record, idx) => (
                              <div key={idx} className="bg-white border border-gray-200 rounded p-1.5 text-center">
                                <div className="text-xs font-medium text-gray-700">
                                  {record.day.substring(0, 3)}
                                </div>
                                <div className="text-xs font-semibold text-gray-900 mt-1">
                                  {record.avgSales.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
