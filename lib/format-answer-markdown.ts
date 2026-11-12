/**
 * Utility to deterministically transform Software Engineering academic
 * model answers and markdown notes into clean, professional, semantic HTML.
 *
 * Prevents raw asterisks (***, **, *) from leaking into student and teacher views,
 * structures numbered exam steps, formats formulas, renders code/ASCII diagrams,
 * and handles markdown tables with high aesthetic appeal.
 */

export function formatAnswerMarkdown(markdown: string | undefined | null): string {
  if (!markdown) return "";

  // 1. Normalize line endings and cleanup stray math delimiters
  let text = markdown
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Replace TeX formulas and math symbols with standard clean Unicode
    .replace(/\$\$(.*?)\$\$/g, "$1")
    .replace(/\$(.*?)\$/g, "$1")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\div/g, "÷")
    .replace(/\\pm/g, "±")
    .replace(/\\approx/g, "≈")
    .replace(/\\neq/g, "≠")
    .replace(/\\leq/g, "≤")
    .replace(/\\le(?![a-zA-Z])/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\ge(?![a-zA-Z])/g, "≥")
    .replace(/\\sum/g, "∑")
    .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "");

  // 2. Extract and preserve Code Blocks / ASCII Diagrams before other formatting
  const codeBlocks: string[] = [];
  text = text.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, (_, _lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    const cleanCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    codeBlocks.push(
      `<div class="my-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-inner">
        <div class="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-[11px] font-mono text-slate-400">
          <span class="flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Architectural Diagram / Technical Model</span>
          </span>
          <span class="text-[10px] text-slate-500">ASCII Architecture</span>
        </div>
        <pre class="p-4 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed select-all">${cleanCode.trim()}</pre>
      </div>`
    );
    return placeholder;
  });

  // 3. Convert Markdown Tables
  text = text.replace(/((?:\|[^\n]+\|\n?)+)/g, (match) => {
    const rawLines = match.trim().split("\n");
    if (rawLines.length < 2) return match;
    const headerLine = rawLines[0];
    const dividerIndex = rawLines.findIndex((l) => l.includes("---") || l.includes(":-"));
    if (dividerIndex === -1) return match;

    const headers = headerLine
      .split("|")
      .filter((c, i, arr) => i > 0 && i < arr.length - 1)
      .map(
        (c) =>
          `<th class="px-3.5 py-2.5 text-left font-bold border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white text-xs">${c.trim().replace(/\*\*(.*?)\*\*/g, "$1")}</th>`
      )
      .join("");

    const bodyLines = rawLines.slice(dividerIndex + 1);
    const bodyRows = bodyLines
      .map((row) => {
        const cells = row
          .split("|")
          .filter((c, i, arr) => i > 0 && i < arr.length - 1)
          .map((c) => {
            const formattedCell = c.trim().replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
            return `<td class="px-3.5 py-2 border-b border-slate-200/70 dark:border-slate-800/70 text-xs text-slate-700 dark:text-slate-300">${formattedCell}</td>`;
          })
          .join("");
        return `<tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">${cells}</tr>`;
      })
      .join("");

    return `\n\n<div class="overflow-x-auto my-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"><table class="w-full text-xs border-collapse"><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table></div>\n\n`;
  });

  // 4. Split by sections or paragraphs
  const rawParagraphs = text.split(/\n\n+/);
  const formattedSections: string[] = [];

  for (let para of rawParagraphs) {
    let p = para.trim();
    if (!p) continue;

    // Restore Code Block if this paragraph is a placeholder
    if (p.startsWith("__CODE_BLOCK_") && p.endsWith("__")) {
      const idx = parseInt(p.replace(/[^0-9]/g, ""), 10);
      if (codeBlocks[idx]) {
        formattedSections.push(codeBlocks[idx]);
        continue;
      }
    }

    // Header 3: ### Title
    if (p.startsWith("###")) {
      const headerTitle = p
        .replace(/^###\s*/, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      formattedSections.push(
        `<div class="mt-4 mb-2 pb-1.5 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white tracking-tight">${headerTitle}</h4>
        </div>`
      );
      continue;
    }

    // Header 2: ## Title
    if (p.startsWith("##")) {
      const headerTitle = p
        .replace(/^##\s*/, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      formattedSections.push(
        `<div class="mt-5 mb-2.5 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
          <h3 class="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">${headerTitle}</h3>
        </div>`
      );
      continue;
    }

    // Blockquote: > Quote
    if (p.startsWith(">")) {
      const quoteText = p
        .replace(/^>\s*/, "")
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
      formattedSections.push(
        `<blockquote class="border-l-4 border-amber-500 pl-3.5 py-1.5 my-2.5 text-xs italic text-slate-700 dark:text-slate-300 bg-amber-50/40 dark:bg-amber-950/20 rounded-r-xl">
          ${quoteText}
        </blockquote>`
      );
      continue;
    }

    // Check if the block consists of line items (numbered list, bullet points, or mix)
    const lines = p.split("\n").map((l) => l.trim()).filter(Boolean);
    const isListBlock = lines.some((l) =>
      /^(\d+\.|\*|\-|•)\s+/.test(l)
    );

    if (isListBlock) {
      const renderedLines = lines.map((line) => {
        // Numbered item: "1. **Title:** text" or "1. text"
        const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const num = numMatch[1];
          let content = numMatch[2];

          // Format bold **Title:**
          content = content.replace(
            /\*\*([^*]+)\*\*/g,
            '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>'
          );
          // Inline code `code`
          content = content.replace(
            /`([^`]+)`/g,
            '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">$1</code>'
          );
          // Strip any residual stray asterisks
          content = content.replace(/\*{1,2}/g, "");

          return `<div class="flex items-start space-x-2.5 my-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs shrink-0 mt-0.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-500/20">${num}</span>
            <div class="flex-1">${content}</div>
          </div>`;
        }

        // Bullet item: "- text", "* text", "• text"
        const bulletMatch = line.match(/^([•\-\*])\s+(.*)$/);
        if (bulletMatch) {
          let content = bulletMatch[2];
          content = content.replace(
            /\*\*([^*]+)\*\*/g,
            '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>'
          );
          content = content.replace(
            /`([^`]+)`/g,
            '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">$1</code>'
          );
          content = content.replace(/\*{1,2}/g, "");

          return `<div class="flex items-start space-x-2.5 my-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
            <div class="flex-1">${content}</div>
          </div>`;
        }

        // Normal line within a list block
        let generalContent = line
          .replace(
            /\*\*([^*]+)\*\*/g,
            '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>'
          )
          .replace(
            /`([^`]+)`/g,
            '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">$1</code>'
          )
          .replace(/\*{1,2}/g, "");

        return `<div class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-1 pl-4">${generalContent}</div>`;
      });

      formattedSections.push(`<div class="space-y-1 my-2">${renderedLines.join("")}</div>`);
      continue;
    }

    // Standard Paragraph
    let cleanPara = p
      .replace(
        /\*\*([^*]+)\*\*/g,
        '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>'
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">$1</code>'
      )
      .replace(/\*{1,2}/g, ""); // Clean up any stray unmatched asterisks

    formattedSections.push(
      `<p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed my-2">${cleanPara}</p>`
    );
  }

  // Final pass: replace any remaining code block placeholders (if any)
  let result = formattedSections.join("");
  for (let i = 0; i < codeBlocks.length; i++) {
    result = result.replace(`__CODE_BLOCK_${i}__`, codeBlocks[i]);
  }

  return result;
}

