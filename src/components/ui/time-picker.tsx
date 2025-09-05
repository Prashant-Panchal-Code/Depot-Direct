"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export function TimePicker({
  value = "",
  onChange,
  label,
  disabled = false,
  className,
  placeholder = "HH:MM",
  required = false,
}: TimePickerProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    onChange(timeValue);
  };

  // Convert 24-hour format to 12-hour format for display
  const formatTimeForDisplay = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={`time-${label}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id={`time-${label}`}
          type="time"
          value={value}
          onChange={handleTimeChange}
          disabled={disabled}
          placeholder={placeholder}
          className="pr-10"
          required={required}
        />
        {value && (
          <div className="absolute right-3 top-2.5 text-xs text-gray-500 pointer-events-none">
            {formatTimeForDisplay(value)}
          </div>
        )}
      </div>
    </div>
  );
}
