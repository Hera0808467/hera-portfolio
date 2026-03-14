import fs from "node:fs";
import path from "node:path";

function extractModuleJsonString(sourceText, moduleId) {
  const marker = `${moduleId},e=>{e.v(JSON.parse('`;
  const start = sourceText.indexOf(marker);
  if (start === -1) {
    throw new Error(`Could not find marker for module ${moduleId}.`);
  }

  let i = start + marker.length;
  let raw = "";

  // Scan until an unescaped closing single-quote.
  for (; i < sourceText.length; i++) {
    const ch = sourceText[i];
    if (ch === "'" && sourceText[i - 1] !== "\\") break;
    raw += ch;
  }

  if (!raw) throw new Error(`Module ${moduleId} JSON string is empty.`);

  // Unescape one JS-string-literal layer so JSON.parse sees proper JSON escapes.
  // - `\\n` -> `\n` (two chars: backslash + n), then JSON.parse => newline in value.
  // - `\\\"` -> `\"`, etc.
  // Also normalize `\'` to `'` (JS escape; not a JSON escape).
  return raw.replace(/\\\\/g, "\\").replace(/\\'/g, "'");
}

function toTypeScript(data) {
  const json = JSON.stringify(data, null, 2);
  return `/*\n * AUTO-GENERATED from reference artifact.\n * Source: reference/_next/static/chunks/9d18e53bc5db42e6.js (module 84509)\n *\n * You can edit this file directly once generated.\n */\n\nexport type ContributorType = \"designers\" | \"researchers\";\n\nexport type NewsletterProject = {\n  id: string;\n  month: string;\n  title: string;\n  contributorType: ContributorType;\n  contributors: string[];\n  figmaUrl: string;\n  coverImage: string;\n  description: string;\n  group?: string;\n  themeColor?: string;\n  videoUrl?: string;\n};\n\nexport type NewsletterData = {\n  month: string;\n  displayMonth?: string;\n  welcomeText?: string;\n  endingText?: string;\n  projects: NewsletterProject[];\n};\n\nexport const newsletterData: NewsletterData = ${json};\n`;
}

const artifactPath = path.resolve(
  "reference/_next/static/chunks/9d18e53bc5db42e6.js"
);
const outPath = path.resolve("data/newsletter.ts");

const sourceText = fs.readFileSync(artifactPath, "utf8");
const jsonText = extractModuleJsonString(sourceText, 84509);
const data = JSON.parse(jsonText);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, toTypeScript(data), "utf8");

console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
