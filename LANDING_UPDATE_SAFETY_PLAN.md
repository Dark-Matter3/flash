# Flash Landing Page - Safe Update Plan

**Date Created:** 2026-07-09  
**Status:** Ready for branch creation  
**Approval Required:** None (safety inspection complete)

---

## 1. Current Public URL (From DEPLOYMENT_LOCK.md)

| Item | Value |
|------|-------|
| **Live URL** | `https://dark-matter3.github.io/flash/` |
| **Repository** | `Dark-Matter3/flash` |
| **GitHub Pages Source** | Deploy from `main` branch |
| **Publishing Folder** | `/` (repository root) |
| **Custom Domain** | None (standard GitHub Pages) |
| **Current Status** | ✅ LIVE (HTTP/2 200 verified) |

---

## 2. GitHub Pages Configuration (DO NOT CHANGE)

```
Settings → Pages
├─ Source: Deploy from branch
├─ Branch: main
├─ Folder: / (root)
└─ No CNAME, no Jekyll, no .nojekyll
```

**Files that control deployment:**
- None — standard GitHub Pages (no CNAME, no config files in repo)
- Deployment happens automatically when main branch is updated
- Rebuild time: 1-2 minutes

**Files that MUST NOT be changed:**
- ❌ Repository name (`flash` → GitHub Pages URL depends on it)
- ❌ Branch name (`main` → GitHub Pages would lose source)
- ❌ Publishing folder (currently `/` → moving to `/docs` would break URL)
- ❌ No CNAME file should be added without DNS verification

---

## 3. Files Analyzed & Categorization

### 🔐 CRITICAL - DO NOT EDIT (URL & Form Preservation)

| File | Purpose | Why Protected |
|------|---------|---------------|
| `index.html` | Main landing page + waitlist form | Form IDs: `waitlist-form`, `wl-email`, `wl-name`, `wl-success`, `wl-submit-error` are referenced by script.js |
| `script.js` | Firebase config + form submission handler | Handles Firestore writes, email validation, modal open/close, success state |
| `js/logger.js` | Founder Infra Kit: Vanilla JS logging | No external dependencies; used by script.js |
| `js/theme.js` | Founder Infra Kit: Dark mode toggle | Manages localStorage, CSS class injection |
| `DEPLOYMENT_LOCK.md` | URL preservation documentation | Documents why the repo structure must be preserved |

**Edits allowed in CRITICAL files:** Copy/styling only, form IDs/names/handlers must not change

### ✏️ SAFE TO EDIT (No URL Impact)

| File | Purpose | Safe Changes |
|------|---------|--------------|
| `styles.css` | Main page styling | Update colors, spacing, responsiveness, typography |
| `demo.css` | Demo widget styling | Improve demo appearance |
| `demo.js` | Demo widget logic | Enhance demo interactivity, improve UX |
| `DEPLOY.md` | Deployment instructions | Update workflow docs |
| `SOURCE_OF_TRUTH.md` | Landing page documentation | Update canonical source notes |
| `privacy.html` | Privacy policy | Update legal text, policy dates |
| `terms.html` | Terms of service | Update legal text, policy dates |
| `assets/` | Images, SVGs | Replace/optimize images, add new assets |

### 📋 REFERENCE ONLY (Do Not Edit)

| File | Purpose |
|------|---------|
| `LANDING_UPDATE_SAFETY_PLAN.md` | This document |

---

## 4. Current File Inventory

```
flash-pages/
├── index.html                     (24K) 🔐 CRITICAL
├── script.js                      (12K) 🔐 CRITICAL
├── styles.css                     (28K) ✏️  SAFE
├── demo.js                        (24K) ✏️  SAFE
├── demo.css                       (20K) ✏️  SAFE
├── privacy.html                   (8K)  ✏️  SAFE
├── terms.html                     (12K) ✏️  SAFE
├── DEPLOY.md                      (4K)  ✏️  SAFE
├── DEPLOYMENT_LOCK.md             (4K)  🔐 CRITICAL
├── SOURCE_OF_TRUTH.md             (8K)  ✏️  SAFE
├── assets/                        (144K) ✏️ SAFE
│   ├── mascot.svg
│   └── Screenshot_20260422_172936.png
└── js/                            (12K) 🔐 CRITICAL
    ├── logger.js
    └── theme.js
```

**Total deployment:** ~200KB (under 300KB threshold, safe for GitHub Pages)

---

