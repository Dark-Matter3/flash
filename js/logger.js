/**
 * Logger - Minimal version for static HTML/JS
 * Works in browser without build tools
 */

const Tags = {
  SYSTEM: 'System',
  UI: 'UI',
  NAVIGATION: 'Navigation',
  DATA: 'Data',
  ERROR: 'Error',
  ANALYTICS: 'Analytics',
};

class Logger {
  constructor() {
    this.LEVELS = {
      TRACE: 0,
      DEBUG: 1,
      INFO: 2,
      WARN: 3,
      ERROR: 4,
      FATAL: 5,
    };
    
    // Auto-detect log level: DEBUG in dev, WARN in prod
    this.globalLogLevel = window.location.hostname === 'localhost' ? 
      this.LEVELS.DEBUG : this.LEVELS.WARN;
  }

  trace(tag, message, data = {}) {
    this._log('TRACE', tag, message, data);
  }

  debug(tag, message, data = {}) {
    this._log('DEBUG', tag, message, data);
  }

  info(tag, message, data = {}) {
    this._log('INFO', tag, message, data);
  }

  warn(tag, message, data = {}) {
    this._log('WARN', tag, message, data);
  }

  error(tag, message, error = null, data = {}) {
    if (error instanceof Error) {
      data.errorMessage = error.message;
      data.stack = error.stack;
    }
    this._log('ERROR', tag, message, data);
  }

  fatal(tag, message, error = null, data = {}) {
    if (error instanceof Error) {
      data.errorMessage = error.message;
      data.stack = error.stack;
    }
    this._log('FATAL', tag, message, data);
  }

  _log(level, tag, message, data) {
    const levelNum = this.LEVELS[level];
    if (levelNum < this.globalLogLevel) return;

    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const formatted = `[${level.padEnd(7)}] [${tag}] ${message}`;
    const args = [formatted];

    if (data && Object.keys(data).length > 0) {
      args.push(data);
    }

    if (level === 'ERROR' || level === 'FATAL') {
      console.error(...args);
    } else if (level === 'WARN') {
      console.warn(...args);
    } else {
      console.log(...args);
    }
  }
}

// Create singleton
const logger = new Logger();

// Export for module systems and globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = logger;
  module.exports.Tags = Tags;
}

// Global for inline scripts
window.Logger = logger;
window.LoggerTags = Tags;
