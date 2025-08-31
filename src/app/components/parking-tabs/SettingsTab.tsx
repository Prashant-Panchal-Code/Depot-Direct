"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Gear } from "@phosphor-icons/react";

interface HistoryEvent {
  id: number;
  date: string;
  time: string;
  user: string;
  eventType: string;
  details: string;
  module: string;
}

export default function SettingsTab() {
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "Parking Update":
        return "text-primary-custom bg-primary-custom/10";
      case "Vehicle Check":
        return "text-green-600 bg-green-100";
      case "Capacity Adjustment":
        return "text-orange-600 bg-orange-100";
      case "Security Alert":
        return "text-red-600 bg-red-100";
      case "User Action":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Mock data for demonstration - parking-specific events
  const mockHistory: HistoryEvent[] = [
    {
      id: 1,
      date: "2024-07-20",
      time: "14:30",
      user: "John Admin",
      eventType: "Parking Update",
      details: "Updated parking space count to 150 spaces",
      module: "Parking Management"
    },
    {
      id: 2,
      date: "2024-07-20",
      time: "09:15",
      user: "Sarah Manager",
      eventType: "Vehicle Check",
      details: "Completed vehicle inspection for overnight parking",
      module: "Security Management"
    },
    {
      id: 3,
      date: "2024-07-19",
      time: "16:45",
      user: "Mike Security",
      eventType: "Security Alert",
      details: "Unauthorized vehicle detected in reserved area",
      module: "Security System"
    },
    {
      id: 4,
      date: "2024-07-19",
      time: "11:20",
      user: "System",
      eventType: "Capacity Adjustment",
      details: "Parking lot reached 90% capacity - overflow protocol activated",
      module: "Capacity Management"
    },
    {
      id: 5,
      date: "2024-07-18",
      time: "13:00",
      user: "Robert Attendant",
      eventType: "Vehicle Check",
      details: "Daily vehicle count verification completed",
      module: "Operations"
    },
    {
      id: 6,
      date: "2024-07-18",
      time: "08:30",
      user: "Admin System",
      eventType: "User Action",
      details: "Updated contact information and emergency procedures",
      module: "Parking Management"
    },
    {
      id: 7,
      date: "2024-07-17",
      time: "15:15",
      user: "Emma Supervisor",
      eventType: "Parking Update",
      details: "Reconfigured parking space layout for larger vehicles",
      module: "Facility Management"
    },
    {
      id: 8,
      date: "2024-07-17",
      time: "10:45",
      user: "System",
      eventType: "Security Alert",
      details: "Motion sensor triggered in after-hours period",
      module: "Security System"
    },
  ];

  const filteredHistory = mockHistory.filter((event: HistoryEvent) => {
    const matchesEventType = selectedEventType === "all" || event.eventType === selectedEventType;
    const matchesDateRange = !dateFrom || !dateTo || 
      (new Date(event.date) >= new Date(dateFrom) && new Date(event.date) <= new Date(dateTo));
    return matchesEventType && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold text-gray-900">Parking History & Settings</h3>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export History
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Gear size={16} />
            Parking Settings
          </Button>
        </div>
      </div>

      {/* Filters Section - Full Width */}
      <div className="grid grid-cols-5 gap-4 mb-6 flex-shrink-0">
        <div>
          <Label className="text-sm font-medium text-gray-700">Date From</Label>
          <Input 
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Date To</Label>
          <Input 
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Event Type</Label>
          <Select value={selectedEventType} onValueChange={setSelectedEventType}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="Parking Update">Parking Updates</SelectItem>
              <SelectItem value="Vehicle Check">Vehicle Checks</SelectItem>
              <SelectItem value="Capacity Adjustment">Capacity Adjustments</SelectItem>
              <SelectItem value="Security Alert">Security Alerts</SelectItem>
              <SelectItem value="User Action">User Actions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Module Filter</Label>
          <Select defaultValue="all">
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="Parking Management">Parking Management</SelectItem>
              <SelectItem value="Security Management">Security Management</SelectItem>
              <SelectItem value="Capacity Management">Capacity Management</SelectItem>
              <SelectItem value="Security System">Security System</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white w-full">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* History Table - Full Width */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-700 border-b border-gray-200">
          <div>DATE & TIME</div>
          <div>USER</div>
          <div>EVENT TYPE</div>
          <div>MODULE</div>
          <div className="col-span-2">DETAILS</div>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto max-h-96">
          {paginatedHistory.map((event: HistoryEvent) => (
            <div key={event.id} className="grid grid-cols-6 px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 text-sm">
              <div className="text-gray-900">
                <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500">{event.time}</div>
              </div>
              <div className="text-gray-600">
                {event.user}
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
                  {event.eventType}
                </span>
              </div>
              <div className="text-gray-600 text-xs">
                {event.module}
              </div>
              <div className="col-span-2 text-gray-600">
                {event.details}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination and Summary - Full Width */}
      <div className="flex justify-between items-center mt-4 flex-shrink-0">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredHistory.length)} of {filteredHistory.length} events
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
