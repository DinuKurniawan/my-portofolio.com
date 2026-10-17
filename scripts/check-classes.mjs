// Guard regresi (PRD §14 "0 regresi", G3): setiap class yang dipakai di index.html
// harus punya rule di output.css. Menangkap utility yang hilang akibat @theme
// menimpa palette, typo class, atau purge yang salah.
//   node scripts/check-classes.mjs
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const css = readFileSync(new URL("src/css/output.css", root), "utf8");

// Kumpulkan nilai atribut class dari HTML
const classes = new Set();
for (const m of html.matchAll(/\bclass="([^"]*)"/g))
  for (const c of m[1].split(/\s+/)) if (c) classes.add(c);

// Escape nama class jadi selector CSS. Tailwind menulis karakter khusus dengan
// backslash literal di file output (mis. `.bg-white\/5`). Pencocokan pakai
// pencarian string biasa — regex akan salah tafsir tanda "-" di dalam calc().
const esc = (c) => c.replace(/[^a-zA-Z0-9_-]/g, (ch) => "\\" + ch);

// Batas kanan: setelah selector boleh apa saja kecuali karakter nama kelas,
// supaya `.card` tidak cocok dengan `.card-foo`.
const hasRule = (sel) => {
  for (let i = css.indexOf(sel); i !== -1; i = css.indexOf(sel, i + 1))
    if (!/[A-Za-z0-9_-]/.test(css[i + sel.length] ?? "")) return true;
  return false;
};

// Kelas yang memang tanpa rule sendiri:
//  - penanda JS / hook styling (group, peer, aktif, hidden)
//  - cert-*: hook querySelector di main.js + container yang di-style lewat
//    utility Tailwind langsung di markup
//  - esp-text: wrapper struktural; anaknya (.esp-title/.esp-subtitle) yang di-style
const ALLOWED = new Set([
  "group", "peer", "active", "hidden",
  "cert-carousel", "cert-carousel-btn", "cert-dot", "cert-overlay",
  "cert-slide", "cert-thumb", "esp-text",
]);
const NON_UTILITY = /^(js-)/;

const missing = [];
for (const c of classes) {
  if (NON_UTILITY.test(c) || ALLOWED.has(c)) continue;
  if (!hasRule("." + esc(c))) missing.push(c);
}

console.log(`class di HTML: ${classes.size}`);
console.log(`tanpa rule di CSS: ${missing.length}`);
if (missing.length) {
  console.log("\nBelum ada rule (cek apakah disengaja):");
  for (const c of missing.sort()) console.log("  " + c);
}
process.exit(missing.length ? 1 : 0);
