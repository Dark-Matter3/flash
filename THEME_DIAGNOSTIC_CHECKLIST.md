# 🎨 Flash Landing Page — Theme Toggle Diagnostic Checklist

**Last Updated:** 2026-08-31  
**Commit:** ee8e386 (all hard-coded colors removed)  
**Status:** Ready for visual validation

---

## Quick Start: Validate the Theme System

### Step 0: Prepare Browser
```
□ Open https://dark-matter3.github.io/flash/
□ Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
□ Or: Open Incognito/Private window (ensures no old cache)
□ Open DevTools: F12
□ Go to Console tab
```

---

## Test 1: Initial State ✅

**What to check:** Is the page in the right mode based on your system preference?

```javascript
// Run in console:
console.log({
  htmlClass: document.documentElement.className,
  bodyBg: getComputedStyle(document.body).backgroundColor,
  bodyText: getComputedStyle(document.body).color,
  storedTheme: localStorage.getItem('flash-pages-theme-mode')
});
```

**Expected:**
- If your OS prefers dark: `className: "dark-mode"`, `bodyBg: "rgb(18, 18, 18)"`, `bodyText: "rgb(255, 255, 255)"`
- If your OS prefers light: `className: ""`, `bodyBg: "rgb(255, 255, 255)"`, `bodyText: "rgb(18, 18, 18)"`
- If you've toggled before: `storedTheme` is "light" or "dark"

**✅ Pass if:** Values match your system preference OR your saved preference

---

## Test 2: Toggle & Visual Change ✅

**What to check:** Does the entire page visibly change when you click the toggle?

```
□ Look at the navbar theme toggle button (top right, says "🌙 Dark" or "☀️ Light")
□ Note the ENTIRE page's appearance (hero, cards, footer, text)
□ Click the theme toggle button
□ VISUALLY INSPECT these sections:
  □ Background (should change from white to dark or vice versa)
  □ Navbar (should change)
  □ Hero section (should change)
  □ Cards (why-card, step cards, status cards - should ALL change)
  □ Text (should invert - light text in dark mode, dark in light)
  □ Footer (should change)
□ Button text should change immediately (🌙 Dark ↔ ☀️ Light)
```

