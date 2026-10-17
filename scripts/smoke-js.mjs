// Smoke test JS di DOM tiruan (tanpa dependensi): menjalankan main.js dengan
// document tiruan dan memastikan tidak ada error saat halaman dimuat.
// Ini menangkap selector yang putus / null deref akibat class berubah.
//   node scripts/smoke-js.mjs
import { readFileSync } from "node:fs";

// Argumen opsional: path HTML lain (dipakai untuk uji negatif)
const htmlPath = process.argv[2] ?? new URL("../index.html", import.meta.url);
const html = readFileSync(htmlPath, "utf8");

// ── Kumpulkan id & class dari HTML ────────────────────────────────────────
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const classes = new Set();
for (const m of html.matchAll(/\bclass="([^"]*)"/g))
  for (const c of m[1].split(/\s+/)) if (c) classes.add(c);

// ── DOM tiruan ────────────────────────────────────────────────────────────
const listeners = [];
const makeEl = (tag = "div", attrs = {}) => {
  const el = {
    tagName: tag.toUpperCase(),
    _attrs: { ...attrs },
    classList: {
      _s: new Set((attrs.class || "").split(/\s+/).filter(Boolean)),
      contains(c) { return this._s.has(c); },
      add(...c) { c.forEach((x) => this._s.add(x)); },
      remove(...c) { c.forEach((x) => this._s.delete(x)); },
      toggle(c, f) { (f === undefined ? !this._s.has(c) : f) ? this._s.add(c) : this._s.delete(c); },
    },
    style: { setProperty() {}, removeProperty() {} },
    dataset: {},
    children: [],
    textContent: "",
    innerHTML: "",
    hidden: false,
    addEventListener(t, fn) { listeners.push([this, t, fn]); },
    removeEventListener() {},
    setAttribute(k, v) { this._attrs[k] = v; },
    getAttribute(k) { return this._attrs[k] ?? null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    appendChild(c) { this.children.push(c); return c; },
    insertBefore(c) { this.children.push(c); return c; },
    remove() {},
    getBoundingClientRect() { return { width: 100, height: 50, top: 0, left: 0 }; },
    getContext() {
      return new Proxy({}, { get: () => () => {} });
    },
    focus() {},
    scrollIntoView() {},
  };
  return el;
};

// Element yang diminta lewat getElementById: ada kalau id-nya memang di HTML,
// supaya null-deref karena id salah tetap terdeteksi.
const byId = new Map();
global.document = {
  readyState: "complete",
  documentElement: makeEl("html"),
  body: makeEl("body"),
  getElementById(id) {
    if (!ids.has(id)) return null;
    if (!byId.has(id)) byId.set(id, makeEl("div", { id }));
    return byId.get(id);
  },
  querySelector(sel) {
    const m = sel.match(/^[.#](.+)$/);
    if (!m) return null;
    const name = m[1];
    return sel[0] === "#"
      ? ids.has(name) ? this.getElementById(name) : null
      : classes.has(name) ? makeEl("div", { class: name }) : null;
  },
  querySelectorAll(sel) {
    const m = sel.match(/^[.#](.+)$/);
    if (!m) return [];
    const name = m[1];
    // Kembalikan satu elemen tiruan bila selector memang ada di HTML —
    // cukup untuk memicu jalur kode inisialisasi.
    if (sel.startsWith(".") && classes.has(name)) return [makeEl("div", { class: name })];
    if (sel.startsWith("#") && ids.has(name)) return [this.getElementById(name)];
    if (/^section\[id\]$/.test(sel)) return [makeEl("section", { id: "home" })];
    if (/^img\[/.test(sel)) return [];
    return [];
  },
  addEventListener(t, fn) { listeners.push([this, t, fn]); },
  createElement(t) { return makeEl(t); },
  createTextNode(t) { return { textContent: t }; },
};

global.window = {
  addEventListener(t, fn) { listeners.push([global.window, t, fn]); },
  removeEventListener() {},
  scrollY: 0,
  innerWidth: 1440,
  innerHeight: 900,
  matchMedia: (q) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }),
  requestAnimationFrame: () => 0,
  cancelAnimationFrame() {},
  devicePixelRatio: 1,
  location: { href: "http://localhost/", hash: "" },
};

global.IntersectionObserver = class {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};
global.ResizeObserver = global.IntersectionObserver;
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;
global.matchMedia = global.window.matchMedia;
global.performance = global.performance ?? { now: () => 0 };
global.fetch = async () => ({ ok: true, json: async () => ({ success: true }) });

// ── Jalankan main.js ──────────────────────────────────────────────────────
// Sebagian kode memanggil setTimeout (typing loop) — batasi agar tidak menggantung.
const timers = [];
const realSetTimeout = global.setTimeout;
global.setTimeout = (fn, ms) => { timers.push([fn, ms]); return 0; };
global.clearTimeout = () => {};

const errors = [];
process.on("uncaughtException", (e) => errors.push(e));
process.on("unhandledRejection", (e) => errors.push(e));

const src = readFileSync(new URL("../src/js/main.js", import.meta.url), "utf8");
try {
  // Jalankan sebagai CommonJS di scope ini; main.js tidak memakai import/export
  new Function("document", "window", src)(global.document, global.window);
} catch (e) {
  errors.push(e);
}
global.setTimeout = realSetTimeout;

console.log(`id di HTML: ${ids.size}, class: ${classes.size}`);
console.log(`timer terjadwal (typing): ${timers.length}`);
console.log(`error saat load: ${errors.length}`);
for (const e of errors) console.log("  " + (e && e.stack ? e.stack.split("\n").slice(0, 3).join("\n  ") : e));
process.exit(errors.length ? 1 : 0);
