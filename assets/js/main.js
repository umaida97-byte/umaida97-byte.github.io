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

  /* Lead forms: submitted to Web3Forms (https://web3forms.com), which emails
     each enquiry to the inbox linked to the access key. The key lives in
     _data/company.yml (web3forms_key). */
  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var status = form.querySelector(".form-status");
      var submitBtn = form.querySelector('button[type="submit"]');
      var showStatus = function (message, isError) {
        if (!status) return;
        status.textContent = message;
        status.hidden = false;
        status.classList.toggle("is-error", !!isError);
      };
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var trap = form.querySelector('input[name="botcheck"]');
      if (trap && trap.checked) { return; }
      var key = form.getAttribute("data-web3forms-key");
      var formData = new FormData(form);
      formData.append("access_key", key);
      formData.append("page", window.location.href);
      if (submitBtn) { submitBtn.disabled = true; }
      showStatus("Sending your enquiry...");
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            showStatus("Thank you. Your enquiry has been sent. We'll be in touch shortly.");
            form.reset();
          } else {
            showStatus("Your enquiry could not be sent. Please call 07463 006088 or email info@five-towns.co.uk.", true);
          }
        })
        .catch(function () {
          showStatus("Your enquiry could not be sent. Please call 07463 006088 or email info@five-towns.co.uk.", true);
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

  /* Rental yield calculator: gross yield always shown, net yield once
     annual running costs are entered. Pure client-side arithmetic, so
     there's nothing here that goes stale over time. */
  document.querySelectorAll("[data-yield-calculator]").forEach(function (calc) {
    var priceInput = calc.querySelector("[data-yc-price]");
    var rentInput = calc.querySelector("[data-yc-rent]");
    var costsInput = calc.querySelector("[data-yc-costs]");
    var mgmtFeeInput = calc.querySelector("[data-yc-mgmt-fee]");
    var mgmtFeeValue = calc.querySelector("[data-yc-mgmt-fee-value]");
    var grossOut = calc.querySelector("[data-yc-gross]");
    var netOut = calc.querySelector("[data-yc-net]");
    if (!priceInput || !rentInput || !costsInput || !grossOut || !netOut) return;

    function formatPercent(n) {
      if (!isFinite(n) || isNaN(n) || n < 0) return "0.0%";
      return n.toFixed(1) + "%";
    }

    function recalc() {
      var price = parseFloat(priceInput.value) || 0;
      var monthlyRent = parseFloat(rentInput.value) || 0;
      var annualCosts = parseFloat(costsInput.value) || 0;
      var mgmtFeePercent = mgmtFeeInput ? (parseFloat(mgmtFeeInput.value) || 0) : 0;
      var annualRent = monthlyRent * 12;
      var mgmtFeeAmount = annualRent * (mgmtFeePercent / 100);
      var gross = price > 0 ? (annualRent / price) * 100 : 0;
      var net = price > 0 ? ((annualRent - annualCosts - mgmtFeeAmount) / price) * 100 : 0;
      grossOut.textContent = formatPercent(gross);
      netOut.textContent = formatPercent(net);
      if (mgmtFeeValue) mgmtFeeValue.textContent = mgmtFeePercent.toFixed(1) + "%";
    }

    [priceInput, rentInput, costsInput].forEach(function (input) {
      input.addEventListener("input", recalc);
    });
    if (mgmtFeeInput) mgmtFeeInput.addEventListener("input", recalc);
    recalc();
  });

})();
