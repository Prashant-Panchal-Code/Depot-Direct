// Zustand store for scheduler state management
// TODO: replace mock store with API calls

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Vehicle,
  Shipment,
  UnassignedOrder,
  mockVehicles,
  mockShipments,
  mockUnassignedOrders,
  getTrailerByVehicleId
} from '@/data/mock-scheduler';
import { validateCompartmentAllocation, checkVehicleAvailability } from '@/utils/validation';
import { addMinutes, isAfter, isBefore } from 'date-fns';

const DEBUG = false;

interface CompartmentAllocation {
  compartmentId: string;
  quantity: number;
}

interface AllocationResult {
  success: boolean;
  allocations: CompartmentAllocation[];
  errors: string[];
}

interface SchedulerState {
  vehicles: Vehicle[];
  shipments: Shipment[];
  unassignedOrders: UnassignedOrder[];
  selectedShipmentId: string | null;
  
  // Actions
  loadFromMock: () => void;
  assignShipmentToVehicle: (shipmentId: string, vehicleId: string, start: Date, end: Date) => Promise<{ success: boolean; error?: string }>;
  moveShipment: (shipmentId: string, toVehicleId: string, newStart: Date, newEnd: Date) => Promise<{ success: boolean; error?: string }>;
  resizeShipment: (shipmentId: string, newStart: Date, newEnd: Date) => Promise<{ success: boolean; error?: string }>;
  createShipmentFromUnassigned: (orderId: string, vehicleId: string, start: Date, end: Date) => Promise<{ success: boolean; error?: string; shipmentId?: string }>;
  autoAllocateCompartments: (shipmentId: string, vehicleId: string) => AllocationResult;
  removeShipment: (shipmentId: string) => void;
  setSelectedShipment: (shipmentId: string | null) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

export const useSchedulerStore = create<SchedulerState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      shipments: [],
      unassignedOrders: [],
      selectedShipmentId: null,

      loadFromMock: () => {
        if (DEBUG) console.debug('Loading mock data');
        set({
          vehicles: mockVehicles,
          shipments: mockShipments,
          unassignedOrders: mockUnassignedOrders
        });
      },

      assignShipmentToVehicle: async (shipmentId: string, vehicleId: string, start: Date, end: Date) => {
        const state = get();
        const shipment = state.shipments.find(s => s.id === shipmentId);
        const vehicle = state.vehicles.find(v => v.id === vehicleId);
        
        if (!shipment || !vehicle) {
          return { success: false, error: 'Shipment or vehicle not found' };
        }

        // Check vehicle availability
        const availabilityCheck = checkVehicleAvailability(
          vehicle,
          state.shipments.filter(s => s.vehicleId === vehicleId && s.id !== shipmentId),
          { ...shipment, start, end }
        );

        if (!availabilityCheck.withinAvailability) {
          return { success: false, error: availabilityCheck.reason || 'Vehicle not available' };
        }

        if (availabilityCheck.overlaps.length > 0) {
          return { success: false, error: `Time slot conflicts with: ${availabilityCheck.overlaps.join(', ')}` };
        }

        // Auto-allocate compartments
        const allocationResult = get().autoAllocateCompartments(shipmentId, vehicleId);
        if (!allocationResult.success) {
          return { success: false, error: allocationResult.errors.join('; ') };
        }

        // Update shipment
        set(state => ({
          shipments: state.shipments.map(s =>
            s.id === shipmentId
              ? { ...s, vehicleId, start, end, compartmentAllocations: allocationResult.allocations }
              : s
          )
        }));

        if (DEBUG) console.debug(`Assigned shipment ${shipmentId} to vehicle ${vehicleId}`);
        return { success: true };
      },

      moveShipment: async (shipmentId: string, toVehicleId: string, newStart: Date, newEnd: Date) => {
        const state = get();
        const shipment = state.shipments.find(s => s.id === shipmentId);
        const toVehicle = state.vehicles.find(v => v.id === toVehicleId);
        
        if (!shipment || !toVehicle) {
          return { success: false, error: 'Shipment or target vehicle not found' };
        }

        // Check vehicle availability
        const availabilityCheck = checkVehicleAvailability(
          toVehicle,
          state.shipments.filter(s => s.vehicleId === toVehicleId && s.id !== shipmentId),
          { ...shipment, start: newStart, end: newEnd }
        );

        if (!availabilityCheck.withinAvailability) {
          return { success: false, error: availabilityCheck.reason || 'Vehicle not available' };
        }

        if (availabilityCheck.overlaps.length > 0) {
          return { success: false, error: `Time slot conflicts with: ${availabilityCheck.overlaps.join(', ')}` };
        }

        // Auto-allocate compartments for new vehicle
        const allocationResult = get().autoAllocateCompartments(shipmentId, toVehicleId);
        if (!allocationResult.success) {
          return { success: false, error: allocationResult.errors.join('; ') };
        }

        // Update shipment
        set(state => ({
          shipments: state.shipments.map(s =>
            s.id === shipmentId
              ? { ...s, vehicleId: toVehicleId, start: newStart, end: newEnd, compartmentAllocations: allocationResult.allocations }
              : s
          )
        }));

        if (DEBUG) console.debug(`Moved shipment ${shipmentId} to vehicle ${toVehicleId}`);
        return { success: true };
      },

