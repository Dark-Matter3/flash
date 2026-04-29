# Flash Landing Page - Deploy Checklist

## Folder Structure

```
landing-dist/
├── index.html      ✅ Main page with demo widget
├── styles.css      ✅ Main page styles (no external fonts)
├── demo.css        ✅ Demo widget styles
├── demo.js         ✅ Demo widget logic (12 questions)
└── assets/
    └── mascot.svg  ✅ Flash mascot logo
```

**Total Files: 5**
**Estimated Size: ~50KB**

---

## Pre-Deploy Validation

Before deploying, verify locally:

```bash
# Navigate to landing-dist folder
cd landing-dist

# Start a local server (pick one)
python3 -m http.server 8080
# OR
npx serve .

# Open in browser
open http://localhost:8080
```

### Checklist:

- [ ] Page loads without errors
- [ ] Mascot logo appears in navbar, hero, and footer
- [ ] Demo widget loads and displays questions
- [ ] Keyboard shortcuts work (1-4, Enter, R)
- [ ] Score/Streak/Progress update correctly
- [ ] Mobile responsive (test at 375px width)
- [ ] Build stamp visible in footer: `Build: 2026-01-06`

---

## Deploy to GitHub Pages

### Step 1: Copy files to Pages repo

```bash
# From flashapp repo root
cp -r landing-dist/* /path/to/your-pages-repo/

# Or if using a specific subfolder in pages repo
cp -r landing-dist/* /path/to/your-pages-repo/flash/
```

### Step 2: Commit and push

```bash
cd /path/to/your-pages-repo

git add .
git commit -m "Deploy landing v2026-01-06 (from flashapp/landing-dist)"
git push origin main
```

### Step 3: Verify deployment

1. Wait 1-2 minutes for GitHub Pages to rebuild
2. Open `https://dark-matter3.github.io/flash/` in incognito
3. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
4. Verify build stamp in footer matches: `Build: 2026-01-06`

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
