"use client";

import React from "react";
import Image from "next/image";
import { DiagramMetadata } from "@/lib/data/diagrams";
import { Maximize2, Download, PenTool, Layers, Bookmark } from "lucide-react";
import { Card3D } from "@/components/ui/Card3D";

interface DiagramReferenceCardProps {
  diagram: DiagramMetadata;
  isBookmarked?: boolean;
  onPreview: (diagram: DiagramMetadata) => void;
  onOpenInStudio: (diagram: DiagramMetadata) => void;
  onToggleBookmark?: (diagram: DiagramMetadata) => void;
}

export function DiagramReferenceCard({
  diagram,
  isBookmarked = false,
  onPreview,
  onOpenInStudio,
  onToggleBookmark,
}: DiagramReferenceCardProps) {
  const getDomainColor = (domain: string) => {
    switch (domain) {
      case "Library":
        return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20";
      case "LMS":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      case "University":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      case "Banking":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20";
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Activity":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      case "StateChart":
        return "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400 border-violet-200 dark:border-violet-800";
      case "Component":
        return "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400 border-sky-200 dark:border-sky-800";
      case "Deployment":
        return "bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 border-teal-200 dark:border-teal-800";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400";
    }
  };

  return (
    <Card3D
      maxTilt={8}
      glowColor="16, 185, 129"
      className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col overflow-hidden h-full"
    >
      {/* Thumbnail Header with Quick Actions */}
      <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-950/50 p-4 flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80 overflow-hidden">
        <Image
          src={diagram.imagePath}
          alt={diagram.title}
          width={400}
          height={300}
          className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay Controls */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2 p-4">
          <button
            onClick={() => onPreview(diagram)}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition duration-200"
            title="Inspect Full Resolution"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <a
            href={diagram.imagePath}
            download={diagram.fileName}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-900 shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition duration-200"
            title="Download PNG"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Badges & Bookmark */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getDomainColor(
                  diagram.domain
                )}`}
              >
                {diagram.domain} System
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getTypeBadge(
                  diagram.diagramType
                )}`}
              >
                {diagram.diagramType}
              </span>
            </div>

            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(diagram);
                }}
                className={`p-1.5 rounded-lg transition ${
                  isBookmarked
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title={isBookmarked ? "Remove Bookmark" : "Bookmark Diagram"}
                aria-label="Bookmark Diagram"
              >
                <Bookmark
                  className="w-3.5 h-3.5"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>
            )}
          </div>

          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
            {diagram.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {diagram.description}
          </p>

          {/* Key Elements Tags */}
          <div className="mt-3 flex flex-wrap gap-1">
            {diagram.keyElements.slice(0, 3).map((elem, idx) => (
              <span
                key={idx}
                className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded"
              >
                {elem}
              </span>
            ))}
            {diagram.keyElements.length > 3 && (
              <span className="text-[10px] text-slate-400 px-1 py-0.5">
                +{diagram.keyElements.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => onPreview(diagram)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition flex items-center space-x-1"
          >
            <span>Preview</span>
          </button>

          <button
            onClick={() => onOpenInStudio(diagram)}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-blue-900/50 transition"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Open in Studio</span>
          </button>
        </div>
      </div>
    </Card3D>
  );
}

export default DiagramReferenceCard;

