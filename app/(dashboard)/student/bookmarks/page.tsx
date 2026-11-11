"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, BookOpen, GraduationCap, ArrowRight, Trash2, Layers } from "lucide-react";
import { TOPICS_DATA } from "@/lib/data/curriculum";
import { EXAM_QUESTIONS } from "@/lib/data/questions";

interface ApiBookmark {
  _id: string;
  itemType: "topic" | "question" | "diagram";
  unitNumber: number;
  title: string;
  subtitle?: string;
  url: string;
}

export default function BookmarksPage() {
  const [filter, setFilter] = useState<"all" | "topics" | "questions">("all");
  const [liveBookmarks, setLiveBookmarks] = useState<ApiBookmark[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.bookmarks)) {
          setLiveBookmarks(data.bookmarks);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const handleDeleteBookmark = async (id: string) => {
    setLiveBookmarks((prev) => prev.filter((b) => b._id !== id));
    try {
      await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete bookmark:", e);
    }
  };

  const sampleBookmarkedTopics = [TOPICS_DATA[0], TOPICS_DATA[2]];
  const sampleBookmarkedQuestions = [EXAM_QUESTIONS[0], EXAM_QUESTIONS[3]];

  const customTopicBookmarks = liveBookmarks.filter((b) => b.itemType === "topic");
  const customQuestionBookmarks = liveBookmarks.filter((b) => b.itemType === "question");

  const totalCount =
    liveBookmarks.length > 0
      ? liveBookmarks.length
      : sampleBookmarkedTopics.length + sampleBookmarkedQuestions.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Personal Revision Tray</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Saved Concepts & Important Questions
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
          Quick access to bookmarked syllabus topics, definitions, and 6-mark
          exam questions for rapid last-minute revision.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        {(["all", "topics", "questions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              filter === tab
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            {tab === "all"
              ? `All Bookmarks (${totalCount})`
              : tab === "topics"
              ? `Theory Topics (${customTopicBookmarks.length > 0 ? customTopicBookmarks.length : sampleBookmarkedTopics.length})`
              : `6-Mark Questions (${customQuestionBookmarks.length > 0 ? customQuestionBookmarks.length : sampleBookmarkedQuestions.length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="space-y-6">
        {/* Topics Section */}
        {(filter === "all" || filter === "topics") && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bookmarked Theory Topics</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customTopicBookmarks.length > 0 ? (
                customTopicBookmarks.map((b) => (
                  <div
                    key={b._id}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          Unit 0{b.unitNumber}
                        </span>
                        <button
                          onClick={() => handleDeleteBookmark(b._id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                        {b.title}
                      </h4>
                      {b.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {b.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Custom Bookmark</span>
                      <Link
                        href={b.url}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center space-x-1"
                      >
                        <span>Open Resource</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                sampleBookmarkedTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Unit 0{topic.unitNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                        {topic.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {topic.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        ~{topic.estimatedMinutes} mins
                      </span>
                      <Link
                        href={`/student/learn/${topic.unitNumber}/${topic.slug}`}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center space-x-1"
                      >
                        <span>Read Notes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Questions Section */}
        {(filter === "all" || filter === "questions") && (
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Bookmarked 6-Mark Exam Questions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customQuestionBookmarks.length > 0 ? (
                customQuestionBookmarks.map((b) => (
                  <div
                    key={b._id}
                    className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          Unit 0{b.unitNumber} • 6-Mark
                        </span>
                        <button
                          onClick={() => handleDeleteBookmark(b._id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                        {b.title}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Custom Bookmark</span>
                      <Link
                        href={b.url}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center space-x-1"
                      >
                        <span>View Model Answer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                sampleBookmarkedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-semibold">
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                          Unit 0{q.unitNumber} • 6-Mark
                        </span>
                        <span className="text-neutral-400">•</span>
                        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          {q.priority} Priority
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-2 leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">
                        {q.markingScheme}
                      </span>
                      <Link
                        href={`/student/exam-prep?unit=${q.unitNumber}`}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center space-x-1"
                      >
                        <span>View Model Answer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

