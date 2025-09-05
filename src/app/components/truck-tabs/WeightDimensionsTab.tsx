"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { TruckDetails } from "../TruckDetailsPage";
import { Plus, Trash2, Save, Settings } from "lucide-react";

// Axle schema
const axleSchema = z.object({
  axleIndex: z.number().min(1, "Axle index must be at least 1"),
  axleLoadLimitKg: z.number().min(0.1, "Axle load limit must be greater than 0"),
});

// Weight & Dimensions schema for Tractor
const weightDimensionsSchema = z.object({
  tareWeight: z.number().min(0.1, "Tare weight must be greater than 0"),
  grossVehicleMass: z.number().optional(),
  axleLimits: z.array(axleSchema),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.grossVehicleMass !== undefined) {
    return data.grossVehicleMass >= data.tareWeight;
  }
  return true;
}, {
  message: "Gross Vehicle Mass must be greater than or equal to Tare Weight",
  path: ["grossVehicleMass"],
});

type WeightDimensionsData = z.infer<typeof weightDimensionsSchema>;

interface WeightDimensionsTabProps {
  truck: TruckDetails;
  onSave: (data: Partial<TruckDetails>) => void;
}

export default function WeightDimensionsTab({ truck, onSave }: WeightDimensionsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<WeightDimensionsData>({
    resolver: zodResolver(weightDimensionsSchema),
    defaultValues: {
      tareWeight: 0,
      grossVehicleMass: undefined,
      axleLimits: [],
      notes: "",
    },
  });

  // Field array for axles
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "axleLimits",
  });

  // Load existing weight data
  useEffect(() => {
    const loadWeightData = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/tractors/${truck.id}/weights`);
        // const data = await response.json();
        
        // Mock data for now
        const mockData = {
          tareWeight: 8500,
          grossVehicleMass: 26000,
          axleLimits: [
            { axleIndex: 1, axleLoadLimitKg: 7500 },
            { axleIndex: 2, axleLoadLimitKg: 11500 },
            { axleIndex: 3, axleLoadLimitKg: 7000 },
          ],
          notes: "Standard 6x4 tractor configuration",
        };
        
        form.reset(mockData);
      } catch (error) {
        console.error("Failed to load weight data:", error);
        toast({
          title: "Error",
          description: "Failed to load weight data",
          variant: "destructive",
        });
      }
    };

    loadWeightData();
  }, [truck.id, form, toast]);

  // Add new axle
  const addAxle = () => {
    const nextAxleIndex = fields.length > 0 
      ? Math.max(...fields.map(field => form.getValues(`axleLimits.${fields.indexOf(field)}.axleIndex`))) + 1
      : 1;
    
    append({
      axleIndex: nextAxleIndex,
      axleLoadLimitKg: 7500, // Default value
    });
  };

  // Auto-fill axles with default configuration
  const autoFillAxles = () => {
    // Clear existing axles safely
    const fieldsToRemove = fields.length;
    for (let i = fieldsToRemove - 1; i >= 0; i--) {
      remove(i);
    }

    // Add standard 3-axle configuration
    const standardAxles = [
      { axleIndex: 1, axleLoadLimitKg: 7500 }, // Steer axle
      { axleIndex: 2, axleLoadLimitKg: 11500 }, // Drive axle 1
      { axleIndex: 3, axleLoadLimitKg: 7000 },  // Drive axle 2
    ];

    standardAxles.forEach(axle => append(axle));
    
    toast({
      title: "Axles Added",
      description: "Standard 3-axle configuration has been applied",
    });
  };

  // Submit form
  const onSubmit = async (data: WeightDimensionsData) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/tractors/${truck.id}/weights`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // Mock success
      console.log("Saving weight data:", data);
      
      onSave({ 
        ...truck,
        weightData: data 
      } as TruckDetails);

      toast({
        title: "Success",
        description: "Weight & dimensions data saved successfully",
      });
    } catch (error) {
      console.error("Failed to save weight data:", error);
      toast({
        title: "Error",
        description: "Failed to save weight data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Weight Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Basic Weight Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tare Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tareWeight">Tare Weight (kg) *</Label>
                <Controller
                  name="tareWeight"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        {...field}
                        id="tareWeight"
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="8500"
                        className="mt-1"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                      <p className="text-xs text-gray-500 mt-1">Weight of empty vehicle</p>
                      {fieldState.error && (
                        <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="grossVehicleMass">Gross Vehicle Mass (kg)</Label>
                <Controller
                  name="grossVehicleMass"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        {...field}
                        id="grossVehicleMass"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="26000"
                        className="mt-1"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum gross weight (optional)</p>
                      {fieldState.error && (
                        <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Axle Limits */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Axle Load Limits</CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={autoFillAxles}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Auto-fill Axles
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAxle}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Axle
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No axle limits defined</p>
                <p className="text-sm">Click &quot;Add Axle&quot; or &quot;Auto-fill Axles&quot; to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor={`axleIndex-${index}`}>Axle Index</Label>
                      <Controller
                        name={`axleLimits.${index}.axleIndex`}
                        control={form.control}
                        render={({ field: axleField, fieldState }) => (
                          <div>
                            <Input
                              {...axleField}
                              id={`axleIndex-${index}`}
                              type="number"
                              min="1"
                              className="mt-1"
                              onChange={(e) => axleField.onChange(parseInt(e.target.value) || 1)}
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div className="flex-2">
                      <Label htmlFor={`axleLoadLimit-${index}`}>Load Limit (kg)</Label>
                      <Controller
                        name={`axleLimits.${index}.axleLoadLimitKg`}
                        control={form.control}
                        render={({ field: loadField, fieldState }) => (
                          <div>
                            <Input
                              {...loadField}
                              id={`axleLoadLimit-${index}`}
                              type="number"
                              step="0.1"
                              min="0.1"
                              className="mt-1"
                              onChange={(e) => loadField.onChange(parseFloat(e.target.value) || 0)}
                            />
                            {fieldState.error && (
                              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="notes"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Additional notes about weight and dimensions..."
                  className="min-h-[100px]"
                />
              )}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary-custom hover:bg-primary-custom/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Weight & Dimensions"}
          </Button>
        </div>
      </form>
    </div>
    </div>
  );
}
