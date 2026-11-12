"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Calendar,
  Layers,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Search,
  CheckCircle2,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  ANITS_PREVIOUS_PAPERS,
  PreviousPaper,
  QuestionGroup,
} from "@/lib/data/previous-papers-data";
import { Card3D } from "@/components/ui/Card3D";

export default function PreviousPapersPage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "Semester-End Regular" | "Mid-Term 1" | "Mid-Term 2">("all");
  const [expandedPaperId, setExpandedPaperId] = useState<string>("anits-r23-sem-end-2025");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const filteredPapers = ANITS_PREVIOUS_PAPERS.filter((paper) => {
    if (selectedFilter === "all") return true;
    return paper.examType === selectedFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedPaperId((prev) => (prev === id ? "" : id));
  };

  const openPreview = (imageUrl: string, title: string) => {
    setPreviewImageUrl(imageUrl);
    setPreviewTitle(title);
  };

  const closePreview = () => {
    setPreviewImageUrl(null);
    setPreviewTitle("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          ANITS R23 Previous Examination Papers
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
          Official question papers for III/IV B.Tech CSE (Semester I) Software Engineering. Featuring official exam dates, R23 regulation, marks schemes, and original paper scans.
        </p>
      </div>

      {/* Regulation & Examination Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedFilter === "all"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
              : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          All Papers ({ANITS_PREVIOUS_PAPERS.length})
        </button>
        <button
          onClick={() => setSelectedFilter("Semester-End Regular")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedFilter === "Semester-End Regular"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          Semester-End Regular (60M)
        </button>
        <button
          onClick={() => setSelectedFilter("Mid-Term 1")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedFilter === "Mid-Term 1"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          Mid-Term 1 (40M)
        </button>
        <button
          onClick={() => setSelectedFilter("Mid-Term 2")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedFilter === "Mid-Term 2"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          Mid-Term 2 (40M)
        </button>
      </div>

      {/* Question Papers List */}
      <div className="space-y-6">
        {filteredPapers.map((paper) => {
          const isExpanded = expandedPaperId === paper.id;

          return (
            <Card3D
              key={paper.id}
              maxTilt={4}
              glowColor="16, 185, 129"
              className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden transition-all duration-200 hover:border-emerald-500/30"
            >
              {/* Paper Overview Header Card */}
              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
                      {paper.regulation}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold font-mono">
                      {paper.courseCode}
                    </span>
                    {paper.codeNumber && (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 text-xs font-mono">
                        Code: {paper.codeNumber}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                      {paper.examType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => openPreview(paper.scanImageUrl, paper.title)}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-500" />
                      <span>View Original Scan</span>
                    </button>
                    <a
                      href={paper.scanImageUrl}
                      download={`${paper.id}.jpg`}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Scan</span>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-white leading-snug">
                    {paper.title}
                  </h3>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1">
                    {paper.institution} • {paper.department}
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-neutral-100 dark:border-neutral-800/80">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">
                      Exam Date
                    </span>
                    <div className="flex items-center space-x-1.5 text-neutral-800 dark:text-neutral-200 font-semibold mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{paper.date}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">
                      Time Duration
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-semibold mt-0.5 block">
                      {paper.time}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">
                      Maximum Marks
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-semibold mt-0.5 block">
                      {paper.maxMarks}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block font-bold">
                      Units Covered
                    </span>
                    <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 font-mono">
                      <span>{paper.unitsCovered.map((u) => `U${u}`).join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Instructions banner */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-600 dark:text-neutral-400 flex items-start space-x-2">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 shrink-0 font-mono text-[10px] uppercase">
                    NOTE:
                  </span>
                  <span>{paper.instructions}</span>
                </div>

                {/* Expand / Collapse Button */}
                <button
                  onClick={() => toggleExpand(paper.id)}
                  className="w-full pt-2 flex items-center justify-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>{isExpanded ? "Hide Question Paper Details" : "View Complete Questions & Marking Structure"}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Collapsible Questions Table Section */}
              {isExpanded && (
                <div className="border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                      Full Descriptive Questions Breakdown
                    </span>
                    <Link
                      href="/student/exam-prep"
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Study All 79 Model Answers</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {paper.groups.map((group, gIdx) => (
                      <div
                        key={gIdx}
                        className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4 shadow-xs"
                      >
                        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                          <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white font-mono flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{group.unitTitle}</span>
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                            Unit 0{group.unitNumber}
                          </span>
                        </div>

                        {/* Primary Questions */}
                        <div className="space-y-3">
                          {group.questions.map((q, qIdx) => (
                            <div
                              key={qIdx}
                              className="flex items-start justify-between gap-4 p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800/60"
                            >
                              <div className="space-y-1">
                                <div className="text-xs font-bold text-neutral-900 dark:text-white leading-relaxed">
                                  <span className="text-emerald-600 dark:text-emerald-400 mr-1.5 font-mono">
                                    Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                  </span>
                                  <span>{q.text}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                  {q.co && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
                                      {q.co}
                                    </span>
                                  )}
                                  {q.blooms && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
                                      Blooms: {q.blooms}
                                    </span>
                                  )}
                                  {q.pi && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                      PI: {q.pi}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                  {q.marks}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <Link
                                    href={`/student/ai-assistant?q=${encodeURIComponent(`${q.text} (Answer according to ANITS ${paper.regulation} university exam pattern for ${q.marks})`)}`}
                                    className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 transition"
                                  >
                                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                    <span>Ask AI</span>
                                  </Link>
                                  <Link
                                    href={`/student/learn/${group.unitNumber}`}
                                    className="text-[10px] text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
                                  >
                                    Notes
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Alternate Choice Questions (OR) */}
                        {group.alternateQuestions && group.alternateQuestions.length > 0 && (
                          <div className="space-y-3 pt-2">
                            <div className="flex items-center space-x-3 my-1">
                              <div className="flex-1 h-px bg-neutral-200 dark:border-neutral-800" />
                              <span className="text-[11px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                                OR
                              </span>
                              <div className="flex-1 h-px bg-neutral-200 dark:border-neutral-800" />
                            </div>

                            {group.alternateQuestions.map((q, qIdx) => (
                              <div
                                key={qIdx}
                                className="flex items-start justify-between gap-4 p-3 rounded-xl bg-neutral-50/70 dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800/60"
                              >
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-neutral-900 dark:text-white leading-relaxed">
                                    <span className="text-emerald-600 dark:text-emerald-400 mr-1.5 font-mono">
                                      Q{q.number}{q.subNumber ? `.${q.subNumber})` : "."}
                                    </span>
                                    <span>{q.text}</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 pt-1">
                                    {q.co && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
                                        {q.co}
                                      </span>
                                    )}
                                    {q.blooms && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
                                        Blooms: {q.blooms}
                                      </span>
                                    )}
                                    {q.pi && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                        PI: {q.pi}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end shrink-0 space-y-1.5">
                                  <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                    {q.marks}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <Link
                                      href={`/student/ai-assistant?q=${encodeURIComponent(`${q.text} (Answer according to ANITS ${paper.regulation} university exam pattern for ${q.marks})`)}`}
                                      className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 transition"
                                    >
                                      <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                      <span>Ask AI</span>
                                    </Link>
                                    <Link
                                      href={`/student/learn/${group.unitNumber}`}
                                      className="text-[10px] text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
                                    >
                                      Notes
                                    </Link>
                                  </div>
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
            </Card3D>
          );
        })}
      </div>

      {/* High-Resolution Paper Scan Lightbox Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {previewTitle}
                </h4>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Official ANITS Examination Question Paper Scan
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={previewImageUrl}
                  download="ANITS_Question_Paper.jpg"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={closePreview}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image View */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/50">
              <img
                src={previewImageUrl}
                alt={previewTitle}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg border border-neutral-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
