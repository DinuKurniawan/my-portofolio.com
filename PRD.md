# PRD — Redesign Website Portofolio

> **Produk:** Website Portofolio Dinu Kurniawan Cahyadi — [myportofolio.codeunchs.my.id](https://myportofolio.codeunchs.my.id/)
> **Jenis Proyek:** Redesign visual (visual overhaul) tanpa migrasi stack
> **Referensi Desain:** [`Template.jpeg`](./Template.jpeg) — gaya "CodeCraft" (dark navy + aksen ungu)
> **Status:** Draft — revisi 1.1 (§17 terjawab, siap mulai F1)
> **Versi:** 1.1
> **Tanggal:** 16 Oktober 2026 · Revisi terakhir: 17 Oktober 2026

---

## 1. Ringkasan Eksekutif

Redesign total tampilan website portofolio yang saat ini sudah live, mengikuti referensi desain `Template.jpeg`: tema **dark navy** dengan aksen **ungu/violet**, layout modern berbasis **badge section, kartu statistik, progress bar skill, kartu proyek bernomor, dan hero dengan foto + kartu kode**.

Seluruh konten dan fitur fungsional yang sudah ada (10 proyek, 3 sertifikat, form kontak dengan Resend, timeline pendidikan & pengalaman, animasi, dsb.) **dipertahankan**. Yang berubah adalah bahasa visual, design system, dan komponen UI. Stack tetap: **HTML5 + Tailwind CSS 4 + Vanilla JS + Express/Vercel + Resend**.

---

## 2. Latar Belakang & Masalah

**Kondisi saat ini:**

- Website sudah memiliki banyak fitur (particle canvas, electric border, typing animation, custom cursor, dst.) namun bahasa visualnya belum konsisten dengan referensi desain yang diinginkan pemilik.
- Aksen warna saat ini indigo (`#4F46E5`); referensi mengarah ke ungu (`± #6D63F8`).
- Beberapa section (about, skills) memakai pola layout yang berbeda dari referensi (kartu profil, badge tech stack) sehingga kurang kohesif.

**Masalah yang ingin diselesaikan:**

1. Tampilan website perlu di-upgrade agar lebih modern, konsisten, dan "portfolio-ready" untuk recruiter/klien.
2. Design system belum terdokumentasi — warna dan style tersebar sebagai nilai hardcoded di HTML/CSS.
3. Belum ada dokumen acuan (PRD) yang jelas untuk proses redesign.

---

## 3. Tujuan & Metrik Sukses

### 3.1 Tujuan

| # | Tujuan |
|---|--------|
| G1 | Tampilan seluruh section mengikuti bahasa visual `Template.jpeg` (dark navy + ungu, komponen kartu & badge) |
| G2 | Design token terdokumentasi & terpusat (Tailwind v4 `@theme`), tidak ada warna hardcoded baru di komponen |
| G3 | Seluruh konten & fitur lama tetap berjalan tanpa regresi (form Resend, lightbox sertifikat, pagination proyek, dsb.) |
| G4 | Meningkatkan kualitas aksesibilitas & performa (target Lighthouse) |
| G5 | Redesign selesai dan ter-deploy ke Vercel tanpa downtime berarti |

### 3.2 Metrik Sukses

| Metrik | Target |
|--------|--------|
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse Accessibility | ≥ 90 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| Regresi fitur | 0 (semua item checklist QA lulus) |
| Konsistensi token | 0 warna hardcoded baru di luar file token |
| Kontras teks (WCAG AA) | Semua teks lolos rasio 4.5:1 (normal) / 3:1 (large) |

---

## 4. Non-Goals (Di Luar Scope)

- ❌ Migrasi ke framework (React/Next.js/Vue) — tetap Vanilla JS.
- ❌ Penambahan blog (nav "Blog" pada template **tidak** diadopsi karena belum ada konten).
- ❌ Perubahan backend / API `api/contact.js` / logika Resend (kecuali kosmetik minor).
- ❌ Penambahan halaman baru (tetap single-page).
- ❌ Redesign Lanyard widget (`public/lanyard/`) — saat ini tidak direferensikan di halaman; statusnya arsip.
- ❌ Multi-bahasa (i18n).

---

## 5. Pengguna Target

| Persona | Kebutuhan |
|---------|-----------|
| **Recruiter / Hiring Manager** | Melihat skill, pengalaman, dan kualitas project dalam < 1 menit; mengunduh CV; kontak cepat |
| **Klien Freelance** | Menilai kredibilitas & estetika; menghubungi via form/WhatsApp |
| **Sesama Developer** | Melihat tech stack, repository, dan detail teknis proyek |

---

## 6. Referensi Desain — Analisis `Template.jpeg`

Template "CodeCraft" (736×1104) berisi satu halaman landing portofolio dengan struktur berikut:

| # | Bagian Template | Isi Template | Adopsi untuk Website Ini |
|---|-----------------|--------------|--------------------------|
| 1 | Navbar | Logo `<CodeCraft/>`, link: Home, About, Skills, Projects, Blog, Contact; tombol **Hire Me ↗** | Logo `<D/>` (dipertahankan), link disesuaikan (lihat §8), tombol Hire Me diadopsi |
| 2 | Hero | Badge "I'M A WEB DEVELOPER"; heading "Hi, I'm **Alex** / I build things for the web."; deskripsi; tombol **View My Work** + **Download CV ↓**; baris ikon teknologi; foto dengan **lingkaran ungu + glow** dan **kartu code snippet** | Diadopsi penuh, konten & foto milik Dinu; kartu kode diganti objek profil developer |
| 3 | About | Badge "ABOUT ME"; heading "I'm passionate about creating digital solutions"; paragraf; tombol **Learn More About Me ↗**; **4 kartu statistik** (2×2) dengan chip ikon ungu | Diadopsi; angka statistik disesuaikan (honest data) |
| 4 | Skills | Badge "MY SKILLS"; heading "Technologies I Master"; **progress bar 3 kolom × 3 baris** dengan label & persentase | Diadopsi; skill disesuaikan dengan stack Dinu |
| 5 | Projects | Badge "FEATURED PROJECTS"; heading "Some of My Recent Work"; **3 kartu proyek bernomor 01/02/03** (thumbnail, judul, deskripsi, "View Project →"); dots carousel | Diadopsi sebagian: grid kartu bernomor + **pagination lama dipertahankan** (bukan dots) |
| 6 | Contact/Footer | Badge "LET'S WORK TOGETHER"; heading "Have a project in mind?"; tombol Get In Touch; **kartu testimoni**; "FOLLOW ME" + sosial + email + telepon; footer copyright + "Made with ❤️" | Diadopsi & digabung dengan **form kontak** yang sudah ada (form tetap jadi fokus utama). **Kartu testimoni tidak diadopsi** (§17.2) |
| — | Education & Experience | *Tidak ada di template* | **Ekstrapolasi gaya**: timeline restyle mengikuti komponen kartu/badge template |
| — | Certificates | *Tidak ada di template* | **Ekstrapolasi gaya**: kartu sertifikat restyle mengikuti pola komponen yang sama |

> **Catatan:** Nama, foto, statistik, testimoni, dan copy di template hanyalah placeholder. Konten aktual tetap milik Dinu Kurniawan Cahyadi.

### Karakter Visual Template

- **Mood:** profesional, modern, techy, high-contrast.
- **Background:** navy sangat gelap (`#020816`), kartu sedikit lebih terang (`#050C1C`–`#0C1325`).
- **Aksen:** ungu/violet (`± #6D63F8`) untuk tombol, ikon chip, progress bar, teks highlight.
- **Bentuk:** kartu rounded (± 12–16px), tombol rounded (8–10px), badge pill uppercase letter-spaced.
- **Efek:** glow ungu halus (radial), noise/dot pattern tipis, hover lift pada kartu.

---

## 7. Design System

### 7.1 Arsitektur Token (3 Lapisan)

```
Primitive  → nilai mentah (hex, ukuran)
Semantic   → alias berdasar fungsi (--bg, --primary, --text-body)
Component  → spesifik komponen (--btn-primary-bg, --progress-fill)
```

Semua token didefinisikan sekali di `src/css/input.css` (Tailwind v4 `@theme`) dan **wajib direferensikan** oleh seluruh komponen. Dilarang menulis hex baru langsung di markup/CSS komponen.

### 7.2 Primitive Tokens (hasil sampling `Template.jpeg`)

| Token | Nilai | Sumber |
|-------|-------|--------|
| `--color-navy-950` | `#020816` | sampling background halaman |
| `--color-navy-900` | `#050C1C` | sampling kartu statistik |
| `--color-navy-800` | `#0C1325` | sampling kartu testimoni |
| `--color-navy-700` | `#141B2E` | turunan (surface hover) |
| `--color-violet-600` | `#6D63F8` | sampling tombol (rentang `#6C5FF7`–`#7163FE`) |
| `--color-violet-500` | `#7C6CF9` | sampling chip ikon (`#7460F5`) |
| `--color-violet-400` | `#A78BFA` | turunan (teks aksen di dark bg, aman untuk AA) |
| `--color-violet-300` | `#C4B5FD` | turunan (teks aksen terang) |
| `--color-white` | `#F6F7F9` | sampling heading |
| `--color-gray-400` | `#9AA3B2` | turunan (body text) — verifikasi kontras saat implementasi |
| `--color-gray-500` | `#6B7280` | turunan (muted text) |
| `--color-emerald-400` | `#34D399` | status "available" (dipertahankan dari versi lama) |
| `--color-border` | `rgba(255,255,255,0.08)` | sampling garis kartu |

> Nilai final dikonfirmasi ulang saat implementasi (JPEG compression membuat warna sedikit bergeser). Dokumen ini adalah acuan awal.

### 7.3 Semantic Tokens

| Token | Referensi | Kegunaan |
|-------|-----------|----------|
| `--bg` | navy-950 | background halaman |
| `--surface` | navy-900 | background kartu |
| `--surface-elevated` | navy-800 | kartu spesial (form kontak, code card) |
| `--primary` | violet-600 | aksi utama |
| `--primary-hover` | violet-500 | hover aksi utama |
| `--primary-fg` | white | teks di atas primary |
| `--text` | #F6F7F9 | heading & teks utama |
| `--text-body` | gray-400 | paragraf |
| `--text-muted` | gray-500 | meta/label |
| `--accent-text` | violet-400 | nama di heading, ikon aksen, harga highlight |
| `--success` | emerald-400 | indikator status online |

### 7.4 Component Tokens & Spesifikasi Komponen

Semua komponen memiliki **3 state minimum**: default, hover, focus-visible (kecuali disabled relevan).

**Badge Section** (mis. `I'M A WEB DEVELOPER`, `ABOUT ME`):

| Properti | Default |
|----------|---------|
| Background | `rgba(109,99,248,0.12)` |
| Border | `rgba(109,99,248,0.35)`, radius pill |
| Teks | `--accent-text`, uppercase, Fira Code, letter-spacing 0.15em, 12px |

**Tombol Primary** (mis. `View My Work`, `Hire Me ↗`):

| Properti | Default | Hover | Focus-visible |
|----------|---------|-------|---------------|
| Background | `--primary` | `--primary-hover` | ring `--accent-text` offset 2px |
| Text | `--primary-fg` | `--primary-fg` | — |
| Shadow | `0 8px 24px rgba(109,99,248,0.35)` | lebih tebal + translateY(-2px) | — |
| Radius | 10px | — | — |

**Tombol Outline** (mis. `Download CV ↓`, `Get In Touch`):

| Properti | Default | Hover |
|----------|---------|-------|
| Background | transparan | `rgba(255,255,255,0.05)` |
| Border | `--color-border` | `rgba(255,255,255,0.2)` |
| Text | `--text` | `--text` |

**Kartu (Project/Sertifikat/Statistik/Info) atau `.card`:**

| Properti | Default | Hover |
|----------|---------|-------|
| Background | `--surface` | `--surface-elevated` |
| Border | 1px `--color-border` | border ungu `rgba(109,99,248,0.4)` |
| Radius | 16px | — |
| Shadow | none | `0 20px 40px rgba(109,99,248,0.12)` + lift 4px |

**Progress Bar Skill:**

| Properti | Nilai |
|----------|-------|
| Track | `rgba(255,255,255,0.06)`, tinggi 8px, radius full |
| Fill | gradient `--primary` → `--color-violet-400` |
| Animasi | width 0 → nilai% (1s ease-out) saat masuk viewport |

**Nav Link:** default `--text-body`; hover `--text`; **aktif** `--accent-text` + indikator.

### 7.5 Tipografi

| Token | Font | Pemakaian |
|-------|------|-----------|
| `--font-sans` | **Inter** (300–900) | Heading & body (dipertahankan) |
| `--font-code` | **Fira Code** (400–500) | Badge, label kode, meta, statistik kecil |

Skala:

| Elemen | Ukuran | Berat |
|--------|--------|-------|
| H1 hero | clamp 2.25rem → 3.75rem | 800–900 |
| H2 section | 1.875rem → 2.5rem | 700 |
| H3 kartu | 1.125rem | 600 |
| Body | 1rem / line-height 1.7 | 400 |
| Small/meta | 0.875rem | 400–500 |
| Badge | 0.75rem uppercase | 500 (Fira Code) |

> Font heading **diputuskan tetap Inter** (§17.5) — tidak ada request font tambahan, scope tidak bertambah.

### 7.6 Spacing & Layout

- Container: `max-w-6xl` (72rem), padding horizontal `1rem` (mobile) / `1.5rem` (≥ sm).
- Padding vertikal section: `5rem` (mobile) → `7rem` (desktop) — konsisten dengan `py-16 sm:py-24 lg:py-28` saat ini.
- Grid: 1 kolom (mobile) → 2 kolom (md) → 3 kolom (lg) untuk kartu & skills.
- Breakpoint standar Tailwind: `sm 640` `md 768` `lg 1024` `xl 1280`.
- Z-index berlapis: navbar 50 → modal 100 → toast 110.

### 7.7 Motion & Efek

| Efek | Spesifikasi | Status |
|------|-------------|--------|
| Reveal on scroll | fade + translateY(24px), 0.6s ease-out, stagger 80ms | Dipertahankan |
| Hover lift kartu | translateY(-4px) + glow ungu | Baru (dari template) |
| Progress bar fill | width animasi 1s saat intersection | Baru |
| Typed text (roles) | dipertahankan, warna `--accent-text` | Adaptasi |
| Marquee logo teknologi | infinite scroll halus, edge fade | Adaptasi (dari logo loop) |
| Code card float | translateY ±6px, 4s ease-in-out infinite | Baru |
| Glow radial ungu hero | 2 blurred circle, opacity rendah | Adaptasi (orb lama) |
| Scroll progress bar | tetap, warna `--primary` | Adaptasi |
| Custom cursor | tetap, warna ungu | Adaptasi |
| Noise overlay | tetap, opacity sangat rendah | Dipertahankan |
| `prefers-reduced-motion` | semua animasi non-esensial dimatikan | Wajib (NFR) |

---

## 8. Struktur Halaman & Navigasi

**Urutan section (anchor):**

```
Navbar
└─ Hero            #home
└─ About           #about        (+ 4 stat cards)
└─ Education       #education    (restyle timeline)
└─ Experience      #experience   (restyle timeline)
└─ Skills          #skills       (progress bars)
└─ Certificates    #certificates (restyle, fungsi dipertahankan)
└─ Projects        #projects     (kartu bernomor + pagination)
└─ Contact         #contact      (form + info + sosial)
└─ Footer
```

**Navbar (desktop):** Logo `<D/>` • Home • About • Skills • Projects • Certificates • Contact • **Hire Me ↗** (primary button).

> Navigasi template memakai "Blog"; diganti **"Certificates"** agar 6 link tetap seimbang dan tidak ada link mati. Education & Experience tetap dapat diakses lewat scroll dan tombol "Learn More About Me" di About. Di menu mobile, semua anchor ditampilkan.

**Perilaku navbar:** fixed, glassmorphism saat scroll (background blur + border bawah tipis), link aktif ditandai saat section terlihat (memakai IntersectionObserver yang sudah ada).

---

## 9. Spesifikasi per Section

> Prioritas: **M** = Must, **S** = Should, **C** = Could.

### 9.1 Global / Halaman

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-G01 | `<html>` dark theme, background `--bg`, teks `--text`, font Inter/Fira Code via Google Fonts (preload seperti sekarang) | M |
| FR-G02 | Meta title, description, OG tags dipertahankan; favicon diubah dari indigo `#4f46e5` → ungu `#6D63F8` | M |
| FR-G03 | Scroll progress bar, noise overlay, custom cursor, WhatsApp floating button, back-to-top tetap berjalan dengan warna baru | S |
| FR-G04 | `theme-color` meta diperbarui ke `#020816` | S |
| FR-G05 | `prefers-reduced-motion`: matikan particle, typing, marquee, dan animasi reveal | M |

### 9.2 Navbar

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-N01 | Layout: logo kiri, link tengah, tombol Hire Me kanan — sesuai template | M |
| FR-N02 | Tombol **Hire Me ↗** mengarah ke `https://wa.me/6281384634526` (`target="_blank" rel="noopener"`), bukan `#contact` | M |
| FR-N03 | Mobile: hamburger → drawer full-screen dengan semua anchor + Hire Me | M |
| FR-N04 | Highlight link aktif + efek transisi background saat scroll | S |

### 9.3 Hero (`#home`)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-H01 | Badge pill: dot hijau status "available" + label `FULL-STACK WEB DEVELOPER` (uppercase, ungu) | M |
| FR-H02 | Heading H1: `Hi, I'm` + **`Dinu Kurniawan Cahyadi`** (warna ungu/gradient) + baris kedua `I build things for the web.` | M |
| FR-H03 | Sub-line animasi typed roles (fitur lama dipertahankan, daftar role tidak berubah) | S |
| FR-H04 | Paragraf deskripsi singkat (copy lama diadaptasi) | M |
| FR-H05 | CTA: **View My Work →** (primary, `#projects`) + **Download CV ↓** (outline) → `./public/cv/Curriculum%20Vitae.pdf`, atribut `download`, `target="_blank" rel="noopener"` | M |
| FR-H06 | Baris sosial: GitHub, LinkedIn, Instagram, WhatsApp (data lama) | S |
| FR-H07 | Baris ikon teknologi dengan label `TECHNOLOGIES I WORK WITH`: HTML, CSS, JS, TS, Node, React, Git (+ Next.js). Di mobile: marquee halus | M |
| FR-H08 | Foto: rasio potret, **lingkaran ungu + radial glow** di belakang foto (pengganti electric border), ring tipis, badge kecil status online | M |
| FR-H09 | **Kartu code snippet** melayang di kanan-bawah foto (glassmorphism, Fira Code, syntax highlight ungu): objek `const developer = { name, role, stack, passion }` — berisi data Dinu | M |
| FR-H10 | Cue scroll di bawah ("scroll" + garis animasi) dipertahankan | C |
| FR-H11 | Latar hero: grid/dot pattern tipis + glow ungu; particle canvas dipertahankan tetapi density diturunkan (subtle) | S |

### 9.4 About (`#about`)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-A01 | Badge `ABOUT ME` + heading `I'm passionate about creating digital solutions` (H2) | M |
| FR-A02 | Bio: 2 paragraf yang ada dipertahankan (termasuk highlight kata kunci dengan warna aksen) | M |
| FR-A03 | Tombol **Learn More About Me ↗** → scroll ke `#education` | S |
| FR-A04 | **4 kartu statistik** (grid 2×2) dengan chip ikon ungu — angka final (dikonfirmasi §17.3): **`1+` Years Experience, `10+` Projects Completed, `15+` Technologies, `3` Certificates** | M |
| FR-A05 | Kartu profil lama (avatar, status pill, stat 3 kolom) **dibubarkan**: avatar → hero, status → hero badge, stats → FR-A04 | M |
| FR-A06 | Badge "currently building: This Portfolio" dipertahankan sebagai elemen kecil di kolom bio | C |

### 9.5 Education (`#education`)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-E01 | Konten entri pendidikan **tidak berubah** (nama sekolah/kampus, jurusan, tahun) | M |
| FR-E02 | Restyle timeline: garis vertikal gradient ungu, node bulat bercincin, entri berbentuk kartu `--surface` | M |
| FR-E03 | Chip ikon 🎓-style (SVG, background ungu transparan) + pill tahun (Fira Code) | S |

### 9.6 Experience (`#experience`)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-X01 | Konten entri pengalaman **tidak berubah** | M |
| FR-X02 | Gaya visual identik dengan Education (satu komponen timeline) | M |

### 9.7 Skills (`#skills`)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-S01 | Badge `MY SKILLS` + heading `Technologies I Master` | M |
| FR-S02 | **9 progress bar** dalam grid 3 kolom × 3 baris, label + ikon kiri, persentase kanan, track + fill ungu | M |
| FR-S03 | Fill dianimasikan saat masuk viewport (IntersectionObserver), hanya sekali | S |
| FR-S04 | Daftar skill (nilai awal, dapat disesuaikan): HTML 95, CSS 90, JavaScript 90, React 85, Next.js 80, TypeScript 85, Node.js 80, Tailwind CSS 90, Git 85 | M |
| FR-S05 | Daftar badge tech-category lama diganti progress bar; marquee logo dipindah ke hero (FR-H07) | M |
| FR-S06 | Aksesibilitas: setiap bar memakai `role="img"` + `aria-label="HTML 95%"` | S |

### 9.8 Certificates (`#certificates`)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-C01 | Badge + heading section (mis. `CERTIFICATES` / `Certificates & Credentials`) | M |
| FR-C02 | Grid kartu sertifikat (thumbnail, judul, penerbit, tahun) — gaya kartu baru | M |
| FR-C03 | Fungsi lama dipertahankan: pagination/carousel, klik → **lightbox modal** dengan navigasi multi-gambar, keyboard (Esc/arrow) | M |
| FR-C04 | Empty state: sembunyikan section bila tidak ada sertifikat (defensif) | C |

### 9.9 Projects (`#projects`)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-P01 | Badge `FEATURED PROJECTS` + heading `Some of My Recent Work` | M |
| FR-P02 | Kartu proyek bernomor overlay **01–06** (per halaman), thumbnail atas dengan zoom hover | M |
| FR-P03 | Isi kartu: judul, 1 baris deskripsi, link `View Project →` (membuka URL/live/GitHub proyek) | M |
| FR-P04 | **Pagination dipertahankan** (6 per halaman, Prev/Next + nomor), di-restyle ke tombol/indikator ungu | M |
| FR-P05 | Efek 3D tilt hover dipertahankan pada kartu (intensitas diturunkan agar selaras gaya baru) | S |
| FR-P06 | Data 10 proyek & SVG thumbnail lama tetap dipakai; audit kontras agar menyatu dengan background baru | M |

### 9.10 Contact (`#contact`)

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-CT01 | Badge `LET'S WORK TOGETHER` + heading `Have a project in mind?` + paragraf ajakan | M |
| FR-CT02 | **Form kontak** (nama, email, subject, pesan) di-restyle sebagai kartu `--surface-elevated` dengan input dark + border fokus ungu | M |
| FR-CT03 | Logika lama dipertahankan 100%: validasi inline, state loading, toast sukses/gagal, panel "email terkirim" + **tombol resend dengan countdown ring** | M |
| FR-CT04 | Kartu info kontak dengan chip ikon ungu: Email (`dinukurniawan28@gmail.com`), WhatsApp (`+62 813-8463-4526`), Lokasi (Indonesia) | M |
| FR-CT05 | Blok **FOLLOW ME**: ikon GitHub, LinkedIn, Instagram (+ WhatsApp) | M |
| FR-CT06 | ~~Kartu testimoni~~ — **DITUNDA** (§17.2 terjawab: belum ada testimoni nyata). Kartu tidak dibuat di F6 | — |
| FR-CT07 | Semua elemen dekoratif lama yang tak terpakai di section ini dibersihkan (stripe-divider dll. jika tidak lagi sesuai) | C |

### 9.11 Footer

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| FR-F01 | Baris atas: navigasi anchor ringkas (opsional) | C |
| FR-F02 | Kiri: `© 2026 Dinu Kurniawan Cahyadi. All rights reserved.` — Kanan: `Made with ❤️ by Dinu` | M |
| FR-F03 | Link ke atas/back-to-top | C |

---

## 10. Non-Functional Requirements

| Kategori | Requirement |
|----------|-------------|
| **Responsif** | Mobile-first; diuji di 360px, 768px, 1024px, 1440px. Tidak ada horizontal scroll di semua breakpoint |
| **Performa** | Target Lighthouse Performance ≥ 90 (mobile). Gambar below-fold `loading="lazy"`; font `display=swap`; tidak menambah library JS baru (kecuali bernilai tinggi); output CSS Tailwind tetap satu file |
| **Aksesibilitas** | Kontras WCAG AA; semua elemen interaktif fokusable (`:focus-visible` ring ungu); modal & menu mobile dapat ditutup dengan Esc; alt text pada semua gambar; heading hierarkis (h1 → h2 → h3) |
| **SEO** | Meta & OG dipertahankan + diperbarui sesuai branding baru; heading semantik; struktur anchor tidak berubah (`#about`, `#projects`, dst. tetap sama agar link lama tidak rusak) |
| **Kompatibilitas** | Chrome, Edge, Firefox, Safari (2 versi terakhir). Tidak mendukung IE |
| **Kualitas Kode** | Seluruh warna/radius/shadow baru memakai design token; style indigo lama dihapus dari `input.css` (bukan ditumpuk); komentar section di HTML dipertahankan/diperbarui; JS tanpa error di console |
| **Maintainability** | `input.css` diorganisasi per kelompok: tokens → base → komponen → section-specific → utilities |

---

## 11. Konten & Aset

### 11.1 Konten (dipertahankan, tanpa redesign)

- Nama, bio 2 paragraf, email, WhatsApp, sosial media
- 10 data proyek + SVG thumbnail (`src/images/project-*.svg`)
- 3 sertifikat + gambar (`src/images/cert-*.svg`, termasuk varian multi-halaman)
- Entri education & experience
- Typed roles, daftar sosial

### 11.2 Status Aset (§17 terjawab)

| Aset | Status | Catatan |
|------|--------|---------|
| File **CV (PDF)** untuk tombol Download CV | ✅ ada — `public/cv/Curriculum Vitae.pdf` (143 KB) | — |
| **Testimoni nyata** (quote, nama, jabatan, avatar) | ❌ tidak ada | **Ditunda** — kartu tidak dibuat (FR-CT06) |
| **Angka statistik final** (tahun, proyek, tech, sertifikat) | ✅ dikonfirmasi: 1+ / 10+ / 15+ / 3 | — |
| Foto hero resolusi cukup (min. 600×800, sudah ada `pp.png`) | ✅ ada | — |
| Favicon ungu baru | 🔨 dibuat saat implementasi | — |

### 11.3 Aset untuk Diarsipkan (tidak dihapus, agar bisa dikembalikan)

- `src/css/electric-border.css` + `src/js/electric-border.js` (digantikan lingkaran ungu + kartu kode)
- `src/images/blkng.jpg`, `dpn.jpg` — audit pemakaian; hapus referensi bila tak terpakai
- `public/lanyard/` — tidak direferensikan; biarkan sebagai arsip

---

## 12. Arsitektur Teknis & Rencana Implementasi

### 12.1 File yang Disentuh

| File | Perubahan |
|------|-----------|
| `index.html` | Rewrite struktur & class seluruh section (± 2.100 baris) — **konten teks & ID anchor dipertahankan** |
| `src/css/input.css` | Token baru (§7.2–7.4), komponen baru, hapus style indigo lama. Organisasi ulang per kelompok |
| `src/css/output.css` | Hasil build (`npm run build`) — tidak diedit manual |
| `src/js/main.js` | Sesuaikan selector class baru, tambah animasi progress bar, hapus referensi electric border, pertahankan logika form/pagination/lightbox/observer |
| `src/js/logo-loop.js` | Adaptasi ke marquee hero (atau pensiun bila diganti implementasi baru) |
| `src/js/electric-border.js` | Tidak dipakai lagi (arsip) |
| `index.html` (head) | Favicon & `theme-color` baru |
| `public/cv/Curriculum Vitae.pdf` | Aset baru (sudah ada) — target tombol Download CV; statis, tidak diolah build |
| `README.md` | Update deskripsi fitur/screenshot (opsional, setelah selesai) |

> **Tidak disentuh:** `server.js`, `api/contact.js`, `vercel.json`, `.env*`, `package.json` (kecuali ada kebutuhan kecil).

### 12.2 Konfigurasi Tailwind v4

Token didefinisikan di `@theme` pada `input.css`, contoh:

```css
@import "tailwindcss";

@theme {
  /* Primitive */
  --color-navy-950: #020816;
  --color-navy-900: #050c1c;
  --color-navy-800: #0c1325;
  --color-violet-600: #6d63f8;
  --color-violet-500: #7c6cf9;
  --color-violet-400: #a78bfa;

  /* Semantic */
  --color-bg: var(--color-navy-950);
  --color-surface: var(--color-navy-900);
  --color-primary: var(--color-violet-600);
  --color-accent: var(--color-violet-400);

  /* Font */
  --font-sans: "Inter", sans-serif;
  --font-code: "Fira Code", monospace;
}
```

### 12.3 Urutan Fase Implementasi

| Fase | Scope | Output |
|------|-------|--------|
| F1 | Fondasi: token, base styles, komponen (badge/btn/card/icon-chip), favicon | Styleguide tersembunyi / halaman bisa dibuild |
| F2 | Navbar + Hero (termasuk code card, marquee teknologi, foto + glow, tombol Download CV) | Section pertama tampil sesuai template |
| F3 | About + Education + Experience | Stat cards & timeline baru |
| F4 | Skills + Certificates | Progress bar animasi; kartu & modal sertifikat |
| F5 | Projects | Kartu bernomor + pagination + tilt |
| F6 | Contact + Footer | Form restyle + info cards + follow me + footer |
| F7 | Polish: responsive QA, a11y, performa, bersihkan CSS/JS mati, build produksi, deploy Vercel | Rilis |

Setiap fase: `npm run watch` untuk build CSS, commit terpisah, cek checklist QA terkait sebelum lanjut.

---

## 13. Mapping Fitur Lama → Keputusan

| Fitur Lama | Keputusan | Catatan |
|------------|-----------|---------|
| Typing animation (roles) | ✅ Adaptasi | Warna aksen ungu, posisi di bawah heading |
| Particle canvas | ✅ Adaptasi | Density diturunkan, warna ungu |
| Floating tech badges | ➡️ Diganti | Menjadi baris ikon teknologi hero (FR-H07) |
| Electric border (foto) | 🗄️ Pensiun | Diganti lingkaran ungu + glow + kartu kode (FR-H08/09) |
| Gradient text | ✅ Adaptasi | Gradient ungu |
| Orbs / aurora / grid pattern | ✅ Adaptasi | Palet ungu, intensitas diturunkan |
| Custom cursor | ✅ Adaptasi | Warna ungu |
| Scroll progress bar | ✅ Adaptasi | Warna ungu |
| Noise overlay | ✅ Dipertahankan | — |
| Reveal on scroll | ✅ Dipertahankan | Tambah stagger |
| Logo loop (marquee tech) | ✅ Adaptasi | Dipindah ke hero |
| Skills badge kategori | 🔁 Diganti | Menjadi progress bar (FR-S02) |
| Cert carousel + lightbox | ✅ Restyle | Logika dipertahankan |
| Project pagination (6/hal) | ✅ Restyle | Logika dipertahankan |
| Project 3D tilt | ✅ Adaptasi | Intensitas diturunkan |
| Contact form + Resend + countdown resend | ✅ Dipertahankan penuh | Hanya restyle UI |
| Nav active link observer | ✅ Dipertahankan | — |
| Mobile menu | ✅ Adaptasi | Gaya drawer baru |
| WhatsApp float | ✅ Dipertahankan | — |
| Scroll indicator hero | ✅ Dipertahankan | Opsional, prioritas C |
| Lanyard widget | 🗄️ Arsip | Tidak direferensikan saat ini |

---

## 14. Acceptance Criteria & Checklist QA

### Global
- [ ] Tidak ada warna indigo `#4F46E5`/`indigo-*` tersisa di HTML/CSS
- [ ] Semua section tampil benar di 360 / 768 / 1024 / 1440 px
- [ ] Lighthouse (mobile): Perf ≥ 90, A11y ≥ 90, BP ≥ 95, SEO ≥ 95
- [ ] Tidak ada error/warning di console browser
- [ ] `prefers-reduced-motion` menonaktifkan animasi non-esensial
- [ ] Semua gambar punya `alt`; semua tombol ikon punya `aria-label`

### Per Fitur
- [ ] Navbar: Hire Me → `#contact`; link aktif ter-highlight; mobile drawer buka/tutup benar
- [ ] Hero: foto + lingkaran + code card tampil rapi di mobile & desktop; typed text berjalan; tombol **Download CV** mengunduh `public/cv/Curriculum Vitae.pdf`
- [ ] Navbar: **Hire Me** membuka `wa.me/6281384634526` di tab baru
- [ ] About: 4 stat card render dengan angka yang benar
- [ ] Education/Experience: seluruh entri lama muncul, timeline rapi di mobile
- [ ] Skills: 9 bar terisi sesuai nilai, animasi hanya sekali
- [ ] Certificates: pagination jalan; klik kartu → lightbox; navigasi gambar & Esc jalan
- [ ] Projects: 10 proyek terbagi 6+4; Prev/Next & nomor halaman jalan; link proyek benar
- [ ] Contact: validasi form jalan; submit sukses (uji dengan Resend lokal); panel sukses + countdown resend jalan; toast error muncul saat gagal
- [ ] Footer: teks copyright benar
- [ ] WhatsApp float & scroll progress berfungsi

### Cross-browser
- [ ] Chrome, Firefox, Edge terbaru (Wajib); Safari (best effort, jika perangkat tersedia)

---

## 15. Milestones

| Fase | Deliverable | Estimasi Kasar |
|------|-------------|----------------|
| F1 | Fondasi token & komponen | 0.5–1 hari |
| F2 | Navbar + Hero | 1 hari |
| F3 | About + Education + Experience | 1 hari |
| F4 | Skills + Certificates | 1 hari |
| F5 | Projects | 0.5–1 hari |
| F6 | Contact + Footer | 1 hari |
| F7 | QA + polish + deploy | 0.5–1 hari |
| **Total** | | **± 6–8 hari kerja** |

---

## 16. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| `index.html` besar (± 95KB, 2.100 baris) — salah edit bisa merusak fitur | Tinggi | Kerjakan per-section, commit terpisah per fase, jalankan checklist QA per fase |
| Warna hasil sampling JPEG bisa bergeser dari aslinya | Rendah | Verifikasi dengan eyedropper saat implementasi; token mudah diubah terpusat |
| Ekstrapolasi gaya untuk Education/Experience/Certificates (tidak ada di template) bisa terasa "keluar gaya" | Sedang | Wajib memakai komponen yang sama (badge, kartu, icon chip, pill tahun) |
| Fitur JS lama (tilt, typed, observer) bisa putus saat class berubah | Sedang | Audit selector di `main.js` per fase; uji tiap fitur setelah edit |
| Nama file CV memuat spasi (`Curriculum Vitae.pdf`) — bisa gagal unduh di sebagian browser/server | Rendah | Selalu pakai URL-encoded `%20` di `href` + atribut `download`; opsional rename ke `cv-dinu.pdf` saat F2 |
| Kontras ungu di navy gagal AA untuk teks kecil | Sedang | Teks kecil gunakan `--color-violet-400`/`--text-body`, bukan `--primary`; uji kontras |

---

## 17. Keputusan (dijawab pemilik, 17 Oktober 2026)

| # | Pertanyaan | Keputusan | Dampak ke implementasi |
|---|-----------|-----------|------------------------|
| 1 | File CV PDF untuk *Download CV*? | ✅ **Ada** — `public/cv/Curriculum Vitae.pdf` | FR-H05: tombol Download CV aktif sejak F2; URL-encoded `./public/cv/Curriculum%20Vitae.pdf` |
| 2 | Testimoni nyata untuk kartu testimoni? | ❌ **Tidak ada** → **ditunda** | FR-CT06 dibatalkan; section Contact fokus ke form + info + follow |
| 3 | Angka statistik final? | ✅ **1+ / 10+ / 15+ / 3** | FR-A04 langsung pakai angka ini |
| 4 | Nav "Blog" diganti "Certificates"? | ✅ **Ya** | FR-N01: 6 link (Home, About, Skills, Projects, Certificates, Contact) |
| 5 | Font heading: Inter atau Plus Jakarta Sans? | ✅ **Tetap Inter** | §7.5 tanpa perubahan; tidak ada request font tambahan |
| 6 | Laravel masuk progress bar skills? | ❌ **Tidak** (cukup di bio) | FR-S02 tetap **9 bar** sesuai FR-S04 |
| 7 | Tombol Hire Me: WhatsApp atau form? | ✅ **WhatsApp** — `https://wa.me/6281384634526` | FR-N02 diubah; pakai `target="_blank" rel="noopener"` |

> **Tidak ada pertanyaan terbuka tersisa.** PRD siap dieksekusi mulai F1.

---

## 18. Lampiran

### A. Hasil Sampling Warna dari `Template.jpeg`

| Titik Sampling | Nilai | Interpretasi |
|----------------|-------|--------------|
| Background halaman | `#020816` | Base bg navy gelap |
| Kartu statistik | `#050C1C` | Surface card |
| Kartu testimoni | `#0C1325` | Surface elevated |
| Tombol "View My Work" (tengah) | `#6C5FF7`–`#7163FE` | **Aksen primary (ungu)** |
| Tombol "Hire Me" | `#6362FB`–`#706EE9` | Konfirmasi aksen primary |
| Chip ikon statistik | `#7460F5` | Ikon chip ungu |
| Progress bar fill | `#7668DA`–`#7C6CD9` | Fill ungu (varian lebih kalem) |
| Heading | `#F6F7F9` | Teks utama |
| Favicon/usulan | `#6D63F8` | Warna brand baru |

### B. Inventaris Aset yang Ada

- **CV:** `public/cv/Curriculum Vitae.pdf` (143 KB, ditambahkan 17 Okt 2026 — dipakai FR-H05)
- **Foto:** `public/images/picture/pp.png` (hero & avatar)
- **Proyek (SVG):** 10 file `src/images/project-*.svg`
- **Sertifikat (SVG):** `cert-laravel.svg`, `cert-react-nextjs.svg`, `cert-web-fundamentals.svg`
- **Ekstra:** `blkng.jpg`, `dpn.jpg` (audit pemakaian), `public/lanyard/` (arsip)

### C. Referensi

- `Template.jpeg` — desain target
- `README.md` — dokumentasi teknis versi saat ini
- Live: [myportofolio.codeunchs.my.id](https://myportofolio.codeunchs.my.id/)

---

*Dokumen ini adalah acuan kerja redesign. Perubahan scope setelah review dicatat sebagai revisi versi baru.*
