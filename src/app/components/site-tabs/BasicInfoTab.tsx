"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";

interface BasicInfoTabProps {
  site: SiteDetails;
  isEditing: boolean;
  onSave: () => void;
  onBack: () => void;
}

export default function BasicInfoTab({ site, isEditing, onSave, onBack }: BasicInfoTabProps) {
  const weekDays = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const mockOperatingHours = {
    Monday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Tuesday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Wednesday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Thursday: { open: "08:00 AM", close: "10:00 PM", closed: false },
    Friday: { open: "08:00 AM", close: "11:00 PM", closed: false },
    Saturday: { open: "09:00 AM", close: "11:00 PM", closed: false },
    Sunday: { open: "09:00 AM", close: "09:00 PM", closed: false },
  };

  const siteWithDefaults = {
    ...site,
    contactPerson: site.contactPerson || "Manager " + site.siteCode,
    phone: site.phone || "(555) 123-4567",
    email: site.email || `contact@${site.siteName.toLowerCase().replace(/\s+/g, '')}.com`,
    operatingHours: site.operatingHours || mockOperatingHours,
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="siteName" className="text-sm font-medium text-gray-700 mb-2 block">
              Site Name
            </Label>
            <Input
              id="siteName"
              value={siteWithDefaults.siteName}
              className="bg-gray-50 border-gray-300"
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
              Address
            </Label>
            <Input
              id="address"
              value={siteWithDefaults.street}
              className="bg-gray-50 border-gray-300"
              disabled={!isEditing}
            />
          </div>

          {/* Map Placeholder */}
          <div className="bg-green-100 border border-green-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-2 text-green-600" />
              <p className="text-gray-600 text-sm">Interactive Map</p>
              <p className="text-xs text-gray-500">{siteWithDefaults.latLong}</p>
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
              Phone
            </Label>
            <Input
              id="phone"
              value={siteWithDefaults.phone}
              className="bg-gray-50 border-gray-300"
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              value={siteWithDefaults.email}
              className="bg-gray-50 border-gray-300"
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Right Column - Operating Hours */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-200">
              <div>DAY</div>
              <div>OPEN</div>
              <div>CLOSE</div>
            </div>
            {weekDays.map((day) => {
              const hours = (siteWithDefaults.operatingHours as any)?.[day] || {
                open: "08:00 AM",
                close: "10:00 PM",
                closed: false,
              };
              return (
                <div key={day} className="grid grid-cols-3 px-4 py-3 border-b border-gray-200 last:border-b-0">
                  <div className="font-medium text-gray-900">{day}</div>
                  <div className="text-gray-600 flex items-center">
                    {hours.closed ? (
                      <span className="text-red-600">Closed</span>
                    ) : (
                      hours.open
                    )}
                  </div>
                  <div className="text-gray-600">
                    {!hours.closed && hours.close}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 pt-6 mt-6 flex justify-end gap-2 flex-shrink-0">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </>
  );
}