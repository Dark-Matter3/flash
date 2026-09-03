---
Status: Documentation Only
Last Updated: 2026-09-02
Owner: Eray Korkmaz
---

# Flash Deployment Posture

## Current Known Deployment Target

- **Repository:** `Dark-Matter3/flash`
- **Published URL:** `https://dark-matter3.github.io/flash/`
- **Deployment mode:** GitHub Pages
- **Known source setting:** branch deployment from `main`, folder `/`

These values are documented from existing repo files, not changed in this pass.

## Current Build / Preview Posture

This repo appears to be a static site with no package-managed build step.

Known local preview commands:

```bash
cd /home/dark_matter3/linux-data/flash
python3 -m http.server 8000

# Alternative if available locally
npx serve .
```

## Current Deploy Flow

Documented current flow:

```bash
git add .
git commit -m "Update landing page"
git push origin main
curl -I https://dark-matter3.github.io/flash/
```

## Environment Requirements

Identifiable requirements:

- Git
- Python 3 for local preview via `python3 -m http.server`
- Optional Node/NPX only if using `npx serve .`

## Preview / Production Distinction

- **Preview/local:** `python3 -m http.server 8000` or `npx serve .`
- **Production:** GitHub Pages live URL above

## Known Constraints

- This repo controls a public URL and should be treated as deployment-sensitive.
- Existing docs indicate that renaming or changing the deployment source could break the public URL.
- Existing docs also describe a relationship with a canonical local source path under `_deployment/flash-pages`; this pass does not resolve or change that behavior.

## Unknowns

- Whether this repo is still the only edited local source, or whether edits are expected to originate elsewhere and be mirrored here
- Whether there is any hidden GitHub Actions or external automation beyond standard GitHub Pages branch deployment
- Whether any CSP/security headers are configured outside the repo settings

## Reference Docs

- `DEPLOY.md`
- `DEPLOYMENT_LOCK.md`
- `SOURCE_OF_TRUTH.md`

## This Pass Did Not Change

- deployment settings
- build commands
- environment handling
- security behavior
- runtime/site behavior