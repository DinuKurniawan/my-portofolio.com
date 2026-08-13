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

- **Hero** — typing animation, particle canvas, floating tech badges
- **About** — profile card with stats, bio, info grid
- **Education & Experience** — timeline layout
- **Skills** — categorized tech stack badges (Frontend, Backend, Tools)
- **Certificates** — card carousel with lightbox modal
- **Projects** — paginated gallery (6 per page), 3D tilt on hover
- **Contact** — validated form with Resend email delivery, resend with countdown
- **Extras** — custom cursor, scroll progress bar, reveal-on-scroll animations, noise overlay, WhatsApp floating button

## Project Structure

```
.
├── api/
│   └── contact.js          # Vercel serverless function for contact form
├── src/
│   ├── css/
│   │   ├── input.css        # Tailwind entry + custom styles
│   │   └── output.css       # Compiled Tailwind output
│   ├── images/              # Profile, project, certificate images
│   └── js/
│       └── main.js          # All client-side interactivity
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

# Start local server
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Deployment

Push to GitHub and connect the repo to [Vercel](https://vercel.com/). Add the environment variables (`RESEND_API_KEY`, `TO_EMAIL`) in the Vercel dashboard under **Settings → Environment Variables**.

The `api/contact.js` serverless function handles the contact form in production.

## License

ISC
