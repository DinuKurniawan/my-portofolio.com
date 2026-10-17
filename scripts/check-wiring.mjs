// Guard regresi F2 (PRD §14): elemen yang di-query main.js/logo-loop.js harus ada
// di index.html. Class/ID yang hilang = fitur mati diam-diam.
//   node scripts/check-wiring.mjs
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");

// [selector, dipakai untuk apa]
const REQUIRED_IDS = [
  ["scroll-progress", "progress bar scroll"],
  ["navbar", "glassmorphism saat scroll"],
  ["menu-btn", "tombol hamburger"],
  ["mobile-menu", "drawer mobile"],
  ["icon-menu", "ikon hamburger"],
  ["icon-close", "ikon close"],
  ["particles-canvas", "particle canvas"],
  ["typed-text", "typing animation roles"],
  ["tech-logo-loop", "marquee teknologi"],
  ["projects-grid", "grid proyek"],
  ["projects-pagination", "pagination proyek"],
  ["projects-prev", "tombol Prev"],
  ["projects-next", "tombol Next"],
  ["projects-pages", "nomor halaman"],
  ["certs-grid", "grid sertifikat"],
  ["certs-pagination", "pagination sertifikat"],
  ["cert-modal", "lightbox sertifikat"],
  ["cert-modal-img", "gambar di lightbox"],
  ["contact-form", "form kontak"],
  ["cf-name", "input nama"],
  ["cf-email", "input email"],
  ["cf-subject", "input subject"],
  ["cf-message", "textarea pesan"],
  ["cf-submit", "tombol submit"],
  ["cf-toast", "toast form"],
  ["email-sent-panel", "panel sukses"],
  ["esp-resend-btn", "tombol resend"],
  ["esp-countdown-num", "countdown resend"],
];

// [selector, dipakai untuk apa] — class yang di-query JS.
// F3: initCounters() (dead code, mencari .counter-num yang tak pernah ada)
// sudah dihapus dari main.js — angka statis di markup.
const REQUIRED_CLASSES = [
  ["nav-link", "observer link aktif"],
  ["hero-photo-wrap", "animasi swing foto"],
  ["social-link", "—"],
  ["cert-card", "kartu sertifikat"],
  ["cert-thumb", "thumbnail sertifikat"],
  ["cert-slide", "slide carousel sertifikat"],
  ["cert-dot", "dot carousel sertifikat"],
];

let fail = 0;
const check = (ok, msg) => {
  if (!ok) fail++;
  console.log(`${ok ? "  ok  " : " FAIL "} ${msg}`);
};

console.log("\n[1] ID yang di-query main.js");
for (const [id, why] of REQUIRED_IDS)
  check(new RegExp(`id="${id}"`).test(html), `#${id} — ${why}`);

console.log("\n[2] Class yang di-query main.js");
for (const [cls, why] of REQUIRED_CLASSES)
  check(new RegExp(`class="[^"]*\\b${cls}\\b`).test(html), `.${cls} — ${why}`);

console.log("\n[3] Anchor section utuh (PRD §10 SEO — link lama tidak boleh rusak)");
for (const id of ["home", "about", "education", "experience", "skills", "certificates", "projects", "contact"])
  check(
    new RegExp(`<section[^>]*id="${id}"`).test(html) || new RegExp(`id="${id}"`).test(html),
    `#${id}`,
  );

console.log("\n[4] FR yang bisa dicek statis");
check(!/data-electric-border/.test(html), "electric border sudah dilepas (FR-H08)");
check(!/electric-border\.js/.test(html), "script electric-border.js tidak dimuat");
check(
  /href="https:\/\/wa\.me\/6281384634526"[\s\S]{0,200}?Hire Me/.test(html),
  "Hire Me → wa.me (FR-N02/§17.7)",
);
check(
  /href="\.\/public\/cv\/Curriculum%20Vitae\.pdf"[\s\S]{0,300}?\n\s*download/.test(html),
  "Download CV → PDF lokal + atribut download (FR-H05)",
);
const navLabels = [...html.matchAll(/class="nav-link"[^>]*>([^<]+)</g)].map((m) =>
  m[1].trim(),
);
check(
  navLabels.join(",") === "Home,About,Skills,Projects,Certificates,Contact",
  `nav desktop 6 link: ${navLabels.join(" / ")}`,
);
check(
  /id="tech-logo-loop"/.test(html) && html.indexOf('id="tech-logo-loop"') < html.indexOf('id="about"'),
  "marquee teknologi ada di hero, bukan di Skills (FR-H07/FR-S05)",
);
check(/prefers-reduced-motion/.test(readFileSync(new URL("src/css/output.css", root), "utf8")), "reduced-motion ter-emit");

console.log(fail ? `\n✗ ${fail} gagal\n` : "\n✓ semua lulus\n");
process.exit(fail ? 1 : 0);
