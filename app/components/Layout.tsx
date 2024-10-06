"use client";

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Leaf, DollarSign, ClipboardList, Users, Settings, Truck, HelpCircle } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  const toggleSection = (section: string) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const mainCategoryStyle = (path: string) => `
    flex items-center space-x-3 cursor-pointer
    ${isActive(path) || openSection === path.split('/')[1] ? 'text-black font-bold text-lg' : 'text-gray-700'}
    hover:text-black transition-all duration-200
  `;

  const subCategoryStyle = (path: string) => `
    block ml-8 mt-2 text-sm
    ${isActive(path) ? 'text-black font-semibold' : 'text-gray-600'}
    hover:text-black
  `;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div className="p-4">
          <div className="flex justify-start mb-8">
            <img src="/favicon.ico" alt="Vervana Logo" className="w-8 h-8" />
          </div>
          <nav className="space-y-4">
            <Link href="/dashboard" className={mainCategoryStyle('/dashboard')} onClick={() => setOpenSection(null)}>
              <BarChart className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <div>
              <Link
                href="/cultivation"
                className={mainCategoryStyle('/cultivation')}
                onClick={() => setOpenSection(openSection === 'cultivation' ? null : 'cultivation')}
              >
                <Leaf className="w-5 h-5" />
                <span>Cultivation</span>
              </Link>
              {openSection === 'cultivation' && (
                <div className="mt-2 space-y-2">
                  <Link href="/cultivation/room101" className={subCategoryStyle('/cultivation/room101')}>Room 101</Link>
                  <Link href="/cultivation/room102" className={subCategoryStyle('/cultivation/room102')}>Room 102</Link>
                  <Link href="/cultivation/room103" className={subCategoryStyle('/cultivation/room103')}>Room 103</Link>
                </div>
              )}
            </div>
            <div>
              <Link
                href="/processing"
                className={mainCategoryStyle('/processing')}
                onClick={() => setOpenSection(openSection === 'processing' ? null : 'processing')}
              >
                <ClipboardList className="w-5 h-5" />
                <span>Processing</span>
              </Link>
              {openSection === 'processing' && (
                <div className="mt-2 space-y-2">
                  <Link href="/processing/drying" className={subCategoryStyle('/processing/drying')}>Drying Room</Link>
                  <Link href="/processing/curing" className={subCategoryStyle('/processing/curing')}>Curing Room</Link>
                </div>
              )}
            </div>
            <div>
              <Link
                href="/staff"
                className={mainCategoryStyle('/staff')}
                onClick={() => setOpenSection(openSection === 'staff' ? null : 'staff')}
              >
                <Users className="w-5 h-5" />
                <span>Staff</span>
              </Link>
              {openSection === 'staff' && (
                <div className="mt-2 space-y-2">
                  <Link href="/staff/roles" className={subCategoryStyle('/staff/roles')}>Roles</Link>
                  <Link href="/staff/schedule" className={subCategoryStyle('/staff/schedule')}>Schedule</Link>
                </div>
              )}
            </div>
            <Link href="/financials" className={mainCategoryStyle('/financials')} onClick={() => setOpenSection(null)}>
              <DollarSign className="w-5 h-5" />
              <span>Financials</span>
            </Link>
            <Link href="/logistics" className={mainCategoryStyle('/logistics')} onClick={() => setOpenSection(null)}>
              <Truck className="w-5 h-5" />
              <span>Logistics</span>
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <Link href="/profile">
            <div className="flex items-center cursor-pointer">
              <img src="/images/avatar.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
            </div>
          </Link>
          <Link href="/help" className="text-gray-700 hover:text-black">
            <HelpCircle className="w-5 h-5" />
          </Link>
          <Link href="/settings" className="text-gray-700 hover:text-black">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;