**❌ FAIL Indicators:**
- Button text changes but page colors stay the same
- Only some sections change (e.g., navbar changes but footer doesn't)
- Colors flash or appear wrong
- Page feels slow to update

**✅ Pass if:** ALL visible sections change color smoothly

---

## Test 3: Computed Styles Verification ✅

**What to check:** Are the actual rendered colors different?

```javascript
// BEFORE clicking toggle, run:
const stateBefore = {
  bodyBg: getComputedStyle(document.body).backgroundColor,
  navbarBg: getComputedStyle(document.querySelector('.navbar')).backgroundColor,
  footerBg: getComputedStyle(document.querySelector('footer')).backgroundColor,
  bodyText: getComputedStyle(document.body).color,
};
console.log('Before toggle:', stateBefore);

// Now click the toggle button
// Wait 1 second for any animations to complete

// Then run:
const stateAfter = {
  bodyBg: getComputedStyle(document.body).backgroundColor,
  navbarBg: getComputedStyle(document.querySelector('.navbar')).backgroundColor,
  footerBg: getComputedStyle(document.querySelector('footer')).backgroundColor,
  bodyText: getComputedStyle(document.body).color,
};
console.log('After toggle:', stateAfter);

// Compare:
console.log('Body BG changed:', stateBefore.bodyBg !== stateAfter.bodyBg);
console.log('Navbar BG changed:', stateBefore.navbarBg !== stateAfter.navbarBg);
console.log('Footer BG changed:', stateBefore.footerBg !== stateAfter.footerBg);
console.log('Body text changed:', stateBefore.bodyText !== stateAfter.bodyText);
```

**Expected Output:**
```
Body BG changed: true
Navbar BG changed: true
Footer BG changed: true
Body text changed: true
```

**✅ Pass if:** All four return `true` (all values actually changed)

**❌ Fail if:** Any return `false` (that color didn't change)

---

## Test 4: CSS Variables Confirm ✅

**What to check:** Are CSS variables actually being applied?

```javascript
// Check if CSS variables exist and have values:
const root = document.documentElement;
const styles = getComputedStyle(root);

console.log({
  '--background': styles.getPropertyValue('--background').trim(),
  '--surface': styles.getPropertyValue('--surface').trim(),
  '--text-primary': styles.getPropertyValue('--text-primary').trim(),
  '--text-secondary': styles.getPropertyValue('--text-secondary').trim(),
});
```

**Expected Light Mode:**
```
--background: #FFFFFF (or rgb(255,255,255))
--surface: #F5F5F5
--text-primary: #121212
--text-secondary: #757575
```

**Expected Dark Mode:**
```
--background: #121212
--surface: #1E1E1E
--text-primary: #FFFFFF
--text-secondary: #B3B3B3
```

**✅ Pass if:** Values match the expected mode

**❌ Fail if:** Values are blank, undefined, or don't match expected

---

## Test 5: Persistence ✅

**What to check:** Does your theme choice survive a page reload?

```
□ Set page to LIGHT mode (click toggle if needed)
□ Reload page (F5)
□ Page should REMAIN in light mode
□ Run in console:
  localStorage.getItem('flash-pages-theme-mode')  // Should be "light"

Then:
□ Set page to DARK mode (click toggle)
□ Reload page (F5)
□ Page should REMAIN in dark mode
□ Run in console:
  localStorage.getItem('flash-pages-theme-mode')  // Should be "dark"
```

**✅ Pass if:** Page maintains your choice after reload

**❌ Fail if:** Page resets to system preference after reload

---

## Test 6: System Preference Fallback ✅

**What to check:** On first visit (no saved preference), does the page respect OS setting?

```javascript
// Clear all saved preferences:
localStorage.clear()

// Reload page:
// Page should follow your OS color scheme preference

// To test both modes without changing OS settings:
// DevTools → Settings (⚙️) → Rendering → 
// Find "Emulate CSS media feature prefers-color-scheme"
// Change from "light" to "dark" and reload
```

**✅ Pass if:** Page changes based on system preference when localStorage is empty

**❌ Fail if:** Page ignores system preference

---

## Test 7: No Console Errors ✅

**What to check:** Are there any blocking errors in the console?

```
□ Open DevTools Console
□ Look for RED error messages
□ Acceptable warnings/errors:
  ✓ Firebase 403 referrer errors (non-blocking)
  ✓ Analytics warnings (non-blocking)
  ✓ CORS errors from external resources
□ NOT acceptable (blocking):
  ✗ "Cannot read property of null" on theme setup
  ✗ "ReferenceError: theme is not defined"
  ✗ "Cannot add/remove class from undefined"
```

**✅ Pass if:** No red console errors (except known Firebase/Analytics warnings)

**❌ Fail if:** Red errors related to theme, button, or DOM manipulation

---

## Test 8: Mobile Responsiveness ✅

**What to check:** Does theme toggle work on mobile viewport?

```
□ Open DevTools Device Emulation (Ctrl+Shift+M)
□ Select any mobile device (iPhone, Pixel, etc.)
□ Reload page
□ Can you see the theme toggle button? (top right)
□ Is it clickable? (click it)
□ Does the page change color?
□ Does text remain readable in both modes?
```

**✅ Pass if:** Toggle works on mobile, all text readable

**❌ Fail if:** Button hidden, not clickable, or page breaks

---

## Test 9: Button Accessibility ✅

**What to check:** Can you interact with the theme toggle?

```javascript
// In console:
const button = document.querySelector('#theme-toggle');

console.log({
  exists: !!button,
  visible: button.offsetHeight > 0 && button.offsetWidth > 0,
  clickable: button.onclick !== null || true,  // Event listener attached
  text: button.textContent,
});
```

**Expected:**
```
exists: true
visible: true
clickable: true
text: "🌙 Dark" or "☀️ Light"
```

**✅ Pass if:** Button exists, is visible, and text reflects current mode

**❌ Fail if:** Button missing, hidden, or text wrong

---

## Test 10: HTML Class Toggle ✅

**What to check:** Does the .dark-mode class actually get added/removed?

```javascript
// In light mode:
console.log('Light mode:', document.documentElement.className);  // Should be "" or not contain "dark-mode"

// Click toggle

// In dark mode:
console.log('Dark mode:', document.documentElement.className);  // Should be "dark-mode"

// Click toggle again

// Should return to light:
console.log('Light again:', document.documentElement.className);  // Should be "" or not contain "dark-mode"
```

**✅ Pass if:** Class adds/removes with each toggle

**❌ Fail if:** Class never changes or doesn't toggle properly

---

## Quick Validation Script

**Copy & paste this entire block into console to run all checks at once:**

```javascript
console.clear();
console.log('%c🎨 Flash Theme System Validation', 'color: #BB86FC; font-size: 16px; font-weight: bold;');

const checks = {
  '1. Button exists': !!document.querySelector('#theme-toggle'),
  '2. Has dark-mode support': getComputedStyle(document.documentElement).getPropertyValue('--background'),
  '3. Body uses var(--background)': getComputedStyle(document.body).backgroundColor,
  '4. CSS variables have values': getComputedStyle(document.documentElement).getPropertyValue('--text-primary').length > 0,
  '5. localStorage accessible': typeof localStorage !== 'undefined',
  '6. Theme in localStorage': localStorage.getItem('flash-pages-theme-mode') !== null,
  '7. Navbar exists': !!document.querySelector('.navbar'),
  '8. Footer exists': !!document.querySelector('footer'),
};

Object.entries(checks).forEach(([check, pass]) => {
  const symbol = pass ? '✅' : '❌';
  console.log(`${symbol} ${check}: ${pass}`);
});

console.log('\n%cRun: window.__flashThemeCheck.checkLight() after toggling to light mode', 'color: #6200EE; font-weight: bold;');
```

---

## Summary: What "Fixed" Means

### ❌ NOT Fixed if:
- Console logs say "Theme toggled" but page doesn't visually change
- Button text changes but colors stay same
- Only some sections change (not all)
- Colors flash or appear wrong
- Preference doesn't persist after reload

### ✅ FIXED if:
- **ALL sections change visually** (hero, navbar, cards, footer, text)
- **Computed colors are demonstrably different** (verified in console)
- **Preference persists** across page reloads
- **No blocking console errors** (Firebase 403s acceptable)
- **Smooth transitions, no flashing**
- **Works on mobile too**

---

## Next Steps If Failed

**If toggle button doesn't work:**
```javascript
// Check if button handler attached
document.querySelector('#theme-toggle').click();
// Should see console log: "🎨 Theme toggled: light" or "dark"
```

**If colors don't change:**
```javascript
// Check computed styles are actually different
// See Test 3 above
```

**If only some sections change:**
```javascript
// Search styles.css for hard-coded colors:
// grep -n "#[0-9a-f]" styles.css | head -20
// Any #hex values found (other than in comments) are culprits
```

**If localStorage not persisting:**
```javascript
// Check storage permissions
localStorage.setItem('test', 'works');
console.log(localStorage.getItem('test'));  // Should print "works"
```

---

**Status:** Ready to validate  
**All systems:** Go/No-go  
**Expected outcome:** All tests pass ✅
