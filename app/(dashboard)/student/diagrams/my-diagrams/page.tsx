"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PenTool,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  FolderOpen,
} from "lucide-react";

interface SavedDiagram {
  _id: string;
  title: string;
  diagramType: string;
  xmlContent: string;
  updatedAt: string;
}

export default function MyDiagramsGalleryPage() {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const loadDiagrams = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/diagrams/personal");
      const data = await res.json();
      if (data?.success && Array.isArray(data.diagrams)) {
        setDiagrams(data.diagrams);
      }
    } catch (e) {
      console.warn("Could not load personal diagrams:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiagrams();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this diagram?")) return;
    setDiagrams((prev) => prev.filter((d) => d._id !== id));
    try {
      await fetch(`/api/diagrams/personal?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleStartRename = (diagram: SavedDiagram) => {
    setEditingId(diagram._id);
    setEditTitle(diagram.title);
  };

  const handleSaveRename = async (id: string) => {
    if (!editTitle.trim()) return;
    setDiagrams((prev) =>
      prev.map((d) => (d._id === id ? { ...d, title: editTitle.trim() } : d))
    );
    setEditingId(null);

    try {
      await fetch("/api/diagrams/personal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editTitle.trim() }),
      });
    } catch (e) {
      console.error("Rename failed:", e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Personal Workspace</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            My Saved Architecture Diagrams
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All UML diagrams, statecharts, and component models authored or cloned by you in the Drawing Studio.
          </p>
        </div>

        <Link
          href="/student/diagrams/studio"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Studio Canvas</span>
        </Link>
      </div>

      {/* Diagrams Grid or Empty State */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Loading your personal diagrams...
        </div>
      ) : diagrams.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <PenTool className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Saved Diagrams Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Open the Drawing Studio to author custom UML models, or clone any of the 16 reference system architectures.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <Link
              href="/student/diagrams/studio"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
            >
              Open Drawing Studio
            </Link>
            <Link
              href="/student/diagrams"
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
            >
              Browse 16 Reference Diagrams
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagrams.map((d) => (
            <div
              key={d._id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono">
                    {d.diagramType || "UML"}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStartRename(d)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Rename"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingId === d._id ? (
                  <div className="flex items-center space-x-1.5 pt-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-emerald-500 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(d._id)}
                      className="px-2 py-1 rounded bg-emerald-600 text-white text-[11px] font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {d.title}
                  </h3>
                )}

                <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Updated {d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : "Recently"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  href={`/student/diagrams/studio?diagramId=${d._id}&title=${encodeURIComponent(
                    d.title
                  )}`}
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open in Studio</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

