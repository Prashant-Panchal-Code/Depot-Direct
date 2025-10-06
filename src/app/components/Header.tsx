'use client';

import { useAppContext } from '../contexts/AppContext';
import { Button } from "@/components/ui/button";
import { useUser } from '@/hooks/useUser';

// Simple role styles - matches the 4 exact roles from .NET API
const getRoleStyle = (role: string) => {
  const styles = {
    'Admin': 'bg-red-100 text-red-800 border-red-200',
    'Data Manager': 'bg-blue-100 text-blue-800 border-blue-200',
    'Planner': 'bg-green-100 text-green-800 border-green-200',
    'Viewer': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function Header() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppContext();
  const { user, loading, isAdmin } = useUser();

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

        {/* Right side - User role and info */}
        <div className="flex items-center gap-4">
          {!loading && user && (
            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleStyle(user.role)}`}>
                {user.role}
              </span>
              
              {/* User Name */}
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user.name || user.email?.split('@')[0]}</span>
                {user.companyName && (
                  <div className="text-xs text-gray-500">{user.companyName}</div>
                )}
              </div>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
