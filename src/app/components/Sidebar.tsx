'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../contexts/AppContext';
import { GasPump,PresentationChart ,CalendarDots, TruckTrailer, Warehouse, LetterCircleP, Users, Kanban, CheckSquareOffset   } from "@phosphor-icons/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppContext();

  const menuItems = [
    { href: '/', icon: <PresentationChart size={25} weight="duotone" />, label: 'Dashboard' },
    { href: '/schedule', icon: <CalendarDots size={25} weight="duotone" />, label: 'Schedule' },
    { href: '/vehicles', icon: <TruckTrailer size={25} weight="duotone" />, label: 'Vehicles' },
    { href: '/depot', icon: <Warehouse size={25} weight="duotone" />, label: 'Depot' },
    { href: '/sites', icon: <GasPump size={25} weight="duotone" />, label: 'Sites' },
    { href: '/parking', icon: <LetterCircleP size={25} weight="duotone" />, label: 'Parking' },
    { href: '/reports', icon: <CheckSquareOffset size={25}  weight="duotone" />, label: 'Reports' },
    { href: '/data-management', icon: <Kanban size={25} weight="duotone" />, label: 'Data Management' },
    { href: '/users', icon: <Users size={25} weight="duotone" />, label: 'Users' },
  ];

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
                <span className="text-xl flex-shrink-0">{item.icon}</span>
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
              <span className="text-sm font-semibold text-gray-700">AU</span>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">Admin User</p>
                <a className="text-sm text-gray-500 hover:text-primary-custom" href="#">Sign Out</a>
              </div>
            )}
          </div>
          
          {/* Tooltip for collapsed user section */}
          {sidebarCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Admin User
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
