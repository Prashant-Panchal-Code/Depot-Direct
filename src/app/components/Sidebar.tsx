'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../contexts/AppContext';
import { useUser, logoutUser } from '@/hooks/useUser';
import { GasPump,PresentationChart ,CalendarDots, TruckTrailer, Warehouse, LetterCircleP, Users, Kanban, CheckSquareOffset   } from "@phosphor-icons/react";

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

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppContext();
  const { user, loading, isAdmin } = useUser();

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force redirect to login
      window.location.href = '/login';
    }
  };

  // Show loading state if user data is still being fetched
  if (loading && !user) {
    return (
      <aside className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 flex flex-col justify-between z-10 shadow-sm transition-all duration-300 ${
        sidebarCollapsed ? 'w-16 px-2' : 'w-64 px-6'
      } py-6`}>
        <div className="flex flex-col gap-8">
          <nav className="flex flex-col gap-2">
            {/* Loading skeleton */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  // Regular user menu items
  const regularMenuItems = [
    { href: '/dashboard', icon: <PresentationChart size={25} weight="duotone" />, label: 'Dashboard' },
    { href: '/schedule', icon: <CalendarDots size={25} weight="duotone" />, label: 'Schedule' },
    { href: '/vehicles', icon: <TruckTrailer size={25} weight="duotone" />, label: 'Vehicles' },
    { href: '/depot', icon: <Warehouse size={25} weight="duotone" />, label: 'Depot' },
    { href: '/sites', icon: <GasPump size={25} weight="duotone" />, label: 'Sites' },
    { href: '/parking', icon: <LetterCircleP size={25} weight="duotone" />, label: 'Parking' },
    { href: '/reports', icon: <CheckSquareOffset size={25}  weight="duotone" />, label: 'Reports' },
  ];

  // Admin-only menu items (matching the admin layout)
  const adminMenuItems = [
    { href: '/admin', icon: <PresentationChart size={25} weight="duotone" />, label: 'Admin Dashboard' },
    { href: '/org-setup', icon: '🏢', label: 'Org Setup' },
    { href: '/countries', icon: '🌍', label: 'Countries' },
    { href: '/companies', icon: '🏭', label: 'Companies' },
    { href: '/regions', icon: '🗺️', label: 'Regions' },
    { href: '/admin-users', icon: '👥', label: 'Admin Users' },
    { href: '/assignments', icon: '📝', label: 'Assignments' },
    { href: '/import-export', icon: '📤', label: 'Import/Export' },
    { href: '/data-management', icon: <Kanban size={25} weight="duotone" />, label: 'Data Management' },
    { href: '/users', icon: <Users size={25} weight="duotone" />, label: 'Users' },
  ];

  // Show different menus based on user role
  const menuItems = isAdmin ? adminMenuItems : regularMenuItems;

  return (
    <aside className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 flex flex-col justify-between z-10 shadow-sm transition-all duration-300 ${
      sidebarCollapsed ? 'w-16 px-2' : 'w-64 px-6'
    } py-6`}>
      <div className="flex flex-col gap-8">
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-primary-custom text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <span className="text-xl flex-shrink-0">
                  {typeof item.icon === 'string' ? item.icon : item.icon}
                </span>
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
              
              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      <div className={`border-t border-gray-200 pt-4 ${sidebarCollapsed ? 'px-1' : 'px-4'}`}>
        <div className="group relative">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-gray-700">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </p>
                
                {/* Role Badge */}
                {user?.role && (
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                )}
                
                {/* Company Info */}
                {user?.companyName && (
                  <p className="text-xs text-gray-500 truncate mb-1">
                    {user.companyName}
                  </p>
                )}
                
                <button 
                  onClick={handleSignOut}
                  className="text-sm text-gray-500 hover:text-primary-custom cursor-pointer transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
          
          {/* Enhanced Tooltip for collapsed user section */}
          {sidebarCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-48">
              <div>
                <p className="font-medium">{user?.name || user?.email?.split('@')[0] || 'User'}</p>
                {user?.role && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                )}
                {user?.companyName && (
                  <p className="text-xs text-gray-300 mt-1">{user.companyName}</p>
                )}
              </div>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
