(function () {
  "use strict";

  const WHATSAPP_NUMBER = "918600792223";
  const PRIMARY_PHONE = "8600792324";

  document.addEventListener("DOMContentLoaded", function () {
    setActiveNav();
    initBackToTop();
    initFadeUp();
    initLightbox();
    initContactForm();
    initServiceEnquiryButtons();
  });

  function setActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-navbar .nav-link").forEach(function (link) {
      const href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 350) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initFadeUp() {
    const items = document.querySelectorAll(".fade-up");
    if (!items.length || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const closeBtn = document.getElementById("lightboxClose");

    document.querySelectorAll("[data-lightbox]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        const src = el.getAttribute("data-full") || el.querySelector("img")?.getAttribute("src");
        const caption = el.getAttribute("data-caption") || "";
        if (!src) return;
        lightboxImg.src = src;
        lightboxImg.alt = caption || "Gallery image";
        lightboxCaption.textContent = caption;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("active");
      lightboxImg.src = "";
      document.body.style.overflow = "";
    }

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  function openWhatsApp(message) {
    const url =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.querySelector("#fullName");
      const mobile = form.querySelector("#mobileNumber");
      const email = form.querySelector("#emailAddress");
      const service = form.querySelector("#selectService");
      const message = form.querySelector("#message");
      const feedback = document.getElementById("formFeedback");

      clearErrors(form);

      let valid = true;

      if (!name.value.trim() || name.value.trim().length < 2) {
        showError(name, "Please enter your full name.");
        valid = false;
      }

      const mobileVal = mobile.value.trim().replace(/\s+/g, "");
      if (!/^[6-9]\d{9}$/.test(mobileVal)) {
        showError(mobile, "Enter a valid 10-digit Indian mobile number.");
        valid = false;
      }

      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, "Enter a valid email address.");
        valid = false;
      }

      if (!service.value) {
        showError(service, "Please select a service.");
        valid = false;
      }

      if (!message.value.trim() || message.value.trim().length < 5) {
        showError(message, "Please enter your message.");
        valid = false;
      }

      if (!valid) {
        if (feedback) {
          feedback.className = "alert alert-danger mt-3";
          feedback.textContent = "Please correct the highlighted fields.";
          feedback.classList.remove("d-none");
        }
        return;
      }

      const text =
        "Namaskar, I am enquiring from the Teertha Xerox website.%0A%0A" +
        "Name: " +
        name.value.trim() +
        "%0A" +
        "Mobile: " +
        mobileVal +
        "%0A" +
        "Email: " +
        (email.value.trim() || "Not provided") +
        "%0A" +
        "Service: " +
        service.value +
        "%0A" +
        "Message: " +
        message.value.trim();

      const decoded = decodeURIComponent(text.replace(/%0A/g, "\n"));
      openWhatsApp(decoded);

      if (feedback) {
        feedback.className = "alert alert-success mt-3";
        feedback.textContent =
          "Opening WhatsApp with your enquiry. Please send the message to complete your request.";
        feedback.classList.remove("d-none");
      }
    });
  }

  function showError(input, message) {
    input.classList.add("is-invalid");
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (feedback) feedback.textContent = message;
  }

  function clearErrors(form) {
    form.querySelectorAll(".is-invalid").forEach(function (el) {
      el.classList.remove("is-invalid");
    });
  }

  function initServiceEnquiryButtons() {
    document.querySelectorAll("[data-wa-service]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const service = btn.getAttribute("data-wa-service") || "General Enquiry";
        const message =
          "Namaskar, I would like to enquire about *" +
          service +
          "* at Teertha Xerox & Digital Seva Kendra, Ambap. Please guide me.";
        openWhatsApp(message);
      });
    });
  }

  window.TeerthaSite = {
    openWhatsApp: openWhatsApp,
    whatsappNumber: WHATSAPP_NUMBER,
    primaryPhone: PRIMARY_PHONE
  };
})();
