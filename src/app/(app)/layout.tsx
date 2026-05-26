"use client";

import AppSidebar from "@/components/AppSidebar";
import BottomNav from "@/components/BottomNav";
import { UserButton } from "@clerk/nextjs";
import { Brain } from "lucide-react";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface">
      {/* Mobile Top Bar */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 bg-surface-container-low border-b border-white/[0.06] z-40 shrink-0 h-14">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-110">
            <Brain className="w-3.5 h-3.5 text-on-primary" />
          </div>
          <span className="font-bold text-on-surface text-base tracking-tight">ScholarAI</span>
        </Link>
        <UserButton
          appearance={{
            elements: { avatarBox: "w-8 h-8" },
          }}
        />
      </header>

      {/* Desktop Sidebar */}
      <AppSidebar className="hidden md:flex" />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col min-h-0 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
