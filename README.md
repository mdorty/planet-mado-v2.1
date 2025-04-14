# DBZ RPG
A browser-based Dragon Ball Z RPG built with Next.js, React, PostgreSQL, Prisma, tRPC, and NextAuth.js.

## Setup
1. Install dependencies: `npm install`
2. Set up PostgreSQL and add `DATABASE_URL` to `.env`
3. Add `NEXTAUTH_SECRET` to `.env` (generate with `openssl rand -base64 32`)
4. Run migrations: `npm run prisma:migrate`
5. Start dev server: `npm run dev`

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Prisma (PostgreSQL)
- tRPC
- NextAuth.js (authentication)
- Tailwind CSS

## Authentication
- Sign up and sign in at `/auth/signup` and `/auth/signin`.
- Uses Credentials Provider (email/password) with bcrypt hashing.
- Supports OAuth providers (e.g., Google) by configuring `lib/auth.ts`.