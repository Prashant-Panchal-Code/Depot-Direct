'use client';

import Link from 'next/link';

export default function RoleDemoFloatingButton() {
  return (
    <Link href="/role-demo">
      <div className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg cursor-pointer transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎭</span>
          <span className="hidden sm:block font-medium">Role Demo</span>
        </div>
      </div>
    </Link>
  );
}