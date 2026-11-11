"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flame,
  Award,
  Search,
  PenTool,
  ChevronRight,
  GraduationCap,
  Layers,
  FileCheck,
  LogOut,
  ArrowRight,
  Menu,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { TOPICS_DATA } from "@/lib/data/curriculum";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/data/auth-store";
import { signOut } from "next-auth/react";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  onToggleDesktopSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Navbar({
  onToggleMobileMenu,
  onToggleDesktopSidebar,
  isSidebarOpen = true,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, profile, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ xp: 0, streak: 0 });

  const isTeacherRoute = pathname.startsWith("/teacher");

  useEffect(() => {
    if (!isTeacherRoute) {
      fetch("/api/student/progress")
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && data.progress) {
            setStats({
              xp: data.progress.xp ?? 0,
              streak: data.progress.streak?.current ?? 0,
            });
          }
        })
        .catch(() => {});
    }
  }, [isTeacherRoute]);

  const filteredTopics = searchQuery.trim()
    ? TOPICS_DATA.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSignOut = async () => {
    logout();
    try {
      await signOut({ callbackUrl: "/login" });
    } catch {
      router.push("/login");
    }
  };

  return (
    <header className="h-16 border-b border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      {/* Left: Sidebar Toggle (Mobile & Desktop) & Global Search Bar */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              onToggleMobileMenu?.();
            } else {
              onToggleDesktopSidebar?.();
            }
          }}
          className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300 transition flex items-center justify-center shadow-xs group"
          title={isSidebarOpen ? "Close Sidebar (Ctrl+B)" : "Open Sidebar (Ctrl+B)"}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 hidden lg:block text-neutral-700 dark:text-neutral-300 group-hover:scale-105 transition-transform" />
          ) : (
            <PanelLeft className="w-4 h-4 hidden lg:block text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform" />
          )}
          <Menu className="w-4 h-4 lg:hidden text-neutral-700 dark:text-neutral-300" />
        </button>

        <div className="relative w-40 sm:w-64 md:w-80">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search syllabus topics, models, metrics..."
              className="w-full bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchOpen && searchQuery.trim() && (
            <div className="absolute left-0 mt-2 w-72 sm:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Matching Syllabus Topics ({filteredTopics.length})
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/student/learn/${topic.unitNumber}/${topic.slug}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition group"
                    >
                      <div>
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white">
                          {topic.title}
                        </span>
                        <span className="block text-[11px] text-neutral-400 font-mono">
                          Unit {topic.unitNumber} • {topic.examWeightage}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-400">
                    No matching curriculum topics found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Engagement & Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {!isTeacherRoute && (
          <>
            <div
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-semibold"
              title={`Daily Study Streak: ${stats.streak} Days`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-mono">{stats.streak}d</span>
            </div>

            <div
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold"
              title="Total Knowledge Points"
            >
              <Award className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span className="font-mono">{stats.xp} XP</span>
            </div>
          </>
        )}



        <ThemeToggle />

        <button
          onClick={handleSignOut}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-xs font-medium transition flex items-center space-x-1.5"
          title="Sign Out or Switch Academic Persona"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