      resizeShipment: async (shipmentId: string, newStart: Date, newEnd: Date) => {
        const state = get();
        const shipment = state.shipments.find(s => s.id === shipmentId);
        
        if (!shipment || !shipment.vehicleId) {
          return { success: false, error: 'Shipment not found or not assigned' };
        }

        const vehicle = state.vehicles.find(v => v.id === shipment.vehicleId);
        if (!vehicle) {
          return { success: false, error: 'Vehicle not found' };
        }

        // Check vehicle availability
        const availabilityCheck = checkVehicleAvailability(
          vehicle,
          state.shipments.filter(s => s.vehicleId === shipment.vehicleId && s.id !== shipmentId),
          { ...shipment, start: newStart, end: newEnd }
        );

        if (!availabilityCheck.withinAvailability) {
          return { success: false, error: availabilityCheck.reason || 'Vehicle not available' };
        }

        if (availabilityCheck.overlaps.length > 0) {
          return { success: false, error: `Time slot conflicts with: ${availabilityCheck.overlaps.join(', ')}` };
        }

        // Update shipment
        set(state => ({
          shipments: state.shipments.map(s =>
            s.id === shipmentId ? { ...s, start: newStart, end: newEnd } : s
          )
        }));

        if (DEBUG) console.debug(`Resized shipment ${shipmentId}`);
        return { success: true };
      },

      createShipmentFromUnassigned: async (orderId: string, vehicleId: string, start: Date, end: Date) => {
        const state = get();
        const order = state.unassignedOrders.find(o => o.orderId === orderId);
        const vehicle = state.vehicles.find(v => v.id === vehicleId);
        
        if (!order || !vehicle) {
          return { success: false, error: 'Order or vehicle not found' };
        }

        // Check if time is within order's ETA window
        if (isBefore(start, order.etaWindow.start) || isAfter(end, order.etaWindow.end)) {
          return { success: false, error: 'Time slot is outside order ETA window' };
        }

        const newShipmentId = `shipment-${Date.now()}`;
        const newShipment: Shipment = {
          id: newShipmentId,
          orderId: order.orderId,
          vehicleId,
          productType: order.productType,
          quantity: order.quantity,
          priority: order.priority,
          start,
          end,
          compartmentAllocations: [],
          status: 'assigned',
          customerName: order.customerName,
          deliveryAddress: order.deliveryAddress
        };

        // Check vehicle availability
        const availabilityCheck = checkVehicleAvailability(
          vehicle,
          state.shipments.filter(s => s.vehicleId === vehicleId),
          newShipment
        );

        if (!availabilityCheck.withinAvailability) {
          return { success: false, error: availabilityCheck.reason || 'Vehicle not available' };
        }

        if (availabilityCheck.overlaps.length > 0) {
          return { success: false, error: `Time slot conflicts with: ${availabilityCheck.overlaps.join(', ')}` };
        }

        // Auto-allocate compartments
        const allocationResult = get().autoAllocateCompartments(newShipmentId, vehicleId);
        
        // Create shipment even if allocation fails (can be fixed later)
        newShipment.compartmentAllocations = allocationResult.allocations;

        set(state => ({
          shipments: [...state.shipments, newShipment],
          unassignedOrders: state.unassignedOrders.filter(o => o.orderId !== orderId)
        }));

        if (DEBUG) console.debug(`Created shipment ${newShipmentId} from order ${orderId}`);
        
        if (!allocationResult.success) {
          return { 
            success: false, 
            error: `Shipment created but compartment allocation failed: ${allocationResult.errors.join('; ')}`,
            shipmentId: newShipmentId
          };
        }

        return { success: true, shipmentId: newShipmentId };
      },

