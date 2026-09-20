import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 md:ml-[240px] pb-[calc(84px+env(safe-area-inset-bottom,0px))] md:pb-0">
        <Topbar />
        <main className="p-[4px_16px_40px] md:p-[8px_28px_56px] max-w-[1240px]">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
