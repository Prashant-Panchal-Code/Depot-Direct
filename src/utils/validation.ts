// Validation utilities for scheduler
// TODO: Unit test these functions for edge cases

import { Trailer, Vehicle, Shipment } from '@/data/mock-scheduler';
import { isWithinInterval, areIntervalsOverlapping } from 'date-fns';

interface CompartmentAllocation {
  compartmentId: string;
  quantity: number;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface AvailabilityResult {
  withinAvailability: boolean;
  overlaps: string[];
  reason?: string;
}

/**
 * Validates compartment allocation against trailer rules
 * Example usage: validateCompartmentAllocation(trailer, allocations, 8000)
 */
export function validateCompartmentAllocation(
  trailer: Trailer,
  allocations: CompartmentAllocation[],
  totalQuantity: number
): ValidationResult {
  const errors: string[] = [];

  if (!trailer) {
    return { valid: false, errors: ['Trailer not found'] };
  }

  // Check if total allocated quantity matches shipment quantity
  const allocatedTotal = allocations.reduce((sum, alloc) => sum + alloc.quantity, 0);
  if (allocatedTotal !== totalQuantity) {
    errors.push(`Allocated quantity (${allocatedTotal}L) doesn't match shipment quantity (${totalQuantity}L)`);
  }

  // Validate each allocation
  for (const allocation of allocations) {
    const compartment = trailer.compartments.find(c => c.id === allocation.compartmentId);
    
    if (!compartment) {
      errors.push(`Compartment ${allocation.compartmentId} not found in trailer`);
      continue;
    }

    // Check capacity
    if (allocation.quantity > compartment.capacity) {
      errors.push(`Compartment ${compartment.name} allocation (${allocation.quantity}L) exceeds capacity (${compartment.capacity}L)`);
    }

    // Check partial filling rules
    if (!compartment.partialAllowed && allocation.quantity < compartment.capacity && allocation.quantity > 0) {
      errors.push(`Compartment ${compartment.name} doesn't allow partial filling`);
    }

    // Check if quantity is 0 but compartment must be used
    if (allocation.quantity === 0 && compartment.mustUse) {
      errors.push(`Compartment ${compartment.name} must be used but has 0 allocation`);
    }
  }

  // Check if all mustUse compartments are allocated
  for (const compartment of trailer.compartments) {
    if (compartment.mustUse) {
      const allocation = allocations.find(a => a.compartmentId === compartment.id);
      if (!allocation || allocation.quantity === 0) {
        errors.push(`Compartment ${compartment.name} must be used but is not allocated`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Checks if a vehicle is available for a shipment and identifies conflicts
 * Example usage: checkVehicleAvailability(vehicle, existingShipments, newShipment)
 */
export function checkVehicleAvailability(
  vehicle: Vehicle,
  existingShipments: Shipment[],
  newShipment: Pick<Shipment, 'start' | 'end' | 'orderId'>
): AvailabilityResult {
  // Check vehicle status
  if (vehicle.status === 'offline') {
    return {
      withinAvailability: false,
      overlaps: [],
      reason: 'Vehicle is offline'
    };
  }

  if (vehicle.status === 'maintenance') {
    return {
      withinAvailability: false,
      overlaps: [],
      reason: 'Vehicle is under maintenance'
    };
  }

  // Check if shipment time is within vehicle availability window
  const shipmentInterval = { start: newShipment.start, end: newShipment.end };
  const availabilityInterval = { start: vehicle.availabilityStart, end: vehicle.availabilityEnd };

  const withinAvailability = isWithinInterval(newShipment.start, availabilityInterval) &&
                            isWithinInterval(newShipment.end, availabilityInterval);

  if (!withinAvailability) {
    const availStart = vehicle.availabilityStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const availEnd = vehicle.availabilityEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      withinAvailability: false,
      overlaps: [],
      reason: `Vehicle only available ${availStart} - ${availEnd}`
    };
  }

  // Check for overlaps with existing shipments
  const overlaps: string[] = [];
  
  for (const existingShipment of existingShipments) {
    const existingInterval = { start: existingShipment.start, end: existingShipment.end };
    
    if (areIntervalsOverlapping(shipmentInterval, existingInterval)) {
      overlaps.push(existingShipment.orderId);
    }
  }

  return {
    withinAvailability: true,
    overlaps,
    reason: overlaps.length > 0 ? `Conflicts with existing shipments: ${overlaps.join(', ')}` : undefined
  };
}

/**
 * Helper function to check if two time intervals overlap
 * Example usage: checkTimeOverlap(ship1.start, ship1.end, ship2.start, ship2.end)
 */
export function checkTimeOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return areIntervalsOverlapping(
    { start: start1, end: end1 },
    { start: start2, end: end2 }
  );
}

/**
 * Calculates total compartment utilization for a trailer
 * Example usage: calculateTrailerUtilization(trailer, allocations)
 */
export function calculateTrailerUtilization(
  trailer: Trailer,
  allocations: CompartmentAllocation[]
): { utilization: number; usedCapacity: number; totalCapacity: number } {
  const usedCapacity = allocations.reduce((sum, alloc) => sum + alloc.quantity, 0);
  const utilization = trailer.totalCapacity > 0 ? (usedCapacity / trailer.totalCapacity) * 100 : 0;

  return {
    utilization: Math.round(utilization * 100) / 100, // Round to 2 decimal places
    usedCapacity,
    totalCapacity: trailer.totalCapacity
  };
}

/**
 * Gets available capacity for a specific product type in a trailer
 * Example usage: getAvailableCapacity(trailer, existingAllocations, 'diesel')
 */
export function getAvailableCapacity(
  trailer: Trailer,
  existingAllocations: CompartmentAllocation[],
  productType: string
): number {
  let availableCapacity = 0;

  for (const compartment of trailer.compartments) {
    if (compartment.productType === productType) {
      const existingAllocation = existingAllocations.find(a => a.compartmentId === compartment.id);
      const usedCapacity = existingAllocation?.quantity || 0;
      availableCapacity += (compartment.capacity - usedCapacity);
    }
  }

  return availableCapacity;
}