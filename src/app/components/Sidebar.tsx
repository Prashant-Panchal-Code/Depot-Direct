'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', icon: '📊', label: 'Dashboard' },
    { href: '/schedule', icon: '📅', label: 'Schedule' },
    { href: '/trucks', icon: '🚛', label: 'Trucks' },
    { href: '/depot', icon: '🏭', label: 'Depot' },
    { href: '/sites', icon: '📍', label: 'Sites' },
    { href: '/parking', icon: '🅿️', label: 'Parking' },
    { href: '/reports', icon: '📊', label: 'Reports' },
    { href: '/data-management', icon: '💾', label: 'Data Management' },
    { href: '/users', icon: '👥', label: 'Users' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between z-10 shadow-sm">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-blue-500">Depot Direct</h1>
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                pathname === item.href
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3 p-4 border-t border-gray-200">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700">AU</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Admin User</p>
          <a className="text-sm text-gray-500 hover:text-blue-500" href="#">Sign Out</a>
        </div>
      </div>
    </aside>
  );
}
