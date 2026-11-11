"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DiagramMetadata } from "@/lib/data/diagrams";
import { X, ZoomIn, ZoomOut, RotateCcw, Download, PenTool } from "lucide-react";

interface DiagramLightboxProps {
  diagram: DiagramMetadata | null;
  onClose: () => void;
  onOpenInStudio: (diagram: DiagramMetadata) => void;
}

export function DiagramLightbox({
  diagram,
  onClose,
  onOpenInStudio,
}: DiagramLightboxProps) {
  const [zoom, setZoom] = useState(1);

  if (!diagram) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 animate-in fade-in duration-200">
      {/* Lightbox Topbar */}
      <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {diagram.domain} System • {diagram.diagramType}
          </span>
          <h2 className="text-lg font-bold text-white mt-1">{diagram.title}</h2>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 space-x-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-400">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <a
            href={diagram.imagePath}
            download={diagram.fileName}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onOpenInStudio(diagram);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition shadow-sm"
          >
            <PenTool className="w-4 h-4" />
            <span>Open in Studio</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Pan / Zoom */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <div
          style={{ transform: `scale(${zoom})`, transition: "transform 0.15s ease-out" }}
          className="relative max-w-4xl max-h-[75vh] flex items-center justify-center"
        >
          <Image
            src={diagram.imagePath}
            alt={diagram.title}
            width={1200}
            height={900}
            className="rounded-xl shadow-2xl object-contain max-h-[75vh] w-auto bg-white p-2"
            priority
          />
        </div>
      </div>

      {/* Lightbox Footer Note */}
      <div className="pt-3 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400 max-w-3xl mx-auto line-clamp-2">
          {diagram.description}
        </p>
      </div>
    </div>
  );
}

export default DiagramLightbox;

