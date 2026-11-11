import { NextRequest, NextResponse } from "next/server";
import { EXAM_QUESTIONS } from "@/lib/data/questions";
import { TOPICS_DATA } from "@/lib/data/curriculum";
import { queryFreeLLM } from "@/lib/ai/llm-service";

export interface StructuredDoubtData {
  title: string;
  unitNumber: number | null;
  marks: string;
  markingScheme: string;
  definition: string;
  keyPoints: Array<{ title: string; description: string }>;
  fullModelAnswer: string;
  diagramRecommendation: string | null;
  diagramType?: string;
  diagramAscii?: string;
  examTip: string;
  source: "exam_bank" | "syllabus_notes" | "general_ai" | "gemini" | "groq" | "institutional_rag";
}

export async function POST(req: NextRequest) {
  try {
    const { query, userApiKey, providerPreference } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { success: false, message: "Query text is required." },
        { status: 400 }
      );
    }

    // 0. Check Free LLM Integration (Google Gemini / Groq Llama)
    const liveLLMResponse = await queryFreeLLM(query, userApiKey, providerPreference);
    if (liveLLMResponse) {
      const structured: StructuredDoubtData = {
        title: liveLLMResponse.title || query,
        unitNumber: liveLLMResponse.unitNumber || 1,
        marks: liveLLMResponse.marks || "6 Marks Standard University Question",
        markingScheme: liveLLMResponse.markingScheme || "Definition (1M) + Concept/Architecture (2.5M) + Tradeoffs (2.5M)",
        definition: liveLLMResponse.definition,
        keyPoints: liveLLMResponse.keyPoints || [],
        fullModelAnswer: liveLLMResponse.fullModelAnswer,
        diagramRecommendation: liveLLMResponse.diagramRecommendation,
        diagramType: liveLLMResponse.diagramType || "block",
        diagramAscii: liveLLMResponse.diagramAscii,
        examTip: liveLLMResponse.examTip,
        source: liveLLMResponse.provider,
      };

      return NextResponse.json({
        success: true,
        orbSummary: `${liveLLMResponse.provider.toUpperCase()} AI generated a complete university model answer for Unit ${structured.unitNumber}.`,
        structured,
        source: structured.source,
        unitNumber: structured.unitNumber,
        provider: liveLLMResponse.provider,
      });
    }

    const qLower = query.toLowerCase().trim();
    const words = qLower.split(/\s+/).filter((w) => w.length > 2);

    // 1. Search in 79 University Exam Questions
    let bestQuestion = null;
    let maxQuestionScore = 0;

    for (const q of EXAM_QUESTIONS) {
      const qText = q.question.toLowerCase();
      const ansText = q.answerMarkdown.toLowerCase();

      let score = 0;
      if (qText.includes(qLower)) score += 60;

      for (const w of words) {
        if (qText.includes(w)) score += 12;
        if (ansText.includes(w)) score += 3;
      }

      if (score > maxQuestionScore) {
        maxQuestionScore = score;
        bestQuestion = q;
      }
    }

    // 2. Search in 5-Unit Topics Curriculum Data
    let bestTopic = null;
    let maxTopicScore = 0;

    for (const t of TOPICS_DATA) {
      const titleLower = t.title.toLowerCase();
      const summaryLower = t.summary.toLowerCase();
      const theoryLower = (t.theoryMarkdown || "").toLowerCase();

      let score = 0;
      if (titleLower.includes(qLower)) score += 50;

      for (const w of words) {
        if (titleLower.includes(w)) score += 14;
        if (summaryLower.includes(w)) score += 5;
        if (theoryLower.includes(w)) score += 2;
      }

      if (score > maxTopicScore) {
        maxTopicScore = score;
        bestTopic = t;
      }
    }

    // 3. Compose Structured Academic Response
    let structured: StructuredDoubtData;
    let orbSummary = "";

    if (bestQuestion && maxQuestionScore >= 18) {
      // Clean answer markdown for pure display
      const cleanAnswer = bestQuestion.answerMarkdown
        .replace(/###/g, "")
        .replace(/##/g, "")
        .replace(/\*\*/g, "")
        .trim();

      structured = {
        title: bestQuestion.question,
        unitNumber: bestQuestion.unitNumber,
        marks: `${bestQuestion.marks} Marks Standard`,
        markingScheme: bestQuestion.markingScheme,
        definition: `Unit ${bestQuestion.unitNumber} core curriculum question evaluated according to official university examination standards.`,
        keyPoints: [
          {
            title: "Phase Structure",
            description: "Follow the sequence defined in the syllabus with formal state transitions and milestones.",
          },
          {
            title: "Architectural Mapping",
            description: "Include a labeled structural diagram or flowchart to secure maximum design marks.",
          },
          {
            title: "Engineering Metric",
            description: "Provide quantitative metrics (e.g. cyclomatic complexity, effort equation, or coupling index).",
          },
        ],
        fullModelAnswer: bestQuestion.answerMarkdown,
        diagramRecommendation: bestQuestion.unitNumber === 1 
          ? "Draw Spiral Model 4-Quadrant Radial Diagram or Waterfall Linear Stages"
          : bestQuestion.unitNumber === 2
          ? "Draw Level-0 Context DFD and Level-1 Functional Decomposition"
          : bestQuestion.unitNumber === 3
          ? "Draw 4+1 View Architecture & Kruchten's Use-Case Centric Matrix"
          : bestQuestion.unitNumber === 4
          ? "Draw Control Flow Graph (CFG) with Cyclomatic Complexity Regions"
          : "Draw Basic COCOMO Estimation Flow & Maintenance Curve",
        examTip: bestQuestion.examTips || "Write definitions first, provide standard diagrams with labeled arrows, and state pros/cons clearly for full marks.",
        source: "exam_bank",
      };

      orbSummary = `Model solution for Unit ${bestQuestion.unitNumber}: ${bestQuestion.question.slice(0, 65)}... Answer and marking breakdown loaded.`;
    } else if (bestTopic && maxTopicScore >= 14) {
      structured = {
        title: bestTopic.title,
        unitNumber: bestTopic.unitNumber,
        marks: "6 Marks Core Topic",
        markingScheme: "Formal Definition (1M) + Core Architecture/Process (2.5M) + Practical Evaluation & Comparison (2.5M)",
        definition: bestTopic.summary,
        keyPoints: [
          {
            title: "Syllabus Weightage",
            description: `Classified under Unit ${bestTopic.unitNumber} with ${bestTopic.examWeightage} priority.`,
          },
          {
            title: "Theoretical Foundation",
            description: bestTopic.summary,
          },
          {
            title: "University Strategy",
            description: "Present clean labeled diagrams and reference IEEE or ISO standard terminology.",
          },
        ],
        fullModelAnswer: bestTopic.theoryMarkdown,
        diagramRecommendation: `Refer to 16 Reference Architecture Figures for Unit ${bestTopic.unitNumber} corresponding diagrams`,
        examTip: `In University examinations, 6-mark questions on ${bestTopic.title} require starting with a precise 2-line definition, followed by an architectural sketch and comparison table.`,
        source: "syllabus_notes",
      };

      orbSummary = `Unit ${bestTopic.unitNumber} Concept: ${bestTopic.title}. Definition, key architecture points, and exam guide prepared.`;
    } else {
      structured = {
        title: query,
        unitNumber: 1,
        marks: "General SE Academic Analysis",
        markingScheme: "Conceptual Understanding (2M) + SDLC Integration (2M) + Practical Examples (2M)",
        definition: `Systematic and quantifiable approach to the development, operation, and maintenance of software systems addressing "${query}".`,
        keyPoints: [
          {
            title: "SDLC Lifecycle Alignment",
            description: "Maps directly into Requirements Engineering, System Design, Implementation, or Verification phases.",
          },
          {
            title: "Quality Attributes",
            description: "Focuses on maintainability, reliability, testability, and zero defect delivery.",
          },
          {
            title: "Assessment Metrics",
            description: "Evaluated using cyclomatic complexity, coupling/cohesion indices, and defect density metrics.",
          },
        ],
        fullModelAnswer: `### Software Engineering Academic Analysis\n\n**Query:** ${query}\n\n**Overview:**\nIn university Software Engineering, questions regarding **${query}** focus on structured methodologies and engineering rigor across the software lifecycle.\n\n**Core Requirements for Examinations:**\n1. **Precise Definitions:** State IEEE/ISO terminology accurately.\n2. **Visual Representation:** Always accompany theoretical answers with labeled UML or architectural figures.\n3. **Trade-off Analysis:** Contrast strengths, weaknesses, and real-world applicability.`,
        diagramRecommendation: "Draw standard UML or architectural diagrams from the 16 Reference Models in the sidebar",
        examTip: "Search the 79 Exam Bank in the sidebar for exact 6-mark previous university question solutions.",
        source: "general_ai",
      };

      orbSummary = `Software Engineering breakdown for "${query.slice(0, 40)}..." prepared with definition, points, and exam tips.`;
    }

    return NextResponse.json({
      success: true,
      orbSummary,
      structured,
      source: structured.source,
      unitNumber: structured.unitNumber,
    });
  } catch (error: any) {
    console.error("AI Doubt Solver Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process question. Please try asking again.",
      },
      { status: 500 }
    );
  }
}
