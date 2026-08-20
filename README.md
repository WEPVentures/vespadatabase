# VespaDatabase 🛵

A crowdsourced registry for Vespa owners — a VIN/pedigree-style catalog of Vespas and the
people who love them.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Netlify Blobs** for all data — users, login tokens, Vespas, and photos. No external
  database to provision: everything is stored as JSON/files in Netlify's built-in blob store,
  available automatically the moment the site is deployed on Netlify. Locally (not deployed on
  Netlify), it falls back to a `.data/` folder of JSON files on disk, so local dev needs zero
  setup either — no signup, no connection string.
- **Custom magic-link auth** — no passwords. In development, the magic link is printed to the
  server console and shown directly on screen so you can log in without an email provider.
  Set `SMTP_*` env vars in `.env` to send real emails via `nodemailer` in production.

## Getting started locally

```bash
npm install
cp .env.example .env   # fill in SESSION_SECRET (any long random string)
npm run dev
```

Open http://localhost:3000. Sign up with any email — the magic link will be printed in your
terminal and also shown on the "check your email" page for convenience in dev. Data is written
to a `.data/` folder (gitignored) in the project root.

## Deploying to Netlify

1. **Push this repo to GitHub** (or your git host of choice) and connect it as a new site in
   Netlify — Netlify auto-detects Next.js, no extra build config needed beyond what's already
   in `netlify.toml`.
2. **Set one environment variable** under Site settings → Environment variables:
   - `SESSION_SECRET` — any long random string (`openssl rand -hex 32`)
   - Optionally `APP_URL` (defaults to the deployed origin) and `SMTP_HOST` / `SMTP_PORT` /
     `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` to send real magic-link emails. Without SMTP, the
     login link is only visible in the Netlify function logs and on the "check your email"
     page — fine for trying it out, not for real users.
3. **Deploy.** That's it — no database to provision. Netlify Blobs is available to the site
   automatically.

## Data model

- **User** — id, email, username, createdAt
- **Vespa** — id, ownerId, year, model, vin, color, story, createdAt (+ embedded photos)

## Scope

This build covers the core loop: sign up → add your Vespa(s) to your Garage → browse everyone's
Vespas. Ownership transfer/claiming, likes, gamification, maps, and comments are intentionally
out of scope for now.

Data lives in Netlify Blobs rather than a relational database — everything is filtered/sorted
in memory per request, which is fine at this app's scale but has weaker guarantees (no
transactions, no real query engine) than a real database. Worth revisiting if this grows well
beyond a hobby registry.
