'use client';

import { useAppContext } from "../contexts/AppContext";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed: _sidebarCollapsed } = useAppContext();
  const pathname = usePathname();
  
  // Don't show header/sidebar on login, unauthorized pages
  const isAuthPage = pathname === '/login' || pathname === '/unauthorized';
  
  if (isAuthPage) {
    return (
      <div className="bg-gray-50 text-gray-900 min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        {children}
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Header />
      <Sidebar />
      <main >
        {children}
      </main>
    </div>
  );
}
