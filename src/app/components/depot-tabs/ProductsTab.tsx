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
import { DepotDetails, Product } from "../DepotDetailsPage";
import { 
  Plus, 
  PencilSimple, 
  Trash,
  ThermometerSimple,
  GasPump,
  Timer,
  CurrencyDollar
} from "@phosphor-icons/react";

interface ProductsTabProps {
  depot: DepotDetails;
  onSave: () => void;
}

export default function ProductsTab({ depot, onSave }: ProductsTabProps) {
  // Mock products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      productCode: "DSL001",
      productName: "Ultra Low Sulfur Diesel",
      status: "Active",
      costPerLiter: 1.45,
      currentTemperature: 22.5,
      density: 0.835,
      loadingRate: 1200
    },
    {
      id: 2,
      productCode: "GSL087",
      productName: "Premium Gasoline 91",
      status: "Active",
      costPerLiter: 1.65,
      currentTemperature: 24.1,
      density: 0.755,
      loadingRate: 1500
    },
    {
      id: 3,
      productCode: "GSL095",
      productName: "Premium Gasoline 95",
      status: "Active",
      costPerLiter: 1.75,
      currentTemperature: 23.8,
      density: 0.758,
      loadingRate: 1500
    },
    {
      id: 4,
      productCode: "KER001",
      productName: "Jet Fuel A1",
      status: "Inactive",
      costPerLiter: 1.85,
      currentTemperature: 21.2,
      density: 0.795,
      loadingRate: 800
    },
    {
      id: 5,
      productCode: "HFO180",
      productName: "Heavy Fuel Oil 180",
      status: "Active",
      costPerLiter: 0.95,
      currentTemperature: 45.0,
      density: 0.980,
      loadingRate: 600
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    productCode: "",
    productName: "",
    status: "Active",
    costPerLiter: 0,
    currentTemperature: 20,
    density: 0.8,
    loadingRate: 1000
  });

  const handleAddProduct = () => {
    if (newProduct.productCode && newProduct.productName) {
      const product: Product = {
        id: products.length + 1,
        productCode: newProduct.productCode!,
        productName: newProduct.productName!,
        status: newProduct.status as "Active" | "Inactive",
        costPerLiter: newProduct.costPerLiter || 0,
        currentTemperature: newProduct.currentTemperature || 20,
        density: newProduct.density || 0.8,
        loadingRate: newProduct.loadingRate || 1000
      };
      
      setProducts([...products, product]);
      setNewProduct({
        productCode: "",
        productName: "",
        status: "Active",
        costPerLiter: 0,
        currentTemperature: 20,
        density: 0.8,
        loadingRate: 1000
      });
      setShowAddDialog(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowAddDialog(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct && newProduct.productCode && newProduct.productName) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? {
              ...editingProduct,
              productCode: newProduct.productCode!,
              productName: newProduct.productName!,
              status: newProduct.status as "Active" | "Inactive",
              costPerLiter: newProduct.costPerLiter || 0,
              currentTemperature: newProduct.currentTemperature || 20,
              density: newProduct.density || 0.8,
              loadingRate: newProduct.loadingRate || 1000
            }
          : p
      );
      
      setProducts(updatedProducts);
      setEditingProduct(null);
      setNewProduct({
        productCode: "",
        productName: "",
        status: "Active",
        costPerLiter: 0,
        currentTemperature: 20,
        density: 0.8,
        loadingRate: 1000
      });
      setShowAddDialog(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const toggleProductStatus = (id: number) => {
    setProducts(products.map(p => 
      p.id === id 
        ? { ...p, status: p.status === "Active" ? "Inactive" as const : "Active" as const }
        : p
    ));
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Products Available at Depot</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="productCode">Product Code</Label>
                <Input
                  id="productCode"
                  value={newProduct.productCode || ""}
                  onChange={(e) => setNewProduct({...newProduct, productCode: e.target.value})}
                  placeholder="e.g., DSL001"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newProduct.productName || ""}
                  onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                  placeholder="e.g., Ultra Low Sulfur Diesel"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newProduct.status || "Active"} 
                  onValueChange={(value) => setNewProduct({...newProduct, status: value as "Active" | "Inactive"})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="costPerLiter">Cost per Liter ($)</Label>
                <Input
                  id="costPerLiter"
                  type="number"
                  step="0.01"
                  value={newProduct.costPerLiter || ""}
                  onChange={(e) => setNewProduct({...newProduct, costPerLiter: parseFloat(e.target.value) || 0})}
                  placeholder="1.45"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="currentTemperature">Current Temperature (°C)</Label>
                <Input
                  id="currentTemperature"
                  type="number"
                  step="0.1"
                  value={newProduct.currentTemperature || ""}
                  onChange={(e) => setNewProduct({...newProduct, currentTemperature: parseFloat(e.target.value) || 20})}
                  placeholder="22.5"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="density">Density (kg/L)</Label>
                <Input
                  id="density"
                  type="number"
                  step="0.001"
                  value={newProduct.density || ""}
                  onChange={(e) => setNewProduct({...newProduct, density: parseFloat(e.target.value) || 0.8})}
                  placeholder="0.835"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="loadingRate">Loading Rate (L/min)</Label>
                <Input
                  id="loadingRate"
                  type="number"
                  value={newProduct.loadingRate || ""}
                  onChange={(e) => setNewProduct({...newProduct, loadingRate: parseInt(e.target.value) || 1000})}
                  placeholder="1200"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setEditingProduct(null);
                setNewProduct({
                  productCode: "",
                  productName: "",
                  status: "Active",
                  costPerLiter: 0,
                  currentTemperature: 20,
                  density: 0.8,
                  loadingRate: 1000
                });
              }}>
                Cancel
              </Button>
              <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{product.productCode}</h4>
                <p className="text-sm text-gray-600 mt-1">{product.productName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditProduct(product)}
                  >
                    <PencilSimple size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CurrencyDollar size={16} />
                  <span>Cost/Liter</span>
                </div>
                <span className="font-medium">${product.costPerLiter.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ThermometerSimple size={16} />
                  <span>Temperature</span>
                </div>
                <span className="font-medium">{product.currentTemperature}°C</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GasPump size={16} />
                  <span>Density</span>
                </div>
                <span className="font-medium">{product.density} kg/L</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Timer size={16} />
                  <span>Loading Rate</span>
                </div>
                <span className="font-medium">{product.loadingRate.toLocaleString()} L/min</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
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
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </div>
  );
}
