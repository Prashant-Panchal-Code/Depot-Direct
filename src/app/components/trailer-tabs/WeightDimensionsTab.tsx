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
import { TrailerDetails } from "../TrailerDetailsPage";
import { Plus, Trash2, Save, Settings, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Axle schema
const axleSchema = z.object({
  axleIndex: z.number().min(1, "Axle index must be at least 1"),
  axleLoadLimitKg: z.number().min(0.1, "Axle load limit must be greater than 0"),
});

// Compartment weight schema
const compartmentWeightSchema = z.object({
  compartmentId: z.string(),
  capacityKl: z.number(),
  maxWeightKg: z.number().min(0, "Max weight must be positive"),
});

// Weight & Dimensions schema for Trailer
const weightDimensionsSchema = z.object({
  tareWeight: z.number().min(0.1, "Tare weight must be greater than 0"),
  maxPayload: z.number().min(0.1, "Max payload must be greater than 0"),
  maxGrossTrailerWeight: z.number().optional(),
  compartmentWeights: z.array(compartmentWeightSchema),
  axleLimits: z.array(axleSchema),
  notes: z.string().optional(),
}).refine((data) => {
  // Validate: sum(compartment maxWeightKg) <= maxPayload
  const totalCompartmentWeight = data.compartmentWeights.reduce(
    (sum, comp) => sum + comp.maxWeightKg, 0
  );
  return totalCompartmentWeight <= data.maxPayload;
}, {
  message: "Total compartment weights cannot exceed max payload",
  path: ["compartmentWeights"],
}).refine((data) => {
  // Validate: tare + maxPayload <= Gross Trailer Weight (if provided)
  if (data.maxGrossTrailerWeight !== undefined) {
    return data.tareWeight + data.maxPayload <= data.maxGrossTrailerWeight;
  }
  return true;
}, {
  message: "Tare weight + max payload cannot exceed gross trailer weight",
  path: ["maxGrossTrailerWeight"],
});

type WeightDimensionsData = z.infer<typeof weightDimensionsSchema>;

interface WeightDimensionsTabProps {
  trailer: TrailerDetails;
  onSave: (data: Partial<TrailerDetails>) => void;
}

export default function WeightDimensionsTab({ trailer, onSave }: WeightDimensionsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<WeightDimensionsData>({
    resolver: zodResolver(weightDimensionsSchema),
    defaultValues: {
      tareWeight: 0,
      maxPayload: 0,
      maxGrossTrailerWeight: undefined,
      compartmentWeights: [],
      axleLimits: [],
      notes: "",
    },
  });

  // Field arrays
  const { fields: axleFields, append: appendAxle, remove: removeAxle } = useFieldArray({
    control: form.control,
    name: "axleLimits",
  });

  const { fields: compartmentFields, append: appendCompartment, remove: removeCompartment } = useFieldArray({
    control: form.control,
    name: "compartmentWeights",
  });

  // Watch for changes to calculate totals
  const watchedValues = form.watch();
  const totalCompartmentWeight = watchedValues.compartmentWeights?.reduce(
    (sum, comp) => sum + (comp.maxWeightKg || 0), 0
  ) || 0;
  const isCompartmentWeightExceeded = totalCompartmentWeight > (watchedValues.maxPayload || 0);

  // Load existing weight data
  useEffect(() => {
    const loadWeightData = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/trailers/${trailer.id}/weights`);
        // const data = await response.json();
        
        // Mock data without compartmentWeights - let the sync effect handle them
        const mockData = {
          tareWeight: 6500,
          maxPayload: 35000,
          maxGrossTrailerWeight: 41500,
          compartmentWeights: [], // Start empty, sync effect will populate
          axleLimits: [
            { axleIndex: 1, axleLoadLimitKg: 9000 },
            { axleIndex: 2, axleLoadLimitKg: 9000 },
            { axleIndex: 3, axleLoadLimitKg: 9000 },
          ],
          notes: "Standard tri-axle fuel trailer",
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
  }, [trailer.id, form, toast]); // Removed trailer.compartments from dependencies

  // Sync compartments when trailer compartments change
  useEffect(() => {
    const currentCompartmentIds = new Set(compartmentFields.map(f => f.compartmentId));
    const trailerCompartmentIds = new Set(trailer.compartments.map(c => c.id.toString()));

    // Add new compartments (this handles both initial load and updates)
    trailer.compartments.forEach(comp => {
      if (!currentCompartmentIds.has(comp.id.toString())) {
        appendCompartment({
          compartmentId: comp.id.toString(),
          capacityKl: comp.capacity,
          maxWeightKg: 0, // Start with 0 - user should set based on actual product
        });
      }
    });

    // Remove deleted compartments (iterate backwards for safe removal)
    for (let i = compartmentFields.length - 1; i >= 0; i--) {
      const field = compartmentFields[i];
      if (!trailerCompartmentIds.has(field.compartmentId)) {
        removeCompartment(i);
      }
    }
  }, [trailer.compartments, appendCompartment, compartmentFields, removeCompartment]);

  // Add new axle
  const addAxle = () => {
    const nextAxleIndex = axleFields.length > 0 
      ? Math.max(...axleFields.map((_, index) => form.getValues(`axleLimits.${index}.axleIndex`))) + 1
      : 1;
    
    appendAxle({
      axleIndex: nextAxleIndex,
      axleLoadLimitKg: 9000, // Default value for trailer
    });
  };

  // Auto-fill axles with default configuration
  const autoFillAxles = () => {
    // Clear existing axles safely
    const fieldsToRemove = axleFields.length;
    for (let i = fieldsToRemove - 1; i >= 0; i--) {
      removeAxle(i);
    }

    // Add standard 3-axle trailer configuration
    const standardAxles = [
      { axleIndex: 1, axleLoadLimitKg: 9000 },
      { axleIndex: 2, axleLoadLimitKg: 9000 },
      { axleIndex: 3, axleLoadLimitKg: 9000 },
    ];

    standardAxles.forEach(axle => appendAxle(axle));
    
    toast({
      title: "Axles Added",
      description: "Standard 3-axle trailer configuration has been applied",
    });
  };

  // Submit form
  const onSubmit = async (data: WeightDimensionsData) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/trailers/${trailer.id}/weights`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // Mock success
      console.log("Saving trailer weight data:", data);
      
      onSave({ 
        ...trailer,
        weightData: data 
      } as TrailerDetails);

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
            <div className="grid grid-cols-3 gap-4">
              {/* Tare Weight */}
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
                        placeholder="6500"
                        className="mt-1"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                      <p className="text-xs text-gray-500 mt-1">Weight of empty trailer</p>
                      {fieldState.error && (
                        <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Max Payload */}
              <div>
                <Label htmlFor="maxPayload">Max Payload (kg) *</Label>
                <Controller
                  name="maxPayload"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        {...field}
                        id="maxPayload"
                        type="number"
                        step="0.1"
                        min="0.1"
                        placeholder="35000"
                        className="mt-1"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum load weight</p>
                      {fieldState.error && (
                        <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Gross Trailer Weight */}
              <div>
                <Label htmlFor="maxGrossTrailerWeight">Max Gross Trailer Weight (kg)</Label>
                <Controller
                  name="maxGrossTrailerWeight"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        {...field}
                        id="maxGrossTrailerWeight"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="41500"
                        className="mt-1"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                      <p className="text-xs text-gray-500 mt-1">MGTW/GTM (optional)</p>
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

        {/* Compartment Weights */}
        {trailer.compartments.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Compartment Weight Limits</CardTitle>
                {isCompartmentWeightExceeded && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Exceeds Payload
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Total compartment weight: <strong>{totalCompartmentWeight.toLocaleString()} kg</strong>
                {watchedValues.maxPayload && (
                  <span className="ml-2">
                    / {watchedValues.maxPayload.toLocaleString()} kg max payload
                  </span>
                )}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compartmentFields.map((field, index) => {
                  const compartment = trailer.compartments.find(c => c.id.toString() === field.compartmentId);
                  return (
                    <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label>Compartment {compartment?.compartmentNo || field.compartmentId}</Label>
                        <div className="text-sm text-gray-500 mt-1">
                          Capacity: {field.capacityKl} KL
                        </div>
                      </div>

                      <div className="flex-2">
                        <Label htmlFor={`compartmentWeight-${index}`}>Max Weight (kg) *</Label>
                        <Controller
                          name={`compartmentWeights.${index}.maxWeightKg`}
                          control={form.control}
                          render={({ field: weightField, fieldState }) => (
                            <div>
                              <Input
                                {...weightField}
                                id={`compartmentWeight-${index}`}
                                type="number"
                                step="0.1"
                                min="0"
                                className="mt-1"
                                onChange={(e) => weightField.onChange(parseFloat(e.target.value) || 0)}
                              />
                              {fieldState.error && (
                                <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
                              )}
                            </div>
                          )}
                        />
                      </div>

                      <div className="text-sm text-gray-500">
                        {((field.maxWeightKg / field.capacityKl) || 0).toFixed(0)} kg/KL
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

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
            {axleFields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No axle limits defined</p>
                <p className="text-sm">Click &quot;Add Axle&quot; or &quot;Auto-fill Axles&quot; to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {axleFields.map((field, index) => (
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
                      onClick={() => removeAxle(index)}
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
