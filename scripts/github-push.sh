#!/usr/bin/env bash
# Push AI Fitness Coach monorepo to GitHub
# Usage:
#   export GITHUB_USER=yourusername
#   export GH_TOKEN=ghp_xxxx   # or: gh auth login
#   ./scripts/github-push.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPO_NAME="${REPO_NAME:-AI-Fitness-Coach}"
GITHUB_USER="${GITHUB_USER:-selvendran254}"
VISIBILITY="${VISIBILITY:-public}" # public | private

GH_BIN="${GH_BIN:-gh}"
if ! command -v "$GH_BIN" &>/dev/null && [[ -x /tmp/gh_2.86.0_linux_amd64/bin/gh ]]; then
  GH_BIN="/tmp/gh_2.86.0_linux_amd64/bin/gh"
fi

if [[ -z "$GITHUB_USER" ]] && command -v "$GH_BIN" &>/dev/null; then
  GITHUB_USER="$("$GH_BIN" api user -q .login 2>/dev/null || true)"
fi

if [[ -z "$GITHUB_USER" ]]; then
  echo "Set GITHUB_USER=your_github_username (or run: gh auth login)"
  exit 1
fi

if [[ ! -d .git ]]; then
  git init -b main
fi

if ! git rev-parse HEAD &>/dev/null; then
  git add -A
  git status --short | head -40
  git commit -m "$(cat <<'EOF'
Initial commit: AI Fitness Coach monorepo

Full-stack app for diabetes/BP-safe fitness with React client,
Express API, Prisma, OpenAI coach, Bluetooth devices, Tamil/English.
EOF
)"
fi

REMOTE="${REMOTE:-https://github.com/${GITHUB_USER}/${REPO_NAME}.git}"
if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi

if command -v "$GH_BIN" &>/dev/null; then
  if [[ -n "${GH_TOKEN:-}" ]]; then
    export GH_TOKEN
  fi
  if ! "$GH_BIN" repo view "${GITHUB_USER}/${REPO_NAME}" &>/dev/null; then
    echo "Creating GitHub repo ${GITHUB_USER}/${REPO_NAME} ..."
    "$GH_BIN" repo create "$REPO_NAME" --${VISIBILITY} --source=. --remote=origin --push --description "AI Fitness Coach — diabetes & BP safe workouts (EN + Tamil)"
  else
    echo "Repo exists. Pushing full monorepo to ${GITHUB_USER}/${REPO_NAME} ..."
    git push -u origin main --force-with-lease
  fi
else
  echo "gh CLI not found. Create repo manually:"
  echo "  https://github.com/new  → name: ${REPO_NAME}"
  echo "Then run: git push -u origin main"
  echo "Remote: $REMOTE"
fi

echo "Done: https://github.com/${GITHUB_USER}/${REPO_NAME}"
