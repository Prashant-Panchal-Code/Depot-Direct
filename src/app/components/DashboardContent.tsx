'use client';

import { useState } from 'react';

// Modal component
function Modal({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Modal states
  const [isDeliveriesModalOpen, setIsDeliveriesModalOpen] = useState(false);
  const [isTrucksModalOpen, setIsTrucksModalOpen] = useState(false);
  const [isLeftOnBoardModalOpen, setIsLeftOnBoardModalOpen] = useState(false);
  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);

  // Extended data for modals
  const allDeliveries = [
    { time: "8:00 AM", eta: "8:15 AM", site: "Site A", product: "Gasoline", truck: "Truck 1", status: "Scheduled", statusColor: "bg-yellow-500/20 text-yellow-400" },
    { time: "10:00 AM", eta: "10:30 AM", site: "Site B", product: "Diesel", truck: "Truck 2", status: "En Route", statusColor: "bg-blue-500/20 text-blue-400" },
    { time: "12:00 PM", eta: "12:05 PM", site: "Site C", product: "Heating Oil", truck: "Truck 3", status: "Completed", statusColor: "bg-green-500/20 text-green-400" },
    { time: "2:00 PM", eta: "2:20 PM", site: "Site D", product: "Gasoline", truck: "Truck 4", status: "Scheduled", statusColor: "bg-yellow-500/20 text-yellow-400" },
    { time: "3:30 PM", eta: "3:45 PM", site: "Site E", product: "Jet Fuel", truck: "Truck 5", status: "Delayed", statusColor: "bg-red-500/20 text-red-400" },
    { time: "4:00 PM", eta: "4:15 PM", site: "Site F", product: "Diesel", truck: "Truck 6", status: "En Route", statusColor: "bg-blue-500/20 text-blue-400" },
  ];

  const allTrucks = [
    { name: "Truck 1", capacity: "10,000L", driver: "Ethan Carter", status: "Available", statusColor: "bg-green-500/20 text-green-400" },
    { name: "Truck 2", capacity: "12,000L", driver: "Olivia Bennett", status: "In Transit", statusColor: "bg-blue-500/20 text-blue-400" },
    { name: "Truck 3", capacity: "8,000L", driver: "Noah Thompson", status: "Maintenance", statusColor: "bg-red-500/20 text-red-400" },
    { name: "Truck 4", capacity: "15,000L", driver: "Emma Wilson", status: "Available", statusColor: "bg-green-500/20 text-green-400" },
    { name: "Truck 5", capacity: "11,000L", driver: "James Rodriguez", status: "Loading", statusColor: "bg-yellow-500/20 text-yellow-400" },
    { name: "Truck 6", capacity: "9,000L", driver: "Sophia Martinez", status: "In Transit", statusColor: "bg-blue-500/20 text-blue-400" },
  ];

  const allLeftOnBoard = [
    { truck: "Truck 5", driver: "James Rodriguez", lastSite: "Site D", product: "Gasoline", volume: "1,200 L", percentage: 30 },
    { truck: "Truck 8", driver: "Sophia Martinez", lastSite: "Site F", product: "Diesel", volume: "800 L", percentage: 20 },
    { truck: "Truck 7", driver: "Michael Chen", lastSite: "Site G", product: "Heating Oil", volume: "2,000 L", percentage: 50 },
    { truck: "Truck 9", driver: "Lisa Johnson", lastSite: "Site H", product: "Jet Fuel", volume: "1,500 L", percentage: 40 },
  ];

  const allUrgentDeliveries = [
    { site: "Site X - Downtown", stockout: "2 hours", eta: "1.5 hours", tanks: "T1 (Gasoline), T3 (Diesel)", priority: "high", bgColor: "bg-red-900/50", borderColor: "border-red-500", textColor: "text-red-300", buttonColor: "bg-red-600 hover:bg-red-500" },
    { site: "Site Y - Airport", stockout: "8 hours", eta: "6 hours", tanks: "T2 (Jet Fuel)", priority: "medium", bgColor: "bg-yellow-900/50", borderColor: "border-yellow-500", textColor: "text-yellow-300", buttonColor: "bg-yellow-600 hover:bg-yellow-500" },
    { site: "Site Z - Industrial Park", stockout: "12 hours", eta: "10 hours", tanks: "T4 (Heating Oil), T5 (Diesel)", priority: "medium", bgColor: "bg-yellow-900/50", borderColor: "border-yellow-500", textColor: "text-yellow-300", buttonColor: "bg-yellow-600 hover:bg-yellow-500" },
    { site: "Site W - Mall", stockout: "4 hours", eta: "3 hours", tanks: "T6 (Gasoline)", priority: "high", bgColor: "bg-red-900/50", borderColor: "border-red-500", textColor: "text-red-300", buttonColor: "bg-red-600 hover:bg-red-500" },
  ];

  return (
    <main className="ml-64 pt-20 min-h-screen bg-gray-50 text-gray-900 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <div className="relative flex items-center gap-2">
                <span className="text-xl">📅</span>
                <input 
                  className="bg-white text-gray-700 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none cursor-pointer hover:text-gray-900 hover:border-gray-400 transition-colors"
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    colorScheme: 'light',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                  onClick={(e) => {
                    // Force show the date picker
                    e.currentTarget.showPicker?.();
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Deliveries */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Deliveries</h2>
                <button 
                  onClick={() => setIsDeliveriesModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Show All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 pr-4 text-gray-700">Time</th>
                      <th className="py-3 px-4 text-gray-700">ETA</th>
                      <th className="py-3 px-4 text-gray-700">Site</th>
                      <th className="py-3 px-4 text-gray-700">Product</th>
                      <th className="py-3 px-4 text-gray-700">Truck</th>
                      <th className="py-3 pl-4 text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-4 pr-4 text-gray-600">8:00 AM</td>
                      <td className="py-4 px-4 text-gray-600">8:15 AM</td>
                      <td className="py-4 px-4 font-medium text-gray-900">Site A</td>
                      <td className="py-4 px-4 text-gray-600">Gasoline</td>
                      <td className="py-4 px-4 text-gray-600">Truck 1</td>
                      <td className="py-4 pl-4">
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 pr-4 text-gray-600">10:00 AM</td>
                      <td className="py-4 px-4 text-gray-600">10:30 AM</td>
                      <td className="py-4 px-4 font-medium text-gray-900">Site B</td>
                      <td className="py-4 px-4 text-gray-600">Diesel</td>
                      <td className="py-4 px-4 text-gray-600">Truck 2</td>
                      <td className="py-4 pl-4">
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                          En Route
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 pr-4 text-gray-600">12:00 PM</td>
                      <td className="py-4 px-4 text-gray-600">12:05 PM</td>
                      <td className="py-4 px-4 font-medium text-gray-900">Site C</td>
                      <td className="py-4 px-4 text-gray-600">Heating Oil</td>
                      <td className="py-4 px-4 text-gray-600">Truck 3</td>
                      <td className="py-4 pl-4">
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Truck Availability */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Truck Availability</h2>
              <button 
                onClick={() => setIsTrucksModalOpen(true)}
                className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Show All
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">Truck 1</p>
                  <p className="text-sm text-gray-600">10,000L - Ethan Carter</p>
                </div>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                  Available
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">Truck 2</p>
                  <p className="text-sm text-gray-600">12,000L - Olivia Bennett</p>
                </div>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                  In Transit
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">Truck 3</p>
                  <p className="text-sm text-gray-600">8,000L - Noah Thompson</p>
                </div>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700">
                  Maintenance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Potential Left on Board Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Potential Left on Board</h2>
            <button 
              onClick={() => setIsLeftOnBoardModalOpen(true)}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 pr-4 text-gray-700">Truck</th>
                  <th className="py-3 px-4 text-gray-700">Driver</th>
                  <th className="py-3 px-4 text-gray-700">Last Site</th>
                  <th className="py-3 px-4 text-gray-700">Product</th>
                  <th className="py-3 px-4 text-gray-700">Volume Remaining</th>
                  <th className="py-3 pl-4 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 pr-4 font-medium text-gray-900">Truck 5</td>
                  <td className="py-4 px-4 text-gray-600">James Rodriguez</td>
                  <td className="py-4 px-4 text-gray-600">Site D</td>
                  <td className="py-4 px-4 text-gray-600">Gasoline</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2.5 bg-gray-200 rounded-full">
                        <div className="h-2.5 bg-orange-400 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-orange-600 text-sm font-medium">1,200 L</span>
                    </div>
                  </td>
                  <td className="py-4 pl-4">
                    <button className="px-3 py-1 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-white">
                      Re-route
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-medium text-gray-900">Truck 8</td>
                  <td className="py-4 px-4 text-gray-600">Sophia Martinez</td>
                  <td className="py-4 px-4 text-gray-600">Site F</td>
                  <td className="py-4 px-4 text-gray-600">Diesel</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2.5 bg-gray-200 rounded-full">
                        <div className="h-2.5 bg-orange-400 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-orange-600 text-sm font-medium">800 L</span>
                    </div>
                  </td>
                  <td className="py-4 pl-4">
                    <button className="px-3 py-1 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-white">
                      Re-route
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Urgent Deliveries Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Urgent Deliveries</h2>
              <span className="text-red-500 text-xl">⚠️</span>
            </div>
            <button 
              onClick={() => setIsUrgentModalOpen(true)}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Show All
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-red-50 rounded-md border-l-4 border-red-500">
              <div>
                <p className="font-semibold text-gray-900">Site X - Downtown</p>
                <p className="text-sm text-red-700 mt-1">Predicted Stockout: 2 hours | ETA: 1.5 hours</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <span className="text-base">⛽</span>
                  <span>Tanks: T1 (Gasoline), T3 (Diesel)</span>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-500 text-white flex-shrink-0">
                Dispatch Now
              </button>
            </div>
            <div className="flex items-start justify-between p-4 bg-yellow-50 rounded-md border-l-4 border-yellow-500">
              <div>
                <p className="font-semibold text-gray-900">Site Y - Airport</p>
                <p className="text-sm text-yellow-700 mt-1">Predicted Stockout: 8 hours | ETA: 6 hours</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600">
                  <span className="text-base">⛽</span>
                  <span>Tanks: T2 (Jet Fuel)</span>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium rounded-md bg-yellow-600 hover:bg-yellow-500 text-white flex-shrink-0">
                Schedule Delivery
              </button>
            </div>
            <div className="flex items-start justify-between p-4 bg-yellow-50 rounded-md border-l-4 border-yellow-500">
              <div>
                <p className="font-semibold text-gray-900">Site Z - Industrial Park</p>
                <p className="text-sm text-yellow-700 mt-1">Predicted Stockout: 12 hours | ETA: 10 hours</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600">
                  <span className="text-base">⛽</span>
                  <span>Tanks: T4 (Heating Oil), T5 (Diesel)</span>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium rounded-md bg-yellow-600 hover:bg-yellow-500 text-white flex-shrink-0">
                Schedule Delivery
              </button>
            </div>
          </div>
        </div>

        {/* Add some extra content to demonstrate scrolling */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Additional Content</h2>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="font-semibold text-gray-900">Sample Content Block {i + 1}</p>
                <p className="text-gray-600 text-sm mt-1">
                  This is additional content to demonstrate the scrolling behavior. 
                  The sidebar should remain fixed while this content scrolls.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isDeliveriesModalOpen} 
        onClose={() => setIsDeliveriesModalOpen(false)}
        title="All Upcoming Deliveries"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 pr-4 text-gray-900">Time</th>
                <th className="py-3 px-4 text-gray-900">ETA</th>
                <th className="py-3 px-4 text-gray-900">Site</th>
                <th className="py-3 px-4 text-gray-900">Product</th>
                <th className="py-3 px-4 text-gray-900">Truck</th>
                <th className="py-3 pl-4 text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allDeliveries.map((delivery, index) => (
                <tr key={index}>
                  <td className="py-4 pr-4 text-gray-600">{delivery.time}</td>
                  <td className="py-4 px-4 text-gray-600">{delivery.eta}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">{delivery.site}</td>
                  <td className="py-4 px-4 text-gray-600">{delivery.product}</td>
                  <td className="py-4 px-4 text-gray-600">{delivery.truck}</td>
                  <td className="py-4 pl-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${delivery.statusColor.replace('bg-yellow-500/20 text-yellow-400', 'bg-yellow-100 text-yellow-700').replace('bg-blue-500/20 text-blue-400', 'bg-blue-100 text-blue-700').replace('bg-green-500/20 text-green-400', 'bg-green-100 text-green-700').replace('bg-red-500/20 text-red-400', 'bg-red-100 text-red-700')}`}>
                      {delivery.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal 
        isOpen={isTrucksModalOpen} 
        onClose={() => setIsTrucksModalOpen(false)}
        title="All Truck Availability"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTrucks.map((truck, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{truck.name}</p>
                  <p className="text-sm text-gray-600">{truck.capacity} - {truck.driver}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${truck.statusColor.replace('bg-green-500/20 text-green-400', 'bg-green-100 text-green-700').replace('bg-blue-500/20 text-blue-400', 'bg-blue-100 text-blue-700').replace('bg-red-500/20 text-red-400', 'bg-red-100 text-red-700').replace('bg-yellow-500/20 text-yellow-400', 'bg-yellow-100 text-yellow-700')}`}>
                {truck.status}
              </span>
            </div>
          ))}
        </div>
      </Modal>

      <Modal 
        isOpen={isLeftOnBoardModalOpen} 
        onClose={() => setIsLeftOnBoardModalOpen(false)}
        title="All Potential Left on Board"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 pr-4 text-gray-900">Truck</th>
                <th className="py-3 px-4 text-gray-900">Driver</th>
                <th className="py-3 px-4 text-gray-900">Last Site</th>
                <th className="py-3 px-4 text-gray-900">Product</th>
                <th className="py-3 px-4 text-gray-900">Volume Remaining</th>
                <th className="py-3 pl-4 text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allLeftOnBoard.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 pr-4 font-medium text-gray-900">{item.truck}</td>
                  <td className="py-4 px-4 text-gray-600">{item.driver}</td>
                  <td className="py-4 px-4 text-gray-600">{item.lastSite}</td>
                  <td className="py-4 px-4 text-gray-600">{item.product}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2.5 bg-gray-200 rounded-full">
                        <div className="h-2.5 bg-orange-400 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                      <span className="text-orange-600 text-sm font-medium">{item.volume}</span>
                    </div>
                  </td>
                  <td className="py-4 pl-4">
                    <button className="px-3 py-1 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-white">
                      Re-route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal 
        isOpen={isUrgentModalOpen} 
        onClose={() => setIsUrgentModalOpen(false)}
        title="All Urgent Deliveries"
      >
        <div className="space-y-4">
          {allUrgentDeliveries.map((delivery, index) => (
            <div key={index} className={`flex items-start justify-between p-4 ${delivery.bgColor.replace('bg-red-900/50', 'bg-red-50').replace('bg-yellow-900/50', 'bg-yellow-50')} rounded-md border-l-4 ${delivery.borderColor}`}>
              <div>
                <p className="font-semibold text-gray-900">{delivery.site}</p>
                <p className={`text-sm mt-1 ${delivery.textColor.replace('text-red-300', 'text-red-700').replace('text-yellow-300', 'text-yellow-700')}`}>Predicted Stockout: {delivery.stockout} | ETA: {delivery.eta}</p>
                <div className={`mt-2 flex items-center gap-2 text-sm ${delivery.textColor.replace('text-red-200', 'text-red-600').replace('text-yellow-200', 'text-yellow-600')}`}>
                  <span className="text-base">⛽</span>
                  <span>Tanks: {delivery.tanks}</span>
                </div>
              </div>
              <button className={`px-4 py-2 text-sm font-medium rounded-md ${delivery.buttonColor} text-white flex-shrink-0`}>
                {delivery.priority === 'high' ? 'Dispatch Now' : 'Schedule Delivery'}
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </main>
  );
}
