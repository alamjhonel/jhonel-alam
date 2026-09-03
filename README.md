# Signal & Cipher — Jhonel Alam

An interactive cybersecurity-themed developer portfolio for **Jhonel Alam**, built as a single-page application with React 18, Vite 5, Tailwind CSS v3.4, and Framer Motion v11. Themed around the visual language of *Signal & Cipher* — terminal UIs, scanlines, command palettes, and a boot sequence.

> Live site: [jhonelalam.dev](https://jhonelalam.dev) (deploy via `npm run deploy`)

---

## Features

- **Boot sequence** — full-screen terminal-style intro on first visit, remembered via `sessionStorage`.
- **Hero** — animated typing/decrypt reveal, telemetry panel, profile portrait with scanline overlay.
- **About** — bio, photo card, contact CTAs, and an `access.profile` stats panel.
- **Skills** — categorized technical skills with proficiency bars.
- **Experience** — timeline with filterable "Security Tools I Operate" cards (per-tool feature list, proficiency bars, deploy callout).
- **Featured Project** — netsec-console CMDB dashboard walkthrough.
- **Certifications** — interactive category filter, click-to-open credential dossier modal with copyable credential IDs and issuer verification links.
- **Activities** — workflow-phased cards (reconnaissance → reporting) for penetration testing, internal VAPT, and other technical activities.
- **Education** — academic history.
- **Contact** — EmailJS-powered form that sends inquiries directly to the configured inbox (no mail-client redirect).
- **Extras** — command palette (`/` or `Ctrl/Cmd+K`), mock terminal widget, theme toggle, network background, and a Konami easter egg.

## Tech Stack

| Layer        | Choice                                  |
| ------------ | --------------------------------------- |
| Framework    | React 18                                |
| Build tool   | Vite 5                                  |
| Styling      | Tailwind CSS 3.4 + custom theme tokens  |
| Animation    | Framer Motion 11                        |
| Email relay  | [@emailjs/browser](https://www.emailjs.com) |
| Icons        | Local SVG component library             |
| Lint / fmt   | ESLint + Prettier (Vite defaults)       |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or `pnpm` / `yarn`)

### Install

```bash
git clone https://github.com/jhonelalam/portfolio.git
cd portfolio
npm install
```

### Run locally

```bash
npm run dev
```

The dev server starts on `http://localhost:5173`.

### Build for production

```bash
npm run build
```

Static output is written to `dist/`. Preview the build locally with:

```bash
npm run preview
```

## EmailJS Setup (Contact Form)

The contact form sends inquiries **directly** to the configured inbox via the [EmailJS](https://www.emailjs.com) API. No redirect to Outlook / Gmail.

1. Create a free account at <https://dashboard.emailjs.com/sign-up>.
2. Add an **Email Service** (Gmail, Outlook, or custom SMTP) → copy the **Service ID**.
3. Create an **Email Template** with these variables in the body / subject:
   - `from_name`
   - `from_email`
   - `reply_to`
   - `message`
4. Copy the **Template ID**.
5. Copy the **Public Key** from *Account → API Keys*.
6. Paste all three values into `.env` (see [`.env.example`](.env.example)):

   ```ini
   VITE_EMAILJS_SERVICE_ID=service_xxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxx
   VITE_EMAILJS_PUBLIC_KEY=public_xxx
   ```

7. Restart `npm run dev` (Vite only injects `VITE_*` vars at build / dev start).

If any of the three values are missing, the form gracefully falls back to a `mailto:` handoff so visitors are never stranded.

## Project Structure

```
.
├── public/                  # Static assets (logo, resume, favicon, profile image)
├── src/
│   ├── components/
│   │   ├── background/      # Animated network background
│   │   ├── boot/            # Boot sequence
│   │   ├── common/          # Buttons, chips, headings, icons
│   │   ├── easter/          # Konami easter egg
│   │   ├── nav/             # Navbar + command palette
│   │   ├── sections/        # Page sections (Hero, About, Skills, ...)
│   │   └── terminal/        # Mock terminal widget
│   ├── context/             # Theme + Toast providers
│   ├── data/
│   │   └── content.js       # All portfolio content (single source of truth)
│   ├── hooks/               # useReducedMotion, useTheme, etc.
│   ├── utils/               # scroll helpers
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css            # Tailwind layers + design tokens
├── .env                     # Local secrets (not committed)
├── .env.example
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Customization

- **Content** — edit [`src/data/content.js`](src/data/content.js). All sections (profile, experience, certifications, activities, education) read from this file.
- **Theme colors** — `tailwind.config.js` → `theme.extend.colors` (`accent`, `base`, `ink*`).
- **Profile image** — drop a photo into `public/profile.jpg` and update `PROFILE_IMG` in [`Hero.jsx`](src/components/sections/Hero.jsx) and [`About.jsx`](src/components/sections/About.jsx).
- **Logo / favicon** — replace `public/logo.png` and `public/shield.svg`.

## Deployment

Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

```bash
npm run build
# then deploy ./dist
```

> Reminder: configure the **same three** `VITE_EMAILJS_*` env vars in your host's dashboard so the contact form stays live in production.

## License

[MIT](./LICENSE) © 2026 Jhonel Alam
