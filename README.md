# VespaDatabase 🛵

A crowdsourced registry for Vespa owners — a VIN/pedigree-style catalog of Vespas and the
people who love them.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Prisma + PostgreSQL** for the database
- **Custom magic-link auth** — no passwords. In development, the magic link is printed to the
  server console and shown directly on screen so you can log in without an email provider.
  Set `SMTP_*` env vars in `.env` to send real emails via `nodemailer` in production.
- Photo uploads use **Netlify Blobs** when deployed on Netlify (detected via Netlify's own
  `NETLIFY` env var), and fall back to local disk (`public/uploads`) for local development —
  serverless functions have an ephemeral filesystem, so plain disk writes don't survive between
  invocations in production.

## Getting started locally

Requires a PostgreSQL database (a free one from [Neon](https://neon.tech) or
[Supabase](https://supabase.com) works fine, or run one locally).

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL and SESSION_SECRET
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000. Sign up with any email — the magic link will be printed in your
terminal and also shown on the "check your email" page for convenience in dev.

## Deploying to Netlify

1. **Push this repo to GitHub** (or your git host of choice) and connect it as a new site in
   Netlify — Netlify auto-detects Next.js, no `netlify.toml` build config needed beyond what's
   already in this repo.
2. **Provision Postgres.** Easiest path: in the Netlify site dashboard, add the **Netlify DB**
   extension (powered by Neon) — it provisions a Postgres database and injects `DATABASE_URL`
   automatically. Alternatively, create a database yourself (Neon, Supabase, etc.) and set
   `DATABASE_URL` as a site environment variable.
3. **Set the rest of the environment variables** under Site settings → Environment variables:
   - `SESSION_SECRET` — any long random string (`openssl rand -hex 32`)
   - `APP_URL` — your Netlify site URL, e.g. `https://your-site.netlify.app`
   - Optionally `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` to send real
     magic-link emails. Without these, the login link is only visible in the Netlify function
     logs and on the "check your email" page — fine for playing around, not for real users.
4. **Deploy.** The build runs `prisma migrate deploy` automatically (see the `build` script in
   `package.json`) before `next build`, so the database schema is created on first deploy.
5. **Netlify Blobs** needs no separate setup — it's automatically available to Netlify Functions
   once the site is deployed on Netlify.

## Data model

- **User** — id, email, username, createdAt
- **Vespa** — id, ownerId, year, model, vin, color, story, createdAt (+ many Photos)

## Scope

This build covers the core loop: sign up → add your Vespa(s) to your Garage → browse everyone's
Vespas. Ownership transfer/claiming, likes, gamification, maps, and comments are intentionally
out of scope for now.
