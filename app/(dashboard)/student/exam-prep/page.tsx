"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  FileText,
  Award,
  Layers,
} from "lucide-react";
import { EXAM_QUESTIONS, ExamQuestion } from "@/lib/data/questions";
import { UNITS_DATA } from "@/lib/data/curriculum";
import { QuestionCard } from "@/components/reader/QuestionCard";

function ExamPrepView() {
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const [selectedUnit, setSelectedUnit] = useState<number>(
    unitParam ? parseInt(unitParam, 10) : 1
  );
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.bookmarks)) {
          const ids = data.bookmarks
            .filter((b: any) => b.itemType === "question")
            .map((b: any) => b.itemId || b._id);
          setBookmarkedIds((prev) => Array.from(new Set([...prev, ...ids])));
        }
      })
      .catch(() => {});
  }, []);

  const toggleBookmark = async (id: string) => {
    const isCurrentlyBookmarked = bookmarkedIds.includes(id);
    setBookmarkedIds((prev) =>
      isCurrentlyBookmarked ? prev.filter((item) => item !== id) : [...prev, id]
    );

    const questionObj = EXAM_QUESTIONS.find((q) => q.id === id);
    if (!questionObj) return;

    try {
      if (isCurrentlyBookmarked) {
        await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemType: "question",
            itemId: id,
            unitNumber: questionObj.unitNumber,
            title: questionObj.question,
            subtitle: `${questionObj.marks} Marks • ${questionObj.markingScheme}`,
            url: `/student/exam-prep?unit=${questionObj.unitNumber}`,
          }),
        });
      }
    } catch {
      // Graceful offline fallback
    }
  };

  const filteredQuestions = EXAM_QUESTIONS.filter((q) => {
    const matchesUnit = q.unitNumber === selectedUnit;
    const matchesPriority =
      priorityFilter === "all" || q.priority === priorityFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answerMarkdown.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUnit && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Semester Examination Preparation</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Unit-Wise 6-Mark Important Questions & Model Answers
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            Authoritative, university exam-ready model answers. Retaining
            exact definitions, step-by-step points, sketches, and marking
            breakdowns.
          </p>
        </div>

        {/* Download PDF Button */}
        <a
          href={`/docs/unit-wise-imp/Software_Engineering_Unit_${selectedUnit}_Complete_Notes.pdf`}
          download
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>Download Unit {selectedUnit} Answers (PDF)</span>
        </a>
      </div>

      {/* Unit Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {UNITS_DATA.map((unit) => {
          const isSelected = unit.unitNumber === selectedUnit;
          return (
            <button
              key={unit.unitNumber}
              onClick={() => setSelectedUnit(unit.unitNumber)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-md ring-2 ring-emerald-500/30"
                  : "bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? "text-emerald-400 dark:text-emerald-600"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  Unit 0{unit.unitNumber}
                </span>
                <span
                  className={`text-[10px] font-mono px-1 rounded ${
                    isSelected
                      ? "bg-neutral-800 text-neutral-200 dark:bg-neutral-200 dark:text-neutral-800"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                  }`}
                >
                  6-Mark
                </span>
              </div>
              <h3 className="text-xs font-bold line-clamp-1">{unit.title}</h3>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs text-neutral-400 font-medium">
            Priority:
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-2.5 py-1 text-xs text-neutral-800 dark:text-neutral-200 focus:outline-none font-medium cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
          </select>
        </div>
      </div>

      {/* 6-Mark Marking Blueprint Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-teal-50/60 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-900/40 flex items-start space-x-3">
        <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="font-bold text-slate-900 dark:text-white">
            University 6-Mark Evaluation Scheme for Software Engineering:
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400">
            <span>• 1. Formal Definition: 1 Mark</span>
            <span>• 2. Labelled Diagram / Architecture Sketch: 1–2 Marks</span>
            <span>• 3. Stepwise Explanation / Phases: 2 Marks</span>
            <span>• 4. Advantages / Disadvantages / Conclusion: 1 Mark</span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              isBookmarked={bookmarkedIds.includes(q.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No questions match your current filters.
            </p>
            <button
              onClick={() => {
                setPriorityFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs text-emerald-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExamPrepPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading Exam Preparation Bank...
        </div>
      }
    >
      <ExamPrepView />
    </Suspense>
  );
}
