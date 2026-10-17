// Self-check F1 (PRD §3.2, §14): token ter-emit + kontras teks WCAG AA.
// Jalankan setelah `npm run build`:  node scripts/check-tokens.mjs
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/css/output.css", import.meta.url), "utf8");

// Ambil token dari blok :root hasil build (nilai bisa hex atau var() alias)
const raw = Object.fromEntries(
  [...css.matchAll(/^\s*(--(?:color|radius|shadow|font|z)-[\w-]+):\s*([^;]+);/gim)].map(
    (m) => [m[1], m[2].trim()],
  ),
);

// Selesaikan rantai alias (semantic → primitive) sampai dapat hex
const tok = new Proxy(raw, {
  get: (t, k) => {
    let v = t[k], hops = 0;
    while (typeof v === "string" && hops++ < 10) {
      const m = v.match(/^var\(\s*(--[\w-]+)\s*\)$/);
      if (!m) break;
      v = t[m[1]];
    }
    return v;
  },
});

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

let fail = 0;
const check = (ok, msg) => {
  if (!ok) fail++;
  console.log(`${ok ? "  ok  " : " FAIL "} ${msg}`);
};

console.log("\n[1] Token wajib ada di output.css (PRD §7.2–7.3)");
const required = [
  "--color-navy-950", "--color-navy-900", "--color-navy-800", "--color-navy-700",
  "--color-violet-600", "--color-violet-500", "--color-violet-400", "--color-violet-300",
  "--color-bg", "--color-surface", "--color-surface-elevated",
  "--color-primary", "--color-primary-hover", "--color-primary-fg",
  "--color-text", "--color-text-body", "--color-text-muted",
  "--color-accent", "--color-success", "--color-border", "--color-focus",
];
for (const t of required) check(t in tok, `${t} = ${tok[t] ?? "HILANG"}`);

console.log("\n[2] Komponen wajib ada (PRD §7.4)");
for (const cls of [
  "badge-section", "icon-chip", ".card", "progress-track", "progress-fill",
  "code-card", "violet-glow", "photo-ring",
])
  check(new RegExp(`\\.${cls.replace(".", "")}\\b`).test(css), `.${cls.replace(".", "")}`);

console.log("\n[3] Kontras teks WCAG AA vs ketiga surface (PRD §3.2)");
// [token teks, ambang] — 4.5 teks normal, 3.0 teks besar/ikon
const pairs = [["--color-text", 4.5], ["--color-text-body", 4.5], ["--color-text-muted", 4.5], ["--color-accent", 4.5]];
const surfaces = ["--color-bg", "--color-surface", "--color-surface-elevated"];
for (const [fg, min] of pairs)
  for (const bg of surfaces) {
    const r = ratio(tok[fg], tok[bg]);
    check(r >= min, `${fg} di ${bg} = ${r.toFixed(2)}:1 (butuh ${min})`);
  }

console.log("\n[4] Tombol: teks di atas latar tombol (PRD §7.4)");
const btn = ratio(tok["--color-primary-fg"], tok["--color-primary-btn"]);
check(btn >= 4.5, `primary-fg/primary-btn = ${btn.toFixed(2)}:1 (butuh 4.5)`);
const btnH = ratio(tok["--color-primary-fg"], tok["--color-primary-btn-hover"]);
check(btnH >= 4.5, `primary-fg/primary-btn-hover = ${btnH.toFixed(2)}:1 (butuh 4.5)`);
// Tombol outline: teks --text di atas surface
const out = ratio(tok["--color-text"], tok["--color-surface"]);
check(out >= 4.5, `text/surface (outline) = ${out.toFixed(2)}:1 (butuh 4.5)`);

console.log("\n[5] prefers-reduced-motion ada (PRD FR-G05)");
check(/prefers-reduced-motion/.test(css), "blok reduced-motion ter-emit");

console.log(fail ? `\n✗ ${fail} gagal\n` : "\n✓ semua lulus\n");
process.exit(fail ? 1 : 0);
