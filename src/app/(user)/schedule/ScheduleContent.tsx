'use client';

// TODO: replace mock store with API calls

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/app/contexts/AppContext';
import { useSchedulerStore } from '@/store/schedulerStore';
import DayPilotSchedulerView from '@/components/scheduler/DayPilotSchedulerView';
import UnassignedOrdersPanel from '@/components/scheduler/UnassignedOrdersPanel';
import ShipmentDetailsDrawer from '@/components/scheduler/ShipmentDetailsDrawer';
import { format, startOfToday, addDays, subDays } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

const DEBUG = false;

type ZoomLevel = '15min' | '30min' | '1h';

export default function ScheduleContent() {
  const { selectedCountry, selectedRegion, sidebarCollapsed, setSidebarCollapsed } = useAppContext();
  const { loadFromMock, selectedShipmentId, setSelectedShipment } = useSchedulerStore();
  
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('1h');
  const [unassignedPanelCollapsed, setUnassignedPanelCollapsed] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);

  // Load mock data on mount
  useEffect(() => {
    if (DEBUG) console.debug('Loading scheduler data');
    loadFromMock();
  }, [loadFromMock]);

  // Collapse sidebar when entering schedule screen
  useEffect(() => {
    if (!sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
    
    // Optional: Restore sidebar when leaving (cleanup)
    return () => {
      // Uncomment if you want to restore sidebar when leaving schedule
      // setSidebarCollapsed(false);
    };
  }, [sidebarCollapsed, setSidebarCollapsed]);

  // Open details drawer when shipment is selected
  useEffect(() => {
    setDetailsDrawerOpen(!!selectedShipmentId);
  }, [selectedShipmentId]);

  const handleEventClick = (shipmentId: string) => {
    if (DEBUG) console.debug('Event clicked in content:', shipmentId);
    setSelectedShipment(shipmentId);
  };

  const handleCloseDetails = () => {
    setSelectedShipment(null);
    setDetailsDrawerOpen(false);
  };

  const handleDateChange = (direction: 'prev' | 'next') => {
    setSelectedDate(current => 
      direction === 'next' ? addDays(current, 1) : subDays(current, 1)
    );
  };

  const handleAutoSchedule = () => {
    // TODO: Implement auto-scheduling algorithm
    toast('Auto-scheduling coming soon', { icon: '🤖' });
  };

  const handleSave = () => {
    // TODO: Save to backend
    toast.success('Changes saved locally');
  };

  const handlePublish = () => {
    // TODO: Publish schedule
    toast('Schedule publishing coming soon', { icon: '📤' });
  };

  return (
    <main className={`pt-24 bg-gray-50 text-gray-900 transition-all duration-300 schedule-container ${
      sidebarCollapsed ? 'ml-16' : 'ml-64'
    }`} style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
              <p className="text-sm text-gray-600">
                Delivery scheduling for {selectedRegion}, {selectedCountry}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Date Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDateChange('prev')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Previous Day"
              >
                ←
              </button>
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => handleDateChange('next')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                title="Next Day"
              >
                →
              </button>
              <button
                onClick={() => setSelectedDate(startOfToday())}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Today
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
              {(['15min', '30min', '1h'] as ZoomLevel[]).map(zoom => (
                <button
                  key={zoom}
                  onClick={() => setZoomLevel(zoom)}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    zoomLevel === zoom
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {zoom}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAutoSchedule}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
              >
                Auto-Schedule
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Unassigned Orders Panel */}
        <UnassignedOrdersPanel
          isCollapsed={unassignedPanelCollapsed}
          onToggle={() => setUnassignedPanelCollapsed(!unassignedPanelCollapsed)}
        />

        {/* Scheduler View */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <DayPilotSchedulerView
              selectedDate={selectedDate}
              zoomLevel={zoomLevel}
              onEventClick={handleEventClick}
            />
          </div>
        </div>

        {/* Shipment Details Drawer */}
        <ShipmentDetailsDrawer
          isOpen={detailsDrawerOpen}
          onClose={handleCloseDetails}
        />
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Global Scrollbar Styles for Schedule */}
      <style jsx global>{`
        .schedule-container .custom-scrollbar {
          overflow-y: scroll !important;
        }
        .schedule-container .custom-scrollbar::-webkit-scrollbar {
          width: 14px;
          display: block !important;
        }
        .schedule-container .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
        }
        .schedule-container .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 8px;
          border: 3px solid #f1f5f9;
        }
        .schedule-container .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </main>
  );
}
