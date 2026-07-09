# Flash Landing Deployment Lock

🔒 **CRITICAL: This repository controls the public Flash landing page URL**

Do not rename, delete, or merge this repo until the public URL is verified to remain unchanged.

---

## Current GitHub Pages Configuration

| Setting | Value |
|---------|-------|
| **Repository** | `Dark-Matter3/flash` |
| **Published URL** | `https://dark-matter3.github.io/flash/` |
| **GitHub Pages Source** | Deploy from branch (main) |
| **Branch** | `main` |
| **Folder** | `/` (repository root) |
| **Custom domain** | No |

---

## Architecture

```
Landing Page Source Code:
  Local: /home/dark_matter3/linux-data/flash-pages
  Remote: https://github.com/Dark-Matter3/flash.git (branch: main)
  Deploys to: https://dark-matter3.github.io/flash/

Main Product Source:
  Local: /home/dark_matter3/linux-data/flash-app
  Remote: https://github.com/Dark-Matter3/flash-app.git
  (Separate from landing page repo)

Relationship:
  ❌ flash-app does NOT control flash-pages deployment
  ✅ flash-pages (flash repo) is the landing page deployment surface
  ✅ Can copy landing from flash-app/landing-dist → flash-pages when updating
```

---

## Rules

1. ✅ **Keep this repo named `flash`** — GitHub Pages URL depends on repository name
2. ✅ **Keep main branch as source** — Current GitHub Pages setting
3. ✅ **Keep root `/` as deployment folder** — Current GitHub Pages setting
4. ✅ **Do not delete this repository** — Deleting loses the URL
5. ✅ **Mirror updates from flash-app** — Copy landing-dist files here when updating

---

## Safe Update Workflow

When updating the landing page:

```bash
# 1. Update source in flash-app (if applicable)
cd /home/dark_matter3/linux-data/flash-app
# Make changes to landing-dist/

# 2. Copy to flash-pages for deployment
cp -r /home/dark_matter3/linux-data/flash-app/landing-dist/* \
  /home/dark_matter3/linux-data/flash-pages/

# 3. Test locally
cd /home/dark_matter3/linux-data/flash-pages
python3 -m http.server 8000
# Visit http://localhost:8000

# 4. Commit and push
git add .
git commit -m "Update landing page (synced from flash-app)"
git push origin main

# 5. Verify live (1-2 min for GitHub Pages to rebuild)
curl -I https://dark-matter3.github.io/flash/
# Expect: HTTP/2 200

# 6. Test in browser
# Visit: https://dark-matter3.github.io/flash/
# Test: desktop, mobile, incognito, DevTools Network tab
```

---

## Verification Checklist

After any deployment:

```
curl -I https://dark-matter3.github.io/flash/
✅ HTTP/2 200
✅ page loads
✅ CSS loads
✅ images load
✅ forms work
✅ early access link works
✅ no 404s in DevTools Network tab
```

---

## Troubleshooting

**Q: URL changed after update?**
- A: GitHub Pages rebuilds in 1-2 min. Wait and retry.

**Q: Page shows old content?**
- A: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Browser cache may need clearing

**Q: Accidentally merged or renamed?**
- A: Restore from git history ASAP
- Contact GitHub support if repo was deleted

---

## What NOT to Do

❌ Rename repository (breaks URL)
❌ Delete repository (breaks URL)
❌ Merge into flash-app (loses deployment surface)
❌ Change main branch name (breaks Pages source)
❌ Move files to `/docs` folder without updating Pages settings
❌ Add custom domain without DNS verification (breaks URL)

---

## Contact

For questions about this deployment lock:
- Check [DEPLOY.md](DEPLOY.md) for detailed deployment steps
- Check [SOURCE_OF_TRUTH.md](SOURCE_OF_TRUTH.md) for file organization

Last updated: 2026-07-09
