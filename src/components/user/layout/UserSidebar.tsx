'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/app/contexts/AppContext';
import { GasPump, PresentationChart, CalendarDots, TruckTrailer, Warehouse, LetterCircleP, CheckSquareOffset } from "@phosphor-icons/react";

export default function UserSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useAppContext();

  // Regular user menu items
  const userMenuItems = [
    { href: '/dashboard', icon: <PresentationChart size={25} weight="duotone" />, label: 'Dashboard' },
    { href: '/role-demo', icon: '🎭', label: 'Role Demo' },
    { href: '/schedule', icon: <CalendarDots size={25} weight="duotone" />, label: 'Schedule' },
    { href: '/vehicles', icon: <TruckTrailer size={25} weight="duotone" />, label: 'Vehicles' },
    { href: '/depot', icon: <Warehouse size={25} weight="duotone" />, label: 'Depot' },
    { href: '/sites', icon: <GasPump size={25} weight="duotone" />, label: 'Sites' },
    { href: '/parking', icon: <LetterCircleP size={25} weight="duotone" />, label: 'Parking' },
    { href: '/reports', icon: <CheckSquareOffset size={25} weight="duotone" />, label: 'Reports' },
  ];

  return (
    <aside className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 flex flex-col justify-between z-10 shadow-sm transition-all duration-300 ${
      sidebarCollapsed ? 'w-16 px-2' : 'w-64 px-6'
    } py-6`}>
      <div className="flex flex-col gap-8">
        <nav className="flex flex-col gap-2">
          {userMenuItems.map((item) => (
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


    </aside>
  );
}
