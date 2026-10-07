import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export const DashboardLayout = ({ menuConfig }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Topbar Header */}
      <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Layout Area */}
      <div className="flex flex-1">
        {/* Desktop Sidebar / Mobile Drawer */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          menuConfig={menuConfig}
        />

        {/* Dynamic Route Content with mobile bottom nav clearance */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav menuConfig={menuConfig} />
    </div>
  );
};

export default DashboardLayout;