      autoAllocateCompartments: (shipmentId: string, vehicleId: string): AllocationResult => {
        const state = get();
        const shipment = state.shipments.find(s => s.id === shipmentId) || 
                        state.unassignedOrders.find(o => o.id === shipmentId);
        
        if (!shipment) {
          return { success: false, allocations: [], errors: ['Shipment not found'] };
        }

        const trailer = getTrailerByVehicleId(vehicleId);
        if (!trailer) {
          return { success: false, allocations: [], errors: ['No trailer found for vehicle'] };
        }

        const allocations: CompartmentAllocation[] = [];
        let remainingQuantity = shipment.quantity;
        const errors: string[] = [];

        // Sort compartments by priority: mustUse first, then mandatoryToLoad, then by capacity (largest first)
        const sortedCompartments = [...trailer.compartments].sort((a, b) => {
          if (a.mustUse && !b.mustUse) return -1;
          if (!a.mustUse && b.mustUse) return 1;
          if (a.mandatoryToLoad && !b.mandatoryToLoad) return -1;
          if (!a.mandatoryToLoad && b.mandatoryToLoad) return 1;
          return b.capacity - a.capacity;
        });

        // First pass: allocate to compatible compartments
        for (const compartment of sortedCompartments) {
          if (remainingQuantity <= 0) break;
          
          // Check if compartment is compatible with product
          if (compartment.productType !== shipment.productType) {
            if (compartment.mustUse) {
              errors.push(`Compartment ${compartment.name} must be used but incompatible with ${shipment.productType}`);
            }
            continue;
          }

          // Check if we must use this compartment
          if (compartment.mustUse || compartment.mandatoryToLoad) {
            const allocationQuantity = Math.min(remainingQuantity, compartment.capacity);
            
            if (!compartment.partialAllowed && allocationQuantity < compartment.capacity) {
              errors.push(`Compartment ${compartment.name} doesn't allow partial filling`);
              continue;
            }

            allocations.push({
              compartmentId: compartment.id,
              quantity: allocationQuantity
            });
            remainingQuantity -= allocationQuantity;
          }
        }

        // Second pass: allocate remaining quantity to other compatible compartments
        for (const compartment of sortedCompartments) {
          if (remainingQuantity <= 0) break;
          
          if (compartment.productType !== shipment.productType) continue;
          if (compartment.mustUse || compartment.mandatoryToLoad) continue; // Already handled
          
          // Check if compartment is already allocated
          const existingAllocation = allocations.find(a => a.compartmentId === compartment.id);
          if (existingAllocation) continue;

          const allocationQuantity = Math.min(remainingQuantity, compartment.capacity);
          
          if (!compartment.partialAllowed && allocationQuantity < compartment.capacity) {
            continue; // Skip if can't partially fill
          }

          allocations.push({
            compartmentId: compartment.id,
            quantity: allocationQuantity
          });
          remainingQuantity -= allocationQuantity;
        }

        // Validate final allocation
        if (remainingQuantity > 0) {
          errors.push(`Cannot allocate ${remainingQuantity}L - insufficient compatible compartment capacity`);
        }

        // Final validation against trailer rules
        const validation = validateCompartmentAllocation(trailer, allocations, shipment.quantity);
        if (!validation.valid) {
          errors.push(...validation.errors);
        }

        const success = remainingQuantity === 0 && errors.length === 0;
        
        if (DEBUG) {
          console.debug(`Auto-allocation for shipment ${shipmentId}:`, {
            success,
            allocations,
            errors,
            remainingQuantity
          });
        }

        return { success, allocations, errors };
      },

      removeShipment: (shipmentId: string) => {
        const state = get();
        const shipment = state.shipments.find(s => s.id === shipmentId);
        
        if (shipment) {
          // Convert back to unassigned order
          const unassignedOrder: UnassignedOrder = {
            id: `unassigned-${Date.now()}`,
            orderId: shipment.orderId,
            productType: shipment.productType,
            quantity: shipment.quantity,
            priority: shipment.priority,
            etaWindow: {
              start: shipment.start,
              end: addMinutes(shipment.end, 240) // Add 4 hours buffer
            },
            customerName: shipment.customerName,
            deliveryAddress: shipment.deliveryAddress,
            createdAt: new Date()
          };

          set(state => ({
            shipments: state.shipments.filter(s => s.id !== shipmentId),
            unassignedOrders: [...state.unassignedOrders, unassignedOrder],
            selectedShipmentId: state.selectedShipmentId === shipmentId ? null : state.selectedShipmentId
          }));

          if (DEBUG) console.debug(`Removed shipment ${shipmentId}`);
        }
      },

      setSelectedShipment: (shipmentId: string | null) => {
        set({ selectedShipmentId: shipmentId });
      },

      saveToLocalStorage: () => {
        const state = get();
        localStorage.setItem('scheduler-data', JSON.stringify({
          vehicles: state.vehicles,
          shipments: state.shipments,
          unassignedOrders: state.unassignedOrders
        }));
        if (DEBUG) console.debug('Saved to localStorage');
      },

      loadFromLocalStorage: () => {
        const saved = localStorage.getItem('scheduler-data');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            set({
              vehicles: data.vehicles || [],
              shipments: data.shipments || [],
              unassignedOrders: data.unassignedOrders || []
            });
            if (DEBUG) console.debug('Loaded from localStorage');
          } catch (error) {
            console.error('Error loading from localStorage:', error);
            get().loadFromMock();
          }
        } else {
          get().loadFromMock();
        }
      }
    }),
    {
      name: 'scheduler-storage',
      partialize: (state) => ({
        vehicles: state.vehicles,
        shipments: state.shipments,
        unassignedOrders: state.unassignedOrders
      })
    }
  )
);