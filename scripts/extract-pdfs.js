const fs = require("fs");
const path = require("path");

const docsDir = path.join(__dirname, "..", "docs", "unit-wise-imp");
const outDir = path.join(__dirname, "..", "docs", "extracted-text");

async function extractAll() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const mod = await import("pdf-parse");
  const PDFParse = mod.PDFParse;

  const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".pdf"));
  for (const file of files) {
    console.log("Extracting:", file);
    const buf = fs.readFileSync(path.join(docsDir, file));
    const uint8 = new Uint8Array(buf);
    const parser = new PDFParse(uint8);
    const result = await parser.getText();
    // result might be an object, let's stringify it
    const text = typeof result === "string" ? result : JSON.stringify(result, null, 2);
    const outFile = file.replace(".pdf", ".txt");
    fs.writeFileSync(path.join(outDir, outFile), text, "utf8");
    console.log("  -> Written", outFile, "(" + text.length + " chars)");
  }
  console.log("Done!");
}

extractAll().catch(console.error);
