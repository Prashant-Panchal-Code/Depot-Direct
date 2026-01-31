"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Product, DepotDetails } from "../DepotDetailsPage";
import {
  Plus,
  PencilSimple,
  Trash,
  ThermometerSimple,
  GasPump,
  Timer,
  CurrencyInr
} from "@phosphor-icons/react";
import { UserApiService, Product as ApiProduct, DepotProduct } from "@/lib/api/user";
import { useNotification } from "@/hooks/useNotification";
import { useLoader } from "@/contexts/LoaderContext";

interface ProductsTabProps {
  depot: DepotDetails;
  onSave: (updatedProducts: Product[]) => void;
}

export default function ProductsTab({ depot, onSave }: ProductsTabProps) {
  // Products currently added to the depot
  const [products, setProducts] = useState<Product[]>([]);

  // Available products from the master list
  const [availableProducts, setAvailableProducts] = useState<ApiProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Product>>({});
  const { showSuccess, showError } = useNotification();
  const { showLoader, hideLoader } = useLoader();

  // Map API DepotProduct to frontend Product
  const mapApiToFrontend = (apiProduct: DepotProduct): Product => ({
    id: apiProduct.id, // Use the unique DepotProduct ID
    productId: apiProduct.productId, // Store the master product ID
    productCode: apiProduct.productCode,
    productName: apiProduct.productName,
    status: apiProduct.productAvailable ? "Active" : "Inactive",
    costPerLiter: apiProduct.costPerLitre,
    currentTemperature: apiProduct.planningTemperature,
    density: apiProduct.density,
    loadingRate: apiProduct.loadingRateLpm,
    depotOfftakeLimit: apiProduct.offtakeLimitActive,
    dailyMaxLimit: apiProduct.dailyMaxLimitL,
    dailyMinLimit: apiProduct.dailyMinLimitL
  });

  // Load depot products from the API on mount
  useEffect(() => {
    const fetchDepotProducts = async () => {
      if (!depot.id) return;
      try {
        const data = await UserApiService.getDepotProducts(depot.id);
        if (data && data.length > 0) {
          setProducts(data.map(mapApiToFrontend));
        } else {
          // If no products from API, we could show empty or keep fallback for now
          // setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch depot products:", error);
      }
    };
    fetchDepotProducts();
  }, [depot.id]);

  // Fetch available products for the region
  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        if (!depot.regionId) {
          console.warn("No region ID available for fetching products");
          return;
        }
        const data = await UserApiService.getProductsByRegion(depot.regionId);
        setAvailableProducts(data.filter(p => p.active));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchAvailableProducts();
  }, [depot.regionId]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({ ...product });
    setShowAddDialog(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct && editFormData) {
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...p, ...editFormData } as Product : p
      ));
      setShowAddDialog(false);
      setEditingProduct(null);
    }
  };

  const handleAddProduct = async () => {
    const apiProduct = availableProducts.find(p => p.id.toString() === selectedProductId);
    if (apiProduct) {
      // Check if already added
      if (products.some(p => p.productId === apiProduct.id)) {
        showError("Product already exists", "This product is already added to the depot.");
        setShowAddDialog(false);
        return;
      }

      try {
        showLoader("Adding product to depot...");
        const response = await UserApiService.addDepotProduct(depot.id, {
          productId: apiProduct.id,
          density: 0.8,
          planningTemperature: 20,
          loadingRateLpm: 1000,
          productAvailable: true,
          costPerLitre: 0,
          offtakeLimitActive: false,
          dailyMinLimitL: 0,
          dailyMaxLimitL: 0,
          metadata: ""
        });

        const newProduct = mapApiToFrontend(response);
        setProducts([...products, newProduct]);
        setSelectedProductId("");
        setShowAddDialog(false);
        showSuccess("Product added", `${newProduct.productName} has been added successfully.`);
      } catch (error) {
        console.error("Failed to add product:", error);
        showError("Failed to add product", "An error occurred while adding the product.");
      } finally {
        hideLoader();
      }
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const toggleProductStatus = (id: number) => {
    setProducts(products.map(p =>
      p.id === id
        ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
        : p
    ));
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Products Available at Depot</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary-custom hover:bg-primary-custom/90">
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className={editingProduct ? "max-w-2xl" : "max-w-md"}>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product Settings" : "Add New Product"}</DialogTitle>
            </DialogHeader>

            {editingProduct ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <Label className="text-gray-500 text-xs">Product Code</Label>
                  <Input
                    value={editFormData.productCode || ""}
                    readOnly
                    className="mt-1 bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label className="text-gray-500 text-xs">Product Name</Label>
                  <Input
                    value={editFormData.productName || ""}
                    readOnly
                    className="mt-1 bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="costPerLiter">Cost per Liter</Label>
                  <Input
                    id="costPerLiter"
                    type="number"
                    step="0.01"
                    value={editFormData.costPerLiter || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, costPerLiter: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currentTemperature">Current Temperature (°C)</Label>
                  <Input
                    id="currentTemperature"
                    type="number"
                    step="0.1"
                    value={editFormData.currentTemperature || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, currentTemperature: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="density">Density (kg/L)</Label>
                  <Input
                    id="density"
                    type="number"
                    step="0.001"
                    value={editFormData.density || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, density: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="loadingRate">Loading Rate (L/min)</Label>
                  <Input
                    id="loadingRate"
                    type="number"
                    value={editFormData.loadingRate || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, loadingRate: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="depotOfftakeLimit"
                      checked={editFormData.depotOfftakeLimit || false}
                      onCheckedChange={(checked) => setEditFormData({ ...editFormData, depotOfftakeLimit: !!checked })}
                    />
                    <Label htmlFor="depotOfftakeLimit">Depot Offtake Limit</Label>
                  </div>
                  {editFormData.depotOfftakeLimit && (
                    <div className="grid grid-cols-2 gap-4 pl-6 border-l-2">
                      <div>
                        <Label htmlFor="dailyMinLimit">Min Limit (L)</Label>
                        <Input
                          id="dailyMinLimit"
                          type="number"
                          value={editFormData.dailyMinLimit || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, dailyMinLimit: parseInt(e.target.value) || 0 })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dailyMaxLimit">Max Limit (L)</Label>
                        <Input
                          id="dailyMaxLimit"
                          type="number"
                          value={editFormData.dailyMaxLimit || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, dailyMaxLimit: parseInt(e.target.value) || 0 })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6">
                <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                  Product
                </Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Select a product to add..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.length > 0 ? (
                      availableProducts.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.productCode} - {p.productName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500 text-center">No products available in this region</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setSelectedProductId("");
                setEditingProduct(null);
              }}>
                Cancel
              </Button>
              <Button
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                className="bg-primary-custom hover:bg-primary-custom/90"
                disabled={!editingProduct && !selectedProductId}
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{product.productCode}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.productName}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEditProduct(product)}
                  >
                    <PencilSimple size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash size={12} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <CurrencyInr size={14} />
                  <span>Cost/L</span>
                </div>
                <span className="font-medium text-xs">{product.costPerLiter.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <ThermometerSimple size={14} />
                  <span>Temp</span>
                </div>
                <span className="font-medium text-xs">{product.currentTemperature}°C</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <GasPump size={14} />
                  <span>Density</span>
                </div>
                <span className="font-medium text-xs">{product.density} kg/L</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Timer size={14} />
                  <span>Rate</span>
                </div>
                <span className="font-medium text-xs">{product.loadingRate.toLocaleString()} L/min</span>
              </div>

              {product.depotOfftakeLimit && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-xs text-gray-500 font-medium mb-1">Daily Limits</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span>Min</span>
                      </div>
                      <span className="font-medium text-xs">{product.dailyMinLimit?.toLocaleString() || 0} L</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span>Max</span>
                      </div>
                      <span className="font-medium text-xs">{product.dailyMaxLimit?.toLocaleString() || 0} L</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => toggleProductStatus(product.id)}
              >
                {product.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <GasPump size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
          <p className="text-gray-500 mb-4">Add your first product to get started.</p>
          <Button className="bg-primary-custom hover:bg-primary-custom/90" onClick={() => setShowAddDialog(true)}>
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-primary-custom hover:bg-primary-custom/90" onClick={() => onSave(products)}>Save Changes</Button>
      </div>
    </div>
  );
}