## 5. Identified Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Form submission breaks | Users can't join waitlist | ✅ Use safety branch; test form before merge |
| Firebase init fails | Modal won't open | ✅ Don't change Firebase config in index.html |
| CSS breaks layout | Page looks broken on deployment | ✅ Test locally with live server; verify mobile |
| Demo widget fails | Interactive demo won't run | ✅ Keep demo.js form ID references intact |
| URL changes | Public link stops working | ✅ Never rename repo, change branch, or move folder |
| Cache serves old version | Users see stale content | ✅ GitHub Pages rebuilds in 1-2 min; browser cache: hard refresh |

---

## 6. Exact Files You Plan to Edit

**After approval, plan to:**

- [ ] Create safety branch `landing-safe-update`
- [ ] Make improvements to: styles.css, demo.css, demo.js
- [ ] Update assets if needed
- [ ] Test locally: `python3 -m http.server 8000`
- [ ] Verify form works, Logger logs, theme toggles
- [ ] Commit: `git commit -m "improve: Landing page updates [safety verified]"`
- [ ] Push: `git push origin landing-safe-update`
- [ ] Create PR for manual review
- [ ] Merge after verification
- [ ] Verify live at https://dark-matter3.github.io/flash/

**Files you will NOT touch:**
- ❌ index.html (form IDs must match script.js)
- ❌ script.js (Firebase + form handlers)
- ❌ js/logger.js (Founder Infra Kit)
- ❌ js/theme.js (Founder Infra Kit)
- ❌ DEPLOYMENT_LOCK.md (preservation doc)
- ❌ Any .git/* files
- ❌ Repository name, branch name, folder structure

---

## 7. Local Testing Procedure

### Pre-Edit Baseline

```bash
# 1. Create local backup
cd /home/dark_matter3/linux-data/flash-pages
cp -r . ../flash-pages-backup-2026-07-09/

# 2. Verify baseline
python3 -m http.server 8000
# Open: http://localhost:8000
# ✅ Page loads without errors
# ✅ Mascot appears in navbar, hero, footer
# ✅ Waitlist form visible
# ✅ Demo widget loads and interactive
# ✅ Dark mode toggle works
# ✅ Console shows Logger messages (DevTools)
# ✅ No 404s in DevTools Network tab
```

### After Edits (Before Pushing)

```bash
# 1. Test locally
cd /home/dark_matter3/linux-data/flash-pages
python3 -m http.server 8000

# 2. Browser verification
# Open: http://localhost:8000
# ✅ Page loads without errors
# ✅ Mascot appears in navbar, hero, footer
# ✅ Waitlist form visible + clickable
# ✅ Demo widget loads and interactive
# ✅ Dark mode toggle works
# ✅ Console shows Logger messages (DevTools)
# ✅ No 404s in DevTools Network tab
# ✅ Mobile responsive at 375px width
# ✅ Form submission shows success state
# ✅ All links work (anchor scrolls, external links open)

# 3. Form test
# - Click "Join the Flash waitlist" button
# - Form modal opens
# - Enter: test@example.com, "Test User"
# - Click submit
# - Success message appears: "Thanks for joining the waitlist!"
# - Modal can be closed and reopened
# - Form resets properly

# 4. Mobile test
# DevTools → Device Emulation → Pixel 6a (or similar)
# ✅ Page layout adapts
# ✅ Buttons are clickable (min 44px touch target)
# ✅ Form inputs are usable
# ✅ No horizontal scroll
# ✅ Text is readable (not too small)
```

---

## 8. Post-Deployment Verification

### Immediate (After Push & GitHub Pages Rebuild)

**Wait 1-2 minutes, then:**

```bash
# 1. Verify HTTP status
curl -I https://dark-matter3.github.io/flash/
# Expected: HTTP/2 200

# 2. Verify content updated
curl -s https://dark-matter3.github.io/flash/ | grep -i "build\|last-modified" | head -3

# 3. Test in multiple browsers
# Desktop:
#   - Chrome/Chromium
#   - Firefox
#   - Safari (if available)
# Mobile:
#   - iOS Safari (iPhone)
#   - Chrome Android (Pixel)
# Incognito/Private:
#   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Linux/Windows)
```

### Functional (Browser Testing)

```
✅ Page loads without errors
✅ Mascot logo visible in navbar, hero, footer
✅ Demo widget loads and responds to interaction
✅ Keyboard shortcuts work (if implemented)
✅ Waitlist form opens when button clicked
✅ Form fields focus properly
✅ Submit button responds to input
✅ Success/error states display correctly
✅ Dark mode toggle works and persists (refresh page)
✅ Browser console shows Logger.info() messages
✅ No 404 errors in Network tab
✅ CSS loads (no broken layout)
✅ Images/SVGs load
✅ All form links work (Google Forms fallback)
```

### Rollback Window

**If anything is wrong:**

```bash
# 1. Immediately revert the branch
git reset --hard HEAD~1
git push origin main --force

# 2. GitHub Pages will rebuild in 1-2 minutes
# 3. Verify live site returns to previous state

# 4. Investigate locally
# 5. Create new branch, fix issue, test thoroughly, push again
```

---

## 9. Branching Strategy

### Create Safety Branch

```bash
cd /home/dark_matter3/linux-data/flash-pages
git checkout -b landing-safe-update
# Branch created locally; not pushed yet
```

### Make Edits

Edit safe files only (see section 3).

### Commit & Push

```bash
# 1. Review changes
git status
git diff --stat

# 2. Commit with clear message
git commit -am "improve: Landing page updates - [describe changes]"

# 3. Push to safety branch
git push origin landing-safe-update
```

### Create PR (Recommended)

```bash
# On GitHub, create PR: landing-safe-update → main
# Add checklist:
# - [ ] Changes tested locally
# - [ ] Form submission tested
# - [ ] Mobile responsiveness verified
# - [ ] No HTTP errors
# - [ ] Console shows no errors
```

### Review & Merge

```bash
# After verification in browser at temporary URL:
# 1. Approve PR
# 2. Squash merge (or regular merge)
# 3. Delete safety branch

git checkout main
git pull origin main
```

### Verify Live Deployment

```bash
# Wait 1-2 minutes for GitHub Pages rebuild
curl -I https://dark-matter3.github.io/flash/
# Should show: HTTP/2 200 + recent Last-Modified header
```

---

## 10. Rollback Plan

If deployment goes wrong:

### Scenario A: Minor Visual Issue

```bash
# 1. Make quick fix locally in main branch
git checkout main
# Edit file
git add .
git commit -m "fix: Revert landing page issue"
git push origin main
# Wait 1-2 minutes for rebuild
# Verify: https://dark-matter3.github.io/flash/
```

### Scenario B: Form Broken or URL Changed

```bash
# 1. IMMEDIATELY revert last commit
git reset --hard HEAD~1
git push origin main --force

# 2. GitHub Pages rebuilds in 1-2 minutes
# 3. Verify: https://dark-matter3.github.io/flash/ returns HTTP/2 200

# 4. DO NOT make changes until root cause found
# 5. Investigate: check git diff, form IDs, script references
```

### Scenario C: Rollback from Backup

```bash
# If local branch history is lost:
cp -r ../flash-pages-backup-2026-07-09/* .
git add -A
git commit -m "restore: Revert to known-good state from backup"
git push origin main
# Wait 1-2 minutes
# Verify: https://dark-matter3.github.io/flash/
```

---

## 11. Non-Negotiable Rules Summary

### ❌ DO NOT

- Rename repository (`flash` → `flash-landing`)
- Delete repository
- Merge into `flash-app`
- Change main branch name
- Move files to `/docs` folder without updating GitHub Pages settings
- Add CNAME without DNS verification
- Break form IDs: `waitlist-form`, `wl-email`, `wl-name`, `wl-success`, `wl-submit-error`
- Remove or alter script.js Firebase initialization
- Remove Founder Infra Kit modules (logger.js, theme.js)
- Modify DEPLOYMENT_LOCK.md without explicit approval

### ✅ DO

- Test locally before pushing
- Use safety branch for all changes
- Verify form works after edits
- Check mobile responsiveness
- Test dark mode toggle
- Verify live URL after deployment
- Keep git history clean with clear commit messages
- Document changes in SOURCE_OF_TRUTH.md if structural
- Create backup before major changes

---

## 12. Success Criteria

Update is successful when:

- ✅ Safety branch created and clean
- ✅ Edits made to safe files only
- ✅ Local testing passes all checks
- ✅ Form submission works end-to-end
- ✅ GitHub Pages rebuilds without errors
- ✅ Live URL returns HTTP/2 200
- ✅ Public site at https://dark-matter3.github.io/flash/ is updated
- ✅ All browsers (desktop + mobile + incognito) show new content
- ✅ Dark mode toggle works
- ✅ Demo widget interactive
- ✅ Console has no errors
- ✅ Network tab has no 404s
- ✅ Form can submit successfully
- ✅ No change to public URL path

---

## Next Step

1. Create safety branch:
   ```bash
   cd /home/dark_matter3/linux-data/flash-pages
   git checkout -b landing-safe-update
   ```

2. Proceed with updates to safe files only

3. Follow local testing procedure (section 7)

4. Commit and push with clear message

5. Verify live deployment (section 8)

---

**Created:** 2026-07-09  
**Plan Status:** ✅ READY FOR IMPLEMENTATION  
**Safety Level:** 🔒 HIGH (multiple safeguards in place)  
**Approval:** Ready (self-review complete, no changes yet)
