# GitHub — full project upload

This project is a **single monorepo** (recommended): `client` + `server` + `shared` in one repo.

## Already done on your machine

- Git initialized in `/home/dell/Documents/project` (not your home folder)
- **199 files** committed on branch `main`
- `.env` and `node_modules` are **not** included (safe)
- CI workflow: `.github/workflows/ci.yml`

## Step 1 — GitHub login (one time)

```bash
# If gh is not installed globally, use the downloaded binary:
export GH_BIN=/tmp/gh_2.86.0_linux_amd64/bin/gh
$GH_BIN auth login
```

Choose: **GitHub.com** → **HTTPS** → login in browser.

Or use a Personal Access Token:

1. GitHub → Settings → Developer settings → Personal access tokens
2. Create token with `repo` scope
3. Run:

```bash
export GH_TOKEN=ghp_YOUR_TOKEN_HERE
export GITHUB_USER=your_github_username
```

## Step 2 — Create repo & push (automatic)

```bash
cd /home/dell/Documents/project
chmod +x scripts/github-push.sh
./scripts/github-push.sh
```

Default repo name: **`ai-fitness-coach`** (public).

Private repo:

```bash
VISIBILITY=private ./scripts/github-push.sh
```

Custom name:

```bash
REPO_NAME=my-fitness-app ./scripts/github-push.sh
```

## Step 2 — Manual (without gh)

1. Open https://github.com/new  
2. Repository name: `ai-fitness-coach`  
3. **Do not** add README / .gitignore (already in project)  
4. Create repository  

```bash
cd /home/dell/Documents/project
git remote add origin https://github.com/YOUR_USERNAME/ai-fitness-coach.git
git push -u origin main
```

## After push

- Enable **Actions** tab for CI builds
- Add GitHub Secrets for deploy (optional):
  - `OPENAI_API_KEY`
  - `DATABASE_URL`
  - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

## Demo login (app)

- Email: `demo@fitcoach.demo`
- Password: `Demo@12345`
