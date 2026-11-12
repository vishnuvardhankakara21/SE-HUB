"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Hash,
  Building,
  GraduationCap,
  Calendar,
  Camera,
  CheckCircle2,
  Award,
  Flame,
  Bookmark,
  Layers,
  BookOpen,
  ArrowRight,
  Edit3,
  X,
  Check,
  Cpu,
  PenTool,
  HelpCircle,
  ShieldCheck,
  Upload,
  Bell,
  AlertCircle,
  Megaphone,
} from "lucide-react";
import { UNITS_DATA } from "@/lib/data/curriculum";

interface UnitProgressItem {
  unitNumber: number;
  attempts: number;
  bestScore: number | null;
  bookmarksCount: number;
  progress: number;
}

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  rollNumber: string;
  className: string;
  section: string;
  department: string;
  avatarUrl: string;
  xp: number;
  levelName?: string;
  nextLevelXp?: number;
  overallProgress?: number;
  unitProgress?: UnitProgressItem[];
  streak: { current: number; longest: number };
  badges: Array<{ badgeId: string; awardedAt: string }>;
  createdAt: string | null;
  stats: {
    quizAttempts: number;
    bookmarkCount: number;
    diagramCount: number;
  };
}

export function StudentProfileView() {
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editClassName, setEditClassName] = useState("III/IV B.Tech");
  const [editSection, setEditSection] = useState("Section A");

  // Faculty announcements & directives
  const [facultyDirectives, setFacultyDirectives] = useState<any[]>([]);
  const [dismissedDirectives, setDismissedDirectives] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("se_dismissed_directives");
      if (saved) {
        setDismissedDirectives(JSON.parse(saved));
      }
    } catch {}

    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.announcements)) {
          setFacultyDirectives(data.announcements);
        }
      })
      .catch(() => {});
  }, []);

  const handleDismissDirective = (id: string) => {
    const updated = [...dismissedDirectives, id];
    setDismissedDirectives(updated);
    try {
      localStorage.setItem("se_dismissed_directives", JSON.stringify(updated));
    } catch {}
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/student/profile");
        const data = await res.json();
        if (data?.success && data.profile) {
          setProfile(data.profile);
          setEditName(data.profile.name || "");
          setEditClassName(data.profile.className || "III/IV B.Tech");
          setEditSection(data.profile.section || "Section A");
        } else {
          // Fallback to real defaults (0s)
          const fallback: ProfileData = {
            id: session?.user?.id || "student-id",
            name: session?.user?.name || "Student",
            email: session?.user?.email || "student@anits.edu.in",
            role: "student",
            rollNumber: session?.user?.rollNumber || "",
            className: session?.user?.className || "III/IV B.Tech",
            section: session?.user?.section || "Section A",
            department: "Computer Science & Engineering",
            avatarUrl: session?.user?.image || "",
            xp: 0,
            levelName: "Level 1 • Student Explorer",
            nextLevelXp: 100,
            overallProgress: 0,
            unitProgress: [1, 2, 3, 4, 5].map((u) => ({
              unitNumber: u,
              attempts: 0,
              bestScore: null,
              bookmarksCount: 0,
              progress: 0,
            })),
            streak: { current: 0, longest: 0 },
            badges: [],
            createdAt: null,
            stats: {
              quizAttempts: 0,
              bookmarkCount: 0,
              diagramCount: 0,
            },
          };
          setProfile(fallback);
          setEditName(fallback.name);
          setEditClassName(fallback.className);
          setEditSection(fallback.section);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [session]);

  // Handle Photo Browse & Canvas Compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("File size exceeds 8MB. Please choose a smaller photo.");
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 320;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);

          // Optimistically update
          setProfile((prev) => (prev ? { ...prev, avatarUrl: compressedDataUrl } : prev));

          // Save to database
          try {
            await fetch("/api/student/profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ avatarUrl: compressedDataUrl }),
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          } catch {
            setErrorMsg("Could not save photo to server. It is displayed locally.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Remove Photo
  const handleRemovePhoto = async () => {
    setProfile((prev) => (prev ? { ...prev, avatarUrl: "" } : prev));
    try {
      await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: "" }),
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      // Ignore
    }
  };

  // Save Name, Class, Section
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          className: editClassName,
          section: editSection,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Failed to update profile.");
        setIsSaving(false);
        return;
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              name: editName.trim(),
              className: editClassName,
              section: editSection,
            }
          : prev
      );

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setErrorMsg("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = profile?.name || session?.user?.name || "Student";
  const userInitials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("") || "ST";

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-5xl mx-auto">
      {/* Toast notifications */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <X className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FACULTY DIRECTIVES & BROADCAST ALERTS (STUDENT NOTIFICATIONS) */}
      {facultyDirectives.filter((d) => !dismissedDirectives.includes(d.id)).length > 0 && (
        <div className="space-y-3">
          {facultyDirectives
            .filter((d) => !dismissedDirectives.includes(d.id))
            .map((directive) => (
              <div
                key={directive.id}
                className={`p-4 sm:p-5 rounded-3xl border shadow-sm transition animate-in fade-in slide-in-from-top-2 duration-200 ${
                  directive.priority === "exam"
                    ? "bg-rose-500/[0.07] border-rose-500/30 text-rose-950 dark:text-rose-100"
                    : directive.priority === "urgent"
                    ? "bg-amber-500/[0.07] border-amber-500/30 text-amber-950 dark:text-amber-100"
                    : "bg-blue-500/[0.07] border-blue-500/30 text-slate-900 dark:text-slate-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-2xl shrink-0 mt-0.5 ${
                        directive.priority === "exam"
                          ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                          : directive.priority === "urgent"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono tracking-wider ${
                            directive.priority === "exam"
                              ? "bg-rose-600 text-white"
                              : directive.priority === "urgent"
                              ? "bg-amber-600 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {directive.priority === "exam"
                            ? "Official Exam Directive"
                            : directive.priority === "urgent"
                            ? "Urgent Alert"
                            : "Faculty Notice"}
                        </span>
                        {directive.unitTag && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                            Unit 0{directive.unitTag}
                          </span>
                        )}
                        <span className="text-[11px] opacity-70 font-mono">
                          Posted {directive.date}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-0.5">
                        {directive.title}
                      </h4>

                      <p className="text-xs opacity-90 leading-relaxed max-w-3xl">
                        {directive.content}
                      </p>

                      <div className="text-[11px] opacity-70 font-mono pt-1">
                        Faculty: {directive.author} ({directive.authorRole})
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDismissDirective(directive.id)}
                    className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold shrink-0 self-start transition flex items-center space-x-1.5"
                    title="Acknowledge directive"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 1. STUDENT HERO PROFILE CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 md:p-10 shadow-lg">
        {/* Background gradient banner */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 opacity-90" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-10">
          {/* Avatar and Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar Circle with Browse button */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-neutral-900 shadow-xl overflow-hidden bg-neutral-900 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shrink-0">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userInitials}</span>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {/* Quick browse icon on hover */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold"
                title="Browse and Upload Photo"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Upload</span>
              </button>
            </div>

            {/* Student Name & Badges */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Verified ANITS Student</span>
                </span>
                {profile?.rollNumber && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold border border-neutral-200 dark:border-neutral-700 font-mono">
                    <Hash className="w-3 h-3 text-neutral-400" />
                    <span>Roll: {profile.rollNumber}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                {displayName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="inline-flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{profile?.email || session?.user?.email}</span>
                </span>
                <span>•</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {profile?.className || "III/IV B.Tech"} • {profile?.section || "Section A"}
                </span>
                <span>•</span>
                <span>CSE Department</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Browse Photo & Edit Profile */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Browse Photo</span>
            </button>

            {profile?.avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition"
                title="Remove custom photo"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-bold text-white dark:text-neutral-900 transition shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? "Close Edit" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* INLINE EDIT DETAILS FORM */}
        {isEditing && (
          <form
            onSubmit={handleSaveDetails}
            className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4 animate-in fade-in"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider font-mono text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider font-mono text-neutral-700 dark:text-neutral-300 mb-1">
                  Class / Year
                </label>
                <select
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="II/IV B.Tech">II/IV B.Tech</option>
                  <option value="III/IV B.Tech">III/IV B.Tech</option>
                  <option value="IV/IV B.Tech">IV/IV B.Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider font-mono text-neutral-700 dark:text-neutral-300 mb-1">
                  Section
                </label>
                <select
                  value={editSection}
                  onChange={(e) => setEditSection(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. ACADEMIC LEARNING PROGRESS & STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Total XP */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400">
              Academic XP
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {profile?.xp ?? 0}{" "}
            <span className="text-xs font-normal text-neutral-400">XP</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
            {profile?.levelName || "Level 1 • Student Explorer"}
          </span>
        </div>

        {/* Metric 2: Study Streak */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400">
              Active Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {profile?.streak?.current ?? 0}{" "}
            <span className="text-sm font-normal text-neutral-400">Days</span>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium block">
            Record: {profile?.streak?.longest ?? 0} Days
          </span>
        </div>

        {/* Metric 3: Quizzes Taken */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400">
              Quizzes Taken
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {profile?.stats?.quizAttempts ?? 0}
          </div>
          <Link
            href="/student/quizzes"
            className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center space-x-1"
          >
            <span>Take Unit Quiz</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Metric 4: Bookmarks & Diagrams */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-neutral-400">
              Saved Assets
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {profile?.stats?.bookmarkCount ?? 0}
          </div>
          <Link
            href="/student/bookmarks"
            className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center space-x-1"
          >
            <span>View Bookmarks</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 3. FIVE-UNIT CURRICULUM SYLLABUS PROGRESS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
              Syllabus Curriculum Progress (R20 / 60 Periods)
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              5 College Units covering SDLC models, SRS, UML Architecture, Testing, and COCOMO.
            </p>
          </div>
          <Link
            href="/student/syllabus"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1 self-start sm:self-auto"
          >
            <span>Full Syllabus Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {UNITS_DATA.map((unit) => {
            const uData = profile?.unitProgress?.find(
              (p) => p.unitNumber === unit.unitNumber
            );
            const progress = uData?.progress ?? 0;
            const attempts = uData?.attempts ?? 0;
            const bestScore = uData?.bestScore;

            return (
              <div
                key={unit.unitNumber}
                className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200/70 dark:border-neutral-800/80 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                      Unit 0{unit.unitNumber}
                    </span>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {unit.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-neutral-500">
                    <span>{unit.periods} Periods</span>
                    <span>•</span>
                    <span>
                      {attempts > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Quiz: {bestScore}% ({attempts} att)
                        </span>
                      ) : (
                        <span className="text-neutral-400">Quiz: Not Attempted</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Real Progress:{" "}
                    <strong className="text-neutral-900 dark:text-white font-mono">
                      {progress}%
                    </strong>
                    {uData && uData.bookmarksCount > 0 && (
                      <span className="ml-2 text-neutral-400 font-mono text-[10px]">
                        ({uData.bookmarksCount} bookmarked)
                      </span>
                    )}
                  </span>
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/student/learn/${unit.unitNumber}`}
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Read Notes
                    </Link>
                    <Link
                      href={`/student/exam-prep?unit=${unit.unitNumber}`}
                      className="text-neutral-600 dark:text-neutral-300 font-semibold hover:underline"
                    >
                      6-Mark Q&As
                    </Link>
                    <Link
                      href={`/student/quizzes?unit=${unit.unitNumber}`}
                      className="text-neutral-600 dark:text-neutral-300 font-semibold hover:underline"
                    >
                      Take Quiz
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. INSTITUTIONAL ACCREDITATION & ACADEMIC REPOSITORY FOOTER */}
      <div className="p-6 rounded-3xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-neutral-900 dark:text-white">
              Anil Neerukonda Institute of Technology & Sciences (ANITS)
            </p>
            <p className="text-[11px]">Department of Computer Science & Engineering • Autonomous</p>
          </div>
        </div>

        <div className="text-right font-mono text-[11px]">
          <span>Student ID: {profile?.id?.slice(-8) || "ANITS-SE"}</span>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileView;

