// Guard struktur HTML: memastikan setiap tag tertutup dan bersarang benar.
// Dipakai tiap fase redesign karena index.html disunting besar-besaran.
//   node scripts/check-html.mjs
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

// Elemen tanpa penutup
const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
  "param", "source", "track", "wbr",
]);

const stack = [];
const errors = [];
const lineAt = (i) => html.slice(0, i).split("\n").length;

// Lewati isi <script>/<style> mentah supaya "<" di dalamnya tidak dianggap tag
const RAW = /<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const rawRanges = [...html.matchAll(RAW)].map((m) => [m.index, m.index + m[0].length]);
const inRaw = (i) => rawRanges.some(([a, b]) => i >= a && i < b);

for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g)) {
  const [full, slash, rawName, attrs] = m;
  if (inRaw(m.index)) continue;
  const name = rawName.toLowerCase();
  if (VOID.has(name) || /\/\s*$/.test(attrs)) continue;

  if (slash) {
    let open = null;
    for (let i = stack.length - 1; i >= 0; i--)
      if (stack[i].name === name) {
        open = i;
        break;
      }
    if (open === null) {
      errors.push(`baris ${lineAt(m.index)}: </${name}> tanpa pembuka`);
      continue;
    }
    // Tag yang ditutup saat masih ada anak belum tertutup
    for (let i = open + 1; i < stack.length; i++)
      errors.push(
        `baris ${lineAt(m.index)}: </${name}> menutup di tengah, <${stack[i].name}> (baris ${stack[i].line}) belum ditutup`,
      );
    stack.length = open;
  } else {
    stack.push({ name, line: lineAt(m.index) });
  }
}

for (const t of stack) errors.push(`baris ${t.line}: <${t.name}> tidak pernah ditutup`);

console.log(`panjang HTML: ${html.length} char`);
console.log(`error struktur: ${errors.length}`);
for (const e of errors.slice(0, 40)) console.log("  " + e);
if (errors.length > 40) console.log(`  ... dan ${errors.length - 40} lagi`);
process.exit(errors.length ? 1 : 0);
