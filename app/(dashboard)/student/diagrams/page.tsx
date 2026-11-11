"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon,
  PenTool,
  Filter,
  Layers,
  ArrowRight,
  Download,
} from "lucide-react";
import { REFERENCE_DIAGRAMS, DiagramMetadata } from "@/lib/data/diagrams";
import { DiagramReferenceCard } from "@/components/diagrams/DiagramReferenceCard";
import { DiagramLightbox } from "@/components/diagrams/DiagramLightbox";

export default function DiagramGalleryPage() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeLightboxDiagram, setActiveLightboxDiagram] =
    useState<DiagramMetadata | null>(null);

  const filteredDiagrams = REFERENCE_DIAGRAMS.filter((d) => {
    const matchesDomain =
      selectedDomain === "all" || d.domain === selectedDomain;
    const matchesType =
      selectedType === "all" || d.diagramType === selectedType;
    return matchesDomain && matchesType;
  });

  const handleOpenInStudio = (diagram: DiagramMetadata) => {
    // Navigate to studio with template parameter
    router.push(
      `/student/diagrams/studio?template=${diagram.templateId}&title=${encodeURIComponent(
        diagram.title
      )}`
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          16 Software Engineering Reference Architectures
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Complete collection of Unit-IV UML behavioral and structural
          diagrams across 4 real-world systems. Inspect, download, or launch
          directly into the drawing studio as editable diagrams.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Domain Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            System Domain:
          </span>
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
            {["all", "Library", "LMS", "University", "Banking"].map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  selectedDomain === dom
                    ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {dom === "all" ? "All Systems" : dom}
              </button>
            ))}
          </div>
        </div>

        {/* Diagram Type Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Diagram Type:
          </span>
          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
            {["all", "Activity", "StateChart", "Component", "Deployment"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedType === type
                      ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {type === "all"
                    ? "All Types"
                    : type === "StateChart"
                    ? "State Chart"
                    : type}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Grid of 16 Reference Diagrams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredDiagrams.map((diagram) => (
          <DiagramReferenceCard
            key={diagram.id}
            diagram={diagram}
            onPreview={(d) => setActiveLightboxDiagram(d)}
            onOpenInStudio={handleOpenInStudio}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      <DiagramLightbox
        diagram={activeLightboxDiagram}
        onClose={() => setActiveLightboxDiagram(null)}
        onOpenInStudio={handleOpenInStudio}
      />
    </div>
  );
}

