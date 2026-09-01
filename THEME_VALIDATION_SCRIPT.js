/**
 * 🎨 Flash Landing Page — Theme Validation Script
 * 
 * Run this in the browser console to verify theme switching actually works.
 * 
 * Paste the entire script below into your browser DevTools console.
 * DO NOT claim the theme is fixed until this script shows both modes
 * have DIFFERENT computed color values.
 */

console.log(
  '%c🎨 Flash Landing Page — Theme Validator',
  'color: #BB86FC; font-size: 16px; font-weight: bold;'
);
console.log(
  '%cThis validates that computed styles actually change when toggling theme.',
  'color: #B3B3B3; font-style: italic;'
);

function captureThemeState(label) {
  // Get key DOM elements
  const root = document.documentElement;
  const body = document.body;
  const navbar = document.querySelector('.navbar');
  const hero = document.querySelector('.hero');
  const whyFlash = document.querySelector('.why-flash');
  const footer = document.querySelector('footer');

  // Get computed styles
  const state = {
    label,
    timestamp: new Date().toLocaleTimeString(),
    dataTheme: root.getAttribute('data-theme') || 'none',
    darkModeClass: root.classList.contains('dark-mode') ? 'yes' : 'no',
    
    // CSS Variables
    cssVars: {
      background: getComputedStyle(root).getPropertyValue('--background').trim(),
      surface: getComputedStyle(root).getPropertyValue('--surface').trim(),
      textPrimary: getComputedStyle(root).getPropertyValue('--text-primary').trim(),
      textSecondary: getComputedStyle(root).getPropertyValue('--text-secondary').trim(),
    },

    // Computed colors (actual rendered colors)
    computed: {
      bodyBg: getComputedStyle(body).backgroundColor,
      bodyColor: getComputedStyle(body).color,
      navbarBg: navbar ? getComputedStyle(navbar).backgroundColor : 'N/A',
      heroBg: hero ? getComputedStyle(hero).backgroundColor : 'N/A',
      whyFlashBg: whyFlash ? getComputedStyle(whyFlash).backgroundColor : 'N/A',
      footerBg: footer ? getComputedStyle(footer).backgroundColor : 'N/A',
      footerColor: footer ? getComputedStyle(footer).color : 'N/A',
    },
  };

  return state;
}

console.log(
  '\n%c═════════════════════════════════════════════════════════════',
  'color: #6200EE; font-weight: bold;'
);

// Capture INITIAL state (should be dark by default or per system pref)
const initialState = captureThemeState('INITIAL STATE');
console.log(
  '%cINITIAL STATE (before toggle):',
  'color: #6200EE; font-weight: bold;'
);
console.table(initialState);

console.log(
  '\n%c🔘 NOW: Click the theme toggle button (🌙 Dark / ☀️ Light)',
  'color: #BB86FC; font-weight: bold; font-size: 14px;'
);
console.log(
  '%cWait 500ms, then run the LIGHT check below...',
  'color: #B3B3B3; font-style: italic;'
);

// Window global for quick access
window.__flashThemeCheck = {
  checkLight: function () {
    const lightState = captureThemeState('AFTER TOGGLE TO LIGHT');
    console.log(
      '\n%c═════════════════════════════════════════════════════════════',
      'color: #6200EE; font-weight: bold;'
    );
    console.log(
      '%cAFTER TOGGLE TO LIGHT:',
      'color: #00D4FF; font-weight: bold;'
    );
    console.table(lightState);

    // Comparison
    console.log(
      '\n%c🔍 COMPARISON: Initial vs Light',
      'color: #6200EE; font-weight: bold;'
    );
    console.log('Body Background Colors:');
    console.log(
      `  Initial: ${initialState.computed.bodyBg}`
    );
    console.log(
      `  Light:   ${lightState.computed.bodyBg}`
    );

    if (initialState.computed.bodyBg === lightState.computed.bodyBg) {
      console.log(
        '%c❌ FAIL: Body background did NOT change!',
        'color: #FF6B6B; font-weight: bold;'
      );
    } else {
      console.log(
        '%c✅ PASS: Body background changed!',
        'color: #51CF66; font-weight: bold;'
      );
    }

    console.log('\nFooter Background Colors:');
    console.log(
      `  Initial: ${initialState.computed.footerBg}`
    );
    console.log(
      `  Light:   ${lightState.computed.footerBg}`
    );

    if (initialState.computed.footerBg === lightState.computed.footerBg) {
      console.log(
        '%c❌ FAIL: Footer background did NOT change!',
        'color: #FF6B6B; font-weight: bold;'
      );
    } else {
      console.log(
        '%c✅ PASS: Footer background changed!',
        'color: #51CF66; font-weight: bold;'
      );
    }

    console.log('\n→ Next: Click toggle again to Dark, then run:');
    console.log('%c  window.__flashThemeCheck.checkDark();', 'color: #BB86FC;');
  },

  checkDark: function () {
    const darkState = captureThemeState('AFTER TOGGLE BACK TO DARK');
    console.log(
      '\n%c═════════════════════════════════════════════════════════════',
      'color: #6200EE; font-weight: bold;'
    );
    console.log(
      '%cAFTER TOGGLE BACK TO DARK:',
      'color: #6200EE; font-weight: bold;'
    );
    console.table(darkState);

    // Comparison to initial
    console.log(
      '\n%c🔍 COMPARISON: Initial vs Dark (after toggle back)',
      'color: #6200EE; font-weight: bold;'
    );
    console.log('Body Background Colors:');
    console.log(
      `  Initial:     ${initialState.computed.bodyBg}`
    );
    console.log(
      `  After Dark:  ${darkState.computed.bodyBg}`
    );

    if (initialState.computed.bodyBg === darkState.computed.bodyBg) {
      console.log(
        '%c✅ PASS: Dark theme restored to initial!',
        'color: #51CF66; font-weight: bold;'
      );
    } else {
      console.log(
        '%c❌ FAIL: Dark theme did not restore correctly!',
        'color: #FF6B6B; font-weight: bold;'
      );
    }

    console.log('\n→ Next: Reload the page and run:');
    console.log('%c  window.__flashThemeCheck.checkPersistence();', 'color: #BB86FC;');
  },

  checkPersistence: function () {
    const afterReloadState = captureThemeState('AFTER PAGE RELOAD');
    console.log(
      '\n%c═════════════════════════════════════════════════════════════',
      'color: #6200EE; font-weight: bold;'
    );
    console.log(
      '%cAFTER PAGE RELOAD — Checking Persistence:',
      'color: #00D4FF; font-weight: bold;'
    );
    console.table(afterReloadState);

    console.log('\nCheck localStorage:');
    const saved = localStorage.getItem('flash-pages-theme-mode');
    console.log(`  Saved theme: "${saved}"`);

    console.log('\n%c🎉 SUMMARY', 'color: #51CF66; font-weight: bold; font-size: 14px;');
    console.log('✅ Theme toggle is FULLY WORKING if:');
    console.log('  1. Body/Footer backgrounds changed when toggling');
    console.log('  2. Dark mode restored when toggled back');
    console.log('  3. Preference persisted after reload');
  },
};

console.log(
  '\n%cTo continue validation, run:%c\n  window.__flashThemeCheck.checkLight();',
  'color: #6200EE;',
  'color: #BB86FC; font-family: monospace; font-weight: bold;'
);
console.log(
  '%c═════════════════════════════════════════════════════════════\n',
  'color: #6200EE; font-weight: bold;'
);
