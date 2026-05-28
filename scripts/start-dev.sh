#!/usr/bin/env bash
# Start AI Fitness Coach — kills stale ports, starts DB + app
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=========================================="
echo "  AI Fitness Coach — Starting..."
echo "=========================================="

# Free ports if old process stuck
for port in 5173 5174 3000 3001; do
  if fuser "$port/tcp" >/dev/null 2>&1; then
    echo "Stopping old process on port $port..."
    fuser -k "$port/tcp" >/dev/null 2>&1 || true
    sleep 1
  fi
done

# Database
if command -v docker >/dev/null 2>&1; then
  echo "Starting PostgreSQL..."
  docker compose up -d postgres
  sleep 2
fi

IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "127.0.0.1")

echo ""
echo "  Open in browser (pick ONE):"
echo "    http://localhost:5173"
echo "    http://127.0.0.1:5173"
if [ "$IP" != "127.0.0.1" ] && [ -n "$IP" ]; then
  echo "    http://${IP}:5173   (if browser is on another machine)"
fi
echo ""
echo "  NOT this (API only, no UI): http://localhost:3001"
echo "  Login: demo@fitcoach.demo / Demo@12345"
echo "=========================================="
echo ""

exec npm run dev
