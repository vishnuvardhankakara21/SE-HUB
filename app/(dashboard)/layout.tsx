"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load saved sidebar preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("se_sidebar_open");
      if (saved !== null) {
        setIsSidebarOpen(saved === "true");
      }
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("se_sidebar_open", String(next));
      }
      return next;
    });
  }, []);

  // Global Ctrl+B shortcut to open/close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return (
    <div className="flex min-h-screen bg-neutral-50/70 dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 antialiased architect-grid">
      {/* Desktop Toggleable Sidebar */}
      <div
        className={cn(
          "hidden lg:block shrink-0 transition-all duration-300 ease-in-out z-20 sticky top-0 h-screen",
          isSidebarOpen ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full overflow-hidden pointer-events-none"
        )}
      >
        <Sidebar onToggleDesktopSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-neutral-950 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} isMobile />
          </div>
        </div>
      )}

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Navbar
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onToggleDesktopSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
