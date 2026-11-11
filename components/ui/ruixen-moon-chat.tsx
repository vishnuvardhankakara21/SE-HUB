"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  FileUp,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  Code2,
  Palette,
  Layers,
  Rocket,
  Sparkles,
  BookOpen,
  GraduationCap,
  PenTool,
} from "lucide-react";

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`; // reset first
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export interface RuixenMoonChatProps {
  onSubmit?: (message: string) => Promise<void> | void;
  isLoading?: boolean;
  onQuickAction?: (label: string) => void;
  className?: string;
  hideHeader?: boolean;
}

export default function RuixenMoonChat({
  onSubmit,
  isLoading = false,
  onQuickAction,
  className,
  hideHeader = false,
}: RuixenMoonChatProps) {
  const [message, setMessage] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 150,
  });

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    setMessage("");
    adjustHeight(true);
    if (onSubmit) {
      await onSubmit(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActionClick = (label: string, promptText?: string) => {
    if (onQuickAction) {
      onQuickAction(promptText || label);
    } else if (onSubmit) {
      onSubmit(promptText || label);
    } else {
      setMessage(promptText || label);
    }
  };

  const canSubmit = message.trim().length > 0 && !isLoading;

  return (
    <div
      className={cn(
        "relative w-full rounded-3xl overflow-hidden bg-cover bg-center flex flex-col items-center border border-neutral-800/80 shadow-2xl p-6 sm:p-10",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(10, 10, 12, 0.88), rgba(10, 10, 12, 0.95)), url('https://cdn.21st.dev/assets/mirror/c3/c333918af688a4a8a3d004652e6c0ee219457a9d84d380eeb31f513d4b59a09f.png')",
        backgroundAttachment: "local",
      }}
    >
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Centered AI Title */}
      {!hideHeader && (
        <div className="w-full flex flex-col items-center justify-center text-center mb-8 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Academic Reasoning Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Software Engineering Assistant
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-300 max-w-xl">
            Ask any question on 5-unit curriculum, 79 exam questions, UML diagrams, or cyclomatic complexity calculations.
          </p>
        </div>
      )}

      {/* Input Box Section */}
      <div className="w-full max-w-3xl relative z-10">
        <div className="relative bg-black/70 backdrop-blur-xl rounded-2xl border border-neutral-700/80 shadow-xl transition-all focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "AI is reasoning and analyzing the syllabus..." : "Ask your software engineering question or paste an exam doubt..."}
            className={cn(
              "w-full px-5 py-4 resize-none border-none",
              "bg-transparent text-white text-sm",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-neutral-500 min-h-[56px] leading-relaxed"
            )}
            style={{ overflow: "hidden" }}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800/60">
            <div className="flex items-center space-x-1">
              <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
                Press Enter to send, Shift + Enter for new line
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleSend}
                disabled={!canSubmit}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md",
                  canSubmit
                    ? "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 cursor-pointer shadow-emerald-500/20"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                )}
              >
                <span>{isLoading ? "Thinking..." : "Send Doubt"}</span>
                <ArrowUpIcon className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Exam Actions */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mt-6">
          <QuickAction
            icon={<Rocket className="w-3.5 h-3.5 text-emerald-400" />}
            label="Explain Spiral Model"
            onClick={() => handleActionClick("Explain Spiral Model", "Explain Spiral Model with risk analysis diagram")}
          />
          <QuickAction
            icon={<Code2 className="w-3.5 h-3.5 text-cyan-400" />}
            label="Cyclomatic Complexity V(G)"
            onClick={() => handleActionClick("Cyclomatic Complexity V(G)", "How to calculate Cyclomatic Complexity V(G) with control flow graph?")}
          />
          <QuickAction
            icon={<Layers className="w-3.5 h-3.5 text-indigo-400" />}
            label="IEEE 830 SRS Standard"
            onClick={() => handleActionClick("IEEE 830 SRS Standard", "What is SRS according to IEEE 830 standard?")}
          />
          <QuickAction
            icon={<Palette className="w-3.5 h-3.5 text-amber-400" />}
            label="Cohesion vs Coupling"
            onClick={() => handleActionClick("Cohesion vs Coupling", "Differentiate Cohesion and Coupling with types and marking criteria")}
          />
          <QuickAction
            icon={<GraduationCap className="w-3.5 h-3.5 text-rose-400" />}
            label="COCOMO Equations"
            onClick={() => handleActionClick("COCOMO Equations", "Explain Basic COCOMO effort and time calculation with equations")}
          />
          <QuickAction
            icon={<PenTool className="w-3.5 h-3.5 text-emerald-400" />}
            label="Verification vs Validation"
            onClick={() => handleActionClick("Verification vs Validation", "Explain Difference between Verification and Validation in Software Engineering")}
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 text-xs px-3.5 py-1.5 transition-all shadow-xs"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}

