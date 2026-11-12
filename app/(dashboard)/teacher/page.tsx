"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  Video,
  Plus,
  CheckCircle2,
  Trash2,
  Eye,
  Layers,
  Users,
  TrendingUp,
  FileCheck,
  GraduationCap,
  Bell,
  Search,
  Check,
  Clock,
  Send,
  Award,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FolderOpen,
  X,
  ShieldAlert,
  Loader2,
  Copy,
  Sparkles,
  Download,
  Calendar,
} from "lucide-react";
import {
  FacultyResourceItem,
  AnnouncementItem,
} from "@/lib/data/faculty-store";
import { UNITS_DATA } from "@/lib/data/curriculum";
import { EXAM_QUESTIONS, ExamQuestion } from "@/lib/data/questions";
import { ANITS_PREVIOUS_PAPERS, PreviousPaper } from "@/lib/data/previous-papers-data";
import { useAuth } from "@/lib/data/auth-store";
import { useSession } from "next-auth/react";
import { StudentRosterSection } from "@/components/teacher/StudentRosterSection";
import type { StudentStatsItem } from "@/app/api/teacher/students/route";
import { Card3D } from "@/components/ui/Card3D";

export default function TeacherDashboardPage() {
  const { role, isLoaded, logout } = useAuth();
  const { data: session } = useSession();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"students" | "materials" | "questions" | "papers" | "broadcast">("students");

  // Previous papers state for teacher
  const [selectedPaperFilter, setSelectedPaperFilter] = useState<"all" | "Semester-End Regular" | "Mid-Term 1" | "Mid-Term 2">("all");
  const [expandedTeacherPaperId, setExpandedTeacherPaperId] = useState<string>("anits-r23-sem-end-2025");
  const [paperPreviewImageUrl, setPaperPreviewImageUrl] = useState<string | null>(null);
  const [paperPreviewTitle, setPaperPreviewTitle] = useState<string>("");

  // Students Telemetry State (strictly from DB)
  const [students, setStudents] = useState<StudentStatsItem[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [cohortStats, setCohortStats] = useState({
    totalStudents: 0,
    sections: {} as { [key: string]: number },
    averageCohortXP: 0,
    averageCohortQuizScore: 0,
    totalQuizSubmissions: 0,
  });

  // Resources state (strictly from DB, zero fake prototypes)
  const [resources, setResources] = useState<FacultyResourceItem[]>([]);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<number | "all">("all");
  const [resourceSearch, setResourceSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Resource Form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newUnit, setNewUnit] = useState(1);
  const [newType, setNewType] = useState<"pdf" | "ppt" | "video_link" | "image" | "xml">("pdf");
  const [newUrl, setNewUrl] = useState("");
  const [newSize, setNewSize] = useState("2.5 MB");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Announcements State (strictly from DB)
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [broadcastPriority, setBroadcastPriority] = useState<"exam" | "urgent" | "normal">("exam");
  const [broadcastUnit, setBroadcastUnit] = useState<number>(1);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Question Bank State inside Teacher Portal
  const [questionSearch, setQuestionSearch] = useState("");
  const [selectedQuestionUnit, setSelectedQuestionUnit] = useState<number | "all">("all");
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  // Authentic Telemetry from database
  const [telemetry, setTelemetry] = useState({
    enrolledStudents: 0,
    totalResources: 0,
    quizAttempts: 0,
    averageQuizScore: 0,
    curriculumCoverage: 100,
  });

  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      const res = await fetch("/api/teacher/students");
      const data = await res.json();
      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students);
        if (data.cohortStats) {
          setCohortStats(data.cohortStats);
        }
      }
    } catch {
      // Graceful fallback
    } finally {
      setStudentsLoading(false);
    }
  };

  // Fetch live resources, announcements, analytics, and student roster from database
  useEffect(() => {
    async function loadData() {
      try {
        const [resData, annData, analyticsData, studentsData] = await Promise.all([
          fetch("/api/resources").then((r) => r.json()).catch(() => null),
          fetch("/api/announcements").then((r) => r.json()).catch(() => null),
          fetch("/api/analytics/dashboard").then((r) => r.json()).catch(() => null),
          fetch("/api/teacher/students").then((r) => r.json()).catch(() => null),
        ]);

        if (resData?.success && Array.isArray(resData.resources)) {
          setResources(resData.resources);
        }
        if (annData?.success && Array.isArray(annData.announcements)) {
          setAnnouncements(annData.announcements);
        }
        if (analyticsData?.success && analyticsData.analytics) {
          setTelemetry({
            enrolledStudents: analyticsData.analytics.enrolledStudents || 0,
            totalResources: analyticsData.analytics.totalResources || 0,
            quizAttempts: analyticsData.analytics.quizAttempts || 0,
            averageQuizScore: analyticsData.analytics.averageQuizScore || 0,
            curriculumCoverage: 100,
          });
        }
        if (studentsData?.success && Array.isArray(studentsData.students)) {
          setStudents(studentsData.students);
          if (studentsData.cohortStats) {
            setCohortStats(studentsData.cohortStats);
          }
        }
      } catch {
        // Retain verified real defaults
      }
    }

    loadData();

    // Check URL hash for direct tab linking
    if (typeof window !== "undefined") {
      const applyHash = () => {
        const hash = window.location.hash;
        if (hash === "#students-section") setActiveTab("students");
        else if (hash === "#materials-section") setActiveTab("materials");
        else if (hash === "#questions-section") setActiveTab("questions");
        else if (hash === "#papers-section") setActiveTab("papers");
        else if (hash === "#announcements-section") setActiveTab("broadcast");
      };
      applyHash();
      window.addEventListener("hashchange", applyHash);
      return () => window.removeEventListener("hashchange", applyHash);
    }
  }, []);

  // Handlers for Resources
  const handleTogglePublish = async (id: string) => {
    const current = resources.find((r) => r.id === id);
    const newStatus = current ? !current.isPublished : true;

    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isPublished: newStatus } : r))
    );

    try {
      await fetch("/api/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: newStatus }),
      });
    } catch {
      // Optimistic update retained
    }
  };

  const handleDeleteResource = async (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch(`/api/resources?id=${id}`, { method: "DELETE" });
    } catch {
      // Optimistic update retained
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsUploading(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", newTitle.trim());
        formData.append("description", newDesc.trim());
        formData.append("unitNumber", newUnit.toString());
        formData.append("resourceType", newType);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.resource) {
          setResources([data.resource, ...resources]);
        }
      } else if (newUrl.trim()) {
        const payload = {
          title: newTitle.trim(),
          description: newDesc.trim(),
          unitNumber: newUnit,
          resourceType: newType,
          fileUrl: newUrl.trim(),
          fileSize: newSize,
        };

        const res = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.resource) {
          setResources([data.resource, ...resources]);
        }
      }

      setShowUploadModal(false);
      setNewTitle("");
      setNewDesc("");
      setNewUrl("");
      setSelectedFile(null);
    } catch {
      // Handled gracefully
    } finally {
      setIsUploading(false);
    }
  };

  // Handlers for Announcements
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return;

    const newAnnouncement: AnnouncementItem = {
      id: `a-${Date.now()}`,
      title: broadcastTitle.trim(),
      content: broadcastContent.trim(),
      priority: broadcastPriority,
      author: session?.user?.name || "Faculty Member",
      authorRole: "Dept. of CSE",
      date: "Just now",
      unitTag: broadcastUnit,
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setBroadcastTitle("");
    setBroadcastContent("");
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);

    try {
      await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          priority: newAnnouncement.priority,
          unitTag: broadcastUnit,
        }),
      });
    } catch {
      // Handled gracefully
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch(`/api/announcements?id=${id}`, { method: "DELETE" });
    } catch {
      // Handled gracefully
    }
  };

  const handleCopyQuestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  // Filtered lists
  const filteredResources = resources.filter((r) => {
    const matchesUnit = selectedUnitFilter === "all" || r.unitNumber === selectedUnitFilter;
    const matchesQuery =
      !resourceSearch.trim() ||
      r.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(resourceSearch.toLowerCase());
    return matchesUnit && matchesQuery;
  });

  const filteredQuestions = EXAM_QUESTIONS.filter((q) => {
    const matchesUnit = selectedQuestionUnit === "all" || q.unitNumber === selectedQuestionUnit;
    const matchesQuery =
      !questionSearch.trim() ||
      q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.markingScheme.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.answerMarkdown.toLowerCase().includes(questionSearch.toLowerCase());
    return matchesUnit && matchesQuery;
  });

  // Role Access Barrier: If logged in as student, faculty controls are restricted
  if (isLoaded && role === "student") {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-4 animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Faculty Access Required
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You are currently signed in as a <strong>Student</strong> ({session?.user?.name || "Student"} • {session?.user?.email || "Student Portal"}). Course administration and syllabus material uploads are restricted to authorized university faculty.
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          To manage coursework, please authenticate with your instructor credentials.
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link
            href="/student"
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
          >
            Return to Student Hub
          </Link>
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
          >
            Switch Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* FACULTY PORTAL BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/70 border border-amber-500/30 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>University Faculty Control Studio • ANITS CSE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Software Engineering Academic Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Welcome back, <strong>{session?.user?.name || "Faculty Member"}</strong>. Manage learning materials, audit the 79-question university exam bank, and broadcast departmental directives in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Material</span>
            </button>

            <button
              onClick={() => setActiveTab("broadcast")}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* REAL TELEMETRY & ACADEMIC METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Registered Students */}
        <Card3D maxTilt={7} glowColor="16, 185, 129" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden hover:border-emerald-500/30 transition h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              Verified DB
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {telemetry.enrolledStudents}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Registered Student Accounts
          </div>
          <div className="mt-3 text-[11px] text-neutral-400 font-mono">
            College roll numbers (@anits.edu.in)
          </div>
        </Card3D>

        {/* Metric 2: Quiz Attempts & Average Score */}
        <Card3D maxTilt={7} glowColor="59, 130, 246" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden hover:border-blue-500/30 transition h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Avg: {telemetry.averageQuizScore}%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {telemetry.quizAttempts}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Total Quiz Attempts Evaluated
          </div>
          <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, telemetry.averageQuizScore || (telemetry.quizAttempts > 0 ? 50 : 0))}%` }}
            />
          </div>
        </Card3D>

        {/* Metric 3: Published Course Materials */}
        <Card3D maxTilt={7} glowColor="245, 158, 11" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden hover:border-amber-500/30 transition h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
              {resources.filter((r) => r.isPublished).length} Active
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {resources.length}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Course Materials in Vault
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>{resources.filter((r) => r.resourceType === "pdf").length} PDFs</span>
            <span>•</span>
            <span>{resources.filter((r) => r.resourceType === "ppt").length} PPTs</span>
          </div>
        </Card3D>

        {/* Metric 4: Question Bank Coverage */}
        <Card3D maxTilt={7} glowColor="99, 102, 241" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden hover:border-indigo-500/30 transition h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
              All 5 Units
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            79 Q&As
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Verified 6-Mark Exam Bank
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>U1:20 • U2:12 • U3:19 • U4:15 • U5:13</span>
          </div>
        </Card3D>
      </div>

      {/* WORKSPACE NAVIGATION TABS */}
      <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "students"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Roster & Progress</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold">
            {students.length} Students
          </span>
        </button>

        <button
          onClick={() => setActiveTab("materials")}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "materials"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Course Materials Vault</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
            {resources.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("questions")}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "questions"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Exam Bank Health & Review</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold">
            79 Qs
          </span>
        </button>

        <button
          onClick={() => setActiveTab("papers")}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "papers"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ANITS Previous Papers</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono font-bold">
            3 Papers (R23)
          </span>
        </button>

        <button
          onClick={() => setActiveTab("broadcast")}
          className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "broadcast"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Broadcast Directives</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
            {announcements.length}
          </span>
        </button>
      </div>

      {/* TAB 0: STUDENT ROSTER & INDIVIDUAL PROGRESS */}
      {activeTab === "students" && (
        <StudentRosterSection
          students={students}
          cohortStats={cohortStats}
          isLoading={studentsLoading}
          onRefresh={loadStudents}
        />
      )}

      {/* TAB 1: COURSE MATERIALS VAULT */}
      {activeTab === "materials" && (
        <div className="space-y-6" id="materials-section">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                placeholder="Search resources, lecture notes, slides..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            {/* Unit Filter Pills */}
            <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs text-slate-400 shrink-0 font-medium hidden sm:inline">Unit:</span>
              <button
                onClick={() => setSelectedUnitFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedUnitFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                All
              </button>
              {[1, 2, 3, 4, 5].map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedUnitFilter(u)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedUnitFilter === u
                      ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Unit {u}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Table or Clean Empty State */}
          {filteredResources.length > 0 ? (
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/60 dark:bg-slate-950/40">
                      <th className="py-3.5 px-6">Resource Document & Details</th>
                      <th className="py-3.5 px-4">Unit</th>
                      <th className="py-3.5 px-4">Format</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {filteredResources.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition group"
                      >
                        <td className="py-4 px-6 max-w-md">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.fileSize && (
                              <span className="text-[10px] font-mono text-slate-400 font-normal">
                                ({item.fileSize})
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                            {item.description}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                          Unit 0{item.unitNumber}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded uppercase text-[10px] font-bold font-mono ${
                              item.resourceType === "pdf"
                                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40"
                                : item.resourceType === "ppt"
                                ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/40"
                                : item.resourceType === "video_link"
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/40"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40"
                            }`}
                          >
                            {item.resourceType}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleTogglePublish(item.id)}
                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                              item.isPublished
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                                : "bg-slate-100 text-slate-500 border border-slate-200 dark:border-slate-800"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.isPublished ? "bg-emerald-500" : "bg-slate-400"}`} />
                            <span>{item.isPublished ? "Published" : "Draft"}</span>
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right space-x-1.5">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 inline-block transition"
                            title="Preview Resource Document"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteResource(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 inline-block transition"
                            title="Delete from Vault"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Course Materials Vault is Empty
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                No course documents have been uploaded yet. Click &quot;Upload Material&quot; to publish syllabus handouts, lecture slides (PPT), or reference documents directly for enrolled students.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload First Document</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXAM BANK HEALTH & DIRECT QUESTION AUDIT (NO REDIRECTION) */}
      {activeTab === "questions" && (
        <div className="space-y-6" id="questions-section">
          {/* Top Overview Cards */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-amber-500" />
                  <span>University 6-Mark Exam Bank Browser (79 Questions)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Full faculty question inspection. Review model answers, marking schemes, architectural diagrams, and exam preparation tips directly inside Faculty Studio.
                </p>
              </div>

              <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                In-Portal Audit Mode
              </div>
            </div>

            {/* Units breakdown cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {[
                { unit: 1, count: 20, name: "Process & Agile Models" },
                { unit: 2, count: 12, name: "SRS & DFD Analysis" },
                { unit: 3, count: 19, name: "Architecture & UML" },
                { unit: 4, count: 15, name: "Testing & Diagrams" },
                { unit: 5, count: 13, name: "Metrics & Project Mgmt" },
              ].map((u) => (
                <button
                  key={u.unit}
                  onClick={() => setSelectedQuestionUnit(selectedQuestionUnit === u.unit ? "all" : u.unit)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    selectedQuestionUnit === u.unit
                      ? "border-amber-500 bg-amber-500/10 shadow-sm"
                      : "border-slate-200/70 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                      Unit 0{u.unit}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      Verified
                    </span>
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1">
                    {u.count} Qs
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {u.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Unit Filters for Faculty Browser */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                placeholder="Search questions, model answers, marking schemes..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedQuestionUnit("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedQuestionUnit === "all"
                    ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 font-bold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                All (79)
              </button>
              {[1, 2, 3, 4, 5].map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedQuestionUnit(u)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedQuestionUnit === u
                      ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Unit {u}
                </button>
              ))}
            </div>
          </div>

          {/* Question List in Faculty Studio */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          Unit 0{q.unitNumber}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                          Q{q.questionNumber} • {q.marks} Marks Standard
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-semibold">
                          • {q.priority} Priority
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug pt-1">
                        {q.question}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleCopyQuestion(q.id, `${q.question}\n\nMarking Scheme:\n${q.markingScheme}\n\nModel Answer:\n${q.answerMarkdown}`)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                        title="Copy Question & Solution"
                      >
                        {copiedQuestionId === q.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1 ${
                          isExpanded
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        <span>{isExpanded ? "Hide Answer" : "Inspect Model Solution"}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Marking Scheme Banner */}
                  <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                    <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Marking Breakdown: </span>
                      <span>{q.markingScheme}</span>
                    </div>
                  </div>

                  {/* Expandable Model Solution & Faculty Notes */}
                  {isExpanded && (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-4 animate-in fade-in duration-150">
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Complete 6-Mark Model Solution
                        </div>
                        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                          {q.answerMarkdown}
                        </div>
                      </div>

                      {q.examTips && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Faculty Grading Instruction: </span>
                            <span>{q.examTips}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      
      {/* TAB: ANITS PREVIOUS PAPERS ARCHIVE (IN-STUDIO AUDIT) */}
      {activeTab === "papers" && (
        <div className="space-y-6" id="papers-section">
          {/* Top Overview Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 font-mono">
                  <FileText className="w-3.5 h-3.5" />
                  <span>ANITS Autonomous Examination Archives</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ANITS R23 Official Question Papers Archive
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                  Inspect the official Software Engineering (CSE) examination papers for III/IV B.Tech (Semester I). Verified R23 regulation, Bloom&apos;s taxonomy levels, Course Outcomes (COs), Performance Indicators (PIs), and original paper scans.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                  3 Papers Loaded
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedPaperFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Papers ({ANITS_PREVIOUS_PAPERS.length})
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Semester-End Regular")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Semester-End Regular"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Semester-End Regular (60M)
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Mid-Term 1")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Mid-Term 1"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Mid-Term 1 (40M)
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Mid-Term 2")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Mid-Term 2"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Mid-Term 2 (40M)
              </button>
            </div>
          </div>

          {/* Papers Cards List */}
          <div className="space-y-6">
            {ANITS_PREVIOUS_PAPERS.filter((p) =>
              selectedPaperFilter === "all" ? true : p.examType === selectedPaperFilter
            ).map((paper) => {
              const isExpanded = expandedTeacherPaperId === paper.id;

              return (
                <div
                  key={paper.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                          {paper.regulation}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold font-mono">
                          {paper.courseCode}
                        </span>
                        {paper.codeNumber && (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 text-xs font-mono">
                            Code: {paper.codeNumber}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                          {paper.examType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => {
                            setPaperPreviewImageUrl(paper.scanImageUrl);
                            setPaperPreviewTitle(paper.title);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center space-x-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>View Original Scan</span>
                        </button>
                        <a
                          href={paper.scanImageUrl}
                          download={`${paper.id}.jpg`}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Scan</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                        {paper.title}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {paper.institution} • {paper.department}
                      </div>
                    </div>

                    {/* Metadata summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800/80">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Exam Date
                        </span>
                        <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 font-semibold mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>{paper.date}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Time Duration
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                          {paper.time}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Max Marks
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                          {paper.maxMarks}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Units Covered
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5 block font-mono">
                          {paper.unitsCovered.map((u) => `U${u}`).join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0 font-mono text-[10px] uppercase">
                        NOTE:
                      </span>
                      <span>{paper.instructions}</span>
                    </div>

                    <button
                      onClick={() => setExpandedTeacherPaperId((prev) => (prev === paper.id ? "" : paper.id))}
                      className="w-full pt-2 flex items-center justify-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>{isExpanded ? "Hide Question Breakdown" : "Inspect Full Question Paper & Bloom's Structure"}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-6 space-y-6">
                      <div className="space-y-6">
                        {paper.groups.map((group, gIdx) => (
                          <div
                            key={gIdx}
                            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <h5 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>{group.unitTitle}</span>
                              </h5>
                              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                Unit 0{group.unitNumber}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {group.questions.map((q, qIdx) => (
                                <div
                                  key={qIdx}
                                  className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60"
                                >
                                  <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                      <span className="text-blue-600 dark:text-blue-400 mr-1.5 font-mono">
                                        Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                      </span>
                                      <span>{q.text}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                      {q.co && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                          {q.co}
                                        </span>
                                      )}
                                      {q.blooms && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                          Blooms: {q.blooms}
                                        </span>
                                      )}
                                      {q.pi && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                          PI: {q.pi}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                      {q.marks}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {group.alternateQuestions && group.alternateQuestions.length > 0 && (
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center space-x-3 my-1">
                                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                  <span className="text-[11px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    OR
                                  </span>
                                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                </div>

                                {group.alternateQuestions.map((q, qIdx) => (
                                  <div
                                    key={qIdx}
                                    className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60"
                                  >
                                    <div className="space-y-1">
                                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                        <span className="text-blue-600 dark:text-blue-400 mr-1.5 font-mono">
                                          Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                        </span>
                                        <span>{q.text}</span>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {q.co && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                            {q.co}
                                          </span>
                                        )}
                                        {q.blooms && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                            Blooms: {q.blooms}
                                          </span>
                                        )}
                                        {q.pi && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            PI: {q.pi}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                      <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                        {q.marks}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: ANITS PREVIOUS PAPERS ARCHIVE (IN-STUDIO AUDIT) */}
      {activeTab === "papers" && (
        <div className="space-y-6" id="papers-section">
          {/* Top Overview Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 font-mono">
                  <FileText className="w-3.5 h-3.5" />
                  <span>ANITS Autonomous Examination Archives</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ANITS R23 Official Question Papers Archive
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                  Inspect the official Software Engineering (CSE) examination papers for III/IV B.Tech (Semester I). Verified R23 regulation, Bloom&apos;s taxonomy levels, Course Outcomes (COs), Performance Indicators (PIs), and original paper scans.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                  3 Papers Loaded
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedPaperFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Papers ({ANITS_PREVIOUS_PAPERS.length})
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Semester-End Regular")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Semester-End Regular"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Semester-End Regular (60M)
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Mid-Term 1")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Mid-Term 1"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Mid-Term 1 (40M)
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Mid-Term 2")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Mid-Term 2"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Mid-Term 2 (40M)
              </button>
            </div>
          </div>

          {/* Papers Cards List */}
          <div className="space-y-6">
            {ANITS_PREVIOUS_PAPERS.filter((p) =>
              selectedPaperFilter === "all" ? true : p.examType === selectedPaperFilter
            ).map((paper) => {
              const isExpanded = expandedTeacherPaperId === paper.id;

              return (
                <div
                  key={paper.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                          {paper.regulation}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold font-mono">
                          {paper.courseCode}
                        </span>
                        {paper.codeNumber && (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 text-xs font-mono">
                            Code: {paper.codeNumber}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                          {paper.examType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => {
                            setPaperPreviewImageUrl(paper.scanImageUrl);
                            setPaperPreviewTitle(paper.title);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center space-x-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>View Original Scan</span>
                        </button>
                        <a
                          href={paper.scanImageUrl}
                          download={`${paper.id}.jpg`}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Scan</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                        {paper.title}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {paper.institution} • {paper.department}
                      </div>
                    </div>

                    {/* Metadata summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800/80">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Exam Date
                        </span>
                        <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 font-semibold mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>{paper.date}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Time Duration
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                          {paper.time}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Max Marks
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                          {paper.maxMarks}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Units Covered
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5 block font-mono">
                          {paper.unitsCovered.map((u) => `U${u}`).join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0 font-mono text-[10px] uppercase">
                        NOTE:
                      </span>
                      <span>{paper.instructions}</span>
                    </div>

                    <button
                      onClick={() => setExpandedTeacherPaperId((prev) => (prev === paper.id ? "" : paper.id))}
                      className="w-full pt-2 flex items-center justify-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>{isExpanded ? "Hide Question Breakdown" : "Inspect Full Question Paper & Bloom's Structure"}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-6 space-y-6">
                      <div className="space-y-6">
                        {paper.groups.map((group, gIdx) => (
                          <div
                            key={gIdx}
                            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <h5 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>{group.unitTitle}</span>
                              </h5>
                              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                Unit 0{group.unitNumber}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {group.questions.map((q, qIdx) => (
                                <div
                                  key={qIdx}
                                  className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60"
                                >
                                  <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                      <span className="text-blue-600 dark:text-blue-400 mr-1.5 font-mono">
                                        Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                      </span>
                                      <span>{q.text}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                      {q.co && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                          {q.co}
                                        </span>
                                      )}
                                      {q.blooms && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                          Blooms: {q.blooms}
                                        </span>
                                      )}
                                      {q.pi && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                          PI: {q.pi}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                      {q.marks}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {group.alternateQuestions && group.alternateQuestions.length > 0 && (
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center space-x-3 my-1">
                                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                  <span className="text-[11px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    OR
                                  </span>
                                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                </div>

                                {group.alternateQuestions.map((q, qIdx) => (
                                  <div
                                    key={qIdx}
                                    className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60"
                                  >
                                    <div className="space-y-1">
                                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                        <span className="text-blue-600 dark:text-blue-400 mr-1.5 font-mono">
                                          Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                        </span>
                                        <span>{q.text}</span>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {q.co && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                            {q.co}
                                          </span>
                                        )}
                                        {q.blooms && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                            Blooms: {q.blooms}
                                          </span>
                                        )}
                                        {q.pi && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            PI: {q.pi}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                      <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                        {q.marks}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BROADCAST DIRECTIVE TERMINAL */}
      {activeTab === "broadcast" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="announcements-section">
          {/* Broadcast Composer */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Broadcast New Directive</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Sends high-visibility alert to student dashboards instantly.
              </p>
            </div>

            {broadcastSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Directive successfully broadcast to student portal!</span>
              </div>
            )}

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Directive Title
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Mid-Term 1 Question Pattern & Focus Topics"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={broadcastPriority}
                    onChange={(e) => setBroadcastPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="exam">Exam Directive</option>
                    <option value="urgent">Urgent Alert</option>
                    <option value="normal">General Notice</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit Tag
                  </label>
                  <select
                    value={broadcastUnit}
                    onChange={(e) => setBroadcastUnit(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5].map((u) => (
                      <option key={u} value={u}>
                        Unit 0{u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Directive Announcement Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  placeholder="Provide instructions, syllabus guidance, or upcoming lab schedules..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition flex items-center justify-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Directive</span>
              </button>
            </form>
          </div>

          {/* Published Announcements Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Broadcast Directives ({announcements.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Visible on Student Hub
              </span>
            </div>

            {announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            ann.priority === "exam"
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200"
                          }`}
                        >
                          {ann.priority === "exam" ? "Exam Directive" : "Department Notice"}
                        </span>
                        {ann.unitTag && (
                          <span className="text-[10px] font-mono text-slate-400">
                            Unit 0{ann.unitTag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-slate-400">
                          {ann.date}
                        </span>
                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 transition"
                          title="Remove Directive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ann.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ann.content}
                    </p>

                    <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 font-mono">
                      Author: {ann.author} ({ann.authorRole})
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
                <Bell className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No Active Directives
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Use the composer on the left to broadcast official exam guidelines, syllabus schedules, or lecture alerts to all students.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: ANITS PREVIOUS PAPERS ARCHIVE (IN-STUDIO AUDIT) */}
      {activeTab === "papers" && (
        <div className="space-y-6" id="papers-section">
          {/* Top Overview Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 font-mono">
                  <FileText className="w-3.5 h-3.5" />
                  <span>ANITS Autonomous Examination Archives</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ANITS R23 Official Question Papers Archive
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                  Inspect the official Software Engineering (CSE) examination papers for III/IV B.Tech (Semester I). Verified R23 regulation, Bloom&apos;s taxonomy levels, Course Outcomes (COs), Performance Indicators (PIs), and original paper scans.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                  3 Papers Loaded
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedPaperFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Papers ({ANITS_PREVIOUS_PAPERS.length})
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Semester-End Regular")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Semester-End Regular"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Semester-End Regular (60M)
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Mid-Term 1")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Mid-Term 1"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Mid-Term 1 (40M)
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Mid-Term 2")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Mid-Term 2"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Mid-Term 2 (40M)
              </button>
            </div>
          </div>

          {/* Papers Cards List */}
          <div className="space-y-6">
            {ANITS_PREVIOUS_PAPERS.filter((p) =>
              selectedPaperFilter === "all" ? true : p.examType === selectedPaperFilter
            ).map((paper) => {
              const isExpanded = expandedTeacherPaperId === paper.id;

              return (
                <div
                  key={paper.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                          {paper.regulation}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold font-mono">
                          {paper.courseCode}
                        </span>
                        {paper.codeNumber && (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 text-xs font-mono">
                            Code: {paper.codeNumber}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                          {paper.examType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => {
                            setPaperPreviewImageUrl(paper.scanImageUrl);
                            setPaperPreviewTitle(paper.title);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center space-x-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>View Original Scan</span>
                        </button>
                        <a
                          href={paper.scanImageUrl}
                          download={`${paper.id}.jpg`}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Scan</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                        {paper.title}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {paper.institution} • {paper.department}
                      </div>
                    </div>

                    {/* Metadata summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800/80">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Exam Date
                        </span>
                        <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 font-semibold mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>{paper.date}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Time Duration
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                          {paper.time}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Max Marks
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                          {paper.maxMarks}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Units Covered
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5 block font-mono">
                          {paper.unitsCovered.map((u) => `U${u}`).join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0 font-mono text-[10px] uppercase">
                        NOTE:
                      </span>
                      <span>{paper.instructions}</span>
                    </div>

                    <button
                      onClick={() => setExpandedTeacherPaperId((prev) => (prev === paper.id ? "" : paper.id))}
                      className="w-full pt-2 flex items-center justify-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>{isExpanded ? "Hide Question Breakdown" : "Inspect Full Question Paper & Bloom's Structure"}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-6 space-y-6">
                      <div className="space-y-6">
                        {paper.groups.map((group, gIdx) => (
                          <div
                            key={gIdx}
                            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <h5 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>{group.unitTitle}</span>
                              </h5>
                              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                Unit 0{group.unitNumber}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {group.questions.map((q, qIdx) => (
                                <div
                                  key={qIdx}
                                  className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60"
                                >
                                  <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                      <span className="text-blue-600 dark:text-blue-400 mr-1.5 font-mono">
                                        Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                      </span>
                                      <span>{q.text}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                      {q.co && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                          {q.co}
                                        </span>
                                      )}
                                      {q.blooms && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                          Blooms: {q.blooms}
                                        </span>
                                      )}
                                      {q.pi && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                          PI: {q.pi}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                      {q.marks}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {group.alternateQuestions && group.alternateQuestions.length > 0 && (
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center space-x-3 my-1">
                                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                  <span className="text-[11px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    OR
                                  </span>
                                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                </div>

                                {group.alternateQuestions.map((q, qIdx) => (
                                  <div
                                    key={qIdx}
                                    className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60"
                                  >
                                    <div className="space-y-1">
                                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                        <span className="text-blue-600 dark:text-blue-400 mr-1.5 font-mono">
                                          Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                        </span>
                                        <span>{q.text}</span>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {q.co && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                            {q.co}
                                          </span>
                                        )}
                                        {q.blooms && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                            Blooms: {q.blooms}
                                          </span>
                                        )}
                                        {q.pi && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            PI: {q.pi}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                      <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                        {q.marks}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UPLOAD MATERIAL MODAL DIALOG */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upload Course Material
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Unit 1: Classical Process Models Lecture Slides"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief summary of key concepts covered in this document..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Curriculum Unit *
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5].map((u) => (
                      <option key={u} value={u}>
                        Unit 0{u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Resource Format *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="ppt">PowerPoint Presentation (PPT)</option>
                    <option value="video_link">Lecture Video URL</option>
                    <option value="image">Diagram / Image</option>
                    <option value="xml">XML Architecture Stencil</option>
                  </select>
                </div>
              </div>

              {/* File Upload input */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Upload File Document (Max 25MB)
                </label>
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-center space-y-2">
                  <input
                    type="file"
                    id="faculty-file-input"
                    accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg,.xml,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="faculty-file-input"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File from Device</span>
                  </label>
                  {selectedFile ? (
                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400">
                      Supports PDF, PPT, Word, Diagrams, and Images
                    </div>
                  )}
                </div>
              </div>

              {/* Or external URL */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Or External Resource URL (if not uploading directly)
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or /docs/..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || (!selectedFile && !newUrl.trim())}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold shadow-md transition flex items-center space-x-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Publish Material</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* High-Resolution Paper Scan Lightbox Modal */}
      {paperPreviewImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {paperPreviewTitle}
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Official ANITS Examination Question Paper Scan • Faculty Audit
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={paperPreviewImageUrl}
                  download="ANITS_Question_Paper.jpg"
                  className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold transition flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => {
                    setPaperPreviewImageUrl(null);
                    setPaperPreviewTitle("");
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/50">
              <img
                src={paperPreviewImageUrl}
                alt={paperPreviewTitle}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: ANITS PREVIOUS PAPERS ARCHIVE (IN-STUDIO AUDIT) */}
      {activeTab === "papers" && (
        <div className="space-y-6" id="papers-section">
          {/* Top Overview Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 font-mono">
                  <FileText className="w-3.5 h-3.5" />
                  <span>ANITS Autonomous Examination Archives</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  ANITS R23 Official Question Papers Archive
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                  Inspect the official Software Engineering (CSE) examination papers for III/IV B.Tech (Semester I). Verified R23 regulation, Bloom&apos;s taxonomy levels, Course Outcomes (COs), Performance Indicators (PIs), and original paper scans.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                  3 Papers Loaded
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedPaperFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Papers ({ANITS_PREVIOUS_PAPERS.length})
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Semester-End Regular")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Semester-End Regular"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Semester-End Regular (60M)
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Mid-Term 1")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Mid-Term 1"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Mid-Term 1 (40M)
              </button>
              <button
                onClick={() => setSelectedPaperFilter("Mid-Term 2")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedPaperFilter === "Mid-Term 2"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Mid-Term 2 (40M)
              </button>
            </div>
          </div>

          {/* Papers Cards List */}
          <div className="space-y-6">
            {ANITS_PREVIOUS_PAPERS.filter((p) =>
              selectedPaperFilter === "all" ? true : p.examType === selectedPaperFilter
            ).map((paper) => {
              const isExpanded = expandedTeacherPaperId === paper.id;

              return (
                <div
                  key={paper.id}
                  className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                          {paper.regulation}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold font-mono">
                          {paper.courseCode}
                        </span>
                        {paper.codeNumber && (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 text-xs font-mono">
                            Code: {paper.codeNumber}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                          {paper.examType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => {
                            setPaperPreviewImageUrl(paper.scanImageUrl);
                            setPaperPreviewTitle(paper.title);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center space-x-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>View Original Scan</span>
                        </button>
                        <a
                          href={paper.scanImageUrl}
                          download={`${paper.id}.jpg`}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Scan</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                        {paper.title}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {paper.institution} • {paper.department}
                      </div>
                    </div>

                    {/* Metadata summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800/80">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Exam Date
                        </span>
                        <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 font-semibold mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>{paper.date}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Time Duration
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                          {paper.time}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Max Marks
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">
                          {paper.maxMarks}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Units Covered
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5 block font-mono">
                          {paper.unitsCovered.map((u) => `U${u}`).join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0 font-mono text-[10px] uppercase">
                        NOTE:
                      </span>
                      <span>{paper.instructions}</span>
                    </div>

                    <button
                      onClick={() => setExpandedTeacherPaperId((prev) => (prev === paper.id ? "" : paper.id))}
                      className="w-full pt-2 flex items-center justify-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>{isExpanded ? "Hide Question Breakdown" : "Inspect Full Question Paper & Bloom's Structure"}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-6 space-y-6">
                      <div className="space-y-6">
                        {paper.groups.map((group, gIdx) => (
                          <div
                            key={gIdx}
                            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <h5 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>{group.unitTitle}</span>
                              </h5>
                              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                Unit 0{group.unitNumber}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {group.questions.map((q, qIdx) => (
                                <div
                                  key={qIdx}
                                  className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60"
                                >
                                  <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                      <span className="text-blue-600 dark:text-blue-400 mr-1.5 font-mono">
                                        Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                      </span>
                                      <span>{q.text}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                      {q.co && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                          {q.co}
                                        </span>
                                      )}
                                      {q.blooms && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                          Blooms: {q.blooms}
                                        </span>
                                      )}
                                      {q.pi && (
                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                          PI: {q.pi}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                      {q.marks}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {group.alternateQuestions && group.alternateQuestions.length > 0 && (
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center space-x-3 my-1">
                                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                  <span className="text-[11px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    OR
                                  </span>
                                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                </div>

                                {group.alternateQuestions.map((q, qIdx) => (
                                  <div
                                    key={qIdx}
                                    className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60"
                                  >
                                    <div className="space-y-1">
                                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                                        <span className="text-blue-600 dark:text-blue-400 mr-1.5 font-mono">
                                          Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                        </span>
                                        <span>{q.text}</span>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {q.co && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                            {q.co}
                                          </span>
                                        )}
                                        {q.blooms && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                                            Blooms: {q.blooms}
                                          </span>
                                        )}
                                        {q.pi && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            PI: {q.pi}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                      <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                        {q.marks}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
