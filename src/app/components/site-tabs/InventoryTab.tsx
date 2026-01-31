"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CaretDown, CaretUp, PlusSquare } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";
import { UserApiService, TankFull, Product } from "@/lib/api/user";
import { useRegionContext } from "@/contexts/RoleBasedContext";

interface InventoryTabProps {
  site: SiteDetails;
}

// Type for editable tank fields
interface EditableTankFields {
  productId: number;
  capacityL: number;
  deadstockL: number;
  safeFillL: number;
  dischargeRateLpm: number;
  avgDailySalesL: number;
}

export default function InventoryTab({ site }: InventoryTabProps) {
  const [expandedTanks, setExpandedTanks] = useState<{ [key: number]: boolean }>({});
  const [isAddTankDialogOpen, setIsAddTankDialogOpen] = useState(false);
  const [newTankCode, setNewTankCode] = useState("");
  const [newTankProductId, setNewTankProductId] = useState<string>("");
  const [tanks, setTanks] = useState<TankFull[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editedTanks, setEditedTanks] = useState<{ [tankId: number]: Partial<EditableTankFields> }>({});

  // Get selected region from context (from header)
  const { selectedRegions } = useRegionContext();

  // Fetch tank data when component mounts or site changes
  useEffect(() => {
    const fetchTanks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const tankData = await UserApiService.getTanksBySite(site.id);
        setTanks(tankData);
      } catch (err) {
        console.error("Failed to fetch tanks:", err);
        setError(err instanceof Error ? err.message : "Failed to load tank data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTanks();
  }, [site.id]);

  // Fetch products by selected region from context
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use the selected region from the header context
        if (!selectedRegions || selectedRegions.length === 0) {
          console.warn("No region selected in header");
          return;
        }

        const regionId = selectedRegions[0].id;
        console.log("Fetching products for region:", regionId);

        const productData = await UserApiService.getProductsByRegion(regionId);
        console.log("Fetched products:", productData);
        setProducts(productData.filter(p => p.active)); // Only show active products
      } catch (err) {
        console.error("Failed to fetch products:", err);
        // Don't show error to user, just log it
      }
    };

    fetchProducts();
  }, [selectedRegions]); // Re-fetch when selected region changes

  const handleTankFieldChange = (tankId: number, field: keyof EditableTankFields, value: number) => {
    setEditedTanks(prev => ({
      ...prev,
      [tankId]: {
        ...prev[tankId],
        [field]: value
      }
    }));
  };

  const getTankValue = (tank: TankFull, field: keyof EditableTankFields): number => {
    // Special handling for avgDailySalesL which comes from lastReadings
    if (field === 'avgDailySalesL') {
      const latestReading = tank.lastReadings && tank.lastReadings.length > 0 ? tank.lastReadings[0] : null;
      return editedTanks[tank.id]?.[field] ?? latestReading?.avgDailySalesL ?? 0;
    }
    return editedTanks[tank.id]?.[field] ?? tank[field];
  };

  const handleSaveTank = async (tankId: number) => {
    const editedFields = editedTanks[tankId];
    if (!editedFields || Object.keys(editedFields).length === 0) {
      console.log("No changes to save for tank", tankId);
      return;
    }

    try {
      // TODO: Add API call to update tank
      console.log("Saving tank", tankId, "with changes:", editedFields);

      // Update local state
      setTanks(prev => prev.map(tank =>
        tank.id === tankId
          ? { ...tank, ...editedFields }
          : tank
      ));

      // Clear edited state for this tank
      setEditedTanks(prev => {
        const newState = { ...prev };
        delete newState[tankId];
        return newState;
      });

      // TODO: Show success notification
      console.log("Tank updated successfully");
    } catch (err) {
      console.error("Failed to save tank:", err);
      // TODO: Show error notification
    }
  };

  const toggleTankExpansion = (tankId: number) => {
    setExpandedTanks(prev => ({
      ...prev,
      [tankId]: !prev[tankId]
    }));
  };

  const handleAddTank = async () => {
    if (!newTankCode.trim() || !newTankProductId) {
      return;
    }

    try {
      setIsLoading(true);

      // Create the tank
      const newTank = await UserApiService.createTank({
        tankCode: newTankCode,
        siteId: site.id,
        productId: parseInt(newTankProductId)
      });

      console.log("Tank created successfully:", newTank);

      // Refresh the tank list
      const tankData = await UserApiService.getTanksBySite(site.id);
      setTanks(tankData);

      // Reset form and close dialog
      setNewTankCode("");
      setNewTankProductId("");
      setIsAddTankDialogOpen(false);

      // TODO: Show success notification
      alert(`Tank "${newTank.tankCode}" created successfully!`);
    } catch (err) {
      console.error("Failed to create tank:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create tank";

      // Show error to user
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setNewTankCode("");
    setNewTankProductId("");
    setIsAddTankDialogOpen(false);
  };

  const calculateFillPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "in transit":
        return "bg-blue-100 text-blue-700";
      case "planned":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Helper to get day name from day of week number (0 = Sunday, 1 = Monday, etc.)
  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayOfWeek] || "Unknown";
  };

  // Helper to aggregate daily sales from sales patterns
  const getDailySalesFromPatterns = (tank: TankFull) => {
    const dailyMap = new Map<number, number>();

    tank.salesPatterns.forEach(pattern => {
      const current = dailyMap.get(pattern.dayOfWeek) || 0;
      dailyMap.set(pattern.dayOfWeek, current + pattern.avgHourlySalesL);
    });

    return Array.from(dailyMap.entries()).map(([dayOfWeek, totalSales]) => ({
      day: getDayName(dayOfWeek),
      avgSales: Math.round(totalSales)
    })).sort((a, b) => {
      const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Add New Tank Button */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Tank Management</h3>
        <Dialog open={isAddTankDialogOpen} onOpenChange={setIsAddTankDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white flex items-center gap-2">
              <PlusSquare size={30} weight="fill" />
              Add New Tank
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Tank</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="tankCode" className="text-sm font-medium text-gray-700">
                  Tank Code
                </Label>
                <Input
                  id="tankCode"
                  value={newTankCode}
                  onChange={(e) => setNewTankCode(e.target.value)}
                  placeholder="Enter tank code (e.g., T1, TANK-A, etc.)"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                  Product
                </Label>
                <Select value={newTankProductId} onValueChange={setNewTankProductId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.productCode} - {product.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button
                onClick={handleAddTank}
                disabled={!newTankCode.trim() || !newTankProductId}
                className="bg-primary-custom hover:bg-primary-custom/90 text-white"
              >
                Add Tank
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-custom mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tank data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading tanks</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Tank Grid - Single Column using Full Width */}
      {!isLoading && !error && (
        <div className="flex-1 space-y-6 overflow-y-auto">
          {tanks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No tanks found for this site.</p>
            </div>
          ) : (
            tanks.map((tank) => {
              const isExpanded = expandedTanks[tank.id];
              const latestReading = tank.lastReadings && tank.lastReadings.length > 0 ? tank.lastReadings[0] : null;
              const currentVolume = latestReading?.currentVolumeL || 0;
              const fillPercentage = calculateFillPercentage(currentVolume, tank.capacityL);
              const avgDailySales = latestReading?.avgDailySalesL || 0;

              return (
                <div key={tank.id} className="bg-white border border-gray-200 rounded-lg">
                  {/* Tank Card Header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleTankExpansion(tank.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{tank.tankCode}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tank.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                          {tank.active ? 'Active' : 'Inactive'}
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
                        <span>Product ID: {tank.productId}</span>
                        <span>{currentVolume.toLocaleString()}L / {tank.capacityL.toLocaleString()}L</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${fillPercentage > 70 ? 'bg-green-500' :
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
                            {/* Row 1: Tank Status, Product ID */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs font-medium text-gray-700">Tank Status</Label>
                                <Select defaultValue={tank.active ? "Active" : "Inactive"}>
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
                                <Label className="text-xs font-medium text-gray-700">Product</Label>
                                <Select
                                  value={getTankValue(tank, 'productId').toString()}
                                  onValueChange={(value) => handleTankFieldChange(tank.id, 'productId', parseInt(value))}
                                >
                                  <SelectTrigger className="mt-1 h-8 text-sm">
                                    <SelectValue placeholder="Select product..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {products.map((product) => (
                                      <SelectItem key={product.id} value={product.id.toString()}>
                                        {product.productCode} - {product.productName}
                                      </SelectItem>
                                    ))}
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
                                  value={getTankValue(tank, 'capacityL')}
                                  onChange={(e) => handleTankFieldChange(tank.id, 'capacityL', parseFloat(e.target.value))}
                                  className="mt-1 h-8 text-sm"
                                  placeholder="e.g. 15000"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-700">Deadstock Volume (L)</Label>
                                <Input
                                  type="number"
                                  value={getTankValue(tank, 'deadstockL')}
                                  onChange={(e) => handleTankFieldChange(tank.id, 'deadstockL', parseFloat(e.target.value))}
                                  className="mt-1 h-8 text-sm"
                                  placeholder="e.g. 500"
                                />
                              </div>
                            </div>

                            {/* Row 3: Safe Fill, Discharge Rate */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs font-medium text-gray-700">Safe Fill (L)</Label>
                                <Input
                                  type="number"
                                  value={getTankValue(tank, 'safeFillL')}
                                  onChange={(e) => handleTankFieldChange(tank.id, 'safeFillL', parseFloat(e.target.value))}
                                  className="mt-1 h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-700">Discharge Rate (L/min)</Label>
                                <Input
                                  type="number"
                                  value={getTankValue(tank, 'dischargeRateLpm')}
                                  onChange={(e) => handleTankFieldChange(tank.id, 'dischargeRateLpm', parseFloat(e.target.value))}
                                  className="mt-1 h-8 text-sm"
                                />
                              </div>
                            </div>

                            {/* Row 4: Current Volume, Avg Daily Sales */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs font-medium text-gray-700">Current Volume (L)</Label>
                                <Input
                                  type="number"
                                  value={currentVolume}
                                  className="mt-1 h-8 text-sm"
                                  disabled
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-gray-700">Avg. Daily Sales (L)</Label>
                                <Input
                                  type="number"
                                  value={getTankValue(tank, 'avgDailySalesL')}
                                  onChange={(e) => handleTankFieldChange(tank.id, 'avgDailySalesL', parseFloat(e.target.value))}
                                  className="mt-1 h-8 text-sm"
                                />
                              </div>
                            </div>

                            {/* Reading Info */}
                            {latestReading && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs font-medium text-gray-700">Reading Method</Label>
                                  <Input
                                    value={latestReading.readingMethod}
                                    className="mt-1 h-8 text-sm"
                                    disabled
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs font-medium text-gray-700">Last Reading</Label>
                                  <Input
                                    value={formatDateTime(latestReading.readingTimestamp)}
                                    className="mt-1 h-8 text-sm"
                                    disabled
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Planned Deliveries */}
                          {tank.deliveries && tank.deliveries.length > 0 && (
                            <div className="mt-4 border-t border-gray-200 pt-4">
                              <h5 className="text-xs font-semibold text-gray-900 mb-2">Planned Deliveries</h5>
                              <div className="grid grid-cols-4 gap-2">
                                {tank.deliveries.map((delivery) => (
                                  <div key={delivery.id} className="bg-white border border-gray-200 rounded p-2 text-xs">
                                    <div className="flex flex-col">
                                      <span className="font-medium text-gray-900 text-center">{delivery.plannedQuantityL.toLocaleString()}L</span>
                                      <span className={`px-1 py-0.5 rounded text-xs font-medium text-center mt-1 ${getDeliveryStatusColor(delivery.status)}`}>
                                        {delivery.status}
                                      </span>
                                    </div>
                                    <div className="text-gray-600 mt-1 text-center">{formatDate(delivery.scheduledArrival)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tank Actions */}
                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => handleSaveTank(tank.id)}
                              disabled={!editedTanks[tank.id] || Object.keys(editedTanks[tank.id]).length === 0}
                            >
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

                          {/* Last Readings */}
                          {tank.lastReadings && tank.lastReadings.length > 0 && (
                            <div className="mb-3">
                              <h6 className="text-xs font-semibold text-gray-900 mb-2">Recent Readings</h6>
                              <div className="bg-white border border-gray-200 rounded overflow-hidden">
                                <div className="grid grid-cols-3 gap-2 p-2 bg-gray-50 text-xs font-medium text-gray-700 border-b">
                                  <div>Date</div>
                                  <div>Volume (L)</div>
                                  <div>Sales (L)</div>
                                </div>
                                <div className="max-h-28 overflow-y-auto">
                                  {tank.lastReadings.slice(0, 10).map((reading) => (
                                    <div key={reading.id} className="grid grid-cols-3 gap-2 p-1.5 text-xs border-b border-gray-100 hover:bg-gray-50">
                                      <div className="text-gray-900">{formatDate(reading.readingTimestamp)}</div>
                                      <div className="text-gray-700">{reading.currentVolumeL.toLocaleString()}</div>
                                      <div className="text-gray-700">{reading.salesSinceLastReadingL.toLocaleString()}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Daily Sales Pattern from Sales Patterns */}
                          {tank.salesPatterns && tank.salesPatterns.length > 0 && (
                            <div>
                              <h6 className="text-xs font-medium text-gray-700 mb-2">Daily Sales Pattern (L)</h6>
                              <div className="grid grid-cols-7 gap-1">
                                {getDailySalesFromPatterns(tank).map((record, idx) => (
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
            })
          )}
        </div>
      )}
    </div>
  );
}
