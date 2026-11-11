"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { UNITS_DATA, TOPICS_DATA } from "@/lib/data/curriculum";

export default function SyllabusPage() {
  const [selectedUnit, setSelectedUnit] = useState<number>(1);

  const activeUnit =
    UNITS_DATA.find((u) => u.unitNumber === selectedUnit) || UNITS_DATA[0];
  const unitTopics = TOPICS_DATA.filter(
    (t) => t.unitNumber === selectedUnit
  ).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>University Curriculum Roadmap</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Software Engineering Syllabus (5 Units • 60 Periods)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Authoritative academic curriculum structure. Select a unit to inspect
          prescribed lecture periods, key learning outcomes, subtopics, and
          associated exam preparation resources.
        </p>
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
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? "text-emerald-100"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  Unit 0{unit.unitNumber}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isSelected
                      ? "bg-emerald-700/50 text-emerald-100"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  12P
                </span>
              </div>
              <h3 className="text-xs font-bold line-clamp-2 leading-snug">
                {unit.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Detailed Unit View */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6">
        {/* Unit Summary Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                Unit 0{activeUnit.unitNumber}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeUnit.periods} Prescribed Academic Periods
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {activeUnit.title}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              {activeUnit.description}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Link
              href={`/student/exam-prep?unit=${activeUnit.unitNumber}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Unit {activeUnit.unitNumber} 6-Mark Q&A</span>
            </Link>
            <Link
              href={`/student/quizzes?unit=${activeUnit.unitNumber}`}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Practice Quiz</span>
            </Link>
          </div>
        </div>

        {/* Prescribed Learning Outcomes */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Prescribed Learning Outcomes
            </h4>
          </div>
          <ul className="space-y-1.5">
            {activeUnit.learningOutcomes.map((outcome, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2"
              >
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {idx + 1}.
                </span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Topics Breakdown */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Syllabus Topics & Detailed Explanations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950/40 hover:border-emerald-500/50 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Topic 0{topic.order}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded border border-rose-200/60 dark:border-rose-900/40">
                      {topic.examWeightage}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
                    {topic.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>~{topic.estimatedMinutes} mins read</span>
                  </span>

                  <Link
                    href={`/student/learn/${topic.unitNumber}/${topic.slug}`}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center space-x-1"
                  >
                    <span>Read Topic</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

