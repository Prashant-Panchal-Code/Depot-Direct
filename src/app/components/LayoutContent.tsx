'use client';

import { usePathname } from "next/navigation";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Root LayoutContent now only handles auth pages and root page
  // Admin pages use (admin)/layout.tsx
  // User pages use (user)/layout.tsx
  
  // All pages get the basic styling, but no header/sidebar
  // Those are handled by the specific (admin) and (user) layouts
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      {children}
    </div>
  );
}
