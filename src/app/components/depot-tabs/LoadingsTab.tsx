"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { DepotDetails, Loading } from "../DepotDetailsPage";
import { 
  Plus, 
  Truck,
  CheckCircle,
  Warning,
  Play,
  Calendar,
  GasPump
} from "@phosphor-icons/react";

interface LoadingsTabProps {
  depot: DepotDetails;
  onSave: () => void;
}

export default function LoadingsTab({ depot, onSave }: LoadingsTabProps) {
  const [activeView, setActiveView] = useState<"recent" | "planned">("recent");
  
  // Mock loadings data
  const [loadings, setLoadings] = useState<Loading[]>([
    {
      id: 1,
      truckId: "TRK001",
      truckNumber: "FL-001-ABC",
      productCode: "DSL001",
      productName: "Ultra Low Sulfur Diesel",
      quantity: 15000,
      loadedDate: "2024-01-15 14:30",
      status: "Completed",
      loadingRate: 1200,
      startTime: "14:30",
      endTime: "14:43"
    },
    {
      id: 2,
      truckId: "TRK002",
      truckNumber: "FL-002-DEF",
      productCode: "GSL087",
      productName: "Premium Gasoline 91",
      quantity: 22000,
      loadedDate: "2024-01-15 16:15",
      status: "Completed",
      loadingRate: 1500,
      startTime: "16:15",
      endTime: "16:30"
    },
    {
      id: 3,
      truckId: "TRK003",
      truckNumber: "FL-003-GHI",
      productCode: "DSL001",
      productName: "Ultra Low Sulfur Diesel",
      quantity: 18500,
      loadedDate: "2024-01-15 18:45",
      status: "In Progress",
      loadingRate: 1200,
      startTime: "18:45",
      endTime: undefined
    },
    {
      id: 4,
      truckId: "TRK004",
      truckNumber: "FL-004-JKL",
      productCode: "GSL095",
      productName: "Premium Gasoline 95",
      quantity: 25000,
      plannedDate: "2024-01-16 08:00",
      status: "Planned",
      loadingRate: 1500
    },
    {
      id: 5,
      truckId: "TRK005",
      truckNumber: "FL-005-MNO",
      productCode: "HFO180",
      productName: "Heavy Fuel Oil 180",
      quantity: 30000,
      plannedDate: "2024-01-16 10:30",
      status: "Planned",
      loadingRate: 600
    },
    {
      id: 6,
      truckId: "TRK006",
      truckNumber: "FL-006-PQR",
      productCode: "DSL001",
      productName: "Ultra Low Sulfur Diesel",
      quantity: 20000,
      plannedDate: "2024-01-16 14:15",
      status: "Planned",
      loadingRate: 1200
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLoading, setNewLoading] = useState<Partial<Loading>>({
    truckNumber: "",
    productCode: "",
    productName: "",
    quantity: 0,
    plannedDate: "",
    status: "Planned",
    loadingRate: 1000
  });

  const handleAddLoading = () => {
    if (newLoading.truckNumber && newLoading.productCode && newLoading.quantity) {
      const loading: Loading = {
        id: loadings.length + 1,
        truckId: `TRK${String(loadings.length + 1).padStart(3, '0')}`,
        truckNumber: newLoading.truckNumber!,
        productCode: newLoading.productCode!,
        productName: newLoading.productName || "",
        quantity: newLoading.quantity!,
        plannedDate: newLoading.plannedDate,
        status: "Planned",
        loadingRate: newLoading.loadingRate || 1000
      };
      
      setLoadings([...loadings, loading]);
      setNewLoading({
        truckNumber: "",
        productCode: "",
        productName: "",
        quantity: 0,
        plannedDate: "",
        status: "Planned",
        loadingRate: 1000
      });
      setShowAddDialog(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={20} className="text-green-600" />;
      case "In Progress":
        return <Play size={20} className="text-blue-600" />;
      case "Planned":
        return <Calendar size={20} className="text-orange-600" />;
      default:
        return <Warning size={20} className="text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Planned":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const formatDuration = (startTime?: string, endTime?: string, quantity?: number, rate?: number) => {
    if (startTime && endTime) {
      // Calculate actual duration
      const start = new Date(`2024-01-15 ${startTime}`);
      const end = new Date(`2024-01-15 ${endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      return `${diffMins} min`;
    } else if (quantity && rate) {
      // Calculate estimated duration
      const estimatedMins = Math.ceil(quantity / rate);
      return `~${estimatedMins} min`;
    }
    return "N/A";
  };

  const recentLoadings = loadings.filter(l => l.status === "Completed" || l.status === "In Progress");
  const plannedLoadings = loadings.filter(l => l.status === "Planned");

  const products = [
    { code: "DSL001", name: "Ultra Low Sulfur Diesel", rate: 1200 },
    { code: "GSL087", name: "Premium Gasoline 91", rate: 1500 },
    { code: "GSL095", name: "Premium Gasoline 95", rate: 1500 },
    { code: "KER001", name: "Jet Fuel A1", rate: 800 },
    { code: "HFO180", name: "Heavy Fuel Oil 180", rate: 600 }
  ];

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeView === "recent" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveView("recent")}
            className={activeView === "recent" ? "bg-white shadow-sm" : ""}
          >
            Recent Loadings ({recentLoadings.length})
          </Button>
          <Button
            variant={activeView === "planned" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveView("planned")}
            className={activeView === "planned" ? "bg-white shadow-sm" : ""}
          >
            Planned Loadings ({plannedLoadings.length})
          </Button>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" />
              Schedule Loading
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Loading</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="truckNumber">Truck Number</Label>
                <Input
                  id="truckNumber"
                  value={newLoading.truckNumber || ""}
                  onChange={(e) => setNewLoading({...newLoading, truckNumber: e.target.value})}
                  placeholder="e.g., FL-001-ABC"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="productCode">Product</Label>
                <Select 
                  value={newLoading.productCode || ""} 
                  onValueChange={(value) => {
                    const product = products.find(p => p.code === value);
                    setNewLoading({
                      ...newLoading, 
                      productCode: value,
                      productName: product?.name || "",
                      loadingRate: product?.rate || 1000
                    });
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.code} value={product.code}>
                        {product.code} - {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity (Liters)</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newLoading.quantity || ""}
                  onChange={(e) => setNewLoading({...newLoading, quantity: parseInt(e.target.value) || 0})}
                  placeholder="15000"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="plannedDate">Planned Date & Time</Label>
                <Input
                  id="plannedDate"
                  type="datetime-local"
                  value={newLoading.plannedDate || ""}
                  onChange={(e) => setNewLoading({...newLoading, plannedDate: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Loading Rate</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    value={newLoading.loadingRate || ""}
                    onChange={(e) => setNewLoading({...newLoading, loadingRate: parseInt(e.target.value) || 1000})}
                    placeholder="1000"
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">L/min</span>
                  <span className="text-sm text-gray-500">
                    (~{Math.ceil((newLoading.quantity || 0) / (newLoading.loadingRate || 1000))} min duration)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLoading}>
                Schedule Loading
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loadings List */}
      <div className="space-y-4">
        {(activeView === "recent" ? recentLoadings : plannedLoadings).map((loading) => (
          <div key={loading.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              {/* Left side - Main info */}
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getStatusIcon(loading.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Truck size={16} />
                      {loading.truckNumber}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loading.status)}`}>
                      {loading.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Product:</span>
                      <p className="font-medium">{loading.productCode}</p>
                      <p className="text-gray-600 text-xs">{loading.productName}</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <p className="font-medium">{loading.quantity.toLocaleString()} L</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">
                        {loading.status === "Planned" ? "Planned:" : "Loaded:"}
                      </span>
                      <p className="font-medium">
                        {loading.status === "Planned" 
                          ? new Date(loading.plannedDate!).toLocaleString()
                          : new Date(loading.loadedDate!).toLocaleString()
                        }
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-medium">
                        {formatDuration(loading.startTime, loading.endTime, loading.quantity, loading.loadingRate)}
                      </p>
                    </div>
                  </div>

                  {loading.status === "In Progress" && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Play size={14} />
                        <span>Started at {loading.startTime}</span>
                        <span>•</span>
                        <span>Rate: {loading.loadingRate.toLocaleString()} L/min</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: "65%"}}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Estimated completion: 18:58</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex gap-2">
                {loading.status === "Planned" && (
                  <Button variant="outline" size="sm">
                    Start Loading
                  </Button>
                )}
                {loading.status === "In Progress" && (
                  <Button variant="outline" size="sm">
                    Complete
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  Details
                </Button>
              </div>
            </div>
          </div>
        ))}

        {(activeView === "recent" ? recentLoadings : plannedLoadings).length === 0 && (
          <div className="text-center py-12">
            {activeView === "recent" ? (
              <>
                <GasPump size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent loadings</h3>
                <p className="text-gray-500 mb-4">Recent loading activities will appear here.</p>
              </>
            ) : (
              <>
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No planned loadings</h3>
                <p className="text-gray-500 mb-4">Schedule your first loading to get started.</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus size={16} className="mr-2" />
                  Schedule Loading
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </div>
  );
}
