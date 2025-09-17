'use client';

import { useAppContext } from '@/app/contexts/AppContext';
import { Button } from "@/components/ui/button";
import { useUser } from '@/hooks/useUser';

export default function UserHeader() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppContext();
  const { user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-3 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        {/* Left side - Logo and Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold text-primary-custom">Depot Direct</h1>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
              User Mode
            </span>
          </div>
          {user && (
            <div className="text-sm text-gray-600">
              Welcome, {user.name || user.email}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
