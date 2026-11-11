"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Save,
  Download,
  ArrowLeft,
  FileCode,
  Image as ImageIcon,
  Check,
  RotateCw,
  FolderOpen,
} from "lucide-react";
import { DIAGRAM_TEMPLATES } from "@/lib/templates";

interface DrawingBoardEmbedProps {
  initialXml?: string;
  diagramTitle?: string;
  diagramId?: string;
  onSave?: (xml: string, title: string) => Promise<void>;
  onBack?: () => void;
}

export function DrawingBoardEmbed({
  initialXml = "",
  diagramTitle = "Untitled SE Diagram",
  diagramId,
  onSave,
  onBack,
}: DrawingBoardEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [title, setTitle] = useState(diagramTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [xmlData, setXmlData] = useState(initialXml);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  // Draw.io embed URL with JSON protocol, full atlas UI, and UML libraries enabled
  const drawIoUrl =
    "https://embed.diagrams.net/?embed=1&ui=atlas&spin=1&modified=unsavedChanges&proto=json&libraries=1&configure=1";

  const DRAW_IO_ORIGIN = "https://embed.diagrams.net";
  const ALLOWED_ORIGINS = ["https://embed.diagrams.net", "https://app.diagrams.net"];
  const ALLOWED_EVENTS = ["configure", "init", "autosave", "save", "export", "exit"];

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Security 1: Strict equality validation of message origin
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        return;
      }

      // Security 2: Validate message source strictly matches our iframe window
      if (iframeRef.current && event.source !== iframeRef.current.contentWindow) {
        return;
      }

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // Security 3: Reject unsupported or arbitrary editor messages
        if (!data || !ALLOWED_EVENTS.includes(data.event)) {
          return;
        }

        // Configuration request
        if (data.event === "configure") {
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({
              action: "configure",
              config: {
                defaultLibraries: "general;uml;er",
              },
            }),
            DRAW_IO_ORIGIN
          );
        }

        // Iframe is initialized and ready for diagram XML
        if (data.event === "init") {
          const contentToLoad =
            xmlData ||
            DIAGRAM_TEMPLATES.find((t) => t.id === "use-case")?.xml ||
            "";

          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({
              action: "load",
              xml: contentToLoad,
              autosave: 1,
              title: title,
            }),
            DRAW_IO_ORIGIN
          );
        }

        // Autosave / Save events from draw.io
        if (data.event === "autosave" || data.event === "save") {
          if (data.xml) {
            setXmlData(data.xml);
            if (onSave) {
              setIsSaving(true);
              try {
                await onSave(data.xml, title);
                setLastSaved(new Date());
              } catch (err) {
                console.error("Failed to auto-save diagram:", err);
              } finally {
                setIsSaving(false);
              }
            }
          }
        }

        // Export event containing base64 data
        if (data.event === "export") {
          if (data.data) {
            const link = document.createElement("a");
            link.download = `${title.toLowerCase().replace(/\s+/g, "_")}.${data.format || "png"}`;
            link.href = data.data;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          setExportingFormat(null);
        }

        // User clicked Exit button inside draw.io
        if (data.event === "exit") {
          if (onBack) onBack();
        }
      } catch (err) {
        console.error("Error processing draw.io postMessage:", err);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [xmlData, title, onSave, onBack]);

  const handleManualSave = () => {
    if (iframeRef.current?.contentWindow) {
      setIsSaving(true);
      // Ask draw.io to save immediately
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ action: "export", format: "xml" }),
        DRAW_IO_ORIGIN
      );
      if (onSave && xmlData) {
        onSave(xmlData, title).then(() => {
          setLastSaved(new Date());
          setIsSaving(false);
        });
      } else {
        setIsSaving(false);
      }
    }
  };

  const handleExport = (format: "png" | "svg" | "xml") => {
    if (!iframeRef.current?.contentWindow) return;
    setExportingFormat(format);
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        action: "export",
        format: format,
        xml: xmlData,
      }),
      DRAW_IO_ORIGIN
    );
  };

  const handleLoadTemplate = (templateXml: string, templateName: string) => {
    if (!iframeRef.current?.contentWindow) return;
    setXmlData(templateXml);
    setTitle(`${templateName} (Copy)`);
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify({
        action: "load",
        xml: templateXml,
        autosave: 1,
      }),
      DRAW_IO_ORIGIN
    );
    setShowTemplates(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              SE Diagram Studio
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border border-transparent hover:border-slate-700 focus:border-emerald-500 rounded px-2 py-1 text-sm font-medium text-white focus:outline-none transition w-64"
              placeholder="Diagram Title..."
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Template Picker */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>SE Templates</span>
            </button>

            {showTemplates && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">
                    Syllabus Diagram Starters
                  </span>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {DIAGRAM_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => handleLoadTemplate(tmpl.xml, tmpl.name)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition group flex flex-col"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white group-hover:text-emerald-400">
                          {tmpl.name}
                        </span>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                          {tmpl.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {tmpl.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export Dropdown Options */}
          <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => handleExport("png")}
              disabled={!!exportingFormat}
              className="px-2.5 py-1 rounded text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition flex items-center space-x-1"
              title="Export as PNG image"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>PNG</span>
            </button>
            <button
              onClick={() => handleExport("svg")}
              disabled={!!exportingFormat}
              className="px-2.5 py-1 rounded text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition flex items-center space-x-1"
              title="Export as vector SVG"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>SVG</span>
            </button>
          </div>

          {/* Save Status & Button */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            {lastSaved && (
              <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center space-x-1">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Saved</span>
              </span>
            )}
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium transition shadow-sm"
            >
              {isSaving ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Screen Draw.io Canvas Iframe */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] relative bg-slate-950">
        <iframe
          ref={iframeRef}
          src={drawIoUrl}
          className="w-full h-full border-0"
          title="Software Engineering Diagram Editor"
          allow="clipboard-read; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </main>
    </div>
  );
}

export default DrawingBoardEmbed;

