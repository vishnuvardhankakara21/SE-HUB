"use client";

import React, { useState } from "react";
import { ExamQuestion } from "@/lib/data/questions";
import { formatAnswerMarkdown } from "@/lib/format-answer-markdown";
import {
  Bookmark,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Award,
} from "lucide-react";

interface QuestionCardProps {
  question: ExamQuestion;
  isBookmarked?: boolean;
  onToggleBookmark?: (questionId: string) => void;
}

export function QuestionCard({
  question,
  isBookmarked = false,
  onToggleBookmark,
}: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${question.question}\n\n${question.answerMarkdown}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden transition-all duration-200">
      {/* Question Header */}
      <div className="p-5 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20">
        <div className="flex-1">
          <div className="flex items-center space-x-2.5 mb-2 text-xs font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
              Q{question.questionNumber} • {question.marks} Marks
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="uppercase tracking-wider text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              {question.priority} Priority
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {question.question}
          </h3>

          <div className="mt-2 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-medium">Marking Scheme:</span>
            <span>{question.markingScheme}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => onToggleBookmark?.(question.id)}
            className={`p-2 rounded-xl transition ${
              isBookmarked
                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Save Question"}
          >
            <Bookmark
              className="w-4 h-4"
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Copy Model Answer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Answer Content */}
      {isOpen && (
        <div className="p-6 space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {/* Exam Tip Callout */}
          {question.examTips && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex items-start space-x-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-300">
                <span className="font-bold">Faculty Exam Strategy Tip: </span>
                {question.examTips}
              </div>
            </div>
          )}

          {/* Formatted Markdown Body */}
          <div
            className="space-y-2 text-slate-800 dark:text-slate-200"
            dangerouslySetInnerHTML={{
              __html: formatAnswerMarkdown(question.answerMarkdown),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default QuestionCard;

