# Security Policy — Flash Landing Page (Public Repo)

**Status:** Active  
**Last Updated:** 2026-09-10  
**Owner:** Eray Korkmaz  
**Repo type:** PUBLIC — https://dark-matter3.github.io/flash/

---

## What This Repo Contains

This repository contains **only** the static landing page for the Flash app:

- HTML, CSS, and vanilla JavaScript for the public landing page
- Privacy policy and terms of service pages
- Public-facing assets (logos, mascot)
- No backend, no API, no server-side logic

---

## Firebase Web API Key (Intentional — Not a Leak)

`script.js` contains a Firebase Web API key (`AIzaSy...`):

```javascript
const firebaseConfig = {
  apiKey: 'AIzaSy...',  // ← This is intentional and correct
  authDomain: 'flash-963ad.firebaseapp.com',
  ...
};
```

**This is NOT a security incident.** Firebase Web API keys are designed to be public:

- They are client-side identifiers, not server-side credentials
- Security is enforced by **Firebase Security Rules** and **API key restrictions** in the Firebase Console
- Google's Firebase documentation explicitly states these keys should be included in client-side code
- This key has been reviewed and restricted to approved domains in the Firebase Console

**This finding is documented in `.secrets.baseline` with `is_secret: false`.**

If you receive a GitHub secret scanning alert for this key, resolve it as "used in client-side code" — it is intentional.

---

## What MUST Never Be Committed to This Repo

| Material | Why | What to do instead |
|----------|-----|-------------------|
| Firebase **service account** JSON | Server-side credential — gives admin access to production Firestore | Store in password manager / encrypted storage |
| Google Play signing keystore | App signing key — loss = cannot update app | Store in encrypted offline volume |
| OpenAI / Anthropic API keys | Billable credentials | Password manager |
| Any `.env` file content | Environment secrets | Use `.env.local` (in `.gitignore`) |
| Passwords of any kind | Obvious | Password manager |
| Recovery codes | 2FA recovery | Password manager + offline backup |

---

## Pre-Commit Secret Scanning

A pre-commit hook is installed at `.git/hooks/pre-commit` using `detect-secrets` (v1.5.0).

**Baseline:** `.secrets.baseline` — generated 2026-09-10. The Firebase Web API key is marked `is_secret: false` (known intentional).

**The hook will block commits containing:**
- New secrets not in the baseline
- Firebase service account `private_key` fields
- OpenAI API key patterns (`sk-...`)
- Content that looks like `.env` variables leaked into source

**If you need to add a new known false positive:**
```bash
detect-secrets scan > .secrets.baseline
# Then review and mark false positives:
detect-secrets audit .secrets.baseline
git add .secrets.baseline
git commit -m "security: update secrets baseline"
```

---

## Branch Protection

Branch protection is enabled on `main` via GitHub settings:
- Force pushes blocked
- Branch deletion blocked

**Never run `git push --force` on main.** Use `git revert` if a change needs to be undone.

---

## Reporting a Security Issue

If you believe there is a genuine security issue with this repository or the Flash landing page:

1. **Do not open a public GitHub issue** if it involves a secret or vulnerability
2. Contact the repository owner directly: Eray Korkmaz (Cortex Digital)
3. For Firebase-related security concerns, also report via Google's security disclosure process

---

## Deployment Posture

This repo deploys automatically to GitHub Pages on every push to `main`.

**Public URL:** https://dark-matter3.github.io/flash/

**Do not change:**
- Repository visibility (must remain public for GitHub Pages)
- Branch-based deployment behavior
- Domain/URL structure (linked from app stores)
- Firebase Security Rules without reviewing landing page behavior

---

**Owner:** Eray Korkmaz  
**Contact:** See GitHub profile  
**Ecosystem:** Cortex Digital
