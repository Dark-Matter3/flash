# Flash Theme System — Quick Validation Guide

**Last Updated:** 2026-08-31  
**Status:** ✅ LIVE (Commit 38ff0ad)  
**URL:** https://dark-matter3.github.io/flash/

---

## 🎯 Quick Test Checklist

### Test 1: Initial Page Load
- [ ] Hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`)
- [ ] Page loads with correct theme based on OS preference
- [ ] `console.log(localStorage.getItem('flash-pages-theme-mode'))` → `null` (first visit)
- [ ] `console.log(theme.getMode())` → `"dark"` or `"light"` (matches OS)

### Test 2: Toggle Works Visually
- [ ] Click theme toggle button (🌙 Dark or ☀️ Light)
- [ ] Entire page changes color (all sections: why-flash, how-it-works, status, etc.)
- [ ] Button label toggles (🌙 ↔ ☀️)
- [ ] No console errors

### Test 3: Persistence
- [ ] After toggling, refresh page
- [ ] Page stays in toggled theme (does NOT return to OS preference)
- [ ] `console.log(localStorage.getItem('flash-pages-theme-mode'))` → `"dark"` or `"light"`

### Test 4: Reset to OS Preference
- [ ] Open DevTools Console
- [ ] `localStorage.clear()`
- [ ] Refresh page
- [ ] Page returns to OS theme
- [ ] `console.log(localStorage.getItem('flash-pages-theme-mode'))` → `null`

### Test 5: System Preference Respect
- [ ] Keep localStorage clear (user hasn't chosen)
- [ ] Open DevTools → Rendering tab
- [ ] Toggle "Emulate CSS media feature prefers-color-scheme"
- [ ] Change between light and dark
- [ ] Page updates automatically (follows OS)
- [ ] No localStorage entry created
- [ ] `console.log(localStorage.getItem('flash-pages-theme-mode'))` → still `null`

### Test 6: Computed Styles (Proof)
```javascript
// Run in console to verify actual CSS values
const bg = getComputedStyle(document.documentElement).getPropertyValue('--background');
const surface = getComputedStyle(document.documentElement).getPropertyValue('--surface');
const text = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');

console.log('Background:', bg.trim());  // #FFFFFF (light) or #121212 (dark)
console.log('Surface:', surface.trim());    // #F5F5F5 (light) or #1E1E1E (dark)
console.log('Text:', text.trim());          // #121212 (light) or #FFFFFF (dark)
```

### Test 7: All Sections Change Color
Verify these sections visually change:
- [ ] Header + Navigation
- [ ] Hero section
- [ ] "Why Flash?" section
- [ ] "How It Works" section
- [ ] Status section
- [ ] Beta proof section
- [ ] Footer
- [ ] All text colors adjust

### Test 8: Mobile Responsiveness
- [ ] Test on mobile browser (or DevTools device emulation)
- [ ] Theme toggle works on mobile
- [ ] Colors readable in both light and dark
- [ ] No layout broken by theme change

### Test 9: No Console Errors
```javascript
// Check in DevTools Console
// Should see only: "🎨 Theme toggled: dark" (when toggling)
// Should NOT see: errors, undefined symbols, failed API calls
```

---

## 🔧 System Architecture Quick Ref

### File Layout
```
js/theme.js          ← ThemeManager logic (FIXED)
styles.css           ← CSS variables (FIXED - all hard-coded colors removed)
index.html           ← Button HTML structure
```

### CSS Variables (Defined in styles.css)

**Light Mode (default `:root`):**
```css
--background: #FFFFFF
--surface: #F5F5F5
--text-primary: #121212
--text-secondary: #757575
--border: #E0E0E0
```

**Dark Mode (@media prefers-color-scheme: dark):**
```css
--background: #121212
--surface: #1E1E1E
--text-primary: #FFFFFF
--text-secondary: #B3B3B3
--border: #333333
```

**User Override (html.dark-mode):**
```css
html.dark-mode {
  --background: #121212
  --surface: #1E1E1E
  --text-primary: #FFFFFF
  --text-secondary: #B3B3B3
  --border: #333333
}
```

### JavaScript API

```javascript
// Get current effective theme
theme.getMode()              // Returns "dark" or "light"
theme.isDark()               // Returns boolean

// User explicitly chooses
theme.setMode("dark")        // Save + apply
theme.toggle()               // Switch + save

// Check if dark mode active
theme.isDark()               // boolean

// Manual setup (auto-called)
theme.setupToggleButton("#theme-toggle")
```

---

## 🐛 What Was Fixed

### Before (Broken)
1. Init detects system preference "dark"
2. Calls `setMode()` (which persists to localStorage)
3. localStorage now contains "dark"
4. System listener's guard `!localStorage.getItem()` is permanently false
5. System preference changes are ignored forever ❌

### After (Fixed)
1. Init detects system preference "dark"
2. Calls `applySystemMode()` (applies DOM, does NOT persist)
3. localStorage remains empty
4. System listener's guard `!localStorage.getItem()` is still true
5. When user doesn't pick a theme, system preference changes tracked ✅

---

## 🎯 Expected Behavior

### Scenario: Fresh User (No Preference Saved)

**First Visit:**
- Page loads with OS theme
- Toggle button works
- System preference changes reflected immediately
- localStorage is empty

**User Clicks Toggle:**
- Theme persists in localStorage
- User's choice now wins over OS

**User Clears localStorage:**
- Next reload returns to OS theme
- System tracking resumes

### Scenario: Returning User (Has Preference Saved)

**Revisit:**
- Page loads with saved theme
- User's choice respected regardless of OS

**System Preference Changes:**
- No effect (user's choice wins)

**User Clicks Toggle:**
- New choice saved, old setting overwritten

---

## 🔍 Debugging Commands

```javascript
// Inspect theme state
console.log('Mode:', theme.getMode());
console.log('Is Dark:', theme.isDark());
console.log('Saved:', localStorage.getItem('flash-pages-theme-mode'));
console.log('System Dark:', theme.mediaQuery.matches);

// Inspect CSS variables
console.log(getComputedStyle(document.documentElement).getPropertyValue('--background'));

// Inspect HTML class
console.log('Dark mode class:', document.documentElement.classList.contains('dark-mode'));

// Simulate user toggle
theme.toggle();

// Reset to system
localStorage.clear();
location.reload();

// Force dark
theme.setMode('dark');
localStorage.getItem('flash-pages-theme-mode');  // → "dark"
```

---

## ✅ Commits in This Session

| Commit | Message | Impact |
|--------|---------|--------|
| ee8e386 | Remove hard-coded colors, use CSS variables | Fixed: Visual theme toggle now works |
| 24fc3e5 | Fix ThemeManager logic bug | Fixed: System preference tracking restored |
| 38ff0ad | Add bug explanation documentation | Documentation: Root cause + fix recorded |

---

## 📍 Files Modified

- `/js/theme.js` — ThemeManager class (logic bug fixed)
- `/styles.css` — Hard-coded colors replaced (CSS variables used)
- `/THEMMANAGER_BUG_FIX_EXPLANATION.md` — Detailed documentation (new)

---

## 🚀 Next Step

**User should:** 
1. Hard refresh https://dark-matter3.github.io/flash/ (`Ctrl+Shift+R`)
2. Run Test 1-6 above
3. Confirm theme toggles visually work across all sections
4. Confirm system preference changes tracked when no preference saved
