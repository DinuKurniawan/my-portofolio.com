// Audit sekali pakai (F7): kelas yang didefinisikan di input.css tapi tidak
// dirujuk di HTML/JS. Bukan bagian dari npm run verify.
// Pencocokan HTML memakai token class exact; JS dicek longgar (includes) agar
// kelas dinamis seperti `esp-feedback--${type}` tidak dilaporkan sebagai mati.
import { readFileSync } from "node:fs";

const css = readFileSync("src/css/input.css", "utf8");
const html = readFileSync("index.html", "utf8");
const js =
  readFileSync("src/js/main.js", "utf8") + readFileSync("src/js/logo-loop.js", "utf8");

const htmlTokens = new Set();
for (const m of html.matchAll(/class="([^"]*)"/g))
  for (const t of m[1].split(/\s+/)) if (t) htmlTokens.add(t);

// Ekspansi kelas yang dibentuk lewat template literal di main.js.
const jsDynamic = ["esp-feedback--success", "esp-feedback--error"];

const dead = [];
const seen = new Set();
for (const m of css.matchAll(/^\s*(\.[A-Za-z][\w\\-]*)/gm)) {
  const cls = m[1].slice(1).replaceAll("\\", "");
  if (seen.has(cls)) continue;
  seen.add(cls);
  if (htmlTokens.has(cls) || js.includes(cls) || jsDynamic.includes(cls)) continue;
  dead.push(cls);
}
console.log("kelas di CSS tanpa rujukan:", dead.length);
console.log(dead.map((d) => "  ." + d).join("\n"));
