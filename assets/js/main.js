/* Five Towns — global JS. No framework, no dependencies. */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".nav-mobile");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Mark current nav link for a11y / styling */
  var here = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".nav-primary a, .nav-mobile a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href) return;
    var normalised = href.replace(/\/index\.html$/, "/");
    if (normalised === here || (normalised !== "/" && here.indexOf(normalised) === 0)) {
      a.setAttribute("aria-current", "page");
    }
  });

  /* Lazy-loaded images: ensure loading=lazy + async decoding where markup forgot it */
  document.querySelectorAll("img:not([loading])").forEach(function (img) {
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
  });

  /* Lead forms: front-end validation feedback + placeholder submit handling.
     Replace the fetch endpoint below with your real form handler (e.g. Formspree,
     Netlify Forms, or a serverless function) when you deploy. */
  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var status = form.querySelector(".form-status");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (status) {
        status.textContent = "Thank you — a member of the team will be in touch shortly.";
        status.hidden = false;
      }
      form.reset();
    });
  });
})();
