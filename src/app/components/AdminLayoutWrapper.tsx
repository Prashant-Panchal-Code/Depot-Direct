'use client';

import { useAppContext } from '../contexts/AppContext';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const { sidebarCollapsed } = useAppContext();

  return (
    <main className={`pt-24 h-screen bg-gray-50 text-gray-900 overflow-hidden transition-all duration-300 ${
      sidebarCollapsed ? 'ml-16' : 'ml-64'
    }`}>
      <div className="p-2 h-full overflow-y-auto">
        {children}
      </div>
    </main>
  );
}
