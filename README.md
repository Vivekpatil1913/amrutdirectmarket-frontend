# AMRUT Peth – Direct Market

Public website, React admin panel and Node.js/Express CMS backend for the AMRUT Peth direct-market initiative.

```
Admin panel (/admin) ──► Express REST API (backend/) ──► PostgreSQL ──► Public website (/)
```

| Part | Location | Stack |
|---|---|---|
| Public website | `src/` | React 19, React Router 7, Vite 6 |
| Admin panel | `src/admin/` (served at `/admin`, lazy-loaded) | React, lucide-react; design system from the Amrutvarg admin |
| Backend API | `backend/` | Node.js ≥ 20, Express 4, `pg`, zod, JWT sessions, multer |
| Database | PostgreSQL (tested on 18) | `backend/migrations/sql/*.sql` |

Every piece of editable website content — logo, favicon, titles/SEO, government bar and notice, navigation, hero text/images/facts/quick links, about text/photo/categories, highlight cards, eligibility groups, participation steps, registration form texts and subjects, contact details, footer text and official/social links — is stored in the database and managed from the admin panel. Enquiries submitted on the site are stored and handled in the admin panel.

## 1. Requirements

- Node.js 20+ (developed on 24) and npm
- PostgreSQL 13+ running locally or reachable over the network

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env          # then edit: PGPASSWORD, JWT_SECRET, SEED_ADMIN_* …
npm run db:setup              # creates the database, applies migrations, seeds baseline content
npm run dev                   # http://localhost:4200/api/v1  (node --watch)
```

- `npm run db:migrate` — creates the database if needed and applies any new `migrations/sql/NNN_*.sql` file (tracked in `schema_migrations`).
- `npm run db:seed` — inserts the first super admin (only if no admin exists) and the original site content (only into empty tables / missing sections). It never overwrites or re-creates anything an administrator has changed or deleted. If `SEED_ADMIN_PASSWORD` is empty a random password is printed once.
- `npm start` — production start.
- `npm test` — unit tests + end-to-end API tests. The API tests create and drop their own database `amrit_peth_cms_test`; development data is not touched.

Health check: `GET http://localhost:4200/api/v1/health`.

## 3. Website + admin setup

```bash
# in the project root
npm install
npm run dev                   # http://localhost:5173  (admin: http://localhost:5173/admin)
```

The Vite dev server proxies `/api` and `/uploads` to the backend (`VITE_DEV_API_TARGET`, default `http://localhost:4200`), so no API host is hard-coded in the app. Copy `.env.example` to `.env.local` to change it.

Sign in at `/admin/login` with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, then change the password under **My Profile**.

## 4. Production build

```bash
npm run build                 # → dist/
```

Serve `dist/` as a single-page app (all unknown paths → `index.html`) and either:

- put the API behind the same host, routing `/api/*` and `/uploads/*` to the backend (recommended — keep `VITE_API_URL=/api/v1`), or
- serve the API on another host: build with `VITE_API_URL=https://api.example.gov.in/api/v1` and add the site's origin to the backend's `CORS_ORIGINS`.

Backend in production: `NODE_ENV=production`, a random `JWT_SECRET` of 32+ characters (the server refuses to start otherwise), HTTPS in front (session cookie is `Secure`), and a persistent volume for `UPLOAD_DIR`.

## 5. Environment variables

**backend/.env** — see `backend/.env.example`:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4200` | API port |
| `PGHOST` `PGPORT` `PGUSER` `PGPASSWORD` `PGDATABASE` | `localhost` `5432` `postgres` – `amrit_peth_cms` | Database |
| `JWT_SECRET` | dev-only value | Session token signing (required in production) |
| `SESSION_HOURS` | `8` | Idle session lifetime |
| `LOGIN_MAX_ATTEMPTS` / `LOGIN_LOCK_MINUTES` | `5` / `15` | Account lockout |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:4173` | Browser origins allowed to call the API |
| `UPLOAD_DIR` / `MAX_FILE_SIZE_MB` | `uploads` / `5` | Media storage |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | | First super admin |
| `LOG_LEVEL` / `LOG_REQUESTS` | `info` / `true` | Logging |

**Website** — see `.env.example`: `VITE_API_URL`, `VITE_DEV_API_TARGET`.

## 6. Content model

**Page sections** (one record each, with a draft and a published copy — the site shows only published content):
Site Settings & SEO · Contact Details · Hero · About · Highlights · Participation · Registration · Footer.

**Collections** (lists with order, publish/draft status, soft delete and restore):
Navigation Menu · Hero Facts · Quick Links · Product Categories (slug) · Highlight Cards · Who Can Apply · Participation Steps · Enquiry Subjects (code) · Official & Social Links.

**Other modules:** Enquiries (status workflow, internal notes) · Media Library · Admin Users (roles: Super Admin, Admin, Editor) · Activity Log · Dashboard.

Deleting anything in the admin panel is a **soft delete** (`deleted_at`); deleted records disappear from the website and normal lists, stay in the database and can be restored from the **Trash** tab.

The API is documented in [`backend/docs/API.md`](backend/docs/API.md).

## 7. Project layout

```
backend/
  migrations/  migrate.js, sql/001_init.sql
  seeds/       seed.js, content.js (original site content), assets/ (original images)
  src/
    config/    env loading
    db/        pg pool + transaction helper
    lib/       errors, validators, field-spec → zod builder, audit, media refs, logger
    middleware/auth (sessions, roles), upload (type/size/signature checks), error, request log
    modules/   auth · sections · collections (generic CRUD) · enquiries · media · users · activity · dashboard · public
    routes/    router assembly, /health, /admin/meta
  test/        end-to-end API tests
src/
  admin/       admin panel (api client, layout, ui components, pages, config)
  components/  public site layout and sections (now CMS-driven)
  content/     SiteContentProvider — loads /public/site, localises mr/en, caches last good copy
  services/    API base URL / media URLs, public API calls
  i18n/        language switch + fixed interface strings
```
