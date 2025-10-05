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
    setSelectedShipment,
  } = useSchedulerStore();

  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
  };

  const handleDrop = async (e: React.DragEvent, vehicleId: string, timeSlot: Date) => {
    e.preventDefault();
    const shipmentId = e.dataTransfer.getData('text/plain');
    
    if (shipmentId && shipmentId !== '') {
      const shipment = shipments.find(s => s.id === shipmentId);
      if (shipment) {
        const duration = differenceInMinutes(shipment.end, shipment.start);
        const newEnd = addMinutes(timeSlot, duration);
        
        const result = await moveShipment(shipmentId, vehicleId, timeSlot, newEnd);
        
        if (!result.success) {
          toast.error(result.error || 'Failed to move shipment');
        } else {
          toast.success('Shipment moved successfully');
        }
      }
    }
    
    setDraggedEvent(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
                   onDragOver={handleDragOver}>
                {/* Availability Window */}
                <div 
                  className="absolute inset-0 bg-blue-50 border border-blue-200 rounded"
                  style={{
                    left: `${(vehicle.availabilityStart.getHours() * 60 + vehicle.availabilityStart.getMinutes()) / (24 * 60) * 100}%`,
                    width: `${differenceInMinutes(vehicle.availabilityEnd, vehicle.availabilityStart) / (24 * 60) * 100}%`,
                    zIndex: 1
                  }}
                />

                {/* Time Slots */}
                {Array.from({ length: 24 }, (_, hour) => (
                  <div
                    key={hour}
                    className="border-r border-gray-100 relative h-20 cursor-pointer hover:bg-gray-50"
                    onDrop={(e) => handleDrop(e, vehicle.id, addHours(startOfDay(selectedDate), hour))}
                    onDragOver={handleDragOver}
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

                  const hasErrors = !trailer || shipment.compartmentAllocations.length === 0;

                  return (
                    <div
                      key={shipment.id}
                      className={`absolute top-1 bottom-1 rounded px-2 py-1 text-xs text-white font-medium cursor-pointer hover:shadow-lg transition-all ${
                        hasErrors ? 'ring-2 ring-red-500' : ''
                      } ${isDragging && draggedEvent === shipment.id ? 'opacity-50' : ''}`}
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