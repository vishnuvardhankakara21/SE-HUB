"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Trash2,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Card3D } from "@/components/ui/Card3D";

interface ApiBookmark {
  _id: string;
  itemType: "topic" | "question" | "diagram";
  itemId?: string;
  unitNumber: number;
  title: string;
  subtitle?: string;
  url: string;
  createdAt?: string;
}

export default function BookmarksPage() {
  const [filter, setFilter] = useState<"all" | "topics" | "questions" | "diagrams">("all");
  const [liveBookmarks, setLiveBookmarks] = useState<ApiBookmark[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  const fetchBookmarks = () => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.bookmarks)) {
          setLiveBookmarks(data.bookmarks);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDeleteBookmark = async (id: string, url: string, title: string) => {
    setLiveBookmarks((prev) => prev.filter((b) => b._id !== id));
    setDeleteNotice(`Removed "${title.slice(0, 30)}..." from bookmarks`);
    setTimeout(() => setDeleteNotice(null), 3000);

    try {
      await fetch(
        `/api/bookmarks?id=${encodeURIComponent(id)}&url=${encodeURIComponent(url)}`,
        { method: "DELETE" }
      );
    } catch (e) {
      console.error("Failed to delete bookmark:", e);
      // Refresh on failure
      fetchBookmarks();
    }
  };

  const customTopicBookmarks = liveBookmarks.filter((b) => b.itemType === "topic");
  const customQuestionBookmarks = liveBookmarks.filter((b) => b.itemType === "question");
  const customDiagramBookmarks = liveBookmarks.filter((b) => b.itemType === "diagram");

  const totalCount = liveBookmarks.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 font-mono">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Personal Revision Repository</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Saved Concepts & Exam Resources
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            Quick access to your bookmarked syllabus topics, 6-mark model answers, and architectural diagrams saved for rapid exam preparation.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
            {totalCount} {totalCount === 1 ? "Item" : "Items"} Bookmarked
          </span>
        </div>
      </div>

      {/* Delete feedback alert */}
      {deleteNotice && (
        <div className="p-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-1 shadow-md">
          <span>{deleteNotice}</span>
          <span className="text-[10px] opacity-75 font-mono">Updated</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === "all"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          All Bookmarks ({totalCount})
        </button>
        <button
          onClick={() => setFilter("topics")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === "topics"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          Theory Topics ({customTopicBookmarks.length})
        </button>
        <button
          onClick={() => setFilter("questions")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === "questions"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          6-Mark Questions ({customQuestionBookmarks.length})
        </button>
        <button
          onClick={() => setFilter("diagrams")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            filter === "diagrams"
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          Architectures & Diagrams ({customDiagramBookmarks.length})
        </button>
      </div>

      {/* Content Body */}
      {loaded && totalCount === 0 ? (
        /* Empty State */
        <div className="p-10 md:p-14 text-center rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 space-y-5">
          <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xs">
            <Bookmark className="w-6 h-6" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              No Saved Bookmarks Yet
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              You haven&apos;t added any bookmarks to your personal revision bank. Click the bookmark icon on any theory topic, 6-mark question, or UML diagram while studying to save it here.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/student/learn"
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore Theory Notes</span>
            </Link>

            <Link
              href="/student/exam-prep"
              className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              <span>Practice 6-Mark Questions</span>
            </Link>

            <Link
              href="/student/diagrams"
              className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>UML Diagram Gallery</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Real Bookmarks Grid */
        <div className="space-y-8">
          {/* Topics Section */}
          {(filter === "all" || filter === "topics") && customTopicBookmarks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>Bookmarked Theory Topics ({customTopicBookmarks.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customTopicBookmarks.map((b) => (
                  <Card3D
                    key={b._id}
                    maxTilt={7}
                    glowColor="16, 185, 129"
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                          Unit 0{b.unitNumber} • Theory
                        </span>
                        <button
                          onClick={() => handleDeleteBookmark(b._id, b.url, b.title)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          title="Remove from bookmarks"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                        {b.title}
                      </h4>

                      {b.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {b.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">Saved Topic</span>
                      <Link
                        href={b.url}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center space-x-1"
                      >
                        <span>Open Theory Notes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </Card3D>
                ))}
              </div>
            </div>
          )}

          {/* Questions Section */}
          {(filter === "all" || filter === "questions") && customQuestionBookmarks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                <span>Bookmarked 6-Mark Exam Questions ({customQuestionBookmarks.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customQuestionBookmarks.map((b) => (
                  <Card3D
                    key={b._id}
                    maxTilt={7}
                    glowColor="59, 130, 246"
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-blue-500/30 transition h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 font-mono">
                          Unit 0{b.unitNumber} • 6-Mark Question
                        </span>
                        <button
                          onClick={() => handleDeleteBookmark(b._id, b.url, b.title)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          title="Remove from bookmarks"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                        {b.title}
                      </h4>

                      {b.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {b.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">Exam Bank</span>
                      <Link
                        href={b.url}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center space-x-1"
                      >
                        <span>View Model Answer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </Card3D>
                ))}
              </div>
            </div>
          )}

          {/* Diagrams Section */}
          {(filter === "all" || filter === "diagrams") && customDiagramBookmarks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>Bookmarked UML Architectures ({customDiagramBookmarks.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customDiagramBookmarks.map((b) => (
                  <Card3D
                    key={b._id}
                    maxTilt={7}
                    glowColor="16, 185, 129"
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                          Unit 0{b.unitNumber} • UML Diagram
                        </span>
                        <button
                          onClick={() => handleDeleteBookmark(b._id, b.url, b.title)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          title="Remove from bookmarks"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                        {b.title}
                      </h4>

                      {b.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {b.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">UML Architecture</span>
                      <Link
                        href={b.url}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center space-x-1"
                      >
                        <span>Open Diagram Gallery</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </Card3D>
                ))}
              </div>
            </div>
          )}

          {/* Filter specific empty state */}
          {filter === "topics" && customTopicBookmarks.length === 0 && (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No bookmarked theory topics found.
              </p>
              <Link
                href="/student/learn"
                className="mt-2 inline-block text-xs text-emerald-600 hover:underline font-semibold"
              >
                Browse syllabus topics to bookmark &rarr;
              </Link>
            </div>
          )}

          {filter === "questions" && customQuestionBookmarks.length === 0 && (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No bookmarked 6-mark questions found.
              </p>
              <Link
                href="/student/exam-prep"
                className="mt-2 inline-block text-xs text-blue-600 hover:underline font-semibold"
              >
                Browse exam questions bank &rarr;
              </Link>
            </div>
          )}

          {filter === "diagrams" && customDiagramBookmarks.length === 0 && (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No bookmarked UML diagrams found.
              </p>
              <Link
                href="/student/diagrams"
                className="mt-2 inline-block text-xs text-emerald-600 hover:underline font-semibold"
              >
                Browse reference architectures &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
