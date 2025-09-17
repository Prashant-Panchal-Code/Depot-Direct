'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/app/contexts/AppContext';
import { useUser, logoutUser } from '@/hooks/useUser';
import { PresentationChart, Kanban, Users } from "@phosphor-icons/react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppContext();
  const { user, loading } = useUser();

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

  // Admin-only menu items
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

  return (
    <aside className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 flex flex-col justify-between z-10 shadow-sm transition-all duration-300 ${
      sidebarCollapsed ? 'w-16 px-2' : 'w-64 px-6'
    } py-6`}>
      <div className="flex flex-col gap-8">
        <nav className="flex flex-col gap-2">
          {adminMenuItems.map((item) => (
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

      {/* Bottom section - User info and Sign Out */}
      <div className="border-t border-gray-200 pt-4">
        {user && (
          <div className={`mb-4 ${sidebarCollapsed ? 'text-center' : ''}`}>
            {!sidebarCollapsed ? (
              <div className="text-sm text-gray-600">
                <div className="font-medium text-gray-900">{user.name || 'Admin User'}</div>
                <div className="text-xs">{user.email}</div>
                <div className="text-xs text-red-600 font-medium">Administrator</div>
              </div>
            ) : (
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-red-600 font-bold text-sm">A</span>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <span className="text-xl">🚪</span>
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
