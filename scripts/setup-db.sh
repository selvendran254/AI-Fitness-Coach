#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Starting PostgreSQL (Docker)..."
docker compose up -d postgres

echo "Waiting for database..."
until docker compose exec -T postgres pg_isready -U postgres -d ai_fitness_coach >/dev/null 2>&1; do
  sleep 1
done

echo "Running migrations..."
npm run db:generate
npm run db:migrate

echo "Seeding demo data..."
npm run db:seed -w server

echo "Done! Start app with: npm run dev"
