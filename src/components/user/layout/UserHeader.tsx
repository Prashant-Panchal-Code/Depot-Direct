'use client';

import { useAppContext } from '@/app/contexts/AppContext';
import { Button } from "@/components/ui/button";
import { useUser, logoutUser } from '@/hooks/useUser';
import { useState, useEffect } from 'react';
import { useRoleBasedContext } from '@/contexts/RoleBasedContext';
import { DataManagerOnly, RegionBasedRoles } from '@/components/shared/RoleBasedComponents';
import RegionSelector from '@/components/shared/RegionSelector';

// Simple role colors - matches the 4 exact roles from .NET API
const getRoleColor = (role: string) => {
  const colors = {
    'Admin': 'bg-red-100 text-red-800',
    'Data Manager': 'bg-blue-100 text-blue-800', 
    'Planner': 'bg-green-100 text-green-800',
    'Viewer': 'bg-gray-100 text-gray-800'
  };
  return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export default function UserHeader() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppContext();
  const { user, loading } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force redirect to login
      window.location.href = '/login';
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

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
          {!loading && user && (
            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
              
              {/* Company Info for Data Managers */}
              <DataManagerOnly>
                {user.companyName && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm font-medium text-blue-700">{user.companyName}</span>
                  </div>
                )}
              </DataManagerOnly>
              
              {/* Region Selector and Country Info for Planner/Viewer */}
              <RegionBasedRoles>
                <div className="flex items-center gap-3">
                  {/* Country Info */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-green-700">
                      USA
                    </span>
                  </div>
                  
                  {/* Region Selector */}
                  <RegionSelector />
                </div>
              </RegionBasedRoles>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  {/* User Initial Circle */}
                  <div className="w-8 h-8 bg-primary-custom text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  
                  {/* User Name */}
                  <span className="font-medium text-gray-700">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                  
                  {/* Dropdown Arrow */}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-gray-900">{user.name || 'User'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.companyName && (
                        <div className="text-xs text-gray-400 mt-1">{user.companyName}</div>
                      )}
                    </div>
                    
                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
