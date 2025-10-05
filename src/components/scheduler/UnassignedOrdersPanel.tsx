'use client';

// Unassigned Orders Panel Component
// Shows unassigned orders with drag support

import React, { useState } from 'react';
import { useSchedulerStore } from '@/store/schedulerStore';
import { productColors } from '@/data/mock-scheduler';
import { format, differenceInHours } from 'date-fns';
// Using simple icons instead of heroicons

const DEBUG = false;

interface UnassignedOrdersPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function UnassignedOrdersPanel({
  isCollapsed,
  onToggle
}: UnassignedOrdersPanelProps) {
  const { unassignedOrders } = useSchedulerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Filter orders based on search and priority
  const filteredOrders = unassignedOrders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.productType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  });

  const handleDragStart = (e: React.DragEvent, order: { orderId: string; productType: string; quantity: number; priority: string; customerName: string; deliveryAddress: string; etaWindow: { start: Date; end: Date; }; }) => {
    if (DEBUG) console.debug('Order drag started:', order.orderId);
    e.dataTransfer.setData('application/json', JSON.stringify({
      orderId: order.orderId,
      productType: order.productType,
      quantity: order.quantity,
      priority: order.priority,
      customerName: order.customerName,
      deliveryAddress: order.deliveryAddress,
      etaWindow: order.etaWindow
    }));
    e.dataTransfer.effectAllowed = 'copy';
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
          title="Show Unassigned Orders"
        >
          <div className="transform rotate-90 text-xs font-medium">ORDERS</div>
        </button>
        <div className="flex-1 flex flex-col items-center justify-start space-y-2 pt-4 custom-scrollbar" style={{ overflowY: 'scroll', minHeight: '200px' }}>
          {unassignedOrders.slice(0, 6).map(order => (
            <div
              key={order.id}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: productColors[order.productType] || '#6B7280' }}
              title={`${order.orderId} - ${order.quantity}L ${order.productType}`}
            >
              {order.quantity > 1000 ? `${Math.round(order.quantity/1000)}k` : order.quantity}
            </div>
          ))}
          {unassignedOrders.length > 6 && (
            <div className="text-xs text-gray-500">+{unassignedOrders.length - 6}</div>
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
          <h2 className="text-lg font-semibold text-gray-900">Unassigned Orders</h2>
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

        {/* Priority Filter */}
        <select
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="flex-1 p-4 space-y-3 custom-scrollbar" style={{ overflowY: 'scroll' }}>
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm">No unassigned orders</p>
            {searchTerm && (
              <p className="text-xs mt-1">Try adjusting your search</p>
            )}
          </div>
        ) : (
          filteredOrders.map(order => {
            const etaHours = differenceInHours(order.etaWindow.end, order.etaWindow.start);
            const isUrgent = differenceInHours(order.etaWindow.start, new Date()) < 4;

            return (
              <div
                key={order.id}
                className={`p-3 border rounded-lg cursor-grab hover:shadow-md transition-all ${
                  isUrgent ? 'ring-2 ring-red-200 bg-red-50' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, order)}
                title="Drag to scheduler to assign"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-gray-900">{order.orderId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityClass(order.priority)}`}>
                      {order.priority}
                    </span>
                  </div>
                  {isUrgent && (
                    <span className="text-red-500 text-xs font-medium">URGENT</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: productColors[order.productType] || '#6B7280' }}
                    />
                    <span className="text-sm text-gray-700 capitalize">{order.productType}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{order.quantity}L</span>
                </div>

                {/* Customer */}
                <div className="text-xs text-gray-600 mb-2">
                  <div className="font-medium">{order.customerName}</div>
                  <div className="truncate">{order.deliveryAddress}</div>
                </div>

                {/* ETA Window */}
                <div className="text-xs text-gray-500">
                  <div>ETA: {format(order.etaWindow.start, 'MMM d, HH:mm')} - {format(order.etaWindow.end, 'HH:mm')}</div>
                  <div>Window: {etaHours}h</div>
                </div>

                {/* Drag Handle */}
                <div className="mt-2 text-center text-gray-400">
                  <div className="text-xs">⋮⋮⋮</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{filteredOrders.length} of {unassignedOrders.length} orders</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Urgent</span>
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