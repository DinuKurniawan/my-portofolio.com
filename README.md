# Dinu Kurniawan Cahyadi — Portfolio

Personal portfolio website showcasing projects, skills, certificates, and contact form with email delivery.

**Live:** [myportofolio.codeunchs.my.id](https://myportofolio.codeunchs.my.id/)

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | HTML5, Tailwind CSS 4, Vanilla JS   |
| Backend    | Express.js (local), Vercel Serverless (production) |
| Email      | [Resend](https://resend.com/)       |
| Deployment | [Vercel](https://vercel.com/)       |

## Features

- **Design system** — dark navy + ungu; token terpusat (Tailwind v4 `@theme`), komponen badge/kartu/tombol/chip
- **Hero** — badge status, typed roles, particle canvas, foto cutout berdiri di depan lingkaran ungu + kartu kode melayang dengan header `// Code` (kanan-atas di layar lebar), ornamen titik-titik, marquee teknologi, tombol Download CV
- **About** — 4 kartu statistik (1+ / 10+ / 15+ / 3), bio dengan highlight teknologi
- **Education & Experience** — timeline dengan node bercincin & kartu
- **Skills** — 9 progress bar yang dianimasikan saat masuk viewport
- **Certificates** — grid kartu dengan carousel + lightbox modal (keyboard: Esc/arrow)
- **Projects** — kartu bernomor (01–06 per halaman), pagination 6/halaman, 3D tilt halus
- **Contact** — form tervalidasi dengan Resend, countdown resend, kartu info & Follow Me
- **Extras** — custom cursor, scroll progress bar, reveal-on-scroll, noise overlay, WhatsApp floating button, `prefers-reduced-motion`

## Project Structure

```
.
├── api/
│   └── contact.js          # Vercel serverless function for contact form
├── lanyard-widget/         # 3D interactive Discord status widget source (React + Vite)
├── public/
│   └── lanyard/            # Built Lanyard widget
├── src/
│   ├── css/
│   │   ├── input.css        # Tailwind entry: token (@theme) + komponen + section styles
│   │   ├── electric-border.css  # arsip (tidak dipakai lagi, PRD §11.3)
│   │   ├── logo-loop.css
│   │   └── output.css       # Compiled Tailwind output
│   ├── images/              # Profile, project, certificate images
│   └── js/
│       ├── main.js          # All client-side interactivity
│       ├── electric-border.js   # arsip (tidak dipakai lagi, PRD §11.3)
│       └── logo-loop.js
├── index.html               # Single-page portfolio
├── server.js                # Express server (local dev)
├── vercel.json              # Vercel deployment config
├── .env.example             # Required environment variables
└── package.json
```

## Getting Started

### Prerequisites

- Node.js >= 18
- A [Resend](https://resend.com/) API key

### Installation

```bash
git clone https://github.com/DinuKurniawan/My-Portofolio.git
cd My-Portofolio
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable         | Description                          |
| ---------------- | ------------------------------------ |
| `RESEND_API_KEY` | Your Resend API key                  |
| `TO_EMAIL`       | Destination email for contact form   |
| `PORT`           | Local server port (default: `3000`)  |

### Development

```bash
# Build Tailwind CSS
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Run static checks (HTML/token/kontras/wiring/smoke JS)
npm run verify

# Start local server
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Deployment

Push to GitHub and connect the repo to [Vercel](https://vercel.com/). Add the environment variables (`RESEND_API_KEY`, `TO_EMAIL`) in the Vercel dashboard under **Settings → Environment Variables**.

The `api/contact.js` serverless function handles the contact form in production.

## License

ISC
