/* Five Towns — Google Analytics, loaded only after cookie consent.
   ------------------------------------------------------------------
   EDIT THIS ONE LINE: replace the placeholder below with your real
   GA4 Measurement ID from analytics.google.com (format: G-XXXXXXXXXX).
   That's the only change needed to make analytics live. */
var GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

(function () {
  "use strict";

  var CONSENT_KEY = "ft-cookie-consent"; // "accepted" | "declined"
  var banner = document.getElementById("cookie-banner");
  var acceptBtn = document.getElementById("cookie-accept");
  var declineBtn = document.getElementById("cookie-decline");
  var manageLinks = document.querySelectorAll("[data-manage-cookies]");

  function loadGoogleAnalytics() {
    if (window.__gaLoaded) return;
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) {
      console.warn("Google Analytics not started: replace the placeholder GA_MEASUREMENT_ID in analytics.js with your real Measurement ID.");
      return;
    }
    window.__gaLoaded = true;
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    document.body.classList.remove("cookie-banner-visible");
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
    document.body.classList.add("cookie-banner-visible");
  }

  var consent = localStorage.getItem(CONSENT_KEY);
  if (consent === "accepted") {
    loadGoogleAnalytics();
  } else if (consent !== "declined") {
    showBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "accepted");
      hideBanner();
      loadGoogleAnalytics();
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "declined");
      hideBanner();
    });
  }

  // "Manage cookie preferences" link in the footer lets someone change
  // their mind later, on either page, without clearing their own browser data.
  manageLinks.forEach(function (link) {
    link.addEventListener("click", function (evt) {
      evt.preventDefault();
      localStorage.removeItem(CONSENT_KEY);
      showBanner();
    });
  });
})();
