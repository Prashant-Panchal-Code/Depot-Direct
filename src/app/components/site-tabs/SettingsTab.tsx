"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteDetails } from "../SiteDetailsModal";

interface SettingsTabProps {
  site: SiteDetails;
}

export default function SettingsTab({ site }: SettingsTabProps) {
  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "Operating hours updated":
        return "text-blue-800 bg-blue-100";
      case "Delivery completed":
        return "text-green-800 bg-green-100";
      case "Tank capacity adjusted":
        return "text-yellow-800 bg-yellow-100";
      case "Site information updated":
        return "text-purple-800 bg-purple-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  const mockHistory = [
    {
      id: 1,
      dateTime: "2024-03-15 10:30 AM",
      user: "Emily Carter",
      eventType: "Operating hours updated",
      details: "Updated operating hours to 8 AM - 6 PM"
    },
    {
      id: 2,
      dateTime: "2024-03-14 02:45 PM",
      user: "System",
      eventType: "Delivery completed",
      details: "Delivery of 5000 gallons completed"
    },
    {
      id: 3,
      dateTime: "2024-03-10 09:15 AM",
      user: "David Lee",
      eventType: "Tank capacity adjusted",
      details: "Adjusted tank capacity to 10000 gallons"
    },
    {
      id: 4,
      dateTime: "2024-03-05 11:00 AM",
      user: "System",
      eventType: "Delivery completed",
      details: "Delivery of 4500 gallons completed"
    },
    {
      id: 5,
      dateTime: "2024-03-01 04:00 PM",
      user: "Sarah Chen",
      eventType: "Site information updated",
      details: "Updated site address to 123 Elm Street"
    }
  ];

  const deliveryTabs = [
    { id: "all-events", label: "All Events" },
    { id: "site-updates", label: "Site Updates" },
    { id: "delivery-history", label: "Deliveries" },
    { id: "tank-adjustments", label: "Tank Adjustments" },
  ];

  const history = site.history || mockHistory;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Site History</h2>
        <p className="text-gray-600 mt-1">A chronological log of all significant site changes and delivery events.</p>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="w-40"
            placeholder="mm/dd/yyyy"
          />
          <span className="text-gray-500">to</span>
          <Input
            type="date"
            className="w-40"
            placeholder="mm/dd/yyyy"
          />
        </div>
        <div className="flex gap-2 ml-auto">
          {deliveryTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={tab.id === "all-events" ? "default" : "outline"}
              size="sm"
              className={tab.id === "all-events" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-50 px-6 py-4 text-sm font-medium text-gray-700 border-b border-gray-200">
          <div>DATE & TIME</div>
          <div>USER</div>
          <div>EVENT TYPE</div>
          <div>DETAILS</div>
        </div>
        {history.map((event) => (
          <div key={event.id} className="grid grid-cols-4 px-6 py-4 border-b border-gray-100 last:border-b-0 items-center">
            <div className="text-gray-900">{event.dateTime}</div>
            <div className="text-gray-600">{event.user}</div>
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
                {event.eventType}
              </span>
            </div>
            <div className="text-gray-600">{event.details}</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing 1 to 5 of 50 results
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <div className="flex gap-1">
            <Button size="sm" className="bg-blue-600 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <span className="px-2 text-gray-500">...</span>
            <Button variant="outline" size="sm">10</Button>
          </div>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}