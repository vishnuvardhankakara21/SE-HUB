"use client";

import React, { useState } from "react";
import { ExamQuestion } from "@/lib/data/questions";
import {
  Bookmark,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Award,
} from "lucide-react";
import { Card3D } from "@/components/ui/Card3D";

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
    <Card3D
      maxTilt={4}
      glowColor="16, 185, 129"
      className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden transition-all duration-200"
    >
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
          <div className="prose dark:prose-invert prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h3:text-sm prose-h3:mt-4 prose-h3:mb-2 prose-p:text-xs prose-p:leading-relaxed prose-li:text-xs prose-table:text-xs">
            <div
              dangerouslySetInnerHTML={{
                __html: formatMarkdownToHtml(question.answerMarkdown),
              }}
            />
          </div>
        </div>
      )}
    </Card3D>
  );
}

// Lightweight, deterministic Markdown renderer preserving headings, lists, tables & code blocks
function formatMarkdownToHtml(markdown: string): string {
  // First convert markdown tables
  let formatted = markdown.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
    const lines = match.trim().split("\n");
    if (lines.length < 2) return match;
    const headerLine = lines[0];
    const isDivider = lines[1].includes("---") || lines[1].includes(":-");
    if (!isDivider) return match;
    const headers = headerLine
      .split("|")
      .filter((c, i, arr) => i > 0 && i < arr.length - 1)
      .map(
        (c) =>
          `<th class="px-3 py-2 text-left font-bold border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80">${c.trim()}</th>`
      )
      .join("");
    const bodyLines = lines.slice(2);
    const bodyRows = bodyLines
      .map((row) => {
        const cells = row
          .split("|")
          .filter((c, i, arr) => i > 0 && i < arr.length - 1)
          .map(
            (c) =>
              `<td class="px-3 py-2 border border-slate-200 dark:border-slate-800">${c.trim()}</td>`
          )
          .join("");
        return `<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">${cells}</tr>`;
      })
      .join("");
    return `<div class="overflow-x-auto my-3"><table class="w-full text-xs border-collapse border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
  });

  let html = formatted
    // Code blocks / ASCII diagrams
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="p-3 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto my-3 leading-tight border border-neutral-800">$1</pre>'
    )
    // Inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">$1</code>'
    )
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="font-bold text-sm text-neutral-900 dark:text-white mt-4 mb-1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-bold text-base text-neutral-900 dark:text-white mt-5 mb-2">$1</h2>')
    // Bold & italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-neutral-900 dark:text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Blockquotes
    .replace(
      /^> (.*$)/gim,
      '<blockquote class="border-l-4 border-emerald-500 pl-3 py-1 my-2 text-xs italic text-neutral-600 dark:text-neutral-400 bg-emerald-50/20 dark:bg-emerald-950/20 rounded-r-lg">$1</blockquote>'
    )
    // Unordered lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-xs my-0.5">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-xs my-0.5">$1</li>')
    // Ordered lists
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 list-decimal text-xs my-0.5">$2</li>')
    // Paragraph breaks
    .replace(/\n\n/g, '<div class="h-2"></div>');

  return html;
}

export default QuestionCard;

