# Ottea Studio — Institutional Website

Institutional website for Ottea Studio, a Brazilian branding and digital strategy agency. Built by [glim.](https://github.com/JuanGabrielGomes)

**[→ Live](https://tea-strategy-studio.vercel.app)**

> _Repository name reflects the agency's former name (Tea Strategy Studio). The brand is now Ottea Studio._

---

## Overview

Marketing and lead-generation website for a branding studio offering social media management, visual identity, content strategy, and paid traffic. The core goal of the site is to convert visitors into qualified leads through a multi-step diagnostic form.

---

## Features

**Site**
- Bilingual — Portuguese (`/`) and English (`/en`) with `hreflang` alternates and locale-aware metadata
- Animated hero and page sections with [Framer Motion](https://www.framer.com/motion/)
- CSS-only animated tea cup illustration (steam, liquid, tea bag, handle, saucer — no JS, no SVG library)
- Responsive, mobile-first layout with Tailwind CSS v4 design tokens
- Vercel Speed Insights

**Lead capture — `/diagnostico`**
- Multi-step form collecting brand context: challenge, project type, urgency, and budget range
- Honeypot field (`contactTrap`) for silent spam rejection — no CAPTCHA
- Server-side validation with bilingual error messages (PT / EN)
- 3-channel parallel forwarding on submission:
  - **Webhook** — generic HTTP POST to any endpoint
  - **SMTP email** — via Nodemailer (Gmail or any SMTP provider)
  - **ClickUp** — creates a task in a configured list via the ClickUp v2 API
- Graceful degradation: responds `200` if at least one active channel succeeds; individual channel failures are logged but non-blocking
- Optional local NDJSON persistence for environments with a writable filesystem

**SEO**
- `buildMetadata()` utility — generates `title`, `description`, canonical URL, `hreflang` alternates, Open Graph, and Twitter Card from a single call
- JSON-LD structured data: `ProfessionalService` and `WebSite` schemas
- Per-page `robots` configuration

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Email | Nodemailer |
| Deployment | Vercel |

---

## Getting Started

```bash
git clone https://github.com/JuanGabrielGomes/Tea-Strategy-Studio.git
cd Tea-Strategy-Studio
npm install
cp .env.local.example .env.local   # configure forwarding channels
npm run dev
```

---

## Environment Variables

At least one forwarding channel must be configured for the lead form to work.

**Webhook**

| Variable | Description |
|---|---|
| `TEA_LEADS_WEBHOOK_URL` | HTTP endpoint that receives lead payloads as JSON POST |

**Email (Nodemailer)**

| Variable | Description |
|---|---|
| `TEA_SMTP_HOST` | SMTP host (default: `smtp.gmail.com`) |
| `TEA_SMTP_PORT` | SMTP port (default: `465`) |
| `TEA_SMTP_SECURE` | `true` for SSL, `false` for STARTTLS |
| `TEA_SMTP_USER` | SMTP username |
| `TEA_SMTP_PASS` | SMTP password or app password |
| `TEA_LEADS_EMAIL_FROM` | Sender address |
| `TEA_LEADS_EMAIL_TO` | Comma-separated list of recipient addresses |

**ClickUp**

| Variable | Description |
|---|---|
| `CLICKUP_API_TOKEN` | ClickUp personal API token |
| `CLICKUP_LIST_ID` | ID of the list where lead tasks are created |

**Optional**

| Variable | Description |
|---|---|
| `TEA_PERSIST_LOCAL_LEADS` | Set to `true` to write leads to `data/diagnostico-leads.ndjson` (local only — not available on Vercel) |

---

## Lead Forwarding Architecture

```
POST /api/diagnostico
  ├─ sanitize + validate (PT/EN)
  ├─ honeypot check  →  silent 200 if triggered
  └─ Promise.all([
       forwardToWebhook(),   // generic HTTP POST
       forwardToEmail(),     // Nodemailer SMTP
       forwardToClickUp()    // ClickUp v2 API task
     ])
       ├─ all disabled      →  503
       ├─ all failed        →  502 + console.error per channel
       └─ at least one ok   →  200  (failures logged, non-blocking)
```

---

## Built by

**[glim.](https://github.com/JuanGabrielGomes)** — boutique web engineering and digital design studio.
