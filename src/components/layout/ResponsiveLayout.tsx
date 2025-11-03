"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import MobileHeader from "./MobileHeader";
import MobileWarning from "./MobileWarning";

interface ResponsiveLayoutProps {
  children: ReactNode;
  title: string;
}

export default function ResponsiveLayout({ children, title }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <MobileHeader title={title} />

      {/* Mobile Warning */}
      <MobileWarning />

      {/* Main Content */}
      <main className="lg:ml-[300px] min-h-screen bg-linear-to-br from-gray-50 to-white pb-20 lg:pb-8">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
