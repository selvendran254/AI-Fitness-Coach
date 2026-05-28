# AI Fitness Coach

Production-ready AI-powered fitness coaching web app for **diabetics** and **blood pressure patients**, with **English** and **Tamil** support.

## Monorepo structure

```
├── client/     # React + TypeScript + Tailwind + shadcn/ui
├── server/     # Node.js + Express + Prisma + OpenAI
├── shared/     # Shared TypeScript types & utilities
└── docs/       # OpenAPI / API documentation
```

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, i18next |
| Backend | Node.js, Express, Zod validation, Pino logging |
| Database | PostgreSQL, Prisma ORM |
| AI | OpenAI GPT-4o |
| Auth | JWT access + refresh tokens |
| Analytics | Mixpanel (optional) |

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- OpenAI API key

## Quick start

### GitHub

Full upload guide: **[docs/GITHUB.md](docs/GITHUB.md)**

```bash
gh auth login   # one time
./scripts/github-push.sh
```

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/ai-fitness-coach.git
cd ai-fitness-coach
npm install
```

### 2. Environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` with your database URL, JWT secrets, and OpenAI key.

### 3. Database (Docker — recommended)

```bash
docker compose up -d postgres
./scripts/setup-db.sh
```

Or manually:

```bash
npm run db:generate
cd server && npx prisma db push
npm run db:seed -w server
```

> **Note:** Uses PostgreSQL on port **5433** (not 5432) to avoid conflicts with system Postgres.
> Credentials: `postgres` / `fitcoach_dev` — see `server/.env.example`

### 4. Run development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001
- API docs: http://localhost:3001/api/v1/docs

## Features

See **[docs/FEATURES.md](docs/FEATURES.md)** for all 27 implemented features (dashboard, vitals, Bluetooth, challenges, 2FA, caregiver, etc.).

- Workout & meal plan generator (AI)
- Calorie & macro tracker
- Food photo calorie scan
- AI chat coach
- BMI & body metrics
- Water & sleep trackers
- Progress charts
- Friends challenges & leaderboard
- PWA + offline support
- Dark mode
- Export CSV/PDF
- Admin dashboard
- Advanced user settings (health conditions, units, notifications, privacy)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server |
| `npm run build` | Production build |
| `npm run test` | Run all tests |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:studio` | Open Prisma Studio |

## API versioning

All routes are under `/api/v1/`. See `docs/openapi.yaml` for the full specification.

## License

MIT
