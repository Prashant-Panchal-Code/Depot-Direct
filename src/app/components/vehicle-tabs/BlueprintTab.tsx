"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { VehicleDetails } from "../VehicleDetailsPage";
import { Trash2, Plus, Calendar } from "lucide-react";

// Days of week constant
const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const;

// Blueprint slot schema
const blueprintSlotSchema = z.object({
  id: z.string().optional(),
  startDay: z.string().min(1, "Start day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDay: z.string().min(1, "End day is required"),
  endTime: z.string().min(1, "End time is required"),
  startParkingId: z.string().min(1, "Start parking location is required"),
  endParkingId: z.string().min(1, "End parking location is required"),
  preloadDepotId: z.string().optional(),
  postloadDepotId: z.string().optional(),
  note: z.string().optional(),
}).refine((data) => {
  if (data.startDay && data.startTime && data.endDay && data.endTime) {
    // If same day, end time must be after start time
    if (data.startDay === data.endDay) {
      return data.endTime > data.startTime;
    }
    // Cross-day slots are always valid
    return true;
  }
  return true;
}, {
  message: "End time must be after start time for same-day slots",
  path: ["endTime"],
});

// Full blueprint schema
const blueprintSchema = z.object({
  vehicleId: z.number(),
  vehicleCode: z.string(),
  slots: z.array(blueprintSlotSchema).max(20, "Maximum 20 slots allowed"),
});

// Types
export type BlueprintSlot = z.infer<typeof blueprintSlotSchema>;
export type Blueprint = z.infer<typeof blueprintSchema>;

// Mock data for depots/parking locations
const mockParkingLocations = [
  { id: "depot-1", name: "Main Depot", type: "depot", address: "123 Industrial Ave" },
  { id: "depot-2", name: "North Depot", type: "depot", address: "456 Commerce St" },
  { id: "depot-3", name: "South Terminal", type: "depot", address: "789 Terminal Rd" },
  { id: "yard-1", name: "Central Yard", type: "yard", address: "321 Yard Dr" },
  { id: "yard-2", name: "East Parking", type: "yard", address: "654 Parking Blvd" },
];

interface BlueprintTabProps {
  vehicle: VehicleDetails;
  onSave: (data: Partial<VehicleDetails>) => void;
}

export default function BlueprintTab({ vehicle, onSave }: BlueprintTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<Blueprint>({
    resolver: zodResolver(blueprintSchema),
    defaultValues: {
      vehicleId: vehicle.id,
      vehicleCode: vehicle.vehicleCode,
      slots: [],
    },
  });

  // Field array for slots
  const slotsArray = useFieldArray({ control: form.control, name: "slots" });

  // Load blueprint data on mount
  useEffect(() => {
    const loadBlueprint = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock response - would come from GET /api/vehicles/:id/blueprint
        const mockBlueprint = {
          vehicleId: vehicle.id,
          vehicleCode: vehicle.vehicleCode,
          slots: [
            {
              id: "slot-1",
              startDay: "monday",
              startTime: "06:00",
              endDay: "monday",
              endTime: "14:00",
              startParkingId: "depot-1",
              endParkingId: "depot-2",
              preloadDepotId: "depot-1",
              postloadDepotId: "depot-3",
              note: "Regular morning shift"
            }
          ]
        };

        form.reset(mockBlueprint);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load blueprint data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBlueprint();
  }, [vehicle.id, vehicle.vehicleCode, form, toast]);

  // Create a new slot
  const createNewSlot = (previousSlot?: BlueprintSlot): BlueprintSlot => {
    const baseSlot = {
      id: `slot-${Date.now()}`,
      startDay: previousSlot?.endDay || "monday",
      startTime: previousSlot?.endTime || "",
      endDay: previousSlot?.endDay || "monday",
      endTime: "",
      startParkingId: previousSlot?.endParkingId || "",
      endParkingId: "",
      preloadDepotId: "",
      postloadDepotId: "",
      note: "",
    };
    return baseSlot;
  };

  // Add a new slot
  const addSlot = () => {
    if (slotsArray.fields.length >= 20) {
      toast({
        title: "Maximum slots reached",
        description: "A maximum of 20 slots is allowed",
        variant: "destructive",
      });
      return;
    }
    
    // Get the last slot's values to auto-populate the new slot
    const previousSlot = slotsArray.fields.length > 0 
      ? form.getValues(`slots.${slotsArray.fields.length - 1}`) as BlueprintSlot
      : undefined;
    
    slotsArray.append(createNewSlot(previousSlot));
  };

  // Remove slot
  const removeSlot = (index: number) => {
    slotsArray.remove(index);
  };

  // Check for overlapping slots
  const checkOverlappingSlots = (slots: BlueprintSlot[]): { hasOverlap: boolean; conflicts: string[] } => {
    const conflicts: string[] = [];
    
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const slot1 = slots[i];
        const slot2 = slots[j];
        
        if (slot1.startDay && slot1.startTime && slot1.endDay && slot1.endTime &&
            slot2.startDay && slot2.startTime && slot2.endDay && slot2.endTime) {
          
          // Check for overlap (simplified logic - can be enhanced for cross-day slots)
          if (slot1.startDay === slot2.startDay && slot1.endDay === slot2.endDay && 
              slot1.startDay === slot1.endDay && slot2.startDay === slot2.endDay) {
            // Same day slots
            const start1 = new Date(`2000-01-01T${slot1.startTime}:00`);
            const end1 = new Date(`2000-01-01T${slot1.endTime}:00`);
            const start2 = new Date(`2000-01-01T${slot2.startTime}:00`);
            const end2 = new Date(`2000-01-01T${slot2.endTime}:00`);
            
            if ((start1 < end2 && end1 > start2)) {
              conflicts.push(`Slot ${i + 1} overlaps with Slot ${j + 1} on ${slot1.startDay}`);
            }
          }
        }
      }
    }
    
    return { hasOverlap: conflicts.length > 0, conflicts };
  };

  // Submit form
  const onSubmit = async (data: Blueprint) => {
    setIsLoading(true);
    
    try {
      // Check for overlapping slots
      const conflictResult = checkOverlappingSlots(data.slots);
      if (conflictResult.hasOverlap) {
        toast({
          title: "Validation Error",
          description: `Overlapping time slots detected: ${conflictResult.conflicts[0]}`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Would make POST /api/vehicles/:id/blueprint
      console.log("Saving blueprint:", data);
      
      toast({
        title: "Blueprint saved",
        description: "Vehicle blueprint has been updated successfully",
      });

      // Notify parent component
      onSave({ blueprint: data });
      
    } catch {
      toast({
        title: "Error",
        description: "Failed to save blueprint",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format parking location for display (currently unused)
  // const formatParkingLocation = (locationId: string) => {
  //   const location = mockParkingLocations.find(loc => loc.id === locationId);
  //   return location ? `${location.name} (${location.type})` : locationId;
  // };

  if (isLoading && !form.getValues("vehicleCode")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading blueprint...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Add Slot Button */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Availability Slots ({slotsArray.fields.length})
            </h3>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
                size="sm"
              >
                Reset
              </Button>
              <Button
                type="button"
                onClick={addSlot}
                disabled={slotsArray.fields.length >= 20}
                className="bg-primary-custom hover:bg-primary-custom/90"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Slot
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {isLoading ? "Saving..." : "Save Blueprint"}
              </Button>
            </div>
          </div>

          {/* Slots List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {slotsArray.fields.map((slot, index) => (
              <Card key={slot.id} className="border border-gray-200 w-full min-w-[280px]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium">
                      Slot {index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeSlot(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 flex-shrink-0"
                      aria-label={`Remove slot ${index + 1}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-3">
                  {/* Days Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <Controller
                      name={`slots.${index}.startDay`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="w-full">
                          <Label className="text-xs block w-full">Start Day *</Label>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1 h-8 w-full">
                              <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS_OF_WEEK.map(day => (
                                <SelectItem key={day.value} value={day.value}>
                                  {day.label.slice(0, 3)} {/* Short day names */}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.error && (
                            <p className="text-xs text-red-600 mt-1">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name={`slots.${index}.endDay`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="w-full">
                          <Label className="text-xs block w-full">End Day *</Label>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1 h-8 w-full">
                              <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS_OF_WEEK.map(day => (
                                <SelectItem key={day.value} value={day.value}>
                                  {day.label.slice(0, 3)} {/* Short day names */}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.error && (
                            <p className="text-xs text-red-600 mt-1">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {/* Times Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <Controller
                      name={`slots.${index}.startTime`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="w-full">
                          <Label className="text-xs block w-full">Start Time *</Label>
                          <div className="mt-1 w-full">
                            <TimePicker
                              {...field}
                              required
                            />
                          </div>
                          {fieldState.error && (
                            <p className="text-xs text-red-600 mt-1">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    
                    <Controller
                      name={`slots.${index}.endTime`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="w-full">
                          <Label className="text-xs block w-full">End Time *</Label>
                          <div className="mt-1 w-full">
                            <TimePicker
                              {...field}
                              required
                            />
                          </div>
                          {fieldState.error && (
                            <p className="text-xs text-red-600 mt-1">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {/* Parking Locations */}
                  <div className="grid grid-cols-2 gap-2">
                    <Controller
                      name={`slots.${index}.startParkingId`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="w-full">
                          <Label className="text-xs block w-full">Start Parking *</Label>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1 h-8 w-full">
                              <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockParkingLocations.map(location => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.error && (
                            <p className="text-xs text-red-600 mt-1">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    
                    <Controller
                      name={`slots.${index}.endParkingId`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="w-full">
                          <Label className="text-xs block w-full">End Parking *</Label>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="mt-1 h-8 w-full">
                              <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockParkingLocations.map(location => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.error && (
                            <p className="text-xs text-red-600 mt-1">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {/* Depot Locations */}
                  <div className="grid grid-cols-2 gap-2">
                    <Controller
                      name={`slots.${index}.preloadDepotId`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="w-full">
                          <Label className="text-xs block w-full">Preload Depot</Label>
                          <Select 
                            value={field.value || undefined} 
                            onValueChange={(value) => {
                              field.onChange(value === "none" ? "" : value);
                            }}
                          >
                            <SelectTrigger className="mt-1 h-8 w-full">
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {mockParkingLocations.filter(loc => loc.type === 'depot').map(depot => (
                                <SelectItem key={depot.id} value={depot.id}>
                                  {depot.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    
                    <Controller
                      name={`slots.${index}.postloadDepotId`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="w-full">
                          <Label className="text-xs block w-full">Post-load Depot</Label>
                          <Select 
                            value={field.value || undefined} 
                            onValueChange={(value) => {
                              field.onChange(value === "none" ? "" : value);
                            }}
                          >
                            <SelectTrigger className="mt-1 h-8 w-full">
                              <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {mockParkingLocations.filter(loc => loc.type === 'depot').map(depot => (
                                <SelectItem key={depot.id} value={depot.id}>
                                  {depot.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  </div>

                  {/* Note */}
                  <Controller
                    name={`slots.${index}.note`}
                    control={form.control}
                    render={({ field }) => (
                      <div className="w-full">
                        <Label className="text-xs block w-full">Note</Label>
                        <Textarea
                          {...field}
                          placeholder="Notes..."
                          className="mt-1 min-h-[50px] text-xs w-full resize-none"
                        />
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
            
            {slotsArray.fields.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-8 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No availability slots defined</p>
                <p className="text-sm">Click &quot;Add Slot&quot; to create a new availability slot</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
