"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  GraduationCap,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Copy,
  Check,
  Eye,
  X,
  Layers,
  Calendar,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { StudentStatsItem } from "@/app/api/teacher/students/route";

interface StudentRosterSectionProps {
  students: StudentStatsItem[];
  cohortStats: {
    totalStudents: number;
    sections: { [key: string]: number };
    averageCohortXP: number;
    averageCohortQuizScore: number;
    totalQuizSubmissions: number;
  };
  isLoading: boolean;
  onRefresh: () => void;
}

export function StudentRosterSection({
  students,
  cohortStats,
  isLoading,
  onRefresh,
}: StudentRosterSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rollNumber" | "xp" | "quizAvg" | "name" | "progress">("rollNumber");
  const [copiedRoll, setCopiedRoll] = useState<string | null>(null);
  const [inspectingStudent, setInspectingStudent] = useState<StudentStatsItem | null>(null);

  // Extract unique sections and classes from students data
  const availableSections = Array.from(
    new Set(students.map((s) => s.section).filter(Boolean))
  ).sort();
  const availableClasses = Array.from(
    new Set(students.map((s) => s.className).filter(Boolean))
  ).sort();

  // Copy roll number to clipboard
  const handleCopyRoll = (roll: string) => {
    navigator.clipboard.writeText(roll);
    setCopiedRoll(roll);
    setTimeout(() => setCopiedRoll(null), 2000);
  };

  // Filter students
  const filteredStudents = students
    .filter((student) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.rollNumber.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q);

      const matchesSection =
        selectedSection === "all" || student.section === selectedSection;

      const matchesClass =
        selectedClass === "all" || student.className === selectedClass;

      return matchesSearch && matchesSection && matchesClass;
    })
    .sort((a, b) => {
      if (sortBy === "rollNumber") {
        return a.rollNumber.localeCompare(b.rollNumber);
      }
      if (sortBy === "xp") {
        return b.xp - a.xp;
      }
      if (sortBy === "quizAvg") {
        return b.averageQuizScore - a.averageQuizScore;
      }
      if (sortBy === "progress") {
        return b.overallProgress - a.overallProgress;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  // Calculate diagnostic recommendation
  const getDiagnosticRecommendation = (student: StudentStatsItem) => {
    if (student.quizAttempts === 0 && student.xp === 0) {
      return {
        level: "warning",
        title: "Awaiting Activity",
        text: "Student has registered but not yet attempted quizzes or saved diagrams. Recommend reminding the student to begin Unit 1 modules.",
      };
    }
    if (student.averageQuizScore >= 80 && student.overallProgress >= 70) {
      return {
        level: "excellent",
        title: "Strong Subject Mastery",
        text: "Consistently scoring above 80% across attempted units. Ready for advanced system design problems and previous university exam question review.",
      };
    }
    if (student.averageQuizScore >= 60) {
      return {
        level: "good",
        title: "Steady Progress",
        text: "Good foundational comprehension. Recommend attempting remaining unit quizzes to reach full syllabus coverage.",
      };
    }
    return {
      level: "needs_work",
      title: "Focus Areas Identified",
      text: "Quiz scores indicate conceptual doubts in key areas (e.g., Coupling or Architecture). Advise reviewing model solutions in the question bank.",
    };
  };

  return (
    <div className="space-y-6" id="students-section">
      {/* COHORT TELEMETRY SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {cohortStats.totalStudents}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
            {Object.entries(cohortStats.sections).map(([sec, count]) => (
              <span
                key={sec}
                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]"
              >
                {sec}: {count}
              </span>
            ))}
            {Object.keys(cohortStats.sections).length === 0 && (
              <span>No sections active</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Cohort Average Quiz</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {cohortStats.averageCohortQuizScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {cohortStats.totalQuizSubmissions} total quiz attempts
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Cohort Average XP</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {cohortStats.averageCohortXP} XP
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Earned via quizzes & topic completions
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Curriculum Framework</span>
            <BookOpen className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            5 Units
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ANITS R23 • CSE4119 / 23CS4119
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search by Name or Roll No */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by Name, Roll No (e.g. A2412...), or Email..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Action Refresh */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Section, Class and Sort Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {/* Section Filter */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 font-medium text-[11px] mr-1">Section:</span>
            <button
              onClick={() => setSelectedSection("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedSection === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Sections
            </button>
            {availableSections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedSection === sec
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {sec}
              </button>
            ))}
            {availableSections.length === 0 && (
              <>
                <button
                  onClick={() => setSelectedSection("Section A")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedSection === "Section A"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Section A
                </button>
                <button
                  onClick={() => setSelectedSection("Section B")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedSection === "Section B"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Section B
                </button>
                <button
                  onClick={() => setSelectedSection("Section C")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedSection === "Section C"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Section C
                </button>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden md:block mx-1" />

          {/* Class Filter */}
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-medium text-[11px] mr-1">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Classes</option>
              {availableClasses.length > 0 ? (
                availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))
              ) : (
                <>
                  <option value="III/IV B.Tech">III/IV B.Tech</option>
                  <option value="II/IV B.Tech">II/IV B.Tech</option>
                  <option value="IV/IV B.Tech">IV/IV B.Tech</option>
                </>
              )}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden md:block mx-1" />

          {/* Sort By */}
          <div className="flex items-center space-x-1 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 focus:outline-none font-medium"
            >
              <option value="rollNumber">Roll Number (Asc)</option>
              <option value="xp">XP (High to Low)</option>
              <option value="quizAvg">Quiz Average (High to Low)</option>
              <option value="progress">Progress % (High to Low)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* STUDENT ROSTER DATA TABLE */}
      {filteredStudents.length > 0 ? (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-w-[760px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Student Details</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Class & Section</th>
                  <th className="py-3.5 px-4">Progress & XP</th>
                  <th className="py-3.5 px-4">Quiz Performance</th>
                  <th className="py-3.5 px-4">Diagrams</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredStudents.map((student) => {
                  const initial = (student.name || "S").charAt(0).toUpperCase();
                  const passedUnitsCount = student.unitProgress.filter(
                    (u) => u.status === "mastered" || u.status === "completed"
                  ).length;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group"
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white truncate">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number with One-Click Copy */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tracking-wide">
                            {student.rollNumber}
                          </span>
                          <button
                            onClick={() => handleCopyRoll(student.rollNumber)}
                            title="Copy Roll Number"
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                          >
                            {copiedRoll === student.rollNumber ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Class & Section */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold text-[11px] border border-blue-200/50 dark:border-blue-800/50">
                            {student.className}
                          </span>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {student.section}
                          </div>
                        </div>
                      </td>

                      {/* Individual Progress & XP */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5 w-36">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {student.overallProgress}%
                            </span>
                            <div className="flex items-center space-x-1 font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                              <Sparkles className="w-3 h-3" />
                              <span>{student.xp} XP</span>
                            </div>
                          </div>
                          {/* Progress track */}
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                student.overallProgress >= 80
                                  ? "bg-emerald-500"
                                  : student.overallProgress >= 50
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${Math.max(4, student.overallProgress)}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>{passedUnitsCount} of 5 units passed</span>
                            {student.streak.current > 0 && (
                              <span className="flex items-center text-orange-500 font-semibold">
                                <Flame className="w-2.5 h-2.5 mr-0.5" />
                                {student.streak.current}d streak
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Quiz Performance */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                                student.quizAttempts === 0
                                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                  : student.averageQuizScore >= 75
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                                  : student.averageQuizScore >= 50
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                              }`}
                            >
                              {student.quizAttempts === 0
                                ? "No Quizzes"
                                : `${student.averageQuizScore}% Avg`}
                            </span>
                            {student.highestQuizScore > 0 && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                (Peak: {student.highestQuizScore}%)
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {student.quizAttempts} total submission
                            {student.quizAttempts === 1 ? "" : "s"}
                          </div>
                        </div>
                      </td>

                      {/* Studio Diagrams */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 font-mono text-xs">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.diagramCount}</span>
                        </div>
                      </td>

                      {/* Action: Inspect */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setInspectingStudent(student)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-slate-950 dark:text-amber-300 dark:hover:text-slate-950 text-xs font-bold transition active:scale-95 border border-amber-500/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Progress</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer info */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong>{filteredStudents.length}</strong> of{" "}
              <strong>{students.length}</strong> enrolled student
              {students.length === 1 ? "" : "s"}
            </span>
            <span className="font-mono text-[10px]">
              ANITS Department of Computer Science & Engineering
            </span>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery || selectedSection !== "all" || selectedClass !== "all"
                ? "No students match your filter"
                : "No student accounts enrolled yet"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {searchQuery || selectedSection !== "all" || selectedClass !== "all"
                ? "Try adjusting your search query, class or section filter to see matching students."
                : "As ANITS students register with their official roll number emails (e.g. A24126510021@anits.edu.in), their real-time telemetry, quiz submissions, and unit progress will automatically populate here."}
            </p>
          </div>
          {(searchQuery || selectedSection !== "all" || selectedClass !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSection("all");
                setSelectedClass("all");
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* INDIVIDUAL STUDENT PROGRESS INSPECTION MODAL */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Student Profile Banner */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                  {inspectingStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {inspectingStudent.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] border border-emerald-200 dark:border-emerald-800">
                      Active Student
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {inspectingStudent.rollNumber}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {inspectingStudent.className} • {inspectingStudent.section}
                    </span>
                    <span>•</span>
                    <span>{inspectingStudent.email}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectingStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Earned XP
                </div>
                <div className="text-lg font-black text-amber-500 font-mono mt-0.5 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {inspectingStudent.xp} XP
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Study Streak
                </div>
                <div className="text-lg font-black text-orange-500 font-mono mt-0.5 flex items-center">
                  <Flame className="w-4 h-4 mr-1" />
                  {inspectingStudent.streak.current} Days
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Quiz Avg Score
                </div>
                <div className="text-lg font-black text-emerald-500 font-mono mt-0.5 flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  {inspectingStudent.averageQuizScore}%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  Studio Diagrams
                </div>
                <div className="text-lg font-black text-indigo-500 font-mono mt-0.5 flex items-center">
                  <Layers className="w-4 h-4 mr-1" />
                  {inspectingStudent.diagramCount}
                </div>
              </div>
            </div>

            {/* Overall Pacing & Syllabus Coverage */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Overall Syllabus Pacing & Mastery
                </span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                  {inspectingStudent.overallProgress}% Complete
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, inspectingStudent.overallProgress)}%` }}
                />
              </div>
            </div>

            {/* UNIT-BY-UNIT MASTERY BREAKDOWN (UNITS 1 to 5) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
                  Unit-by-Unit Mastery Breakdown (5 Units)
                </h4>
                <span className="text-[11px] text-slate-400">
                  Passing benchmark: 50% • Mastery: 80%
                </span>
              </div>

              <div className="space-y-2.5">
                {inspectingStudent.unitProgress.map((unit) => {
                  return (
                    <div
                      key={unit.unitNumber}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold font-mono flex items-center justify-center text-slate-700 dark:text-slate-300">
                            {unit.unitNumber}
                          </span>
                          <span className="font-semibold text-xs text-slate-900 dark:text-white">
                            {unit.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 pl-7">
                          {unit.attempts > 0
                            ? `${unit.attempts} quiz attempt${unit.attempts === 1 ? "" : "s"} submitted`
                            : "No quizzes attempted yet for this unit"}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 pl-7 sm:pl-0 shrink-0">
                        {unit.bestScore !== null ? (
                          <div className="text-right">
                            <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                              {unit.bestScore}%
                            </span>
                            <span className="text-[10px] text-slate-400 block">Best Score</span>
                          </div>
                        ) : null}

                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono ${
                            unit.status === "mastered"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : unit.status === "completed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                              : unit.status === "in_progress"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {unit.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECENT QUIZ SUBMISSIONS */}
            {inspectingStudent.recentQuizzes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
                  Recent Quiz Submissions
                </h4>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Unit</th>
                        <th className="py-2.5 px-3">Score</th>
                        <th className="py-2.5 px-3">Percentage</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {inspectingStudent.recentQuizzes.map((quiz, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                            Unit {quiz.unitNumber}
                          </td>
                          <td className="py-2 px-3 font-mono">
                            {quiz.score} / {quiz.totalQuestions}
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`font-mono font-bold ${
                                quiz.percentage >= 75
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : quiz.percentage >= 50
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {quiz.percentage}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-[11px] text-slate-400">
                            {quiz.createdAt
                              ? new Date(quiz.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Recent"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FACULTY ACADEMIC DIAGNOSTIC & ADVISORY NOTE */}
            {(() => {
              const diag = getDiagnosticRecommendation(inspectingStudent);
              return (
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    diag.level === "excellent"
                      ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200"
                      : diag.level === "good"
                      ? "bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-200"
                      : diag.level === "needs_work"
                      ? "bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200"
                      : "bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Faculty Diagnostic Recommendation: {diag.title}</span>
                  </div>
                  <p className="leading-relaxed opacity-90">{diag.text}</p>
                </div>
              );
            })()}

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingStudent(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-bold transition shadow-sm"
              >
                Close Student Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default StudentRosterSection;

