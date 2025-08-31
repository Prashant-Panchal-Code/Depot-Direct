"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DepotDetails } from "../DepotDetailsPage";
import {
  FloppyDisk,
  Download
} from "@phosphor-icons/react";

interface DepotHistoryEvent {
  id: number;
  date: string;
  time: string;
  user: string;
  eventType: string;
  details: string;
  module: string;
}

interface SettingsTabProps {
  depot: DepotDetails;
  onSave: () => void;
}

export default function SettingsTab({ depot, onSave }: SettingsTabProps) {
  // History filtering and pagination state
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock depot history data
  const mockDepotHistory: DepotHistoryEvent[] = [
    {
      id: 1,
      date: "2024-07-20",
      time: "14:30",
      user: "John Admin",
      eventType: "Depot Update",
      details: "Updated depot operating hours for loading operations",
      module: "Depot Management"
    },
    {
      id: 2,
      date: "2024-07-20",
      time: "09:15",
      user: "Sarah Manager",
      eventType: "Loading Completed",
      details: "Truck FL-001-ABC completed loading 15,000L Ultra Low Sulfur Diesel",
      module: "Loading Operations"
    },
    {
      id: 3,
      date: "2024-07-19",
      time: "16:45",
      user: "Mike Supervisor",
      eventType: "Product Added",
      details: "Added new product: Premium Gasoline 98 with 1,800 L/min loading rate",
      module: "Product Management"
    },
    {
      id: 4,
      date: "2024-07-19",
      time: "11:20",
      user: "System",
      eventType: "System Alert",
      details: "Loading bay 3 exceeded temperature threshold during operation",
      module: "Alert System"
    },
    {
      id: 5,
      date: "2024-07-18",
      time: "13:00",
      user: "Robert Operator",
      eventType: "Loading Scheduled",
      details: "Scheduled loading for truck FL-005-MNO - 30,000L Heavy Fuel Oil 180",
      module: "Loading Operations"
    },
    {
      id: 6,
      date: "2024-07-18",
      time: "08:30",
      user: "Admin System",
      eventType: "Security Update",
      details: "Updated access control settings and badge requirements",
      module: "Security Management"
    },
    {
      id: 7,
      date: "2024-07-17",
      time: "15:20",
      user: "Lisa Coordinator",
      eventType: "Compliance Check",
      details: "Completed monthly environmental compliance audit",
      module: "Compliance Management"
    },
    {
      id: 8,
      date: "2024-07-17",
      time: "10:45",
      user: "David Technician",
      eventType: "Maintenance",
      details: "Performed routine maintenance on loading bay 2 equipment",
      module: "Maintenance"
    },
    {
      id: 9,
      date: "2024-07-16",
      time: "14:15",
      user: "System",
      eventType: "Integration Update",
      details: "Successfully synchronized with EMS integration system",
      module: "System Integration"
    },
    {
      id: 10,
      date: "2024-07-16",
      time: "09:00",
      user: "Mark Manager",
      eventType: "Depot Settings",
      details: "Modified notification settings for temperature alerts",
      module: "Settings Management"
    }
  ];

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "Depot Update":
        return "text-primary-custom bg-primary-custom/10";
      case "Loading Completed":
        return "text-green-600 bg-green-100";
      case "Loading Scheduled":
        return "text-blue-600 bg-blue-100";
      case "Product Added":
        return "text-purple-600 bg-purple-100";
      case "System Alert":
        return "text-red-600 bg-red-100";
      case "Security Update":
        return "text-orange-600 bg-orange-100";
      case "Compliance Check":
        return "text-teal-600 bg-teal-100";
      case "Maintenance":
        return "text-yellow-600 bg-yellow-100";
      case "Integration Update":
        return "text-indigo-600 bg-indigo-100";
      case "Depot Settings":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Filter and paginate history
  const filteredHistory = mockDepotHistory.filter((event: DepotHistoryEvent) => {
    const eventDate = new Date(event.date);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    
    const typeMatch = selectedEventType === "all" || event.eventType === selectedEventType;
    const dateMatch = (!fromDate || eventDate >= fromDate) && (!toDate || eventDate <= toDate);
    
    return typeMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    console.log("Saving depot settings");
    onSave();
  };

  return (
    <div className="w-full space-y-8">
      {/* Depot History */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Depot History & Activity Log</h3>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export History
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="Depot Update">Depot Update</SelectItem>
                  <SelectItem value="Loading Completed">Loading Completed</SelectItem>
                  <SelectItem value="Loading Scheduled">Loading Scheduled</SelectItem>
                  <SelectItem value="Product Added">Product Added</SelectItem>
                  <SelectItem value="System Alert">System Alert</SelectItem>
                  <SelectItem value="Security Update">Security Update</SelectItem>
                  <SelectItem value="Compliance Check">Compliance Check</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Integration Update">Integration Update</SelectItem>
                  <SelectItem value="Depot Settings">Depot Settings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button className="bg-primary-custom hover:bg-primary-custom/90 text-white w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-hidden">
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
            {paginatedHistory.map((event: DepotHistoryEvent) => (
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

        {/* Pagination */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredHistory.length)} of {filteredHistory.length} events
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSaveSettings} className="bg-primary-custom hover:bg-primary-custom/90">
          <FloppyDisk size={16} className="mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
