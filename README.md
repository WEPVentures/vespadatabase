# VespaDatabase 🛵

A crowdsourced registry for Vespa owners — a VIN/pedigree-style catalog of Vespas and the
people who love them.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Prisma + SQLite** for the database (zero external services to get running)
- **Custom magic-link auth** — no passwords. In development, the magic link is printed to the
  server console and shown directly on screen so you can log in without an email provider.
  Set `SMTP_*` env vars in `.env` to send real emails via `nodemailer` in production.
- Photos are stored on local disk under `public/uploads` (swap for S3/R2 later if you outgrow it).

## Getting started

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000. Sign up with any email — the magic link will be printed in your
terminal and also shown on the "check your email" page for convenience in dev.

## Data model

- **User** — id, email, username, createdAt
- **Vespa** — id, ownerId, year, model, vin, color, story, createdAt (+ many Photos)

## Scope

This build covers the core loop: sign up → add your Vespa(s) to your Garage → browse everyone's
Vespas. Ownership transfer/claiming, likes, gamification, maps, and comments are intentionally
out of scope for now.
