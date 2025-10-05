'use client';

// Orders Panel Component
// Shows both assigned and unassigned orders with different styling

import React, { useState } from 'react';
import { useSchedulerStore } from '@/store/schedulerStore';
import { productColors } from '@/data/mock-scheduler';
// Using simple icons instead of heroicons

const DEBUG = false;

// Type for combined order (assigned or unassigned)
interface CombinedOrder {
  id: string;
  orderId: string;
  productType: string;
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  siteName?: string;
  depotName?: string;
  customerName: string;
  deliveryAddress: string;
  isAssigned: boolean;
  vehicleId?: string;
  etaWindow?: { start: Date; end: Date };
}

interface UnassignedOrdersPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function UnassignedOrdersPanel({
  isCollapsed,
  onToggle
}: UnassignedOrdersPanelProps) {
  const { unassignedOrders, shipments, setSelectedShipment } = useSchedulerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Convert shipments to assigned orders format
  const assignedOrders = shipments.map(shipment => ({
    id: shipment.id,
    orderId: shipment.orderId,
    productType: shipment.productType,
    quantity: shipment.quantity,
    priority: shipment.priority,
    siteName: shipment.siteName,
    depotName: shipment.depotName,
    customerName: shipment.customerName,
    deliveryAddress: shipment.deliveryAddress,
    isAssigned: true,
    vehicleId: shipment.vehicleId
  }));

  // Convert unassigned orders to common format
  const unassignedOrdersFormatted = unassignedOrders.map(order => ({
    ...order,
    isAssigned: false,
    vehicleId: undefined
  }));

  // Combine all orders
  const allOrders = [...assignedOrders, ...unassignedOrdersFormatted];

  // Filter orders based on search, priority, and status
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.productType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'assigned' && order.isAssigned) ||
                         (filterStatus === 'unassigned' && !order.isAssigned);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleDragStart = (e: React.DragEvent, order: CombinedOrder) => {
    // Only allow dragging unassigned orders
    if (order.isAssigned) {
      e.preventDefault();
      return;
    }
    
    if (DEBUG) console.debug('Order drag started:', order.orderId);
    e.dataTransfer.setData('application/json', JSON.stringify({
      orderId: order.orderId,
      productType: order.productType,
      quantity: order.quantity,
      priority: order.priority,
      customerName: order.customerName,
      deliveryAddress: order.deliveryAddress,
      etaWindow: order.etaWindow || { start: new Date(), end: new Date() }
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAssignedOrderClick = (order: CombinedOrder) => {
    if (order.isAssigned) {
      // Find the corresponding shipment and select it
      const shipment = shipments.find(s => s.orderId === order.orderId);
      if (shipment) {
        setSelectedShipment(shipment.id);
        if (DEBUG) console.debug('Selected shipment for order:', order.orderId, 'shipment:', shipment.id);
      }
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col h-full">
        <button
          onClick={onToggle}
          className="flex-shrink-0 p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          title="Show Orders"
        >
          <div className="transform rotate-90 text-xs font-medium">ORDERS</div>
        </button>
        <div className="flex-1 flex flex-col items-center justify-start space-y-2 pt-4 custom-scrollbar" style={{ overflowY: 'scroll', minHeight: '200px' }}>
          {allOrders.slice(0, 6).map(order => (
            <div
              key={order.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                order.isAssigned ? 'opacity-60' : ''
              }`}
              style={{ backgroundColor: productColors[order.productType] || '#6B7280' }}
              title={`${order.orderId} - ${order.quantity}L ${order.productType} ${order.isAssigned ? '(Assigned)' : ''}`}
            >
              {order.quantity > 1000 ? `${Math.round(order.quantity/1000)}k` : order.quantity}
            </div>
          ))}
          {allOrders.length > 6 && (
            <div className="text-xs text-gray-500">+{allOrders.length - 6}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Collapse Panel"
          >
            <span className="text-lg">×</span>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <select
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="unassigned">Unassigned</option>
            <option value="assigned">Assigned</option>
          </select>
          <select
            className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 p-4 space-y-3 custom-scrollbar" style={{ overflowY: 'scroll' }}>
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm">No orders found</p>
            {searchTerm && (
              <p className="text-xs mt-1">Try adjusting your search</p>
            )}
          </div>
        ) : (
          filteredOrders.map(order => {
            const isAssigned = order.isAssigned;
            const isUnassigned = !order.isAssigned;
            
            return (
              <div
                key={order.id}
                className={`p-3 border rounded-lg transition-all ${
                  isAssigned 
                    ? 'bg-gray-100 border-gray-300 opacity-75 cursor-pointer hover:opacity-90 hover:shadow-sm' 
                    : 'bg-gray-50 hover:bg-gray-100 cursor-grab hover:shadow-md'
                }`}
                draggable={isUnassigned}
                onDragStart={isUnassigned ? (e) => handleDragStart(e, order) : undefined}
                onClick={isAssigned ? () => handleAssignedOrderClick(order) : undefined}
                title={isAssigned ? "Click to select shipment in scheduler" : "Drag to scheduler to assign"}
              >
                {/* Order Header - Compact */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-gray-900">{order.orderId}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityClass(order.priority)}`}>
                      {order.priority.charAt(0).toUpperCase()}
                    </span>
                    {isAssigned && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border-blue-200">
                        ASSIGNED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: productColors[order.productType] || '#6B7280' }}
                    />
                    <span className="text-xs font-medium text-gray-900">{order.quantity}L</span>
                  </div>
                </div>

                {/* Site and Depot Info - Compact */}
                <div className="text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {order.siteName || 'SITE'} | {order.depotName || 'DEPOT'}
                    </span>
                  </div>
                </div>

                {/* Drag Handle - Only for unassigned */}
                {isUnassigned && (
                  <div className="mt-2 text-center text-gray-400">
                    <div className="text-xs">⋮⋮⋮</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{filteredOrders.length} of {allOrders.length} orders</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-50 border border-gray-300 rounded-full"></div>
              <span>Unassigned</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Assigned</span>
            </div>
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