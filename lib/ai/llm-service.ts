export interface AIResponseData {
  title: string;
  unitNumber: number;
  marks: string;
  markingScheme: string;
  definition: string;
  keyPoints: Array<{ title: string; description: string }>;
  fullModelAnswer: string;
  diagramRecommendation: string;
  diagramType?: "block" | "uml" | "flowchart" | "architecture" | "table";
  diagramAscii?: string;
  examTip: string;
  provider: "gemini" | "groq" | "institutional_rag";
}

const SYSTEM_ACADEMIC_PROMPT = `You are a Senior University Professor of Software Engineering for B.Tech CSE (ANITS Autonomous / JNTU R23 Regulation).
Your task is to provide an exact, university-standard examination solution for the student's question. Generate open-ended, comprehensive, and technically rigorous explanations.

You MUST respond strictly with a valid JSON object (no markdown code fence, no additional commentary) matching this exact JSON schema:
{
  "title": "Concise Question Title",
  "unitNumber": 1, // Number from 1 to 5 based on topic (1: SDLC/Process Models/Agile, 2: Requirements/SRS/DFD/Coupling, 3: Software Architecture/4+1/UML Diagrams, 4: OO Methodologies/COCOMO/Metrics, 5: Testing Strategies/Verification & Validation/SPM)
  "marks": "6 Marks Standard University Question",
  "markingScheme": "Formal Definition (1M) + Structural Architecture/Block Diagram (2.5M) + Comparative Analysis & Pointers (2.5M)",
  "definition": "Rigorous 2-3 line IEEE/ISO standard academic definition.",
  "keyPoints": [
    { "title": "Phase / Characteristic 1", "description": "Accurate technical description." },
    { "title": "Phase / Characteristic 2", "description": "Accurate technical description." },
    { "title": "Phase / Characteristic 3", "description": "Accurate technical description." }
  ],
  "fullModelAnswer": "Comprehensive step-by-step markdown answer. Include clear ## and ### section headers, formatted bullet points, comparison tables, and formal engineering explanations.",
  "diagramRecommendation": "Specific architectural figure or UML diagram to draw for maximum examination marks (e.g., 'Draw Level-1 Functional DFD' or 'Draw 4-Quadrant Spiral Model Radial Chart').",
  "diagramType": "block", // "block" | "uml" | "flowchart" | "architecture"
  "diagramAscii": "CRITICAL: A meticulously formatted, aligned ASCII block diagram or architecture flow. Keep column widths consistent and ensure arrows (---->, <----, |, v, ^) align cleanly. Example:\n+--------------------+         +--------------------+\n|   Client / Web UI  | ------> |  API Gateway (SE)  |\n+--------------------+         +--------------------+\n                                         |\n                                         v\n                               +--------------------+\n                               | Database / Storage |\n                               +--------------------+",
  "examTip": "Faculty examiner evaluation tip highlighting what evaluators look for to award full 6/6 marks."
}`;

export async function queryFreeLLM(
  query: string,
  userApiKey?: string,
  providerPreference?: "gemini" | "groq"
): Promise<AIResponseData | null> {
  const geminiKey =
    userApiKey && (userApiKey.startsWith("AIza") || userApiKey.length > 20)
      ? userApiKey
      : process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  const groqKey =
    userApiKey && userApiKey.startsWith("gsk_")
      ? userApiKey
      : process.env.GROQ_API_KEY;

  // 1. Primary: Google Gemini API (Free Tier from Google AI Studio)
  if (geminiKey && (providerPreference === "gemini" || !providerPreference || !groqKey)) {
    // Primary model for Google AI Studio
    const models = ["gemini-flash-latest"];

    for (const model of models) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
        const payload = {
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_ACADEMIC_PROMPT}\n\nStudent Question / Query: "${query}"\n\nGenerate a complete, open-ended, and structured university model answer with a clean aligned block diagram:`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
            try {
              const parsed = JSON.parse(cleanText);
              return {
                ...parsed,
                provider: "gemini",
              };
            } catch (pErr) {
              try {
                const fixed = cleanText.replace(/[\u0000-\u001F]+/g, " ");
                const parsed = JSON.parse(fixed);
                return {
                  ...parsed,
                  provider: "gemini",
                };
              } catch (innerErr) {
                console.warn("Gemini JSON parse fallback error:", pErr);
              }
            }
          }
        } else {
          console.warn(`Gemini (${model}) returned non-200:`, await res.text());
        }
      } catch (err) {
        console.warn(`Gemini (${model}) fetch error:`, err);
      }
    }
  }

  // 2. Secondary: Groq API (Free Tier from GroqCloud: Llama 3.3 70B Versatile)
  if (groqKey) {
    try {
      const endpoint = "https://api.groq.com/openai/v1/chat/completions";
      const payload = {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_ACADEMIC_PROMPT },
          { role: "user", content: `Student Question: ${query}` },
        ],
        temperature: 0.25,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          const clean = content.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(clean);
          return {
            ...parsed,
            provider: "groq",
          };
        }
      }
    } catch (err) {
      console.warn("Groq API fetch error:", err);
    }
  }

  return null;
}
