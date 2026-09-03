---
Status: Production
Last Updated: 2026-09-02
Owner: Eray Korkmaz
Stack: Static HTML + CSS + JavaScript
---

# Flash Landing Repo

This repository is the public deployment surface for the Flash landing page.

## Status

- **Project status:** Production
- **Repo role:** GitHub Pages landing-site surface for Flash
- **Priority:** Supports Flash, but does not replace `flash-app`
- **Current posture:** Static site, deployment-sensitive, docs now standardized at the portfolio level

## Real Local Path

`/home/dark_matter3/linux-data/flash`

## Current Stack

- Static HTML
- Static CSS
- Vanilla JavaScript
- GitHub Pages deployment from repository root

There is currently **no `package.json`**, no package-manager workflow, and no app-style build pipeline in this repo.

## What This Repo Is

- The public Flash landing page and policy pages
- The GitHub Pages deployment target for `https://dark-matter3.github.io/flash/`
- A deployment-sensitive mirror/surface distinct from `flash-app`

## What This Repo Is Not

- The main Flash product codebase
- The place to change mobile app runtime behavior
- A Node/Next.js/Vite project
- A safe place to change deployment behavior casually

## Current Commands

These are the current known commands documented or directly inspectable from this repo today.

```bash
# Confirm repo path
cd /home/dark_matter3/linux-data/flash
pwd

# Inspect repo contents
ls -la

# Local static preview
python3 -m http.server 8000

# Alternative local preview (only if available locally)
npx serve .

# Verify live deployment
curl -I https://dark-matter3.github.io/flash/

# Standard git deploy flow
git add .
git commit -m "Update landing page"
git push origin main
```

## Current Verification Commands

```bash
cd /home/dark_matter3/linux-data/flash
python3 -m http.server 8000
curl -I https://dark-matter3.github.io/flash/
git diff --check
```

## Public / Private Posture

- **Public:** landing page HTML, CSS, JS, public assets, privacy/terms pages
- **Private elsewhere:** Flash app internals, mobile runtime logic, backend behavior, Firebase details, monetization logic
- **Boundary:** this repo should describe and deploy the public landing surface only

## Do Not Change Without Approval

- GitHub Pages deployment settings
- repository name `flash`
- branch-based deployment behavior
- root-folder deployment behavior
- security/CSP posture
- environment-variable behavior
- any relationship between this repo and `flash-app`

## Key Documentation

- `docs/STATUS.md` — repo posture, priority, blocked areas
- `docs/DEPLOYMENT.md` — current deployment/build posture, unknowns, constraints
- `docs/WEB_CONFIG_AUDIT.md` — Flash-specific portfolio config audit
- `DEPLOY.md` — existing deployment checklist
- `DEPLOYMENT_LOCK.md` — non-negotiable URL preservation rules
- `SOURCE_OF_TRUTH.md` — current source-of-truth notes and mirror relationship

## Current File Surface

- `index.html` — main landing page
- `privacy.html` — privacy page
- `terms.html` — terms page
- `styles.css` and `demo.css` — presentation layer
- `script.js` and `demo.js` — interactive behavior
- `js/logger.js` and `js/theme.js` — utility scripts
- `assets/` — public assets used by the landing page

## Notes

- This docs pass does **not** change runtime, deployment, build, security, or configuration behavior.
- No `.env.example` was added because no environment-variable workflow is currently documented or required for this static repo.