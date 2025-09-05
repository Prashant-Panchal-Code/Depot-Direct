"use client";

import React from "react";
import { BlueprintSlot } from "./BlueprintTab";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  slots: (BlueprintSlot & { originalIndex: number })[];
  dayLabel: string;
  className?: string;
}

export function TimelineView({ slots, dayLabel, className }: TimelineViewProps) {
  // Convert time string to minutes since midnight
  const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Convert minutes to time string
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Get time range for the day (earliest start to latest end)
  const getTimeRange = () => {
    if (slots.length === 0) return { start: 360, end: 1080 }; // Default 6:00 to 18:00
    
    const times = slots.flatMap(slot => [
      timeToMinutes(slot.startTime),
      timeToMinutes(slot.endTime)
    ]).filter(time => time > 0);
    
    if (times.length === 0) return { start: 360, end: 1080 };
    
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    // Add some padding
    return {
      start: Math.max(0, minTime - 60), // 1 hour before earliest
      end: Math.min(1440, maxTime + 60), // 1 hour after latest
    };
  };

  const timeRange = getTimeRange();
  const totalMinutes = timeRange.end - timeRange.start;

  // Generate hour markers
  const hourMarkers = [];
  for (let i = timeRange.start; i <= timeRange.end; i += 60) {
    hourMarkers.push(i);
  }

  if (slots.length === 0) {
    return (
      <div className={cn("border border-gray-200 rounded-lg p-4 bg-gray-50", className)}>
        <div className="text-center text-gray-500">
          <p className="font-medium">{dayLabel}</p>
          <p className="text-sm">No slots scheduled</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border border-gray-200 rounded-lg p-4 bg-white", className)}>
      <h4 className="font-medium text-gray-900 mb-3">{dayLabel} Timeline</h4>
      
      {/* Hour markers */}
      <div className="relative mb-2">
        <div className="flex justify-between text-xs text-gray-500">
          {hourMarkers.map(minutes => (
            <span key={minutes} className="text-center">
              {minutesToTime(minutes)}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative h-16 bg-gray-100 rounded">
        {/* Grid lines */}
        {hourMarkers.map(minutes => {
          const position = ((minutes - timeRange.start) / totalMinutes) * 100;
          return (
            <div
              key={minutes}
              className="absolute top-0 bottom-0 w-px bg-gray-300"
              style={{ left: `${position}%` }}
            />
          );
        })}

        {/* Slots */}
        {slots.map((slot, index) => {
          const startMinutes = timeToMinutes(slot.startTime);
          const endMinutes = timeToMinutes(slot.endTime);
          
          if (startMinutes === 0 || endMinutes === 0 || endMinutes <= startMinutes) {
            return null;
          }

          const left = ((startMinutes - timeRange.start) / totalMinutes) * 100;
          const width = ((endMinutes - startMinutes) / totalMinutes) * 100;

          const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-orange-500',
            'bg-red-500',
            'bg-pink-500'
          ];

          return (
            <div
              key={`${slot.id}-${index}`}
              className={cn(
                "absolute top-2 bottom-2 rounded text-white text-xs flex items-center justify-center font-medium shadow-sm",
                colors[slot.originalIndex % colors.length]
              )}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                minWidth: '80px'
              }}
              title={`Slot ${slot.originalIndex + 1}: ${slot.startTime} - ${slot.endTime}${slot.note ? ` (${slot.note})` : ''}`}
            >
              <span className="truncate px-1">
                #{slot.originalIndex + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Slot details */}
      <div className="mt-3 space-y-1">
        {slots.map((slot, index) => {
          const colors = [
            'text-blue-600',
            'text-green-600',
            'text-purple-600',
            'text-orange-600',
            'text-red-600',
            'text-pink-600'
          ];

          return (
            <div key={`${slot.id}-detail-${index}`} className="text-xs text-gray-600">
              <span className={cn("font-medium", colors[slot.originalIndex % colors.length])}>
                Slot {slot.originalIndex + 1}:
              </span>{" "}
              {slot.startTime} - {slot.endTime}
              {slot.note && (
                <span className="text-gray-500"> • {slot.note}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
