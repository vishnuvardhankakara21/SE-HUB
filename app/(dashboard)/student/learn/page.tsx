"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { UNITS_DATA, TOPICS_DATA } from "@/lib/data/curriculum";

function LearnIndexView() {
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const [selectedUnit, setSelectedUnit] = useState<number>(
    unitParam ? parseInt(unitParam, 10) : 0
  );

  const filteredTopics =
    selectedUnit === 0
      ? TOPICS_DATA
      : TOPICS_DATA.filter((t) => t.unitNumber === selectedUnit);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Theory & Concept Explanations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Software Engineering Knowledge Base
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Syllabus-aligned theory concepts retaining the complete explanations,
            ASCII architectures, and mathematical formulas from the university notes.
          </p>
        </div>

        {/* Unit Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setSelectedUnit(0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedUnit === 0
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Units
          </button>
          {[1, 2, 3, 4, 5].map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUnit(u)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedUnit === u
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Unit {u}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Unit 0{topic.unitNumber}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
                  {topic.examWeightage}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
                {topic.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {topic.summary}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{topic.estimatedMinutes} mins read</span>
              </span>

              <Link
                href={`/student/learn/${topic.unitNumber}/${topic.slug}`}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center space-x-1"
              >
                <span>Read Full Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LearnIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading Learning Modules...
        </div>
      }
    >
      <LearnIndexView />
    </Suspense>
  );
}
