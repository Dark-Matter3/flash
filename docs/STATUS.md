---
Status: Production
Last Updated: 2026-09-02
Owner: Eray Korkmaz
Priority: Supports Flash flagship
---

# Flash Repo Status

## Product Status

- **Product represented here:** Flash public landing page
- **Site status:** Live public surface
- **Main product:** The core app lives in `flash-app`, not in this repo

## Repo Status

- **Repo state:** Deployment-sensitive static site repository
- **Current role:** Public marketing/landing surface for Flash
- **Current stack:** Static HTML, CSS, and JavaScript
- **Docs baseline:** Added in this pass only; no behavior changes

## Active Development Status

- Active only for landing-page/documentation updates
- Not the place for mobile app feature development
- Not the place for backend/config experimentation

## Release / Beta Status

- Public landing page is live via GitHub Pages
- Flash app closed-beta / release engineering state is documented in `flash-app`, not controlled here

## Priority Level

- **Portfolio priority:** Supports priority-1 Flash, but is not the flagship runtime repo
- **Operational sensitivity:** High for URL/deployment continuity

## Blocked / Deferred Areas

- runtime/app changes
- CSP/security-header changes
- deployment-setting changes
- package-manager/build-system normalization
- analytics/tracking additions
- auth/payment/backend additions

## Do Not Touch Without Approval

- repository name
- branch deployment source
- root-folder Pages deployment
- public URL assumptions
- any deployment automation behavior
- any environment-variable behavior

## Current Sources Of Truth

- `DEPLOYMENT_LOCK.md`
- `DEPLOY.md`
- `SOURCE_OF_TRUTH.md`