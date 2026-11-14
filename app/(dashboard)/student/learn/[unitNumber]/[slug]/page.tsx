"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  GraduationCap,
  Share2,
  Download,
  FileText,
  Video,
} from "lucide-react";
import { TOPICS_DATA, UNITS_DATA } from "@/lib/data/curriculum";
import { formatAnswerMarkdown } from "@/lib/format-answer-markdown";

export default function TopicReaderPage() {
  const params = useParams();
  const router = useRouter();
  const unitNumber = parseInt(params.unitNumber as string, 10);
  const slug = params.slug as string;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const topic = TOPICS_DATA.find(
    (t) => t.unitNumber === unitNumber && t.slug === slug
  );

  const currentUrl = `/student/learn/${unitNumber}/${slug}`;

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.bookmarks)) {
          const exists = data.bookmarks.some((b: any) => b.url === currentUrl);
          if (exists) setIsBookmarked(true);
        }
      })
      .catch(() => {});
  }, [currentUrl]);

  const handleToggleBookmark = async () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      if (!nextState) {
        await fetch(
          `/api/bookmarks?url=${encodeURIComponent(
            currentUrl
          )}&itemId=${encodeURIComponent(topic?.id || "")}`,
          {
            method: "DELETE",
          }
        );
      } else if (topic) {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemType: "topic",
            itemId: topic.id,
            unitNumber: topic.unitNumber,
            title: topic.title,
            subtitle: topic.summary,
            url: currentUrl,
          }),
        });
      }
    } catch {
      // Graceful offline fallback
    }
  };

  const unit = UNITS_DATA.find((u) => u.unitNumber === unitNumber);

  // Find next and previous topics in curriculum order
  const currentIndex = TOPICS_DATA.findIndex((t) => t.id === topic?.id);
  const prevTopic = currentIndex > 0 ? TOPICS_DATA[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < TOPICS_DATA.length - 1
      ? TOPICS_DATA[currentIndex + 1]
      : null;

  if (!topic) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Topic not found
        </h2>
        <Link
          href="/student/learn"
          className="text-sm font-semibold text-emerald-600 hover:underline"
        >
          Return to Learning Directory
        </Link>
      </div>
    );
  }

  const handleMarkComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/student/learn?unit=${unitNumber}`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Unit {unitNumber} Topics</span>
        </Link>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleBookmark}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              isBookmarked
                ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }`}
          >
            <Bookmark
              className="w-3.5 h-3.5"
              fill={isBookmarked ? "currentColor" : "none"}
            />
            <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>

          <button
            onClick={handleMarkComplete}
            disabled={isCompleted}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? "Completed (+15 XP)" : "Mark Complete"}</span>
          </button>
        </div>
      </div>

      {/* Topic Title & Metadata Header */}
      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Unit 0{topic.unitNumber} • Topic 0{topic.order}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
            {topic.examWeightage}
          </span>
          <span className="text-xs text-slate-400 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{topic.estimatedMinutes} mins read</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          {topic.title}
        </h1>

        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {topic.summary}
        </p>

        {/* Companion Material Shortcuts */}
        <div className="pt-2 flex flex-wrap gap-2">
          <Link
            href={`/student/exam-prep?unit=${unitNumber}`}
            className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-medium border border-indigo-200/60 dark:border-indigo-900/50 hover:bg-indigo-100 transition"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Unit {unitNumber} 6-Mark Exam Q&A</span>
          </Link>
          <a
            href={`/docs/unit-wise-imp/Software_Engineering_Unit_${unitNumber}_Complete_Notes.pdf`}
            download
            className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Unit Notes (PDF)</span>
          </a>
        </div>
      </div>

      {/* Main Educational Article Content */}
      <article className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 md:p-10 shadow-sm space-y-4">
        <div
          className="space-y-3 text-slate-800 dark:text-slate-200 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: formatAnswerMarkdown(topic.theoryMarkdown),
          }}
        />
      </article>

      {/* Next & Previous Curriculum Navigation Footer */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevTopic ? (
          <Link
            href={`/student/learn/${prevTopic.unitNumber}/${prevTopic.slug}`}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/40 transition group flex flex-col justify-between"
          >
            <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition" />
              <span>Previous Topic</span>
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mt-1 line-clamp-1">
              {prevTopic.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextTopic ? (
          <Link
            href={`/student/learn/${nextTopic.unitNumber}/${nextTopic.slug}`}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/40 transition group flex flex-col justify-between items-end text-right"
          >
            <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
              <span>Next Topic</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mt-1 line-clamp-1">
              {nextTopic.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

