// Flash Landing Page – Interactive Elements
// CHANGED: Removed newsletter form handler (section removed).
// CHANGED: Updated scroll observer to target new card classes.
// ADDED: Waitlist modal — open/close, validation, Firebase Firestore submit handler.

// Firebase Web SDK init — public client config, safe to commit.
//
// SECURITY NOTE — Firebase Browser API key:
// This is the Firebase Browser key (appId: web:907269c6aaba5a729c82b8).
// It is NOT the Android key and NOT a service account secret.
// Firebase Web config is intentionally public — the key alone grants no
// privileged access. Security is enforced at two layers:
//   1. Google Cloud Console → API Keys → Browser key must be restricted
//      to HTTP referrers: your domain(s) only (e.g. dark-matter3.github.io/flash/*)
//   2. Firestore Security Rules — waitlistLeads only allows create with
//      validated fields. All reads/updates/deletes are blocked.
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

 (function () {
  function init() {
    // Log page load using Logger
    if (typeof Logger !== 'undefined') {
      Logger.info(LoggerTags.NAVIGATION, 'Flash landing page loaded');
    }

    // ---------------------------------------------------------------
    // Smooth scrolling for navigation links
    // ---------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth',
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
    // Fade-in on scroll for cards
    // ---------------------------------------------------------------
    const animatedItems = document.querySelectorAll(
      '.why-card, .step, .status-item',
    );

    if ('IntersectionObserver' in window && animatedItems.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      animatedItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(16px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(item);
      });
    }

    // ---------------------------------------------------------------
    // WAITLIST MODAL
    // ---------------------------------------------------------------
    const modal = document.getElementById('waitlist-modal');
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('wl-email');
    const emailError = document.getElementById('wl-email-error');
    const successMsg = document.getElementById('wl-success');

    /**
     * Open the waitlist modal.
     * Analytics event: waitlist_modal_opened
     */
    function openModal() {
      if (!modal) return;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      if (emailInput) emailInput.focus();
      logEvent('waitlist_modal_opened');
    }

    /**
     * Close the waitlist modal and reset form state.
     */
    function closeModal() {
      if (!modal) return;
      modal.hidden = true;
      document.body.style.overflow = '';
      resetForm();
    }

    /**
     * Reset the form to its initial state.
     * Called on close and can be called after a successful submit if needed.
     */
    function resetForm() {
      if (form) form.reset();
      clearError();
      hideSubmitError();
      if (successMsg) successMsg.hidden = true;
      var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
      if (submitBtn) {
        submitBtn.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join the waitlist';
      }
    }

    // Open triggers (hero + beta section buttons)
    ['hero-waitlist-btn', 'beta-waitlist-btn'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', openModal);
    });

    // Close via × button
    var closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close when clicking backdrop
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
    });

    // ---------------------------------------------------------------
    // Form validation helpers
    // ---------------------------------------------------------------
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (emailInput) {
      emailInput.addEventListener('input', function () {
        if (emailInput.value.trim()) clearError();
      });
    }

    // ---------------------------------------------------------------
    // Form submit
    // ---------------------------------------------------------------
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearError();

        var email = emailInput ? emailInput.value.trim() : '';
        var name = (document.getElementById('wl-name') || {}).value || '';
        var role = (document.getElementById('wl-role') || {}).value || '';
        var interest = (document.getElementById('wl-interest') || {}).value || '';

        // Validation
        if (!email) {
          setError('Email address is required.');
          if (emailInput) emailInput.focus();
          return;
        }
        if (!EMAIL_RE.test(email)) {
          setError('Please enter a valid email address.');
          if (emailInput) emailInput.focus();
          return;
        }

        var lead = {
          email: email,
          name: name || null,
          role: role || null,
          interest: interest || null,
          source: 'landing_page_modal',
          createdAt: new Date().toISOString(),
        };

        submitLead(lead);
      });
    }

    var submitError = document.getElementById('wl-submit-error');

    function showSubmitError(msg) {
      if (!submitError) return;
      submitError.textContent = msg;
      submitError.hidden = false;
    }

    function hideSubmitError() {
      if (!submitError) return;
      submitError.textContent = '';
      submitError.hidden = true;
    }

    /**
     * Save lead to Firestore collection 'waitlistLeads'.
     * Falls back to local success state if Firebase SDK is not loaded.
     */
    function submitLead(lead) {
      var submitBtn = form ? form.querySelector('button[type="submit"]') : null;
      hideSubmitError();

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting\u2026';
      }

      var hasFirestore = typeof firebase !== 'undefined' && firebase.firestore;

      if (hasFirestore) {
        var db = firebase.firestore();
        db.collection('waitlistLeads')
          .add({
            email: lead.email,
            name: lead.name || null,
            role: lead.role || null,
            interest: lead.interest || null,
            source: 'landing_page_modal',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(function () {
            logEvent('waitlist_lead_submitted', { role: lead.role, interest: lead.interest });
            if (submitBtn) {
              submitBtn.textContent = 'Join the waitlist'; // reset text before hiding
              submitBtn.hidden = true;
            }
            if (successMsg) successMsg.hidden = false;
          })
          .catch(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Join the waitlist';
            }
            showSubmitError(
              'Something went wrong. Please try again or use the Google Forms link below.',
            );
          });
      } else {
        // Firebase not available — show success locally
        logEvent('waitlist_lead_submitted', { role: lead.role, interest: lead.interest });
        if (submitBtn) submitBtn.hidden = true;
        if (successMsg) successMsg.hidden = false;
      }
    }

    /**
     * Log an analytics event via Firebase Analytics.
     * Falls back silently if the SDK is not loaded.
     */
    function logEvent(eventName, params) {
      try {
        if (typeof firebase !== 'undefined' && firebase.analytics) {
          firebase.analytics().logEvent(eventName, params || {});
        }
      } catch (e) {
        // Analytics failures are non-fatal — never block the user flow
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
