'use client';

// Scheduler View Component  
// README: This component provides a simplified scheduler view
// - Visual timeline showing vehicles as rows and time as columns
// - Drag and drop support for moving shipments
// - Click events for shipment details

import React, { useState } from 'react';
import { useSchedulerStore } from '@/store/schedulerStore';
import { productColors, priorityColors, getTrailerByVehicleId } from '@/data/mock-scheduler';
import { format, startOfDay, addHours, addMinutes, differenceInMinutes } from 'date-fns';
import toast from 'react-hot-toast';

const DEBUG = false;

interface DayPilotSchedulerViewProps {
  selectedDate: Date;
  zoomLevel: '15min' | '30min' | '1h';
  onEventClick?: (shipmentId: string) => void;
}

export default function DayPilotSchedulerView({
  selectedDate,
  zoomLevel,
  onEventClick
}: DayPilotSchedulerViewProps) {
  const {
    vehicles,
    shipments,
    moveShipment,
    createShipmentFromUnassigned,
    setSelectedShipment,
  } = useSchedulerStore();

  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverVehicle, setDragOverVehicle] = useState<string | null>(null);

  const handleEventClick = (shipmentId: string) => {
    if (DEBUG) console.debug('Event clicked:', shipmentId);
    onEventClick?.(shipmentId);
    setSelectedShipment(shipmentId);
  };

  const handleDragStart = (e: React.DragEvent, shipmentId: string) => {
    setDraggedEvent(shipmentId);
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', shipmentId);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
    setIsDragging(false);
    setDragOverVehicle(null);
  };

  const handleDrop = async (e: React.DragEvent, vehicleId: string, timeSlot: Date) => {
    e.preventDefault();
    
    // Find the vehicle to check availability
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
      toast.error('Vehicle not found');
      setDraggedEvent(null);
      setIsDragging(false);
      setDragOverVehicle(null);
      return;
    }
    
    // Try to get shipment data first (for existing shipments)
    const shipmentId = e.dataTransfer.getData('text/plain');
    
    // Try to get unassigned order data (from UnassignedOrdersPanel)
    let orderData = null;
    try {
      const orderDataString = e.dataTransfer.getData('application/json');
      if (orderDataString) {
        orderData = JSON.parse(orderDataString);
      }
    } catch (error) {
      if (DEBUG) console.debug('No JSON data found in drag event');
    }
    
    if (orderData && orderData.orderId) {
      // Handle unassigned order drop - create new shipment
      if (DEBUG) console.debug('Creating shipment from unassigned order:', orderData);
      
      // Calculate estimated duration based on quantity (1 hour per 1000L)
      const estimatedDuration = Math.max(60, Math.ceil(orderData.quantity / 1000) * 60); // minimum 1 hour
      const endTime = addMinutes(timeSlot, estimatedDuration);
      
      // Only check if start time is after availability start
      const availabilityStart = new Date(selectedDate);
      availabilityStart.setHours(vehicle.availabilityStart.getHours(), vehicle.availabilityStart.getMinutes(), 0, 0);
      
      if (timeSlot < availabilityStart) {
        toast.error(`Cannot schedule before vehicle availability starts (${format(availabilityStart, 'HH:mm')})`);
      } else {
        // Check for overlapping shipments
        const overlapCheck = checkForOverlappingShipments(vehicleId, timeSlot, endTime);
        
        if (overlapCheck.hasOverlap) {
          toast.error(`Cannot schedule: conflicts with existing shipment ${overlapCheck.conflictingShipment?.orderId}`);
        } else {
          const result = await createShipmentFromUnassigned(
            orderData.orderId,
            vehicleId,
            timeSlot,
            endTime
          );
          
          if (!result.success) {
            toast.error(result.error || 'Failed to create shipment');
          } else {
            toast.success(`Shipment created for order ${orderData.orderId}`);
          }
        }
      }
    } else if (shipmentId && shipmentId !== '') {
      // Handle existing shipment drop - move shipment
      const shipment = shipments.find(s => s.id === shipmentId);
      if (shipment) {
        const duration = differenceInMinutes(shipment.end, shipment.start);
        const newEnd = addMinutes(timeSlot, duration);
        
        // Only check if start time is after availability start
        const availabilityStart = new Date(selectedDate);
        availabilityStart.setHours(vehicle.availabilityStart.getHours(), vehicle.availabilityStart.getMinutes(), 0, 0);
        
        if (timeSlot < availabilityStart) {
          toast.error(`Cannot schedule before vehicle availability starts (${format(availabilityStart, 'HH:mm')})`);
        } else {
          // Check for overlapping shipments (excluding the current shipment being moved)
          const overlapCheck = checkForOverlappingShipments(vehicleId, timeSlot, newEnd, shipmentId);
          
          if (overlapCheck.hasOverlap) {
            toast.error(`Cannot move shipment: conflicts with existing shipment ${overlapCheck.conflictingShipment?.orderId}`);
          } else {
            const result = await moveShipment(shipmentId, vehicleId, timeSlot, newEnd);
            
            if (!result.success) {
              toast.error(result.error || 'Failed to move shipment');
            } else {
              toast.success('Shipment moved successfully');
            }
          }
        }
      }
    }
    
    setDraggedEvent(null);
    setIsDragging(false);
    setDragOverVehicle(null);
  };

  const handleDragOver = (e: React.DragEvent, vehicleId?: string) => {
    e.preventDefault();
    if (vehicleId && vehicleId !== dragOverVehicle) {
      setDragOverVehicle(vehicleId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, vehicleId?: string) => {
    // Only clear if we're leaving the vehicle row entirely
    if (vehicleId && dragOverVehicle === vehicleId) {
      // Check if we're still within the vehicle row
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setDragOverVehicle(null);
      }
    }
  };

  const checkForOverlappingShipments = (vehicleId: string, startTime: Date, endTime: Date, excludeShipmentId?: string) => {
    const vehicleShipments = shipments.filter(s => 
      s.vehicleId === vehicleId && s.id !== excludeShipmentId
    );
    
    for (const shipment of vehicleShipments) {
      const shipmentStart = new Date(shipment.start);
      const shipmentEnd = new Date(shipment.end);
      
      // Check if there's any overlap
      if (startTime < shipmentEnd && endTime > shipmentStart) {
        return {
          hasOverlap: true,
          conflictingShipment: shipment
        };
      }
    }
    
    return { hasOverlap: false };
  };

  return (
    <div className="h-full bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
      {/* Time Headers */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="flex">
          <div className="w-48 flex-shrink-0 border-r border-gray-200 bg-gray-50">
            <div className="p-2 text-sm font-semibold text-gray-700">
              {format(selectedDate, 'MMMM d, yyyy')}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-24 gap-0 text-xs text-gray-600">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="border-r border-gray-100 p-1 text-center">
                {format(addHours(startOfDay(selectedDate), hour), 'HH:mm')}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Rows */}
      <div className="flex-1 custom-scrollbar" style={{ overflowY: 'scroll' }}>
        <div className="divide-y divide-gray-100">
        {vehicles.map(vehicle => {
          const trailer = getTrailerByVehicleId(vehicle.id);
          const vehicleShipments = shipments.filter(s => s.vehicleId === vehicle.id);
          
          // Calculate utilization
          const totalAllocated = vehicleShipments.reduce((sum, s) => sum + s.quantity, 0);
          const totalCapacity = trailer?.totalCapacity || 1;
          const utilization = Math.round((totalAllocated / totalCapacity) * 100);

          // Status colors
          const statusColors = {
            active: 'bg-green-100 text-green-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            offline: 'bg-red-100 text-red-800'
          };

          return (
            <div key={vehicle.id} className="flex min-h-20">
              {/* Vehicle Info */}
              <div className="w-48 flex-shrink-0 border-r border-gray-200 p-3 bg-gray-50">
                <div className="text-sm font-semibold text-gray-900">{vehicle.name}</div>
                <div className="text-xs text-gray-500">{vehicle.driver || 'No driver'}</div>
                {trailer && (
                  <div className="text-xs text-gray-400">{trailer.registration}</div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[vehicle.status]}`}>
                    {vehicle.status}
                  </span>
                  <span className="text-xs text-gray-600">{utilization}%</span>
                </div>
              </div>

              {/* Time Grid */}
              <div className="flex-1 relative grid grid-cols-24 gap-0 min-h-20"
                   onDragOver={(e) => handleDragOver(e, vehicle.id)}
                   onDragLeave={(e) => handleDragLeave(e, vehicle.id)}>
                {/* Availability Window */}
                <div 
                  className={`absolute inset-0 border rounded transition-all duration-200 ${
                    dragOverVehicle === vehicle.id 
                      ? 'bg-green-100 border-green-300 border-2' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                  style={{
                    left: `${(vehicle.availabilityStart.getHours() * 60 + vehicle.availabilityStart.getMinutes()) / (24 * 60) * 100}%`,
                    width: `${differenceInMinutes(vehicle.availabilityEnd, vehicle.availabilityStart) / (24 * 60) * 100}%`,
                    zIndex: 1
                  }}
                >
                  {dragOverVehicle === vehicle.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Drop to create shipment
                      </div>
                    </div>
                  )}
                </div>

                {/* Time Slots */}
                {Array.from({ length: 24 }, (_, hour) => (
                  <div
                    key={hour}
                    className="border-r border-gray-100 relative h-20 cursor-pointer hover:bg-gray-50"
                    onDrop={(e) => handleDrop(e, vehicle.id, addHours(startOfDay(selectedDate), hour))}
                    onDragOver={(e) => handleDragOver(e, vehicle.id)}
                    style={{ zIndex: 2 }}
                  />
                ))}

                {/* Shipments */}
                {vehicleShipments.map(shipment => {
                  const start = new Date(shipment.start);
                  const end = new Date(shipment.end);
                  const startMinutes = differenceInMinutes(start, startOfDay(selectedDate));
                  const duration = differenceInMinutes(end, start);
                  
                  const left = (startMinutes / (24 * 60)) * 100;
                  const width = (duration / (24 * 60)) * 100;

                  return (
                    <div
                      key={shipment.id}
                      className={`absolute top-1 bottom-1 rounded px-2 py-1 text-xs text-white font-medium cursor-pointer hover:shadow-lg transition-all ${
                        isDragging && draggedEvent === shipment.id ? 'opacity-50' : ''
                      }`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: productColors[shipment.productType] || '#6B7280',
                        borderLeft: `4px solid ${priorityColors[shipment.priority]}`,
                        zIndex: 10
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, shipment.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleEventClick(shipment.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{shipment.orderId}</span>
                        <span>{shipment.quantity}L</span>
                      </div>
                      <div className="text-xs opacity-90">
                        {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Availability Window</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Low Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-red-500 bg-white rounded"></div>
            <span>Validation Error</span>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          display: block;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 6px;
          border: 2px solid #e2e8f0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: #475569;
        }
        .custom-scrollbar {
          scrollbar-width: auto;
          scrollbar-color: #94a3b8 #e2e8f0;
          overflow-y: scroll !important;
        }
      `}</style>
    </div>
  );
}