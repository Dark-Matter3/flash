/**
 * Theme Manager - Dark/Light mode toggle for static HTML
 * 
 * ✅ FIXED: Separation of concerns
 * - applyMode() = just apply to DOM (no persistence)
 * - setMode() = user explicitly chose (save + apply)
 * - getMode() = return saved OR current system preference (read-only)
 * 
 * Bug fix: No longer accidentally persists system preference on init,
 * so system theme tracking works forever.
 */

class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'flash-pages-theme-mode';
    this.DARK_CLASS = 'dark-mode';
    this.SYSTEM_PREF_KEY = '(prefers-color-scheme: dark)';
    this.mediaQuery = window.matchMedia(this.SYSTEM_PREF_KEY);
    
    this.init();
  }

  init() {
    const savedMode = localStorage.getItem(this.STORAGE_KEY);

    // ✅ Only restore if user explicitly saved. Otherwise apply system preference.
    if (savedMode === 'dark' || savedMode === 'light') {
      this.applyMode(savedMode);
    } else {
      this.applySystemMode();
    }

    // ✅ Listen for system preference changes
    // Only apply if user hasn't made an explicit choice
    this.mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.applyMode(e.matches ? 'dark' : 'light');
      }
    });

    try { console.debug?.('🎨 Theme manager init:', { mode: this.getMode() }); } catch (e) {}
  }

  // ✅ Apply theme to DOM without persisting (internal use)
  applyMode(mode) {
    const isDark = mode === 'dark';

    if (isDark) {
      document.documentElement.classList.add(this.DARK_CLASS);
    } else {
      document.documentElement.classList.remove(this.DARK_CLASS);
    }

    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }));
  }

  // ✅ Apply current system theme preference (internal use)
  applySystemMode() {
    this.applyMode(this.mediaQuery.matches ? 'dark' : 'light');
  }

  // ✅ Get current effective mode (reads saved preference OR system preference)
  // Does NOT persist anything—purely informational
  getMode() {
    const savedMode = localStorage.getItem(this.STORAGE_KEY);

    // If user explicitly chose, return that
    if (savedMode === 'dark' || savedMode === 'light') {
      return savedMode;
    }

    // Otherwise, return current system preference
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  // ✅ User explicitly chose a theme (persists + applies)
  setMode(mode) {
    if (mode !== 'dark' && mode !== 'light') return;

    // Save user choice
    localStorage.setItem(this.STORAGE_KEY, mode);

    // Apply it
    this.applyMode(mode);
  }

  // ✅ Toggle between light and dark (only when user has made a choice)
  toggle() {
    const next = this.getMode() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
    return next;
  }

  isDark() {
    return this.getMode() === 'dark';
  }

  // Setup toggle button with label updates
  setupToggleButton(selector) {
    const button = document.querySelector(selector);
    if (!button) return;

    const updateLabel = () => {
      button.textContent = this.isDark() ? '☀️ Light' : '🌙 Dark';
    };

    button.addEventListener('click', () => {
      const newMode = this.toggle();
      updateLabel();

      try { console.debug?.('🎨 Theme toggled:', newMode); } catch (e) {}
    });

    // ✅ Update label if theme changes externally (e.g., system preference change)
    window.addEventListener('themechange', updateLabel);

    updateLabel();
  }
}

// Create singleton
const theme = new ThemeManager();

// Export for module systems and globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = theme;
}

// Global for inline scripts
window.Theme = theme;

// Auto-setup if button exists
// Handle both cases: if DOMContentLoaded has already fired or will fire in future
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    theme.setupToggleButton('#theme-toggle');
  });
} else {
  // DOMContentLoaded has already fired, setup immediately
  theme.setupToggleButton('#theme-toggle');
}
