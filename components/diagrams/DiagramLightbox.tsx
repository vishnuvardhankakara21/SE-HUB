"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { DiagramMetadata } from "@/lib/data/diagrams";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  Move,
} from "lucide-react";

interface DiagramLightboxProps {
  diagram: DiagramMetadata | null;
  onClose: () => void;
}

export function DiagramLightbox({ diagram, onClose }: DiagramLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when diagram changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [diagram]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-" || e.key === "_") handleZoomOut();
      if (e.key === "0") handleResetZoom();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!diagram) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleToggleEnlarge = () => {
    if (zoom > 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(1.75);
    }
  };

  const handleDoubleClick = () => {
    handleToggleEnlarge();
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Pan dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5 animate-in fade-in duration-200 select-none"
      onMouseUp={handleMouseUp}
    >
      {/* Lightbox Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {diagram.domain} System
            </span>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {diagram.diagramType} Diagram
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
            {diagram.title}
          </h2>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 space-x-1 shadow-sm">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-slate-300 min-w-[3.5rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Reset Zoom (0)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Enlarge Toggle */}
          <button
            onClick={handleToggleEnlarge}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              zoom > 1
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
            title={zoom > 1 ? "Fit to Screen" : "Enlarge Full View (175%)"}
          >
            {zoom > 1 ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Fit Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Enlarge View</span>
              </>
            )}
          </button>

          {/* Download PNG */}
          <a
            href={diagram.imagePath}
            download={diagram.fileName}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-white transition"
            title="Download Original PNG"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Close Lightbox */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition ml-1"
            title="Close (Esc)"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Pan, Zoom & Drag */}
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className={`flex-1 overflow-hidden relative flex items-center justify-center p-2 sm:p-4 my-2 rounded-2xl bg-black/40 border border-slate-900 ${
          zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        }`}
      >
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className="relative max-w-full max-h-full flex items-center justify-center"
        >
          <img
            src={diagram.imagePath}
            alt={diagram.title}
            className="rounded-xl shadow-2xl object-contain max-h-[75vh] w-auto max-w-[90vw] bg-white p-3 border border-slate-700 pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Interaction Hints Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-mono flex items-center space-x-2 pointer-events-none backdrop-blur-sm">
          <span>Double-click or click Enlarge View</span>
          <span>•</span>
          <span>{zoom > 1 ? "Drag to pan architecture" : "Scroll wheel to zoom"}</span>
        </div>
      </div>

      {/* Lightbox Footer */}
      <div className="pt-2 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400 max-w-3xl mx-auto line-clamp-2">
          {diagram.description}
        </p>
      </div>
    </div>
  );
}

export default DiagramLightbox;
