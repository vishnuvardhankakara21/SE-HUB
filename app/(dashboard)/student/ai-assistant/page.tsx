"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Copy,
  Check,
  ArrowRight,
  HelpCircle,
  Cpu,
  Layers,
  Award,
  PenTool,
  CheckCircle2,
  Lightbulb,
  Key,
  Settings,
  ExternalLink,
  X,
} from "lucide-react";
import RuixenMoonChat from "@/components/ui/ruixen-moon-chat";
import { OrbitalThinkingIndicator } from "@/components/ui/orbital-thinking";
import { StructuredDoubtData } from "@/app/api/ai/doubt-solver/route";

interface ResolvedDoubtItem {
  id: string;
  query: string;
  timestamp: string;
  data: StructuredDoubtData;
}

export default function AiAssistantPage() {
  const [history, setHistory] = useState<ResolvedDoubtItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [activeQuery, setActiveQuery] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [providerPreference, setProviderPreference] = useState<"gemini" | "groq">("gemini");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("se_free_llm_api_key") || "";
      const storedProvider = (localStorage.getItem("se_free_llm_provider") as any) || "gemini";
      setSavedKey(storedKey);
      setApiKeyInput(storedKey);
      setProviderPreference(storedProvider);

      // Check if URL contains ?q= parameter from previous papers or exam bank
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get("q");
      if (queryParam) {
        handleAskAI(queryParam);
      }
    }
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    setSavedKey(trimmed);
    if (typeof window !== "undefined") {
      localStorage.setItem("se_free_llm_api_key", trimmed);
      localStorage.setItem("se_free_llm_provider", providerPreference);
    }
    setShowKeyModal(false);
  };

  const handleClearKey = () => {
    setSavedKey("");
    setApiKeyInput("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("se_free_llm_api_key");
    }
    setShowKeyModal(false);
  };

  const handleAskAI = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isThinking) return;

    setIsThinking(true);
    setActiveQuery(trimmed);

    try {
      const res = await fetch("/api/ai/doubt-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          userApiKey: savedKey || (typeof window !== "undefined" ? localStorage.getItem("se_free_llm_api_key") || undefined : undefined),
          providerPreference: providerPreference || (typeof window !== "undefined" ? (localStorage.getItem("se_free_llm_provider") as any) || "gemini" : "gemini"),
        }),
      });

      const json = await res.json();
      const structured: StructuredDoubtData = json?.structured || {
        title: trimmed,
        unitNumber: 1,
        marks: "6-Marks University Standard",
        markingScheme: "Definition (1M) + Architecture/Process (2.5M) + Comparative Analysis (2.5M)",
        definition: "Software Engineering systematic discipline and process models.",
        keyPoints: [
          {
            title: "SDLC Process Alignment",
            description: "Follow the prescribed university syllabus methodology.",
          },
        ],
        fullModelAnswer: json?.answer || "Explanation prepared for query.",
        diagramRecommendation: "Draw standard architectural model from the 16 Reference Models in sidebar.",
        examTip: "Begin with definitions, illustrate with clear diagrams, and conclude with real-world examples.",
        source: "general_ai",
      };

      const newItem: ResolvedDoubtItem = {
        id: Math.random().toString(36).substring(2, 9),
        query: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        data: structured,
      };

      setHistory((prev) => [newItem, ...prev]);

      // Smooth scroll to top of answers
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      // Fallback
    } finally {
      setIsThinking(false);
      setActiveQuery("");
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clean LaTeX math symbols into crystal-clear human-readable student formulas
  const cleanMathSymbols = (text: string): string => {
    return text
      .replace(/\$\$(.*?)\$\$/g, "$1") // Strip block $$...$$
      .replace(/\$(.*?)\$/g, "$1") // Strip inline $...$
      .replace(/\\times/g, "×")
      .replace(/\\cdot/g, "·")
      .replace(/\\div/g, "÷")
      .replace(/\\pm/g, "±")
      .replace(/\\approx/g, "≈")
      .replace(/\\neq/g, "≠")
      .replace(/\\leq/g, "≤")
      .replace(/\\le(?![a-zA-Z])/g, "≤")
      .replace(/\\geq/g, "≥")
      .replace(/\\ge(?![a-zA-Z])/g, "≥")
      .replace(/\\sum/g, "∑")
      .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
      .replace(/\\text\{([^}]+)\}/g, "$1")
      .replace(/\\mathbf\{([^}]+)\}/g, "$1")
      .replace(/\\mathit\{([^}]+)\}/g, "$1")
      .replace(/\\left/g, "")
      .replace(/\\right/g, "")
      .replace(/\\_/g, "_");
  };

  // Clean Markdown & Math renderer
  const renderFormattedMarkdown = (content: string) => {
    const paragraphs = content.split(/\n\n+/);

    return paragraphs.map((para, pIdx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Header 3 or 2
      if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
        const title = cleanMathSymbols(trimmed.replace(/^#+\s*/, ""));
        return (
          <h5 key={pIdx} className="text-sm font-bold text-neutral-900 dark:text-white pt-2 pb-1 border-b border-neutral-100 dark:border-neutral-800">
            {title}
          </h5>
        );
      }

      // Standalone Equation / Formula Block Detection
      const isEquationBlock =
        trimmed.startsWith("$$") ||
        (trimmed.includes("=") &&
          (/\b(Effort|TDEV|Tdev|V\(G\)|Cyclomatic|DRE|KLOC|COCOMO|UFP|FP|LOC)\b/i.test(trimmed) ||
            /^[A-Z]\([A-Za-z]+\)\s*=/.test(trimmed) ||
            /^[A-Za-z]+\s*=\s*[a-z0-9\(\)]+[\s\*\×\+\-\^]/.test(trimmed)));

      if (isEquationBlock && !trimmed.includes("\n- ") && !trimmed.startsWith("- ")) {
        const cleanedFormula = cleanMathSymbols(trimmed);
        return (
          <div
            key={pIdx}
            className="my-3 p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/25 dark:border-amber-500/20 space-y-1.5 shadow-xs"
          >
            <div className="flex items-center space-x-1.5 text-[10px] font-bold font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Standard University Exam Formula</span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-amber-200 tracking-wide select-all leading-relaxed whitespace-pre-line">
              {cleanedFormula}
            </div>
          </div>
        );
      }

      // Markdown Table Detection
      if (trimmed.includes("|") && trimmed.includes("-|-") || (trimmed.startsWith("|") && trimmed.endsWith("|"))) {
        const rows = trimmed.split("\n").filter((r) => r.trim().startsWith("|") && !r.includes("---"));
        if (rows.length >= 2) {
          const headerCols = rows[0]
            .split("|")
            .filter((c, i, a) => i > 0 && i < a.length - 1)
            .map((c) => cleanMathSymbols(c.trim()));
          const bodyRows = rows.slice(1).map((r) =>
            r
              .split("|")
              .filter((c, i, a) => i > 0 && i < a.length - 1)
              .map((c) => cleanMathSymbols(c.trim()))
          );

          return (
            <div key={pIdx} className="overflow-x-auto my-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100 dark:bg-neutral-900 font-bold text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    {headerCols.map((h, hIdx) => (
                      <th key={hIdx} className="p-2.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {bodyRows.map((cols, rIdx) => (
                    <tr key={rIdx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                      {cols.map((col, cIdx) => (
                        <td key={cIdx} className="p-2.5 text-neutral-700 dark:text-neutral-300">
                          {col}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Bullet points
      if (trimmed.includes("\n- ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const lines = trimmed.split("\n").filter(Boolean);
        return (
          <ul key={pIdx} className="space-y-1.5 my-2 pl-2">
            {lines.map((line, lIdx) => {
              const cleanLine = line.replace(/^[-*]\s*/, "");
              const formattedLine = cleanMathSymbols(cleanLine.replace(/\*\*(.*?)\*\*/g, "$1"));
              return (
                <li key={lIdx} className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{formattedLine}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Numbered items
      if (/^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split("\n").filter(Boolean);
        return (
          <ol key={pIdx} className="space-y-1.5 my-2 pl-2 list-decimal list-inside text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            {lines.map((line, lIdx) => (
              <li key={lIdx} className="leading-relaxed">
                {cleanMathSymbols(line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1"))}
              </li>
            ))}
          </ol>
        );
      }

      // Standard text with bold cleaning and math symbol cleanup
      const cleanPara = cleanMathSymbols(trimmed.replace(/\*\*(.*?)\*\*/g, "$1"));
      return (
        <p key={pIdx} className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {cleanPara}
        </p>
      );
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Academic Doubt Resolution Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Software Engineering AI Assistant
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
            Ask any question regarding the 5-unit syllabus, 79 exam questions, UML diagrams, or numericals. Get instant structured model answers with marking breakdowns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition shadow-xs"
            title="Configure Free LLM API (Google Gemini / Groq)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {savedKey
                ? savedKey.startsWith("AIza")
                  ? "Gemini 1.5 Flash (Active)"
                  : "Groq Llama 3.3 (Active)"
                : "Free AI Engine (Auto)"}
            </span>
            <Settings className="w-3 h-3 text-neutral-400 ml-1" />
          </button>

          <Link
            href="/student/exam-prep"
            className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition"
          >
            Exam Bank (79 Qs)
          </Link>
          <Link
            href="/student/learn"
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold transition shadow-xs"
          >
            Theory Notes
          </Link>
        </div>
      </div>

      {/* Free LLM API Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Free LLM API Integration
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Connect Google Gemini or Groq at zero cost
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
              <p className="leading-relaxed">
                The platform includes built-in academic RAG synthesis for all 5 units. To unlock open-ended AI answers across any topic, you can paste your own <strong>100% Free</strong> API key:
              </p>

              {/* Steps to get Free Key */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
                  <span>How to get a Free Google Gemini API Key:</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-[11px] underline hover:text-amber-700 dark:hover:text-amber-200"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  <li>Visit <strong>Google AI Studio</strong> (aistudio.google.com).</li>
                  <li>Click <strong>"Get API key"</strong> &gt; <strong>"Create API key"</strong>.</li>
                  <li>No credit card required (1,500 free requests per day).</li>
                  <li>Copy and paste your key below (starts with <code className="font-mono">AIza...</code>).</li>
                </ol>
              </div>

              <form onSubmit={handleSaveKey} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider font-mono text-neutral-700 dark:text-neutral-300 mb-1">
                    Free API Key (Gemini or Groq)
                  </label>
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy... or gsk_..."
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Saved locally in your browser storage only. Never sent to third parties.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {savedKey ? (
                    <button
                      type="button"
                      onClick={handleClearKey}
                      className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition"
                    >
                      Remove Key
                    </button>
                  ) : <div />}

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowKeyModal(false)}
                      className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Moon Chat Input Component */}
      <RuixenMoonChat
        onSubmit={handleAskAI}
        isLoading={isThinking}
        onQuickAction={(prompt) => handleAskAI(prompt)}
      />

      {/* Orbital Loading Effect Displayed While AI is Reasoning */}
      {isThinking && (
        <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 text-center">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              Processing Query:
            </span>
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
              "{activeQuery}"
            </p>
          </div>
          <OrbitalThinkingIndicator statusText="Analyzing Syllabus & Composing Model Solution..." />
        </div>
      )}

      {/* Answers History Section: Rendered in 100% Structured Format */}
      <div ref={resultsRef} />
      {history.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>Resolved Academic Doubts ({history.length})</span>
            </h3>
            <button
              onClick={() => setHistory([])}
              className="text-[11px] text-neutral-400 hover:text-rose-500 transition"
            >
              Clear Session
            </button>
          </div>

          <div className="space-y-6">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md space-y-6 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* 1. Header with Badges and Query Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.data.unitNumber && (
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          Unit 0{item.data.unitNumber}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {item.data.marks}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60">
                        {item.data.source === "gemini"
                          ? "✨ Generated by Google Gemini 1.5/2.0 Live LLM"
                          : item.data.source === "groq"
                          ? "⚡ Generated by Groq Llama 3.3 70B"
                          : item.data.source === "exam_bank"
                          ? "ANITS Exam Bank Model Answer"
                          : "Syllabus Curriculum Notes"}
                      </span>
                    </div>
                    <h4 className="text-lg font-extrabold text-neutral-900 dark:text-white pt-1">
                      {item.data.title}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
                    {item.data.unitNumber && (
                      <Link
                        href={`/student/learn/${item.data.unitNumber}`}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition flex items-center space-x-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Unit Notes</span>
                      </Link>
                    )}
                    <button
                      onClick={() => handleCopy(item.id, `${item.data.title}\n\nDefinition:\n${item.data.definition}\n\nModel Answer:\n${item.data.fullModelAnswer}\n\nMarking Scheme:\n${item.data.markingScheme}`)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                      title="Copy Model Solution"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Formal University Definition Callout */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Formal Academic Definition</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                    {item.data.definition}
                  </p>
                </div>

                {/* 3. Core Architectural / Theoretical Points */}
                {item.data.keyPoints && item.data.keyPoints.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                      Key Technical Pillars
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {item.data.keyPoints.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200/80 dark:border-neutral-800/80 space-y-1"
                        >
                          <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{point.title}</span>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {point.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Full Examination Model Answer */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                    Step-by-Step Model Examination Solution
                  </div>
                  <div className="p-5 rounded-2xl bg-neutral-50/70 dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800/60 space-y-2">
                    {renderFormattedMarkdown(item.data.fullModelAnswer)}
                  </div>
                </div>

                {/* 4.5 Aligned Visual Block / Line Diagram View */}
                {item.data.diagramAscii && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-500" />
                        <span>System Architecture Block / Line Diagram</span>
                      </div>
                      <button
                        onClick={() => handleCopy(`${item.id}-diag`, item.data.diagramAscii || "")}
                        className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedId === `${item.id}-diag` ? "Copied Diagram" : "Copy Diagram"}</span>
                      </button>
                    </div>
                    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 text-emerald-400 font-mono text-xs border border-emerald-500/25 shadow-inner overflow-x-auto whitespace-pre leading-relaxed select-all">
                      {item.data.diagramAscii}
                    </div>
                  </div>
                )}

                {/* 5. Recommended Architecture Figure & Marking Scheme */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Marking Scheme */}
                  <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 space-y-1.5">
                    <div className="flex items-center space-x-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 font-mono uppercase tracking-wider">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Exam Marking Scheme</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.data.markingScheme}
                    </p>
                  </div>

                  {/* Diagram Recommendation */}
                  <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 font-mono uppercase tracking-wider">
                        <PenTool className="w-4 h-4 text-emerald-500" />
                        <span>Recommended Diagram</span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1">
                        {item.data.diagramRecommendation || "Draw corresponding standard UML diagram."}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <Link
                        href="/student/diagrams/studio"
                        className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                      >
                        <span>Open Drawing Studio</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <span className="text-neutral-300 dark:text-neutral-700">•</span>
                      <Link
                        href="/student/diagrams"
                        className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:underline flex items-center space-x-1"
                      >
                        <span>16 Reference Diagrams</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 6. Golden Exam Preparation Tip */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">University Exam Preparation Tip: </span>
                    <span className="leading-relaxed">{item.data.examTip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
