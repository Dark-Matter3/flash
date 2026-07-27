# Flash Landing Page — Single Source of Truth

**Canonical Location:** `/home/dark_matter3/linux-data/_deployment/flash-pages/` ✅  
**Last Updated:** 2026-07-09 (reorganized to _deployment folder)  
**Status:** Production-ready with Founder Infra Kit integration

---

## What This Is

This is the **authoritative, live landing page** for Flash. All edits happen here. This is what gets deployed to production.

---

## Current Infrastructure (2026-06-28)

✅ **Founder Infra Kit Modules Integrated:**
- `js/logger.js` — Vanilla JS logging with tag-based categorization
- `js/theme.js` — Dark/light mode toggle with localStorage persistence

✅ **Pages:**
- `index.html` — Main landing page (with theme toggle, Logger integration)
- `privacy.html` — Privacy policy
- `terms.html` — Terms of service

✅ **Styling:**
- `styles.css` — Complete design system with dark mode support (`.dark-mode` class)
- `demo.css` — Demo widget styling

✅ **Interactivity:**
- `script.js` — Page interactions (smooth scroll, Firebase integration, Logger calls)
- `demo.js` — Demo widget logic

✅ **Assets:**
- `assets/` — Images, mascot, branding

---

## Deployment Workflow

### For GitHub Pages Live Site

```bash
# 1. Edit files in /home/dark_matter3/linux-data/_deployment/flash-pages/
# (Make your changes here—this is the source of truth)

# 2. Test locally
cd /home/dark_matter3/linux-data/_deployment/flash-pages
python3 -m http.server 8000

# 3. Verify in browser
# Open http://localhost:8000
# Check: Logger console.log output, Theme toggle works, no errors

# 4. Commit and push
git add .
git commit -m "Update landing page"
git push origin main

# 5. Verify live site
# Open https://dark-matter3.github.io/flash/ in incognito
# Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
# Confirm Logger messages in console, dark mode works
```

---

## File Organization

```
/home/dark_matter3/linux-data/_deployment/flash-pages/
├── SOURCE_OF_TRUTH.md          ← You are here (canonical definition)
├── DEPLOYMENT_LOCK.md           ← URL preservation rules
├── LANDING_UPDATE_SAFETY_PLAN.md ← Safety procedures (on landing-safe-update branch)
├── DEPLOY.md                    ← Deployment instructions
├── index.html                   ← Main landing page
├── privacy.html                 ← Privacy policy
├── terms.html                   ← Terms of service
├── styles.css                   ← Design tokens + dark mode
├── demo.css                     ← Demo widget styles
├── script.js                    ← Page interactions + Logger.info()
├── demo.js                      ← Interactive demo logic
├── assets/                      ← Mascot, icons, images
└── js/
    ├── logger.js                ← Vanilla JS Logger (no deps)
    └── theme.js                 ← Theme Manager (localStorage + system preference)
```

---

## Single Source of Truth Rules

### ✅ DO:
- Edit files **only** in `/home/dark_matter3/linux-data/_deployment/flash-pages/`
- Test locally with `python3 -m http.server 8000`
- Verify Logger messages in browser console
- Test dark mode toggle works
- Commit and push to main branch (auto-deploys to GitHub Pages)
- Update this file when adding new features

### ❌ DON'T:
- Edit this `flash/` repo directly—it's a deployment mirror only
- Maintain multiple versions of the same file
- Deploy without testing locally first
- Edit files in other locations expecting them to auto-sync

---

## Verification Checklist (Before Deploying)

- [ ] All changes made in `/home/dark_matter3/linux-data/_deployment/flash-pages/`
- [ ] Tested locally: `python3 -m http.server 8000`
- [ ] Browser console shows Logger output (no errors)
- [ ] Dark mode toggle works: click button, see CSS class change
- [ ] Mobile responsive: test at 375px width
- [ ] Mascot loads and displays correctly
- [ ] Demo widget interactive
- [ ] All links work (smooth scroll to sections)
- [ ] Committed and pushed to main branch
- [ ] Live site verified at https://dark-matter3.github.io/flash/ (wait 1-2 min)
- [ ] Incognito mode + hard refresh (Cmd+Shift+R) shows new version

---

## Features

### Dark Mode (2026-06-28)
- Button in navbar: `<button id="theme-toggle">🌙 Dark</button>`
- Persistence: localStorage key `flash-pages-theme-mode`
- System preference detection: `window.matchMedia('(prefers-color-scheme: dark)')`
- CSS variables update when `.dark-mode` class added to `<html>`

### Logging (2026-06-28)
- Global: `window.Logger` and `window.LoggerTags`
- Auto-level: DEBUG on localhost, WARN in production
- Page load: `Logger.info(LoggerTags.NAVIGATION, 'Flash landing page loaded')`
- No external dependencies—pure vanilla JS

---

## Next Steps

### Phase 1: Performance Logging (Future)
- Log page load time, paint time, interaction latency
- Send analytics to Firebase

### Phase 2: A/B Testing (Future)
- Variant support (minimal vs. full demo)
- Event tracking for hero tap, demo interactions

### Phase 3: Conversion Funnel (Future)
- Track beta signup flow
- Log user drop-off points

---

## Questions?

Refer to:
- [DEPLOY.md](DEPLOY.md) — Step-by-step deployment
- [js/logger.js](js/logger.js) — Logger API
- [js/theme.js](js/theme.js) — Theme Manager API
- [styles.css](styles.css) — CSS variables and dark mode

---

**Status:** ✅ Production-Ready | **Last Sync:** 2026-06-28 | **Live Site:** https://dark-matter3.github.io/flash/
