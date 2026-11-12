"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Bell,
  CheckCheck,
  Megaphone,
} from "lucide-react";
import { TOPICS_DATA } from "@/lib/data/curriculum";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/data/auth-store";
import { signOut, useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ xp: 0, streak: 0 });

  interface AnnouncementItem {
    id: string;
    title: string;
    content: string;
    priority: "exam" | "urgent" | "normal";
    author: string;
    authorRole: string;
    date: string;
    unitTag?: number;
  }

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<string[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchAnnouncements = () => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("se_read_announcements");
      if (stored) {
        setReadAnnouncementIds(JSON.parse(stored));
      }
    } catch {}

    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 25000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const unreadAnnouncements = announcements.filter(
    (a) => !readAnnouncementIds.includes(a.id)
  );
  const unreadCount = unreadAnnouncements.length;

  const markAllAsRead = () => {
    const allIds = announcements.map((a) => a.id);
    setReadAnnouncementIds(allIds);
    try {
      localStorage.setItem("se_read_announcements", JSON.stringify(allIds));
    } catch {}
  };

  const markOneAsRead = (id: string) => {
    if (!readAnnouncementIds.includes(id)) {
      const updated = [...readAnnouncementIds, id];
      setReadAnnouncementIds(updated);
      try {
        localStorage.setItem("se_read_announcements", JSON.stringify(updated));
      } catch {}
    }
  };

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



        {/* Notifications Bell Dropdown (Faculty Directives & Broadcast Alerts) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300 transition flex items-center justify-center shadow-xs"
            title={
              unreadCount > 0
                ? `${unreadCount} new faculty directive${unreadCount > 1 ? "s" : ""}`
                : "Faculty Directives & Department Notifications"
            }
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-rose-600 text-[9px] font-extrabold text-white font-mono shadow-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Dropdown Header */}
              <div className="px-4 py-3 bg-neutral-50/90 dark:bg-neutral-950/80 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Faculty Directives
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-mono">
                      {unreadCount > 0
                        ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}`
                        : "All notices acknowledged"}
                    </p>
                  </div>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Directives Body List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {announcements.length > 0 ? (
                  announcements.map((ann) => {
                    const isUnread = !readAnnouncementIds.includes(ann.id);
                    return (
                      <div
                        key={ann.id}
                        onClick={() => markOneAsRead(ann.id)}
                        className={`p-4 transition cursor-pointer ${
                          isUnread
                            ? "bg-amber-500/[0.04] dark:bg-amber-500/[0.06] hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                            : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50 opacity-80"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono tracking-wider ${
                                ann.priority === "exam"
                                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/60"
                                  : ann.priority === "urgent"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/60"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200/60"
                              }`}
                            >
                              {ann.priority === "exam"
                                ? "Exam Directive"
                                : ann.priority === "urgent"
                                ? "Urgent Alert"
                                : "Department Notice"}
                            </span>
                            {ann.unitTag && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                                Unit 0{ann.unitTag}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1.5 text-[10px] text-neutral-400 font-mono shrink-0">
                            <span>{ann.date}</span>
                            {isUnread && (
                              <span
                                className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-neutral-900"
                                title="Unread Directive"
                              />
                            )}
                          </div>
                        </div>

                        <h5 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug">
                          {ann.title}
                        </h5>

                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                          {ann.content}
                        </p>

                        <div className="mt-2 text-[10px] text-neutral-400 font-mono flex items-center justify-between">
                          <span>
                            From: {ann.author} ({ann.authorRole})
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-neutral-400 space-y-1">
                    <Bell className="w-6 h-6 mx-auto opacity-40 text-neutral-400" />
                    <p className="font-semibold text-neutral-600 dark:text-neutral-300">
                      No Active Directives
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Faculty broadcasts and examination alerts will appear here.
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2.5 bg-neutral-50/80 dark:bg-neutral-950/60 border-t border-neutral-200/80 dark:border-neutral-800 text-center text-[10px] text-neutral-400 font-mono">
                Synchronized with ANITS Autonomous Examination Broadcasts
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />

        <Link
          href={isTeacherRoute ? "/teacher" : "/student/profile"}
          className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center text-xs font-bold shadow-xs hover:ring-2 hover:ring-emerald-500/30 transition shrink-0"
          title="View Student Profile"
        >
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>
              {session?.user?.name
                ?.split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0].toUpperCase())
                .join("") || (isTeacherRoute ? "FA" : "ST")}
            </span>
          )}
        </Link>

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
