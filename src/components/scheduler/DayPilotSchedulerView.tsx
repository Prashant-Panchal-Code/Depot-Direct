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
      
      // Get the next available slot for sequential scheduling
      const nextSlot = getNextAvailableSlot(vehicleId, estimatedDuration);
      
      if (!nextSlot) {
        toast.error('Vehicle not found');
      } else {
        const result = await createShipmentFromUnassigned(
          orderData.orderId,
          vehicleId,
          nextSlot.startTime,
          nextSlot.endTime
        );
        
        if (!result.success) {
          toast.error(result.error || 'Failed to create shipment');
        } else {
          toast.success(`Shipment created for order ${orderData.orderId} at ${format(nextSlot.startTime, 'HH:mm')}`);
        }
      }
    } else if (shipmentId && shipmentId !== '') {
      // Handle existing shipment drop - move shipment and reorganize all shipments
      const shipment = shipments.find(s => s.id === shipmentId);
      if (shipment) {
        const duration = differenceInMinutes(shipment.end, shipment.start);
        const originalVehicleId = shipment.vehicleId;
        
        // If moving to the same vehicle, we'll reorganize
        // If moving to a different vehicle, we'll add to the end
        if (vehicleId === originalVehicleId) {
          // Moving within same vehicle - just reorganize everything
          await reorganizeVehicleShipments(vehicleId);
          toast.success('All shipments reorganized sequentially');
        } else {
          // Moving to different vehicle - add to the end of target vehicle
          const nextSlot = getNextAvailableSlot(vehicleId, duration);
          
          if (!nextSlot) {
            toast.error('Vehicle not found');
          } else {
            const result = await moveShipment(shipmentId, vehicleId, nextSlot.startTime, nextSlot.endTime);
            
            if (!result.success) {
              toast.error(result.error || 'Failed to move shipment');
            } else {
              // Reorganize both vehicles after the move
              if (originalVehicleId) {
                await reorganizeVehicleShipments(originalVehicleId);
              }
              await reorganizeVehicleShipments(vehicleId);
              toast.success(`Shipment moved to ${format(nextSlot.startTime, 'HH:mm')} and vehicles reorganized`);
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

  const getNextAvailableSlot = (vehicleId: string, duration: number, excludeShipmentId?: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return null;

    const vehicleShipments = shipments
      .filter(s => s.vehicleId === vehicleId && s.id !== excludeShipmentId)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    // Get vehicle availability start time for the selected date
    const availabilityStart = new Date(selectedDate);
    availabilityStart.setHours(vehicle.availabilityStart.getHours(), vehicle.availabilityStart.getMinutes(), 0, 0);

    if (vehicleShipments.length === 0) {
      // First shipment - must start at availability start
      return {
        startTime: availabilityStart,
        endTime: addMinutes(availabilityStart, duration)
      };
    } else {
      // Find the end time of the last shipment
      const lastShipment = vehicleShipments[vehicleShipments.length - 1];
      const lastShipmentEnd = new Date(lastShipment.end);
      
      return {
        startTime: lastShipmentEnd,
        endTime: addMinutes(lastShipmentEnd, duration)
      };
    }
  };

  const reorganizeVehicleShipments = async (vehicleId: string, movedShipmentId?: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    // Get all shipments for this vehicle
    const vehicleShipments = shipments
      .filter(s => s.vehicleId === vehicleId)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    if (vehicleShipments.length === 0) return;

    // Get vehicle availability start time for the selected date
    const availabilityStart = new Date(selectedDate);
    availabilityStart.setHours(vehicle.availabilityStart.getHours(), vehicle.availabilityStart.getMinutes(), 0, 0);

    let currentTime = availabilityStart;

    // Reorganize all shipments sequentially
    for (const shipment of vehicleShipments) {
      const duration = differenceInMinutes(shipment.end, shipment.start);
      const newEnd = addMinutes(currentTime, duration);

      // Only update if the times have changed
      if (currentTime.getTime() !== new Date(shipment.start).getTime()) {
        await moveShipment(shipment.id, vehicleId, currentTime, newEnd);
      }

      currentTime = newEnd;
    }
  };

  return (
    <div className="h-full bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
      {/* Single Table with Sticky Header */}
      <div className="flex-1 custom-scrollbar" style={{ overflowY: 'scroll' }}>
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '192px' }} />
            {Array.from({ length: 24 }, (_, i) => (
              <col key={i} style={{ width: `calc((100% - 192px) / 24)` }} />
            ))}
          </colgroup>
          
          {/* Sticky Header */}
          <thead className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <tr>
              <th className="border-r border-gray-200 bg-gray-50 p-2 text-left" style={{ width: '192px', minWidth: '192px', maxWidth: '192px' }}>
                <div className="text-sm font-semibold text-gray-700">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </div>
              </th>
              {Array.from({ length: 24 }, (_, hour) => (
                <th
                  key={hour}
                  className="border-r border-gray-100 text-xs text-gray-600 text-center p-1 bg-white"
                >
                  {format(addHours(startOfDay(selectedDate), hour), 'HH:mm')}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Vehicle Rows */}
          <tbody>
            {vehicles.map((vehicle, index) => {
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
                <tr key={vehicle.id} className="relative" style={{ 
                  height: '48px',
                  borderBottom: index < vehicles.length - 1 ? '2px solid #f3f4f6' : undefined
                }}>
                  <td className="border-r border-gray-200 p-2 bg-gray-50 align-middle" style={{ width: '192px', minWidth: '192px', maxWidth: '192px' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{vehicle.name}</div>
                        <div className="text-xs text-gray-500">{vehicle.baseLocation || 'Base Location'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-700">
                          {trailer ? `${Math.round(trailer.totalCapacity / 1000)}T` : 'N/A'}
                        </div>
                        <span className={`px-1 py-0.5 rounded text-xs ${statusColors[vehicle.status]}`}>
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  {/* Time slot cells */}
                  {Array.from({ length: 24 }, (_, hour) => {
                    const isAvailableHour = hour >= vehicle.availabilityStart.getHours() && hour < vehicle.availabilityEnd.getHours();
                    const isFirstAvailableHour = hour === vehicle.availabilityStart.getHours();
                    const isLastAvailableHour = hour === vehicle.availabilityEnd.getHours() - 1;
                    
                    return (
                      <td
                        key={hour}
                        className={`relative cursor-pointer hover:bg-gray-50 border-r border-gray-100 p-0 ${
                          isAvailableHour ? (dragOverVehicle === vehicle.id ? 'bg-green-100' : 'bg-blue-50') : ''
                        }`}
                        style={{
                          boxShadow: isAvailableHour ? [
                            isFirstAvailableHour ? 'inset 1px 0 0 0 #2563eb' : '',
                            isLastAvailableHour ? 'inset -1px 0 0 0 #2563eb' : '',
                            'inset 0 1px 0 0 #2563eb',
                            'inset 0 -1px 0 0 #2563eb'
                          ].filter(Boolean).join(', ') : undefined
                        }}
                        onDrop={(e) => handleDrop(e, vehicle.id, addHours(startOfDay(selectedDate), hour))}
                        onDragOver={(e) => handleDragOver(e, vehicle.id)}
                        onDragLeave={(e) => handleDragLeave(e, vehicle.id)}
                      >
                        {/* Show drag message only in the center of availability window */}
                        {dragOverVehicle === vehicle.id && isFirstAvailableHour && (
                          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ 
                            width: `${differenceInMinutes(vehicle.availabilityEnd, vehicle.availabilityStart) / 60 * 100}%`
                          }}>
                            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                              {(() => {
                                const vehicleShipments = shipments.filter(s => s.vehicleId === vehicle.id);
                                if (vehicleShipments.length === 0) {
                                  return `Drop to start at ${format(vehicle.availabilityStart, 'HH:mm')}`;
                                } else {
                                  const sortedShipments = vehicleShipments.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
                                  const lastShipment = sortedShipments[sortedShipments.length - 1];
                                  return `Drop to start at ${format(new Date(lastShipment.end), 'HH:mm')}`;
                                }
                              })()}
                            </div>
                          </div>
                        )}
                        {/* Shipments positioned in this cell */}
                        {vehicleShipments
                          .filter(shipment => {
                            const start = new Date(shipment.start);
                            const end = new Date(shipment.end);
                            const shipmentStartHour = start.getHours();
                            const shipmentEndHour = end.getHours();
                            // Show shipment in cells it spans
                            return hour >= shipmentStartHour && hour < shipmentEndHour + (end.getMinutes() > 0 ? 1 : 0);
                          })
                          .map(shipment => {
                            const start = new Date(shipment.start);
                            const end = new Date(shipment.end);
                            const shipmentStartHour = start.getHours();
                            const shipmentStartMinutes = start.getMinutes();
                            const duration = differenceInMinutes(end, start);
                            
                            // Only show the shipment content in the first cell it appears in
                            if (hour !== shipmentStartHour) {
                              return (
                                <div
                                  key={shipment.id}
                                  className="absolute inset-0"
                                  style={{
                                    backgroundColor: productColors[shipment.productType] || '#6B7280',
                                    borderLeft: hour === shipmentStartHour ? `4px solid ${priorityColors[shipment.priority]}` : 'none',
                                    zIndex: 5,
                                    opacity: 0.8
                                  }}
                                />
                              );
                            }

                            // Calculate individual shipment utilization
                            const shipmentUtilization = trailer ? Math.round((shipment.quantity / trailer.totalCapacity) * 100) : 0;
                            
                            // Calculate how many cells this shipment spans
                            const durationInHours = duration / 60;
                            const cellsSpanned = Math.ceil(durationInHours);
                            
                            return (
                              <div
                                key={shipment.id}
                                className={`absolute inset-0 rounded px-1 py-0.5 text-xs text-white font-medium cursor-pointer hover:shadow-lg transition-all ${
                                  isDragging && draggedEvent === shipment.id ? 'opacity-50' : ''
                                }`}
                                style={{
                                  backgroundColor: productColors[shipment.productType] || '#6B7280',
                                  borderLeft: `4px solid ${priorityColors[shipment.priority]}`,
                                  zIndex: 10,
                                  width: `${cellsSpanned * 100}%`
                                }}
                                draggable
                                onDragStart={(e) => handleDragStart(e, shipment.id)}
                                onDragEnd={handleDragEnd}
                                onClick={() => handleEventClick(shipment.id)}
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold truncate">{shipment.orderId}</span>
                                  <span className="text-xs">{shipmentUtilization}%</span>
                                </div>
                                <div className="text-xs opacity-90 truncate">
                                  {(shipment.siteName || 'SITE')} | {(shipment.depotName || 'DEPOT')}
                                </div>
                              </div>
                            );
                          })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
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