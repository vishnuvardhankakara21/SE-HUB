"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DrawingBoardEmbed } from "@/components/diagrams/DrawingBoardEmbed";
import { DIAGRAM_TEMPLATES } from "@/lib/templates";

function StudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const diagramId = searchParams.get("diagramId");
  const initialTitleParam = searchParams.get("title") || "Untitled SE Diagram";

  // Pick starter template XML if specified
  const template = DIAGRAM_TEMPLATES.find((t) => t.id === templateId);
  const defaultXml =
    template?.xml || DIAGRAM_TEMPLATES.find((t) => t.id === "use-case")?.xml || "";

  const [xml, setXml] = useState<string>(defaultXml);
  const [title, setTitle] = useState<string>(initialTitleParam);
  const [activeId, setActiveId] = useState<string | null>(diagramId);
  const [isReady, setIsReady] = useState<boolean>(!diagramId);

  useEffect(() => {
    if (diagramId) {
      fetch("/api/diagrams/personal")
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.diagrams)) {
            const found = data.diagrams.find((d: any) => d._id === diagramId);
            if (found) {
              setXml(found.xmlContent);
              setTitle(found.title);
            }
          }
        })
        .catch(() => {})
        .finally(() => setIsReady(true));
    }
  }, [diagramId]);

  const handleSaveDiagram = async (savedXml: string, savedTitle: string) => {
    try {
      localStorage.setItem("last_saved_se_diagram_xml", savedXml);
      localStorage.setItem("last_saved_se_diagram_title", savedTitle);

      if (activeId) {
        await fetch("/api/diagrams/personal", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: activeId, title: savedTitle, xmlContent: savedXml }),
        });
      } else {
        const res = await fetch("/api/diagrams/personal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: savedTitle, xmlContent: savedXml }),
        });
        const data = await res.json();
        if (data?.success && data.diagram?._id) {
          setActiveId(data.diagram._id);
        }
      }
    } catch (e) {
      console.warn("Saved to local browser storage successfully.");
    }
  };

  const handleBack = () => {
    router.push("/student/diagrams/my-diagrams");
  };

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center text-white text-xs">
        Loading saved diagram...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950">
      <DrawingBoardEmbed
        initialXml={xml}
        diagramTitle={title}
        diagramId={activeId || undefined}
        onSave={handleSaveDiagram}
        onBack={handleBack}
      />
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center text-white text-xs">
          Loading Drawing Studio...
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}

