// Flash landing page navigation and iOS waitlist modal.

// Firebase Web SDK init — public client config, safe to commit.
//
// SECURITY NOTE — Firebase Browser API key:
// This is the Firebase Browser key (appId: web:907269c6aaba5a729c82b8).
// It is NOT the Android key and NOT a service account secret.
// Firebase Web config is intentionally public — the key alone grants no
// privileged access. Security is enforced at two layers:
//   1. Google Cloud Console → API Keys → Browser key must be restricted
//      to HTTP referrers: your domain(s) only (e.g. dark-matter3.github.io/flash/*)
//   2. Firestore Security Rules allow validated creates in waitlistLeads only.
//      All reads, updates, and deletes are blocked.
// GitHub secret scanning alert: resolve as "used in client-side code" /
// "false positive" after confirming the Browser key has HTTP referrer
// restrictions applied in Google Cloud Console.
(function initFirebase() {
  if (typeof firebase === 'undefined') return;
  if (firebase.apps && firebase.apps.length) return;
  firebase.initializeApp({
    apiKey: 'AIzaSyDuDnt-6VJFrThgdmRNcGuQmWK5Hj9Olog',
    authDomain: 'flash-963ad.firebaseapp.com',
    projectId: 'flash-963ad',
    storageBucket: 'flash-963ad.firebasestorage.app',
    messagingSenderId: '1051704761257',
    appId: '1:1051704761257:web:907269c6aaba5a729c82b8',
    measurementId: 'G-M48DC2MH5L',
  });
  // Init Analytics (only in browser, not during server-side render)
  if (typeof window !== 'undefined' && firebase.analytics) {
    firebase.analytics();
  }
})();

async function initInstallCounter() {
  const counter = document.querySelector('#install-counter');
  if (!counter) return;

  const response = await fetch('./data/play-installs.json', { cache: 'no-cache' });
  if (!response.ok) return;

  const snapshot = await response.json();
  const { count, reportDate } = snapshot;
  if (!Number.isSafeInteger(count) || count < 0) return;
  if (typeof reportDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(reportDate)) return;

  const date = new Date(`${reportDate}T00:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== reportDate) return;

  const numberFormat = new Intl.NumberFormat('en');
  const dateFormat = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  });
  const digits = counter.querySelector('#install-count');
  const accessibleCount = counter.querySelector('#install-count-accessible');
  const reportTime = counter.querySelector('#install-report-date');
  const finalValue = numberFormat.format(count);

  digits.textContent = '0';
  accessibleCount.textContent = `${finalValue} Google Play user installs`;
  reportTime.dateTime = reportDate;
  reportTime.textContent = `As of ${dateFormat.format(date)}`;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    digits.textContent = finalValue;
    counter.hidden = false;
    return;
  }

  counter.hidden = false;
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    const start = performance.now();

    function animate(now) {
      const progress = Math.min((now - start) / 700, 1);
      if (reducedMotion.matches || progress === 1) {
        digits.textContent = finalValue;
        return;
      }

      const eased = 1 - (1 - progress) ** 3;
      digits.textContent = numberFormat.format(Math.floor(count * eased));
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  });

  observer.observe(counter);
}

initInstallCounter().catch((error) => {
  console.warn('Play install counter unavailable:', error);
});

 (function () {
  function init() {
    // Init debug
    try { console.debug && console.debug('🚀 Flash landing page init'); } catch (e) {}

    // ---------------------------------------------------------------
    // Smooth scrolling for navigation links
    // ---------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const scrollTarget = targetId === '#flash-demo'
            ? document.querySelector('#demo-section') || targetElement
            : targetElement;
          const navbarHeight = document.querySelector('.navbar')?.getBoundingClientRect().height || 0;
          const targetTop = scrollTarget.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: Math.max(0, targetTop - navbarHeight - 12),
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          });
        }
      });
    });

    // ---------------------------------------------------------------
    // Navbar shadow on scroll
    // ---------------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', function () {
        navbar.style.boxShadow =
          window.scrollY > 40 ? '0 2px 12px rgba(0, 0, 0, 0.1)' : 'none';
      });
    }

    // ---------------------------------------------------------------
    // iPhone beta access requests
    // ---------------------------------------------------------------
    const modal = document.getElementById('ios-waitlist');
    const form = document.getElementById('ios-waitlist-form');
    const emailInput = document.getElementById('ios-waitlist-email');
    const emailError = document.getElementById('ios-waitlist-email-error');
    const successMsg = document.getElementById('ios-waitlist-success');
    const submitError = document.getElementById('ios-waitlist-submit-error');
    const submitButton = form?.querySelector('button[type="submit"]');
    const closeButton = document.getElementById('ios-waitlist-close');
    let activeTrigger = null;
    let previousBodyOverflow = '';

    function openModal(trigger) {
      if (!modal) return;
      activeTrigger = trigger;
      previousBodyOverflow = document.body.style.overflow;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      if (emailInput) emailInput.focus();
      logEvent('ios_beta_request_modal_opened');
    }

    function closeModal() {
      if (!modal) return;
      modal.hidden = true;
      document.body.style.overflow = previousBodyOverflow;
      if (activeTrigger) activeTrigger.focus();
    }

    document.querySelectorAll('[data-open-ios-waitlist]').forEach((trigger) => {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        openModal(this);
      });
    });

    if (closeButton) closeButton.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });

      modal.addEventListener('keydown', function (event) {
        if (event.key !== 'Tab') return;
        const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]')];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
    });

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(msg) {
      if (!emailError || !emailInput) return;
      emailError.textContent = msg;
      emailInput.classList.add('input-error');
      emailInput.setAttribute('aria-invalid', 'true');
    }

    function clearError() {
      if (!emailError || !emailInput) return;
      emailError.textContent = '';
      emailInput.classList.remove('input-error');
      emailInput.removeAttribute('aria-invalid');
    }

    function setSubmitError(message) {
      if (!submitError) return;
      submitError.textContent = message;
      submitError.hidden = !message;
    }

    function logEvent(eventName, params) {
      try {
        if (typeof firebase !== 'undefined' && firebase.analytics) {
          firebase.analytics().logEvent(eventName, params || {});
        }
      } catch (error) {
        // Analytics failures do not block the waitlist flow.
      }
    }

    if (emailInput) {
      emailInput.addEventListener('input', function () {
        if (emailInput.value.trim()) clearError();
        if (successMsg) successMsg.hidden = true;
        setSubmitError('');
      });
    }

    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        clearError();
        setSubmitError('');
        if (successMsg) successMsg.hidden = true;

        const email = emailInput ? emailInput.value.trim() : '';
        if (!email || !EMAIL_RE.test(email) || email.length > 255) {
          setError('Enter a valid email address.');
          emailInput?.focus();
          return;
        }

        if (typeof firebase === 'undefined' || !firebase.firestore) {
          setSubmitError('iPhone beta requests are temporarily unavailable. Please try again later.');
          return;
        }

        const originalButtonText = submitButton ? submitButton.textContent : 'Request access';
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Submitting…';
        }

        try {
          const db = firebase.firestore();
          await db.collection('waitlistLeads').add({
            email,
            name: null,
            role: null,
            interest: 'closed_beta',
            source: 'landing_page_modal',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
          logEvent('ios_beta_request_submitted', { interest: 'closed_beta' });
          successMsg.textContent = 'Beta access requested.';
          successMsg.hidden = false;
        } catch (error) {
          setSubmitError('We couldn’t add that address right now. Please try again.');
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
          }
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
