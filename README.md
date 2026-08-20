# VespaDatabase 🛵

A crowdsourced registry for Vespa owners — a VIN/pedigree-style catalog of Vespas and the
people who love them.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Prisma + Supabase (PostgreSQL)** for the database.
- **Supabase Storage** for uploaded photos (bucket `photos`, must be public). Falls back to
  local disk (`public/uploads`) when Supabase isn't configured, so local dev needs no Supabase
  project — just a Postgres connection string.
- **Custom magic-link auth** — no passwords. In development, the magic link is printed to the
  server console and shown directly on screen so you can log in without an email provider.
  Set `RESEND_API_KEY` in `.env` to send real emails via [Resend](https://resend.com) in
  production.

## Getting started locally

Requires a PostgreSQL database — a local one, or Supabase's, or any other Postgres works fine
for `DATABASE_URL`.

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL and SESSION_SECRET
npx prisma migrate deploy
npm run dev
```

Open http://localhost:3000. Sign up with any email — the magic link will be printed in your
terminal and also shown on the "check your email" page for convenience in dev.

## Deploying to Netlify

1. **Push this repo to GitHub** and connect it as a new site in Netlify. `netlify.toml` already
   declares the Next.js runtime plugin and publish directory — don't override the "Publish
   directory" field in the Netlify UI, leave it blank.
2. **Set environment variables** under Site settings → Environment variables:
   - `DATABASE_URL` — your Supabase project's Postgres connection string (Project settings →
     Database → Connection string in the Supabase dashboard).
   - `SESSION_SECRET` — any long random string (`openssl rand -hex 32`)
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` — from Supabase's Project settings → API.
     Create a **public** Storage bucket named `photos` in the Supabase dashboard first.
   - Optionally `APP_URL` (defaults to the deployed origin) and `RESEND_API_KEY` / `EMAIL_FROM`
     to send real magic-link emails. Without Resend, the login link is only visible in the
     Netlify function logs and on the "check your email" page — fine for trying it out, not for
     real users.
3. **Deploy.** The build runs `prisma migrate deploy` automatically before `next build`, so the
   database schema is created on first deploy.

## Data model

- **User** — id, email, username, createdAt
- **Vespa** — id, ownerId, year, model, vin, color, story, createdAt (+ many Photos)

## Scope

This build covers the core loop: sign up → add your Vespa(s) to your Garage → browse everyone's
Vespas. Ownership transfer/claiming, likes, gamification, maps, and comments are intentionally
out of scope for now.
