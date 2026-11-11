"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Award,
  ArrowRight,
  Clock,
  Layers,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UNITS_DATA } from "@/lib/data/curriculum";
import { CANONICAL_QUIZZES } from "@/lib/data/quizzes";


function QuizView() {
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const [selectedUnit, setSelectedUnit] = useState<number>(
    unitParam ? parseInt(unitParam, 10) : 1
  );

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const currentQuiz = CANONICAL_QUIZZES[selectedUnit] || CANONICAL_QUIZZES[1];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score / currentQuiz.questions.length >= 0.7) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    // Persist real quiz attempt and award real XP to database
    try {
      const answersPayload = Object.entries(selectedAnswers).map(([k, v]) => ({
        questionIndex: parseInt(k, 10),
        selectedOption: v,
      }));
      fetch(`/api/quizzes/${selectedUnit}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersPayload }),
      }).catch(() => {});
    } catch {
      // Graceful offline fallback
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const score = calculateScore();
  const total = currentQuiz.questions.length;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Unit-Wise Software Engineering Quizzes & MCQs
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Evaluate your understanding with instant grading, immediate
          explanations for every option, and score tracking.
        </p>
      </div>

      {/* Unit Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {[1, 2, 3, 4, 5].map((u) => {
          const isSelected = u === selectedUnit;
          return (
            <button
              key={u}
              onClick={() => {
                setSelectedUnit(u);
                setSelectedAnswers({});
                setIsSubmitted(false);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider">
                Unit 0{u}
              </div>
              <div className="text-xs font-bold mt-0.5">Mastery Quiz</div>
            </button>
          );
        })}
      </div>

      {/* Quiz Container */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6">
        {/* Quiz Title Banner */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              Unit {selectedUnit} MCQ Test
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
              {currentQuiz.title}
            </h2>
          </div>

          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentQuiz.questions.length} Questions</span>
          </div>
        </div>

        {/* Score Card on Submit */}
        {isSubmitted && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xl shadow-md">
                {percentage}%
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Test Completed: {score} out of {total} Correct
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {percentage >= 75
                    ? "Excellent performance! Ready for university examination questions."
                    : "Good attempt! Review the question explanations below."}
                </p>
              </div>
            </div>

            <button
              onClick={handleRetake}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {currentQuiz.questions.map((q, qIdx) => {
            const userAnswer = selectedAnswers[qIdx];
            const isAnswered = userAnswer !== undefined;

            let isCorrectOption = false;

            return (
              <div
                key={qIdx}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {qIdx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {q.questionText}
                  </h4>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isCorrect = optIdx === q.correctOptionIndex;

                    let btnStyle =
                      "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 text-slate-800 dark:text-slate-200";

                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle =
                          "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300";
                      }
                    } else if (isSelected) {
                      btnStyle =
                        "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold";
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-5 h-5 rounded-md border border-current text-[11px] font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isSubmitted && isCorrect && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            Correct
                          </span>
                        )}
                        {isSubmitted && isSelected && !isCorrect && (
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            Incorrect
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Post-Submit Explanation */}
                {isSubmitted && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      Faculty Explanation:{" "}
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Action Button */}
        {!isSubmitted && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={
                Object.keys(selectedAnswers).length <
                currentQuiz.questions.length
              }
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
            >
              <span>Submit & Check Answers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizzesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading Quiz Engine...
        </div>
      }
    >
      <QuizView />
    </Suspense>
  );
}
