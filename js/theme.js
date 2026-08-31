/**
 * Theme Manager - Dark/Light mode toggle for static HTML
 * Persists preference to localStorage
 */

class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'flash-pages-theme-mode';
    this.DARK_CLASS = 'dark-mode';
    this.SYSTEM_PREF_KEY = '(prefers-color-scheme: dark)';
    
    this.init();
  }

  init() {
    const savedMode = localStorage.getItem(this.STORAGE_KEY);
    
    if (savedMode) {
      this.setMode(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(this.SYSTEM_PREF_KEY).matches;
      this.setMode(prefersDark ? 'dark' : 'light');
    }
    
    // Listen for system preference changes
    window.matchMedia(this.SYSTEM_PREF_KEY).addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setMode(e.matches ? 'dark' : 'light');
      }
    });
    
    // Theme manager initialized
    try { console.debug && console.debug('🎨 Theme manager init:', { mode: this.getMode() }); } catch (e) {}
  }

  getMode() {
    return localStorage.getItem(this.STORAGE_KEY) || 
           (window.matchMedia(this.SYSTEM_PREF_KEY).matches ? 'dark' : 'light');
  }

  setMode(mode) {
    const isDark = mode === 'dark';
    
    if (isDark) {
      document.documentElement.classList.add(this.DARK_CLASS);
    } else {
      document.documentElement.classList.remove(this.DARK_CLASS);
    }
    
    localStorage.setItem(this.STORAGE_KEY, mode);
    try { console.debug && console.debug('🎨 Theme changed:', { mode }); } catch (e) {}
    
    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }));
  }

  toggle() {
    const current = this.getMode();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setMode(next);
    return next;
  }

  isDark() {
    return this.getMode() === 'dark';
  }

  // Setup toggle button
  setupToggleButton(selector) {
    const button = document.querySelector(selector);
    if (!button) return;

    button.addEventListener('click', () => {
      const newMode = this.toggle();
      button.textContent = newMode === 'dark' ? '☀️ Light' : '🌙 Dark';
      Logger.info(LoggerTags.NAVIGATION, 'Theme toggled', { newMode });
    });

    // Update button text on init
    button.textContent = this.isDark() ? '☀️ Light' : '🌙 Dark';
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
document.addEventListener('DOMContentLoaded', () => {
  theme.setupToggleButton('#theme-toggle');
});
