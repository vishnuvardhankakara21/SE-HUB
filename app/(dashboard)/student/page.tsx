"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  GraduationCap,
  PenTool,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  Flame,
  Award,
  ArrowRight,
  Layers,
  ChevronRight,
  Cpu,
  Compass,
} from "lucide-react";
import { UNITS_DATA } from "@/lib/data/curriculum";
import { INITIAL_ANNOUNCEMENTS } from "@/lib/data/faculty-store";

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [stats, setStats] = useState({
    xp: 0,
    streakDays: 0,
    quizAttempts: 0,
    bookmarkCount: 0,
  });

  useEffect(() => {
    async function loadStudentData() {
      try {
        const [progRes, annRes] = await Promise.all([
          fetch("/api/student/progress").then((r) => r.json()).catch(() => null),
          fetch("/api/announcements").then((r) => r.json()).catch(() => null),
        ]);

        if (progRes?.success && progRes.progress) {
          setStats({
            xp: progRes.progress.xp ?? 0,
            streakDays: progRes.progress.streak?.current ?? 0,
            quizAttempts: progRes.progress.quizAttempts ?? 0,
            bookmarkCount: progRes.progress.bookmarkCount ?? 0,
          });
        }

        if (annRes?.success && Array.isArray(annRes.announcements) && annRes.announcements.length > 0) {
          setAnnouncements(annRes.announcements);
        }
      } catch {
        // Fallback maintained
      }
    }
    loadStudentData();
  }, []);

  const studentName = session?.user?.name || "Student";

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* HERO ACADEMIC WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 p-6 sm:p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-700 font-mono">
              <Cpu className="w-3.5 h-3.5 text-neutral-300" />
              <span>ANITS CSE • Software Engineering</span>
            </span>
            {session?.user?.rollNumber && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30 font-mono">
                <span>Roll: {session.user.rollNumber}</span>
              </span>
            )}
            {session?.user?.className && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-700 font-mono">
                <span>{session.user.className} {session?.user?.section ? `• ${session.user.section}` : ""}</span>
              </span>
            )}
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>79 Exam Questions Ready</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Welcome back, {studentName}.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl font-normal">
            Your college syllabus-aligned Software Engineering workspace. Master all 5 units, review verbatim 6-mark examination model answers, and architect UML diagrams in the embedded diagrams.net studio.
          </p>

          {/* Quick Action Navigation */}
          <div className="pt-2">
            <Link
              href="/student/exam-prep"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Study 79 Exam Q&As</span>
            </Link>
          </div>
        </div>

        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-neutral-700/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* GAMIFICATION & ACADEMIC TELEMETRY ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center space-x-3.5 glow-card">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-mono">
              {stats.streakDays} {stats.streakDays === 1 ? "Day" : "Days"}
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">
              Active Study Streak
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center space-x-3.5 glow-card">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-mono">
              {stats.xp} XP
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">
              Verified Knowledge Points
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center space-x-3.5 glow-card">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-mono">
              79 Q&As
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">
              Verbatim 6-Mark Answers
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex items-center space-x-3.5 glow-card">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-mono">
              16 Figs
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">
              UML Architecture Models
            </div>
          </div>
        </div>
      </div>

      {/* FACULTY DIRECTIVES & ANNOUNCEMENTS BANNER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">
              Department Notice Board
            </h3>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            Latest Official Directives
          </span>
        </div>

        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 2).map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-2 relative glow-card"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      ann.priority === "exam"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60"
                    }`}
                  >
                    {ann.priority === "exam" ? "Exam Directive" : "Department Notice"}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">{ann.date}</span>
                </div>

                <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                  {ann.title}
                </h4>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {ann.content}
                </p>

                <div className="pt-2 text-[10px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 font-mono">
                  {ann.author} ({ann.authorRole})
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-1">
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Department Notice Board
            </p>
            <p className="text-[11px] text-neutral-400">
              No active departmental notices posted yet. Official course notices broadcasted by verified faculty members will appear here in real time.
            </p>
          </div>
        )}
      </div>

      {/* 5-UNIT CURRICULUM OVERVIEW CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              5-Unit Software Engineering Curriculum
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Structured according to the college syllabus with integrated theory, 6-mark exam answers, and reference diagrams.
            </p>
          </div>
          <Link
            href="/student/learn"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:underline flex items-center gap-1"
          >
            <span>View All Topics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UNITS_DATA.map((unit) => (
            <div
              key={unit.unitNumber}
              className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between space-y-4 glow-card group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    Unit 0{unit.unitNumber} • {unit.periods} Periods
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-neutral-400">
                    Syllabus Verified
                  </span>
                </div>

                <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition leading-snug">
                  {unit.title}
                </h4>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {unit.description}
                </p>
              </div>

              {/* Action Links */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                <Link
                  href={`/student/exam-prep?unit=${unit.unitNumber}`}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>6-Mark Q&As</span>
                </Link>

                <Link
                  href={`/student/quizzes?unit=${unit.unitNumber}`}
                  className="font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Practice Quiz</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 16 REFERENCE ARCHITECTURE DIAGRAMS CALLOUT */}
      <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
            <span>Embedded Diagrams.net Studio Active</span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-white">
            16 High-Resolution UML Reference Architectures
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed font-normal">
            Inspect Activity, Statechart, Component, and Deployment diagrams for Library, LMS, University, and Banking systems. Open and clone directly into your drawing studio.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Link
            href="/student/diagrams"
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition"
          >
            Browse Gallery
          </Link>
          <Link
            href="/student/diagrams/studio"
            className="px-4 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-bold shadow-md transition"
          >
            Launch Studio →
          </Link>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
