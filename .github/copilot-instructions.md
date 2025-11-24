# Copilot / AI Agent instructions — ecommerce (Next.js)

This file gives targeted, actionable guidance to an AI coding agent working on this repository. Keep suggestions specific to the codebase and reference concrete files/paths.

1) Big picture (what this project is)
- Next.js (App Router) frontend + serverless API routes under `src/app/api/*`.
- MongoDB is used via Mongoose. DB connection helper: `src/database/index.js`.
- Application state is provided with a React context at `src/context/index.js` and consumed across pages/components.
- Client-side services that call internal API routes live in `src/services/*` (e.g. `src/services/product/index.js`).

2) Architecture & boundaries (how responsibilities are split)
- UI: `src/app/*` and `src/components/*` (pages use the App Router — server components + client components). Example: `src/app/layout.js` wraps the entire app with `GlobalState` and `Navbar`.
- API layer: `src/app/api/*/route.js` files implement server endpoints. They call Mongoose models in `src/models/*` and the DB helper in `src/database/index.js`.
- Services: client-side convenience wrappers under `src/services/*` that call `/api/*` endpoints (examples: `addNewProduct`, `getAllAdminProducts` in `src/services/product/index.js`). Prefer these for client fetches rather than inlining fetch calls in components.
- Models: `src/models/*` are Mongoose schemas used by API routes.

3) Key conventions and patterns
- Path alias: imports use `@/` mapped to `src/` via `jsconfig.json` — use `@/models/user` or `@/services/cart` rather than long relative paths.
- API signatures: API routes return JSON via `NextResponse.json()` and typically use `export const dynamic = "force-dynamic";` at top. Follow this pattern for new API routes.
- Auth: authentication tokens are stored in cookies (see `js-cookie` usage in `src/services/*`) and user data is stored in localStorage. Look at `src/context/index.js` to see the runtime check for `Cookies.get('token')`.
- Error/validation: many API routes use `Joi` for request validation. Reuse the same schema-then-respond pattern.
- JWT: some routes sign/expect JWTs. Existing code uses a hard-coded secret (e.g. `default_secret_key`) — treat this as a TODO if you modify auth flows and prefer environment variables.

4) Developer workflows / commands
- Dev server (run from project root):
  - npm: `npm run dev` (runs `next dev`)
  - build: `npm run build` then `npm run start`
- Lint: `npm run lint` (uses Next.js eslint config)
- When testing API endpoints locally, the client services often call absolute `http://localhost:3000/api/...` in serverless fetches; prefer relative `/api/...` to avoid port-hardcoding in client-side code.

5) Files to check when changing behavior
- DB connection: `src/database/index.js` — called at top of API routes. Changing connection handling or environment variables affects all APIs.
- Global state: `src/context/index.js` — updates here affect auth and UI state across app.
- Client services: `src/services/*` — these are the canonical place for calling APIs from components.
- API routes: `src/app/api/*/route.js` — server-only code. Use `NextResponse` and `connectToDB()` when needed.

6) Integration points & external dependencies
- MongoDB via Mongoose. Connection URL currently hard-coded in `src/database/index.js` (replace with env var `MONGODB_URI` when making changes).
- Stripe usage: `@stripe/stripe-js` and `stripe` are installed — search for `stripe` to see payment flows (not central in the current snapshot).
- Firebase is present in package.json but may be unused; search `firebase` before introducing changes.

7) Small, concrete examples to follow
- Creating a new API route that reads JSON, validates with Joi, writes via a Mongoose model, and returns a NextResponse JSON: see `src/app/api/register/route.js` and `src/app/api/login/route.js`.
- Calling an authenticated admin endpoint from client code: use `js-cookie` to read `token` and add `Authorization: Bearer <token>` header — see `src/services/product/index.js`.

8) What to avoid / gotchas
- Do not assume environment variables exist — many secrets are currently hard-coded (DB URL, JWT secret). If you add env usage, update `src/database/index.js` and API routes consistently.
- Some client services use absolute URLs (`http://localhost:3000/api/...`) — prefer relative `/api/...` and `cache: 'no-store'` as needed for server-side fetches.
- The project uses Next 15+ and React 19 — be careful when copying examples for older Next.js versions (App Router specifics matter).

9) Editing etiquette for AI patches
- Keep changes minimal and locally scoped. When modifying auth or DB code, add a short note and prefer adding an env var fallback rather than replacing the value silently.
- Preserve `export const dynamic = "force-dynamic";` where present unless you intentionally change caching behavior and document why.

10) Quick reference (paths)
- App root/layout: `src/app/layout.js`
- API routes: `src/app/api/*/route.js` (e.g. `src/app/api/register/route.js`)
- Services (client): `src/services/*` (e.g. `src/services/product/index.js`)
- Context provider: `src/context/index.js`
- DB helper: `src/database/index.js`
- Models: `src/models/*.js`
- Path alias config: `jsconfig.json` ("@/*" -> "./src/*")

If anything in this file is unclear, tell me which area you'd like expanded (authentication, API patterns, or DB/config management) and I'll iterate.
