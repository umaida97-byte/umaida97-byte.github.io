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

  /* Lead forms: submit to Web3Forms (https://web3forms.com) — a free service that
     emails form submissions straight to you with no backend required.
     Setup: create a free account at web3forms.com, get your Access Key, then
     replace [INSERT WEB3FORMS ACCESS KEY] in the form's data-web3forms-key
     attribute in contact.html with that key. */
  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var status = form.querySelector(".form-status");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var key = form.getAttribute("data-web3forms-key");
      var submitBtn = form.querySelector('button[type="submit"]');
      var showStatus = function (message) {
        if (status) {
          status.textContent = message;
          status.hidden = false;
        }
      };
      if (!key || key.indexOf("INSERT") !== -1) {
        showStatus("This form isn't connected yet — add a Web3Forms access key in contact.html to enable it.");
        return;
      }
      var formData = new FormData(form);
      formData.append("access_key", key);
      if (submitBtn) { submitBtn.disabled = true; }
      showStatus("Sending...");
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            showStatus("Thank you — a member of the team will be in touch shortly.");
            form.reset();
          } else {
            showStatus("Something went wrong sending your enquiry. Please call or email us directly.");
          }
        })
        .catch(function () {
          showStatus("Something went wrong sending your enquiry. Please call or email us directly.");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; }
        });
    });
  });
})();
