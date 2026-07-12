(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  function setYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var header = document.querySelector(".site-header");
    if (!toggle || !header) return;
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    document.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(btn);
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", function () {
      btn.classList.toggle("is-visible", window.scrollY > 500);
    });
  }

  /* ---------- GDPR cookie consent ---------- */
  var CONSENT_KEY = "ag_cookie_consent"; // { necessary:true, analytics:bool, ts:number }

  function getConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function saveConsent(consent) {
    consent.necessary = true;
    consent.ts = Date.now();
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); } catch (e) {}
    applyConsent(consent);
  }
  function applyConsent(consent) {
    // Hook point: only load analytics scripts if consent.analytics === true.
    document.dispatchEvent(new CustomEvent("consent:updated", { detail: consent }));
    window.__alphaGlobeConsent = consent;
  }

  function buildCookieBanner() {
    var wrap = document.createElement("div");
    wrap.className = "cookie-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-live", "polite");
    wrap.setAttribute("aria-label", "Cookie preferences");
    wrap.innerHTML =
      '<h4>We value your privacy</h4>' +
      '<p>We use essential cookies to make this site work. With your consent, we\u2019d also like to set analytics cookies to help us understand how the site is used, so we can keep improving it. Read our <a href="' + (window.__AG_ROOT || "./") + 'privacy.html">Privacy Policy</a> for details.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-primary btn-sm" data-cookie-accept>Accept all</button>' +
      '<button type="button" class="btn btn-outline btn-sm" data-cookie-reject>Reject non-essential</button>' +
      '<button type="button" class="btn btn-outline btn-sm" data-cookie-manage>Manage preferences</button>' +
      '</div>' +
      '<div class="cookie-prefs" data-cookie-prefs>' +
      '<div class="cookie-pref-row"><div><strong>Strictly necessary</strong><span>Required for the site to function. Always on.</span></div>' +
      '<label class="switch"><input type="checkbox" checked disabled><span class="slider"></span></label></div>' +
      '<div class="cookie-pref-row"><div><strong>Analytics</strong><span>Helps us understand how visitors use the site.</span></div>' +
      '<label class="switch"><input type="checkbox" data-cookie-analytics><span class="slider"></span></label></div>' +
      '<div style="margin-top:16px;"><button type="button" class="btn btn-teal btn-sm" data-cookie-save>Save preferences</button></div>' +
      '</div>';
    document.body.appendChild(wrap);

    var manageBtn = wrap.querySelector("[data-cookie-manage]");
    var prefsPanel = wrap.querySelector("[data-cookie-prefs]");
    manageBtn.addEventListener("click", function () {
      prefsPanel.classList.toggle("is-visible");
    });
    wrap.querySelector("[data-cookie-accept]").addEventListener("click", function () {
      saveConsent({ analytics: true });
      wrap.classList.remove("is-visible");
    });
    wrap.querySelector("[data-cookie-reject]").addEventListener("click", function () {
      saveConsent({ analytics: false });
      wrap.classList.remove("is-visible");
    });
    wrap.querySelector("[data-cookie-save]").addEventListener("click", function () {
      var analytics = wrap.querySelector("[data-cookie-analytics]").checked;
      saveConsent({ analytics: analytics });
      wrap.classList.remove("is-visible");
    });

    var existing = getConsent();
    if (!existing) {
      wrap.classList.add("is-visible");
    } else {
      applyConsent(existing);
      wrap.querySelector("[data-cookie-analytics]").checked = !!existing.analytics;
    }

    // Expose a global so the footer "Cookie settings" link can reopen this banner.
    window.__openCookiePrefs = function () {
      wrap.classList.add("is-visible");
      prefsPanel.classList.add("is-visible");
      wrap.scrollIntoView({ behavior: "smooth", block: "center" });
    };
  }

  function initCookieSettingsLinks() {
    document.body.addEventListener("click", function (e) {
      var target = e.target.closest("[data-open-cookie-prefs]");
      if (target) {
        e.preventDefault();
        if (window.__openCookiePrefs) window.__openCookiePrefs();
      }
    });
  }

  /* ---------- Contact / referral form (client-side handling stub) ---------- */
  function initForms() {
    document.querySelectorAll("form[data-ajax-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = form.querySelector(".form-status");
        var consentBox = form.querySelector('input[name="gdpr_consent"]');
        if (consentBox && !consentBox.checked) {
          if (status) {
            status.className = "form-status err";
            status.textContent = "Please confirm you agree to our Privacy Policy before submitting.";
          }
          return;
        }
        // In production, replace this block with a fetch() call to your
        // form-handling endpoint (e.g. a serverless function or CRM webhook).
        if (status) {
          status.className = "form-status ok";
          status.textContent = "Thank you \u2014 your message has been received. A member of our team will be in touch within one working day.";
        }
        form.reset();
      });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    setYear();
    initReveal();
    initBackToTop();
    buildCookieBanner();
    initCookieSettingsLinks();
    initForms();
  });
  document.addEventListener("partials:loaded", function () {
    initNavToggle();
  });
})();
