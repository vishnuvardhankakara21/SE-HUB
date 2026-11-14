"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  PenTool,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  Bookmark,
  Layers,
  LayoutDashboard,
  FileCheck,
  FolderOpen,
  Users,
  ArrowRight,
  LogOut,
  X,
  Cpu,
  Bell,
  PanelLeftClose,
  PanelLeft,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/data/auth-store";
import { signOut, useSession } from "next-auth/react";

interface SidebarProps {
  currentRole?: "student" | "teacher";
  onCloseMobile?: () => void;
  onToggleDesktopSidebar?: () => void;
  isMobile?: boolean;
  isSidebarOpen?: boolean;
}

interface SidebarLink {
  title: string;
  href: string;
  icon: any;
  exact?: boolean;
}

export function Sidebar({
  currentRole,
  onCloseMobile,
  onToggleDesktopSidebar,
  isMobile,
  isSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { data: session } = useSession();

  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateHash = () => setCurrentHash(window.location.hash || "");
      updateHash();
      window.addEventListener("hashchange", updateHash);
      return () => window.removeEventListener("hashchange", updateHash);
    }
  }, []);

  const isTeacherRoute = pathname.startsWith("/teacher");
  const isStudentRoute = !isTeacherRoute;

  const userName = session?.user?.name || (isTeacherRoute ? "Faculty Member" : "Student");
  const userInitials =
    userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("") || (isTeacherRoute ? "FA" : "ST");

  const userSubtitle = session?.user?.email || (isTeacherRoute ? "Faculty Portal" : "Student Portal");

  // Navigation Links strictly for students (Profile section at the very last)
  const studentLinks: SidebarLink[] = [
    {
      title: "Syllabus Roadmap",
      href: "/student/syllabus",
      icon: Layers,
    },
    {
      title: "5-Unit Theory Notes",
      href: "/student/learn",
      icon: BookOpen,
    },
    {
      title: "Exam Bank (6-Marks)",
      href: "/student/exam-prep",
      icon: GraduationCap,
    },
    {
      title: "16 Reference Diagrams",
      href: "/student/diagrams",
      icon: ImageIcon,
    },
    {
      title: "Drawing Studio",
      href: "/student/diagrams/studio",
      icon: PenTool,
    },
    {
      title: "AI Doubt Assistant",
      href: "/student/ai-assistant",
      icon: Cpu,
    },
    {
      title: "My Saved Diagrams",
      href: "/student/diagrams/my-diagrams",
      icon: Layers,
    },
    {
      title: "Quizzes & MCQs",
      href: "/student/quizzes",
      icon: CheckCircle2,
    },
    {
      title: "Previous Papers",
      href: "/student/previous-papers",
      icon: FileText,
    },
    {
      title: "Saved Bookmarks",
      href: "/student/bookmarks",
      icon: Bookmark,
    },
    {
      title: "My Profile & Progress",
      href: "/student/profile",
      icon: User,
    },
  ];

  // Navigation Links strictly for teachers (clean without badge clutter)
  const teacherLinks: SidebarLink[] = [
    {
      title: "Faculty Studio",
      href: "/teacher",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Student Roster & Stats",
      href: "/teacher#students-section",
      icon: Users,
    },
    {
      title: "Course Materials Vault",
      href: "/teacher#materials-section",
      icon: FolderOpen,
    },
    {
      title: "Question Bank Audit",
      href: "/teacher#questions-section",
      icon: GraduationCap,
    },
    {
      title: "ANITS Previous Papers",
      href: "/teacher#papers-section",
      icon: FileText,
    },
    {
      title: "Broadcast Directives",
      href: "/teacher#announcements-section",
      icon: Bell,
    },
  ];

  const handleSignOut = async () => {
    logout();
    try {
      await signOut({ callbackUrl: "/login" });
    } catch {
      router.push("/login");
    }
  };

  const handleNavClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={cn(
        "border-r border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 shrink-0 transition-colors duration-200 z-20",
        isMobile ? "w-full" : "w-64"
      )}
    >
      <div className="flex flex-col min-h-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-200/70 dark:border-neutral-800/80">
          <Link
            href={isTeacherRoute ? "/teacher" : "/student"}
            onClick={handleNavClick}
            className="flex items-center space-x-2.5"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm transition-all duration-300 font-bold",
                isTeacherRoute ? "bg-amber-600 shadow-amber-600/20" : "bg-neutral-900 dark:bg-white dark:text-neutral-950"
              )}
            >
              {isTeacherRoute ? <FileCheck className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Software Eng.
              </span>
              <span
                className={cn(
                  "block text-[10px] uppercase font-bold tracking-wider font-mono",
                  isTeacherRoute ? "text-amber-600 dark:text-amber-400" : "text-neutral-500 dark:text-neutral-400"
                )}
              >
                {isTeacherRoute ? "Faculty Studio" : "Student Hub"}
              </span>
            </div>
          </Link>

          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {!isMobile && onToggleDesktopSidebar && (
            <button
              onClick={onToggleDesktopSidebar}
              className="p-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition shadow-xs"
              title="Close Sidebar (Ctrl+B)"
              aria-label="Close Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="p-3 space-y-4 overflow-y-auto flex-1">
          {/* STUDENT WORKSPACE */}
          {isStudentRoute && (
            <div>
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                  Curriculum Modules
                </span>
              </div>
              <nav className="space-y-1">
                {studentLinks.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                        isActive
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold shadow-xs"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/60"
                      )}
                    >
                      <div className="flex items-center space-x-2.5">
                        <item.icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive
                              ? "text-white dark:text-neutral-950"
                              : "text-neutral-400 group-hover:text-neutral-700 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                          )}
                        />
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* TEACHER WORKSPACE */}
          {isTeacherRoute && (
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                  Faculty Controls
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">CSE Portal</span>
              </div>
              <nav className="space-y-1">
                {teacherLinks.map((item) => {
                  const targetHash = item.href.includes("#") ? `#${item.href.split("#")[1]}` : "";
                  const isActive = targetHash
                    ? currentHash === targetHash
                    : (!currentHash || currentHash === "#students-section");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all",
                        isActive
                          ? "bg-amber-600 text-white font-bold shadow-xs"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/60"
                      )}
                    >
                      <div className="flex items-center space-x-2.5">
                        <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-amber-500")} />
                        <span>{item.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Footer Profile Preview */}
      <div className="p-3 border-t border-neutral-200/70 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-2">
        <Link
          href={isTeacherRoute ? "/teacher" : "/student/profile"}
          onClick={handleNavClick}
          className="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition group"
          title="View Student Profile"
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0 overflow-hidden",
              isTeacherRoute ? "bg-amber-600" : "bg-neutral-900 dark:bg-white dark:text-neutral-900"
            )}
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{userInitials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-bold text-neutral-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {userName}
            </span>
            <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 truncate font-mono">
              {userSubtitle}
            </span>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white text-[11px] font-semibold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
