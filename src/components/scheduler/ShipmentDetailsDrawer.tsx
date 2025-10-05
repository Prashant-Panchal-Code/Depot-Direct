'use client';

// Shipment Details Drawer Component
// Shows detailed shipment information with editing capabilities

import React, { useState, useEffect } from 'react';
import { useSchedulerStore } from '@/store/schedulerStore';
import { getTrailerByVehicleId, productColors } from '@/data/mock-scheduler';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const DEBUG = false;

interface ShipmentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShipmentDetailsDrawer({
  isOpen,
  onClose
}: ShipmentDetailsDrawerProps) {
  const {
    selectedShipmentId,
    shipments,
    vehicles,
    autoAllocateCompartments,
    removeShipment,
    resizeShipment
  } = useSchedulerStore();

  const [editMode, setEditMode] = useState(false);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');

  const shipment = selectedShipmentId ? shipments.find(s => s.id === selectedShipmentId) : null;
  const vehicle = shipment ? vehicles.find(v => v.id === shipment.vehicleId) : null;
  const trailer = vehicle ? getTrailerByVehicleId(vehicle.id) : null;

  // Update edit fields when shipment changes
  useEffect(() => {
    if (shipment) {
      setEditStart(format(shipment.start, "yyyy-MM-dd'T'HH:mm"));
      setEditEnd(format(shipment.end, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [shipment]);

  const handleAutoAllocate = () => {
    if (!shipment || !vehicle) return;

    if (DEBUG) console.debug('Auto-allocating compartments for:', shipment.id);
    
    const result = autoAllocateCompartments(shipment.id, vehicle.id);
    
    if (result.success) {
      toast.success('Compartments allocated successfully');
    } else {
      toast.error(`Allocation failed: ${result.errors.join(', ')}`);
    }
  };

  const handleSaveEdit = async () => {
    if (!shipment) return;

    const newStart = new Date(editStart);
    const newEnd = new Date(editEnd);

    if (newStart >= newEnd) {
      toast.error('End time must be after start time');
      return;
    }

    const result = await resizeShipment(shipment.id, newStart, newEnd);
    
    if (result.success) {
      toast.success('Shipment time updated');
      setEditMode(false);
    } else {
      toast.error(result.error || 'Failed to update shipment');
    }
  };

  const handleRemove = () => {
    if (!shipment) return;

    if (confirm(`Remove shipment ${shipment.orderId}? It will be moved back to unassigned orders.`)) {
      removeShipment(shipment.id);
      toast.success('Shipment removed');
      onClose();
    }
  };

  const handleSplit = () => {
    // TODO: Implement shipment splitting
    toast('Shipment splitting coming soon', { icon: 'ℹ️' });
  };

  const getCompartmentInfo = () => {
    if (!trailer || !shipment) return [];

    return shipment.compartmentAllocations.map(allocation => {
      const compartment = trailer.compartments.find(c => c.id === allocation.compartmentId);
      return {
        allocation,
        compartment,
        utilizationPercent: compartment ? Math.round((allocation.quantity / compartment.capacity) * 100) : 0
      };
    });
  };

  const getTotalAllocated = () => {
    return shipment ? shipment.compartmentAllocations.reduce((sum, alloc) => sum + alloc.quantity, 0) : 0;
  };

  const hasValidationErrors = () => {
    if (!shipment || !trailer) return true;
    return shipment.compartmentAllocations.length === 0 || getTotalAllocated() !== shipment.quantity;
  };

  if (!isOpen || !shipment) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Shipment Details</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Close Details"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg">{shipment.orderId}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            shipment.priority === 'high' ? 'bg-red-100 text-red-800' :
            shipment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {shipment.priority} priority
          </span>
          {hasValidationErrors() && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              ⚠ Errors
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: productColors[shipment.productType] || '#6B7280' }}
                />
                <span className="font-medium capitalize">{shipment.productType}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium">{shipment.quantity.toLocaleString()}L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                shipment.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                shipment.status === 'in-transit' ? 'bg-yellow-100 text-yellow-800' :
                shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {shipment.status}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <div className="font-medium">{shipment.customerName}</div>
            </div>
            <div>
              <span className="text-gray-600">Address:</span>
              <div className="text-gray-700">{shipment.deliveryAddress}</div>
            </div>
          </div>
        </div>

        {/* Vehicle & Time */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Assignment</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle:</span>
              <span className="font-medium">{vehicle?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Driver:</span>
              <span className="font-medium">{vehicle?.driver || 'Not assigned'}</span>
            </div>
            {trailer && (
              <div className="flex justify-between">
                <span className="text-gray-600">Trailer:</span>
                <span className="font-medium">{trailer.registration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Time Editing */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Schedule</h3>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={editStart}
                  onChange={(e) => setEditStart(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={editEnd}
                  onChange={(e) => setEditEnd(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSaveEdit}
                className="w-full py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start:</span>
                <span className="font-medium">{format(shipment.start, 'MMM d, HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End:</span>
                <span className="font-medium">{format(shipment.end, 'MMM d, HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {Math.round((shipment.end.getTime() - shipment.start.getTime()) / (1000 * 60))} min
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Compartment Allocations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Compartments</h3>
            <button
              onClick={handleAutoAllocate}
              className="text-xs text-green-600 hover:text-green-800 font-medium"
              disabled={!trailer}
            >
              Auto-Allocate
            </button>
          </div>

          {!trailer ? (
            <div className="text-xs text-gray-500 italic">No trailer assigned to vehicle</div>
          ) : getCompartmentInfo().length === 0 ? (
            <div className="text-xs text-red-600 italic">No compartments allocated</div>
          ) : (
            <div className="space-y-2">
              {getCompartmentInfo().map(({ allocation, compartment, utilizationPercent }) => (
                <div key={allocation.compartmentId} className="border border-gray-200 rounded p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{compartment?.name}</span>
                    <span className="text-xs text-gray-500">{utilizationPercent}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>{allocation.quantity.toLocaleString()}L allocated</span>
                    <span>{compartment?.capacity.toLocaleString()}L capacity</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                    />
                  </div>
                  {compartment && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {compartment.mustUse && (
                        <span className="px-1 py-0.5 bg-red-100 text-red-700 text-xs rounded">Must Use</span>
                      )}
                      {compartment.mandatoryToLoad && (
                        <span className="px-1 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">Mandatory</span>
                      )}
                      {!compartment.partialAllowed && (
                        <span className="px-1 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">No Partial</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="text-xs text-gray-600 mt-2">
                Total Allocated: {getTotalAllocated().toLocaleString()}L / {shipment.quantity.toLocaleString()}L
                {getTotalAllocated() !== shipment.quantity && (
                  <span className="text-red-600 ml-2 font-medium">
                    ⚠ Mismatch: {(shipment.quantity - getTotalAllocated()).toLocaleString()}L
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={handleSplit}
          className="w-full py-2 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700"
        >
          Split Shipment
        </button>
        <button
          onClick={handleRemove}
          className="w-full py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
        >
          Remove Shipment
        </button>
      </div>
    </div>
  );
}