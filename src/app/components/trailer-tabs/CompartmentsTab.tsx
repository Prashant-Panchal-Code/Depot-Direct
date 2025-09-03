"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrailerDetails, TrailerCompartment } from "../TrailerDetailsPage";
import { PlusSquare, Pencil, Trash, Package } from "@phosphor-icons/react";

interface CompartmentsTabProps {
  trailer: TrailerDetails;
  onSave: (data: Partial<TrailerDetails>) => void;
}

interface CompartmentFormData {
  compartmentNo: number;
  capacity: number;
  minVolume: number;
  maxVolume: number;
  allowedProducts: string[];
  partialLoadAllowed: boolean;
  mustUse: boolean;
}

export default function CompartmentsTab({ trailer, onSave }: CompartmentsTabProps) {
  const [editingCompartment, setEditingCompartment] = useState<TrailerCompartment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CompartmentFormData>({
    compartmentNo: 1,
    capacity: 0,
    minVolume: 0,
    maxVolume: 0,
    allowedProducts: [],
    partialLoadAllowed: true,
    mustUse: false,
  });

  const availableProducts = [
    "Diesel",
    "Petrol Unleaded",
    "Petrol Super",
    "Heating Oil",
    "Kerosene",
    "AdBlue",
    "Biodiesel",
    "LPG"
  ];

  // Helper function to check if compartments are sequential
  const areCompartmentsSequential = (compartments: TrailerCompartment[]) => {
    if (!compartments || compartments.length === 0) return true;
    
    const numbers = compartments.map(c => c.compartmentNo).sort((a, b) => a - b);
    const expectedNumbers = Array.from({ length: numbers.length }, (_, i) => i + 1);
    
    return JSON.stringify(numbers) === JSON.stringify(expectedNumbers);
  };

  // Helper function to get missing compartment numbers
  const getMissingCompartmentNumbers = (compartments: TrailerCompartment[]) => {
    if (!compartments || compartments.length === 0) return [];
    
    const existingNumbers = compartments.map(c => c.compartmentNo).sort((a, b) => a - b);
    const maxNumber = Math.max(...existingNumbers);
    const expectedNumbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    
    return expectedNumbers.filter(num => !existingNumbers.includes(num));
  };

  const handleAddCompartment = () => {
    // Find the next sequential compartment number
    const existingNumbers = trailer.compartments?.map(c => c.compartmentNo).sort((a, b) => a - b) || [];
    let nextCompartmentNo = 1;
    
    // Find the first missing number in the sequence
    for (let i = 1; i <= existingNumbers.length + 1; i++) {
      if (!existingNumbers.includes(i)) {
        nextCompartmentNo = i;
        break;
      }
    }
    
    setEditingCompartment(null);
    setFormData({
      compartmentNo: nextCompartmentNo,
      capacity: 0,
      minVolume: 0,
      maxVolume: 0,
      allowedProducts: [],
      partialLoadAllowed: true,
      mustUse: false,
    });
    setIsDialogOpen(true);
  };

  const handleEditCompartment = (compartment: TrailerCompartment) => {
    setEditingCompartment(compartment);
    setFormData({
      compartmentNo: compartment.compartmentNo,
      capacity: compartment.capacity,
      minVolume: compartment.minVolume,
      maxVolume: compartment.maxVolume,
      allowedProducts: compartment.allowedProducts,
      partialLoadAllowed: compartment.partialLoadAllowed,
      mustUse: compartment.mustUse,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCompartment = (compartmentId: number) => {
    const compartmentToDelete = trailer.compartments?.find(c => c.id === compartmentId);
    if (!compartmentToDelete) return;
    
    const confirmMessage = `Are you sure you want to delete Compartment ${compartmentToDelete.compartmentNo}? This may make the trailer inactive if it creates gaps in the compartment sequence.`;
    
    if (confirm(confirmMessage)) {
      const updatedCompartments = trailer.compartments?.filter(c => c.id !== compartmentId) || [];
      
      // Check if deletion would create non-sequential compartments
      const isSequential = areCompartmentsSequential(updatedCompartments);
      const missingNumbers = getMissingCompartmentNumbers(updatedCompartments);
      
      // Update trailer with new compartments and active status
      onSave({ 
        compartments: updatedCompartments,
        active: isSequential && updatedCompartments.length > 0
      });
      
      if (!isSequential && missingNumbers.length > 0) {
        alert(`Warning: Deleting this compartment has created gaps in the sequence (missing compartments: ${missingNumbers.join(', ')}). The trailer has been deactivated and must have sequential compartments to be reactivated.`);
      }
    }
  };

  const handleSaveCompartment = () => {
    // Validation: Check if capacity is provided and greater than 0
    if (!formData.capacity || formData.capacity <= 0) {
      alert("Capacity is mandatory and must be greater than 0.");
      return;
    }

    // Validation: Check if minVolume exceeds capacity
    if (formData.minVolume > formData.capacity) {
      alert("Minimum volume cannot exceed capacity.");
      return;
    }

    // Validation: Check if maxVolume exceeds capacity
    if (formData.maxVolume > formData.capacity) {
      alert("Maximum volume cannot exceed capacity.");
      return;
    }

    // Validation: Check if minVolume is greater than maxVolume
    if (formData.minVolume > formData.maxVolume) {
      alert("Minimum volume cannot be greater than maximum volume.");
      return;
    }

    // Apply logic before saving
    const finalFormData = { ...formData };
    
    // Apply volume logic based on settings
    if (!finalFormData.partialLoadAllowed && finalFormData.mustUse) {
      // Not partial load + must use = min/max = capacity
      finalFormData.minVolume = finalFormData.capacity;
      finalFormData.maxVolume = finalFormData.capacity;
    } else if (finalFormData.mustUse) {
      // Must use = ensure min > 0
      finalFormData.minVolume = Math.max(1, finalFormData.minVolume);
    }
    
    // Ensure max doesn't exceed capacity (safety check)
    finalFormData.maxVolume = Math.min(finalFormData.maxVolume, finalFormData.capacity);
    // Ensure min doesn't exceed capacity (safety check)
    finalFormData.minVolume = Math.min(finalFormData.minVolume, finalFormData.capacity);
    // Ensure min doesn't exceed max (safety check)
    finalFormData.minVolume = Math.min(finalFormData.minVolume, finalFormData.maxVolume);
    
    const updatedCompartments = [...(trailer.compartments || [])];
    
    if (editingCompartment) {
      // Update existing compartment
      const index = updatedCompartments.findIndex(c => c.id === editingCompartment.id);
      if (index !== -1) {
        updatedCompartments[index] = {
          ...editingCompartment,
          ...finalFormData,
        };
      }
    } else {
      // Add new compartment
      const newCompartment: TrailerCompartment = {
        id: Date.now(), // Simple ID generation for demo
        ...finalFormData,
      };
      updatedCompartments.push(newCompartment);
    }
    
    // Reorder compartments sequentially by compartmentNo
    updatedCompartments.sort((a, b) => a.compartmentNo - b.compartmentNo);
    
    // Check if compartments are sequential
    const isSequential = areCompartmentsSequential(updatedCompartments);
    
    onSave({ 
      compartments: updatedCompartments,
      active: isSequential && updatedCompartments.length > 0
    });
    
    setIsDialogOpen(false);
    
    // Show message if trailer becomes active due to completing the sequence
    if (isSequential && updatedCompartments.length > 0 && !trailer.active) {
      alert("Great! All compartments are now sequential. The trailer has been activated and compartments have been reordered.");
    }
  };

  const handleProductToggle = (product: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        allowedProducts: [...formData.allowedProducts, product]
      });
    } else {
      setFormData({
        ...formData,
        allowedProducts: formData.allowedProducts.filter(p => p !== product)
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Compartment Configuration</h2>
          <p className="text-sm text-gray-600 mt-1">Configure compartment specifications and allowed products (master data only)</p>
          
          {/* Sequential Status Indicator */}
          {trailer.compartments && trailer.compartments.length > 0 && (
            <div className="mt-2">
              {areCompartmentsSequential(trailer.compartments) ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm font-medium text-green-700">
                    Sequential compartments - Trailer is active
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-sm font-medium text-red-700">
                    Non-sequential compartments (missing: {getMissingCompartmentNumbers(trailer.compartments).join(', ')}) - Trailer is inactive
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <Button onClick={handleAddCompartment} className="bg-primary-custom hover:bg-primary-custom/90">
          <PlusSquare size={16} className="mr-2" />
          Add Compartment
        </Button>
      </div>

      {(!trailer.compartments || trailer.compartments.length === 0) ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Compartments Configured</h3>
          <p className="text-gray-500 mb-4">This trailer doesn&apos;t have any compartments configured yet. Add compartments to define the structure and allowed products.</p>
          <Button onClick={handleAddCompartment} className="bg-primary-custom hover:bg-primary-custom/90">
            <PlusSquare size={16} className="mr-2" />
            Add First Compartment
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trailer.compartments
            .sort((a, b) => a.compartmentNo - b.compartmentNo) // Display compartments in sequential order
            .map((compartment) => (
            <div key={compartment.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Compartment {compartment.compartmentNo}
                  </h3>
                  <p className="text-sm text-gray-500">{compartment.capacity.toLocaleString()} L</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCompartment(compartment)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCompartment(compartment.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-gray-600">
                  <p><strong>Allowed Products:</strong></p>
                  <p className="mt-1">
                    {compartment.allowedProducts.length === 0 
                      ? "No products assigned" 
                      : compartment.allowedProducts.length === availableProducts.length 
                        ? "All Products" 
                        : compartment.allowedProducts.join(", ")
                    }
                  </p>
                </div>
                
                <div className="text-xs text-gray-600">
                  <p><strong>Volume Range:</strong></p>
                  <p className="mt-1">{compartment.minVolume.toLocaleString()} - {compartment.maxVolume.toLocaleString()} L</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {compartment.partialLoadAllowed && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md font-medium">
                      Partial Load OK
                    </span>
                  )}
                  {compartment.mustUse && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
                      Must Use
                    </span>
                  )}
                  {!compartment.partialLoadAllowed && !compartment.mustUse && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      Standard Configuration
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Compartment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCompartment ? "Edit Compartment" : "Add New Compartment"}
            </DialogTitle>
            <DialogDescription>
              Configure the compartment specifications, capacity, and allowed products for this compartment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="compartmentNo">Compartment Number</Label>
                <Input
                  id="compartmentNo"
                  type="number"
                  value={formData.compartmentNo}
                  onChange={(e) => setFormData({ ...formData, compartmentNo: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label htmlFor="capacity" className="text-sm font-medium">
                  Capacity (L) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  required
                  value={formData.capacity}
                  onChange={(e) => {
                    const capacity = parseInt(e.target.value) || 0;
                    setFormData({ 
                      ...formData, 
                      capacity,
                      // Auto-adjust min/max based on current logic and capacity constraints
                      minVolume: (!formData.partialLoadAllowed && formData.mustUse) ? capacity : Math.min(formData.minVolume, capacity),
                      maxVolume: (!formData.partialLoadAllowed && formData.mustUse) ? capacity : Math.min(formData.maxVolume, capacity)
                    });
                  }}
                  className={`${formData.capacity <= 0 ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder="Enter capacity in liters"
                />
                {formData.capacity <= 0 && (
                  <p className="text-xs text-red-600 mt-1">Capacity is mandatory and must be greater than 0</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minVolume">Min Volume (L)</Label>
                <Input
                  id="minVolume"
                  type="number"
                  min="0"
                  max={Math.min(formData.capacity, formData.maxVolume)}
                  value={formData.minVolume}
                  onChange={(e) => {
                    const minVolume = parseInt(e.target.value) || 0;
                    const clampedMinVolume = Math.min(minVolume, formData.capacity, formData.maxVolume);
                    setFormData({ 
                      ...formData, 
                      minVolume: clampedMinVolume
                    });
                  }}
                  disabled={!formData.partialLoadAllowed && formData.mustUse}
                  className={`${(!formData.partialLoadAllowed && formData.mustUse) ? "bg-gray-100" : ""} ${
                    formData.minVolume > formData.capacity || formData.minVolume > formData.maxVolume ? 'border-red-300 focus:border-red-500' : ''
                  }`}
                  placeholder={`Max: ${Math.min(formData.capacity, formData.maxVolume)}`}
                />
                {(formData.minVolume > formData.capacity || formData.minVolume > formData.maxVolume) && (
                  <p className="text-xs text-red-600 mt-1">
                    {formData.minVolume > formData.capacity 
                      ? `Min volume cannot exceed capacity (${formData.capacity}L)`
                      : `Min volume cannot exceed max volume (${formData.maxVolume}L)`
                    }
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="maxVolume">Max Volume (L)</Label>
                <Input
                  id="maxVolume"
                  type="number"
                  min={formData.minVolume}
                  max={formData.capacity}
                  value={formData.maxVolume}
                  onChange={(e) => {
                    const maxVolume = parseInt(e.target.value) || 0;
                    const clampedMaxVolume = Math.min(maxVolume, formData.capacity);
                    setFormData({ 
                      ...formData, 
                      maxVolume: clampedMaxVolume,
                      // If new max is less than current min, adjust min to match max
                      minVolume: Math.min(formData.minVolume, clampedMaxVolume)
                    });
                  }}
                  disabled={!formData.partialLoadAllowed && formData.mustUse}
                  className={`${(!formData.partialLoadAllowed && formData.mustUse) ? "bg-gray-100" : ""} ${formData.maxVolume > formData.capacity ? 'border-red-300 focus:border-red-500' : ''}`}
                  placeholder={`Min: ${formData.minVolume}, Max: ${formData.capacity}`}
                />
                {formData.maxVolume > formData.capacity && (
                  <p className="text-xs text-red-600 mt-1">Max volume cannot exceed capacity ({formData.capacity}L)</p>
                )}
              </div>
            </div>

            <div>
              <Label>Allowed Products</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                {/* All Products option */}
                <div className="flex items-center space-x-2 font-medium">
                  <Checkbox
                    id="allProducts"
                    checked={formData.allowedProducts.length === availableProducts.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Select all products
                        setFormData({
                          ...formData,
                          allowedProducts: [...availableProducts]
                        });
                      } else {
                        // Deselect all products
                        setFormData({
                          ...formData,
                          allowedProducts: []
                        });
                      }
                    }}
                  />
                  <Label htmlFor="allProducts" className="text-sm font-medium text-blue-600">All Products</Label>
                </div>
                
                {/* Separator */}
                <div className="col-span-2 border-t border-gray-200 my-1"></div>
                
                {/* Individual products */}
                {availableProducts.map((product) => (
                  <div key={product} className="flex items-center space-x-2">
                    <Checkbox
                      id={product}
                      checked={formData.allowedProducts.includes(product)}
                      onCheckedChange={(checked) => handleProductToggle(product, checked as boolean)}
                    />
                    <Label htmlFor={product} className="text-sm">{product}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="partialLoadAllowed"
                  checked={formData.partialLoadAllowed}
                  onCheckedChange={(checked) => {
                    const partialLoadAllowed = checked as boolean;
                    const updatedFormData = { 
                      ...formData, 
                      partialLoadAllowed 
                    };
                    
                    // Auto-adjust min/max based on new partial load setting
                    if (!partialLoadAllowed && formData.mustUse) {
                      // Not partial load + must use = min/max = capacity
                      updatedFormData.minVolume = formData.capacity;
                      updatedFormData.maxVolume = formData.capacity;
                    }
                    
                    setFormData(updatedFormData);
                  }}
                />
                <Label htmlFor="partialLoadAllowed" className="text-sm">Partial Load Allowed</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mustUse"
                  checked={formData.mustUse}
                  onCheckedChange={(checked) => {
                    const mustUse = checked as boolean;
                    const updatedFormData = { 
                      ...formData, 
                      mustUse 
                    };
                    
                    if (mustUse) {
                      if (!formData.partialLoadAllowed) {
                        // Not partial load + must use = min/max = capacity
                        updatedFormData.minVolume = formData.capacity;
                        updatedFormData.maxVolume = formData.capacity;
                      } else {
                        // Must use but partial allowed = ensure min > 0
                        updatedFormData.minVolume = Math.max(1, formData.minVolume);
                      }
                    }
                    
                    setFormData(updatedFormData);
                  }}
                />
                <Label htmlFor="mustUse" className="text-sm">Must Use</Label>
              </div>
            </div>

            {/* Helper text */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-xs text-blue-800">
                <strong>Validation Rules:</strong>
                <span> • Capacity is mandatory and must be greater than 0</span><br/>
                <span> • Min/Max volumes cannot exceed capacity</span><br/>
                <span> • Min volume cannot be greater than max volume</span><br/>
                <strong>Volume Logic:</strong>
                {!formData.partialLoadAllowed && formData.mustUse && (
                  <span> Must load full capacity - Min/Max will equal capacity.</span>
                )}
                {formData.partialLoadAllowed && formData.mustUse && (
                  <span> Must use compartment but partial loads allowed - Min volume must be greater than 0.</span>
                )}
                {formData.partialLoadAllowed && !formData.mustUse && (
                  <span> Flexible loading - Min can be 0, Max up to capacity.</span>
                )}
                {!formData.partialLoadAllowed && !formData.mustUse && (
                  <span> Standard configuration - Manual volume control.</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveCompartment} 
              className="bg-primary-custom hover:bg-primary-custom/90"
              disabled={
                formData.capacity <= 0 || 
                formData.minVolume > formData.capacity || 
                formData.maxVolume > formData.capacity ||
                formData.minVolume > formData.maxVolume
              }
            >
              {editingCompartment ? "Update Compartment" : "Add Compartment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
