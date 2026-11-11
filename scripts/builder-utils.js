const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const EXTRACTED_DIR = path.join(ROOT, "docs", "extracted-text");
const QUESTIONS_DIR = path.join(ROOT, "lib", "data", "questions");

if (!fs.existsSync(QUESTIONS_DIR)) {
  fs.mkdirSync(QUESTIONS_DIR, { recursive: true });
}

function cleanPdfPageText(txt) {
  return txt
    .replace(/\r\n/g, "\n")
    .replace(/Software Engineering\s*[—–-]\s*Unit\s*\d+\s*(?:\|\s*Semester Exam Notes\s*)?Page\s*\d+/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function loadExtractedText(filename) {
  const raw = JSON.parse(fs.readFileSync(path.join(EXTRACTED_DIR, filename), "utf8"));
  return raw.pages.map(p => cleanPdfPageText(p.text)).join("\n\n");
}

function formatMarkdown(body) {
  let md = body
    .replace(/^Definition\b/gm, "### 1. Definition")
    .replace(/^Steps Involved\b/gm, "### 2. Steps Involved")
    .replace(/^Types of Modelling\b/gm, "### 2. Types of Modelling")
    .replace(/^Importance of Modelling\b/gm, "### 3. Importance of Modelling")
    .replace(/^Importance\b/gm, "### Importance")
    .replace(/^Main Elements\b/gm, "### 2. Main Elements")
    .replace(/^Important Umbrella Activities\b/gm, "### 2. Important Umbrella Activities")
    .replace(/^Major Challenges\b/gm, "### 2. Major Software Engineering Challenges")
    .replace(/^Phases of SDLC\b/gm, "### 2. Phases of SDLC")
    .replace(/^SDLC Diagram\b/gm, "### 3. SDLC Diagram")
    .replace(/^Advantages of SDLC\b/gm, "### 4. Advantages of SDLC")
    .replace(/^Phases\b/gm, "### Phases")
    .replace(/^Working\b/gm, "### Working Steps")
    .replace(/^Advantages\b/gm, "### Advantages")
    .replace(/^Disadvantages\b/gm, "### Disadvantages")
    .replace(/^Example\b/gm, "### Example")
    .replace(/^Conclusion:\s*(.*)$/gm, "### Conclusion\n$1");

  // Format numbered points with bold headers (e.g. "1. Handles Complexity. Software..." -> "1. **Handles Complexity:** Software...")
  md = md.replace(/^(\d+)\.\s+([A-Za-z0-9\s\(\)\-\/\']+?)\.\s+/gm, (match, num, header) => {
    if (header.length > 50) return match;
    return `${num}. **${header.trim()}:** `;
  });

  return md;
}

function extractSections(text, sectionDefs) {
  const results = [];
  for (let i = 0; i < sectionDefs.length; i++) {
    const cur = sectionDefs[i];
    const next = sectionDefs[i + 1];

    const startIdx = text.indexOf(cur.matchPattern);
    if (startIdx === -1) {
      console.warn("Could not find section:", cur.matchPattern);
      continue;
    }
    const contentStart = startIdx + cur.matchPattern.length;
    const endIdx = next ? text.indexOf(next.matchPattern, contentStart) : text.length;
    let body = text.substring(contentStart, endIdx !== -1 ? endIdx : undefined).trim();

    results.push({
      id: cur.id,
      unitNumber: cur.unitNumber,
      questionNumber: cur.questionNumber,
      question: cur.question,
      marks: cur.marks || 6,
      priority: cur.priority || "high",
      markingScheme: cur.markingScheme,
      examTips: cur.examTips,
      answerMarkdown: formatMarkdown(body),
    });
  }
  return results;
}

function writeUnitFile(unitNum, questions) {
  const tsContent = `import { ExamQuestion } from "../questions";

export const UNIT_${unitNum}_QUESTIONS: ExamQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
  fs.writeFileSync(path.join(QUESTIONS_DIR, `unit${unitNum}.ts`), tsContent, "utf8");
  console.log(`Generated unit${unitNum}.ts with ${questions.length} questions`);
}

module.exports = {
  loadExtractedText,
  formatMarkdown,
  extractSections,
  writeUnitFile,
  QUESTIONS_DIR,
};

