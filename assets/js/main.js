/* Five Towns - global JS. No framework, no dependencies. */
(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".nav-mobile");
  var savedScrollY = 0;

  function openMobileNav() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    mobileNav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    // Robust mobile-Safari-safe scroll lock: overflow:hidden alone is
    // unreliable once the page has been scrolled, and can clip a
    // position:fixed overlay to whatever sliver is at the current scroll
    // offset. Pinning the body in place with a negative top offset avoids that.
    document.body.style.position = "fixed";
    document.body.style.top = "-" + savedScrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, savedScrollY);
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      if (mobileNav.classList.contains("is-open")) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMobileNav();
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

  /* Lead forms: submit to Web3Forms (https://web3forms.com) - a free service that
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
        showStatus("This form isn't connected yet - add a Web3Forms access key in contact.html to enable it.");
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
            showStatus("Thank you - a member of the team will be in touch shortly.");
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
  /* Testimonial carousels: find each [data-testimonial-carousel], wire up
     prev/next arrows and dot navigation. Works with any number of slides. */
  document.querySelectorAll("[data-testimonial-carousel]").forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".tc-slide"));
    if (slides.length < 2) return; // nothing to navigate
    var dotsWrap = carousel.querySelector(".tc-dots");
    var current = 0;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "tc-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1) + " of " + slides.length);
      dot.addEventListener("click", function () { show(i); });
      if (dotsWrap) dotsWrap.appendChild(dot);
      return dot;
    });

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === current); });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
    }

    var prevBtn = carousel.querySelector(".tc-prev");
    var nextBtn = carousel.querySelector(".tc-next");
    if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });

    show(0);
  });

})();
