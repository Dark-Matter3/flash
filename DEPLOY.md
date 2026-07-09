# Flash Landing Page - Deploy Checklist

## Location & Purpose

**Canonical Source:** `/home/dark_matter3/linux-data/_deployment/flash-pages/`  
**GitHub Repo:** Dark-Matter3/flash (main branch)  
**Public URL:** https://dark-matter3.github.io/flash/  
**Deployment:** Automatic on every push to main (GitHub Pages)

This folder IS the source of truth. No separate deployment step needed.

## File Structure

```
/home/dark_matter3/linux-data/_deployment/flash-pages/
├── index.html           ✅ Main landing page
├── script.js            ✅ Page interactions + Logger
├── styles.css           ✅ Design tokens + dark mode
├── demo.js              ✅ Demo widget logic
├── demo.css             ✅ Demo widget styles
├── js/
│   ├── logger.js        ✅ Vanilla JS Logger (no deps)
│   └── theme.js         ✅ Theme Manager
├── assets/
│   └── mascot.svg       ✅ Flash mascot logo
├── DEPLOYMENT_LOCK.md   📋 URL preservation rules
└── SOURCE_OF_TRUTH.md   📋 This is the source
```

**Total Files: ~15**  
**Total Size: ~150KB**

### Step 1: Navigate to the repository

```bash
cd /home/dark_matter3/linux-data/_deployment/flash-pages
```

### Step 2: Test locally before deploying

```bash
# Start a local server (pick one)
python3 -m http.server 8000
# OR
npx serve .

# Open in browser
open http://localhost:8000
```

### Step 3: Verify deployment is ready

Make sure the form works, dark mode toggles, and there are no console errors.

---

## Deploy to GitHub Pages

### Step 4: Commit your changes

```bash
git add .
git commit -m "improve: Landing page updates [describe what changed]"
```

### Step 5: Push to GitHub

```bash
git push origin main
```

### Step 6: Verify live deployment

1. **Wait 1-2 minutes** for GitHub Pages to rebuild
2. **Open in incognito mode** to bypass browser cache:
   ```bash
   open https://dark-matter3.github.io/flash/
   ```
3. **Hard refresh** (Ctrl+Shift+R / Cmd+Shift+R)
4. **Check browser console** (F12) for Logger output
5. **Test dark mode toggle** works across all themes

### Rollback (if needed)

If you pushed a broken change:

```bash
# Revert the last commit
git revert HEAD
git push origin main

# Wait 1-2 minutes for rebuild
```

---

## Path Rules

All paths in `landing-dist` are **relative** (no leading slashes):

| ✅ Correct          | ❌ Wrong             |
| ------------------- | -------------------- |
| `assets/mascot.svg` | `/assets/mascot.svg` |
| `styles.css`        | `./styles.css`       |
| `demo.js`           | `/demo.js`           |

This ensures compatibility with GitHub Pages project pages (e.g., `/flash/` subfolder).

---

## Quick Update Workflow

1. **Edit** files in `flashapp/landing-dist/`
2. **Test** locally with `python3 -m http.server 8080`
3. **Update** build stamp in footer of `index.html`
4. **Copy** all files to Pages repo
5. **Commit** with descriptive message
6. **Verify** live site in incognito

---

## Files NOT to Deploy

These files are for development only and should NOT be copied to Pages repo:

- `landing-page/` (old folder, keep for reference)
- `LANDING_PAGE_ANALYSIS.md`
- `REMAINING_TASKS.md`
- `playable-ad/` (separate standalone ad)
- `Flash – Vocabulary Reinvented.html` (old version)

---

## Troubleshooting

### Images not loading

- Check paths are relative (no leading `/`)
- Verify file exists in `assets/` folder

### Demo not working

- Check browser console for JS errors
- Verify `demo.js` is loaded after DOM

### Old content showing

- Hard refresh (Ctrl+Shift+R)
- Check build stamp matches expected date
- Clear browser cache
- Try incognito mode
