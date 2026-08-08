//Navigation functionality
const openBtn = document.querySelector(".open-button") || document.querySelector("#open");
const closeBtn = document.querySelector(".close-button") || document.querySelector("#close");
const navigationBar = document.querySelector(".nav-links");

function openMenu() {
    if (!navigationBar) return;
    navigationBar.classList.add("open");
    if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => ScrollTrigger.refresh(), 420);
    }
}

function closeMenu() {
    if (!navigationBar) return;
    const wasOpen = navigationBar.classList.contains("open");
    navigationBar.classList.remove("open");
    if (wasOpen && typeof ScrollTrigger !== "undefined") {
        setTimeout(() => ScrollTrigger.refresh(), 420);
    }
}

if (openBtn) {
    openBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openMenu();
    });
}

if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeMenu();
    });
}

// Helper: get stable absolute top position of an element (immune to mid-scroll drift)
function getOffsetTop(el) {
    let top = 0;
    while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
    }
    return top;
}

// Dedicated click handler for nav links
const pageNavLinks = document.querySelectorAll(".nav-links a");

pageNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href) return;

        if (!href.includes("#")) {
            closeMenu();
            return;
        }

        const hashPart = href.substring(href.indexOf("#"));
        if (!hashPart || hashPart === "#") {
            closeMenu();
            return;
        }

        const target = document.querySelector(hashPart);
        if (!target) {
            closeMenu();
            return;
        }

        e.preventDefault();

        const wasMenuOpen = navigationBar && navigationBar.classList.contains("open");

        // If mobile menu is open, close it INSTANTLY (skip transition) to avoid scroll race
        if (wasMenuOpen) {
            navigationBar.style.transition = "none";
            navigationBar.classList.remove("open");
            navigationBar.offsetHeight;
            navigationBar.style.transition = "";
        }

        // Calculate absolute scroll position using offsetTop (stable regardless of current scroll)
        const navEl = document.querySelector(".navigation");
        const navHeight = navEl ? navEl.offsetHeight : 0;
        const scrollTarget = getOffsetTop(target) - navHeight;

        window.scrollTo({ top: scrollTarget, behavior: "smooth" });
        history.replaceState(null, "", hashPart);

        if (wasMenuOpen && typeof ScrollTrigger !== "undefined") {
            setTimeout(() => ScrollTrigger.refresh(), 500);
        }
    });
});

// Close menu on outside click
document.addEventListener("click", (e) => {
    if (navigationBar && navigationBar.classList.contains("open")) {
        if (!navigationBar.contains(e.target) && openBtn && !openBtn.contains(e.target)) {
            closeMenu();
        }
    }
});

//Swiper js
const swiper = new Swiper('.swiper', {
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  spaceBetween: 20,
  loop: true,
  observer: true,
  observeParents: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 16
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 24
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30
    }
  }
});

//Validation Helper Functions
function validateName(name) {
  return name && name.trim().length >= 2;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function validatePhone(phone, isRequired = false) {
  if (!phone || !phone.trim()) {
    return !isRequired;
  }
  const cleanPhone = phone.trim();
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  const digitsOnly = cleanPhone.replace(/\D/g, "");
  return phoneRegex.test(cleanPhone) && digitsOnly.length >= 7;
}

function validateMessage(message, minLength = 10, isRequired = true) {
  if (!message || !message.trim()) {
    return !isRequired;
  }
  return message.trim().length >= minLength;
}

function validateService(serviceValue) {
  return serviceValue !== null && serviceValue !== undefined && serviceValue.trim() !== "";
}

function validateDate(dateString) {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
}

function setFieldError(field, errorMessage) {
  if (!field) return;
  const formGroup = field.closest(".form-group");
  if (!formGroup) return;
  
  let errorSpan = formGroup.querySelector(".field-error");
  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.className = "field-error";
    formGroup.appendChild(errorSpan);
  }
  
  if (errorMessage) {
    errorSpan.innerText = errorMessage;
    formGroup.classList.add("error");
  } else {
    errorSpan.innerText = "";
    formGroup.classList.remove("error");
  }
}

//Contact form validation & submission
let contactForm = document.querySelector("#contact-form");
let contactStatus = document.querySelector("#contact-status");

if (contactForm) {
  const nameInput = contactForm.querySelector("#contact-name");
  const emailInput = contactForm.querySelector("#contact-email");
  const phoneInput = contactForm.querySelector("#contact-phone");
  const messageInput = contactForm.querySelector("#contact-message");

  function validateContactField(field) {
    if (field === nameInput) {
      const isValid = validateName(field.value);
      setFieldError(field, isValid ? "" : "Please enter your name (minimum 2 characters).");
      return isValid;
    }
    if (field === emailInput) {
      const isValid = validateEmail(field.value);
      setFieldError(field, isValid ? "" : "Please enter a valid email address.");
      return isValid;
    }
    if (field === phoneInput) {
      const isValid = validatePhone(field.value, false);
      setFieldError(field, isValid ? "" : "Please enter a valid phone number (minimum 7 digits).");
      return isValid;
    }
    if (field === messageInput) {
      const isValid = validateMessage(field.value, 10, true);
      setFieldError(field, isValid ? "" : "Please enter a message (minimum 10 characters).");
      return isValid;
    }
    return true;
  }

  [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener("blur", () => validateContactField(input));
      input.addEventListener("input", () => {
        if (input.closest(".form-group")?.classList.contains("error")) {
          validateContactField(input);
        }
      });
    }
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    contactStatus.className = "form-status";
    contactStatus.style.display = "none";

    const isNameValid = validateContactField(nameInput);
    const isEmailValid = validateContactField(emailInput);
    const isPhoneValid = validateContactField(phoneInput);
    const isMessageValid = validateContactField(messageInput);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
      const firstInvalid = contactForm.querySelector(".form-group.error input, .form-group.error textarea");
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn ? submitBtn.innerText : "Send Message";
    if (submitBtn) {
      submitBtn.innerText = "Sending...";
      submitBtn.disabled = true;
    }

    const formData = new FormData(contactForm);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        contactStatus.innerText = "Thanks — we'll be in touch shortly.";
        contactStatus.classList.add("success");
        contactForm.reset();
        [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
          if (input) setFieldError(input, "");
        });
      } else {
        contactStatus.innerText = data.message || "Something went wrong. Please try again.";
        contactStatus.classList.add("error");
      }
    } catch (error) {
      contactStatus.innerText = "Connection error. Please check your network and try again.";
      contactStatus.classList.add("error");
    } finally {
      if (submitBtn) {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    }
  });
}

//Booking form validation & submission
let bookingForm = document.querySelector("#booking-form");
let bookingStatus = document.querySelector("#booking-status");

if (bookingForm) {
  const nameInput = bookingForm.querySelector("#booking-name");
  const emailInput = bookingForm.querySelector("#booking-email");
  const phoneInput = bookingForm.querySelector("#booking-phone");
  const serviceInput = bookingForm.querySelector("#booking-service");
  const dateInput = bookingForm.querySelector("#booking-date");
  const detailsInput = bookingForm.querySelector("#booking-details");

  function validateBookingField(field) {
    if (field === nameInput) {
      const isValid = validateName(field.value);
      setFieldError(field, isValid ? "" : "Please enter your full name (minimum 2 characters).");
      return isValid;
    }
    if (field === emailInput) {
      const isValid = validateEmail(field.value);
      setFieldError(field, isValid ? "" : "Please enter a valid email address.");
      return isValid;
    }
    if (field === phoneInput) {
      const isValid = validatePhone(field.value, true);
      setFieldError(field, isValid ? "" : "Please enter a valid phone number (minimum 7 digits).");
      return isValid;
    }
    if (field === serviceInput) {
      const isValid = validateService(field.value);
      setFieldError(field, isValid ? "" : "Please select a service from the list.");
      return isValid;
    }
    if (field === dateInput) {
      const isValid = validateDate(field.value);
      setFieldError(field, isValid ? "" : "Please select a valid date (today or in the future).");
      return isValid;
    }
    if (field === detailsInput) {
      const isValid = validateMessage(field.value, 5, false);
      setFieldError(field, isValid ? "" : "Additional details should be at least 5 characters if provided.");
      return isValid;
    }
    return true;
  }

  [nameInput, emailInput, phoneInput, serviceInput, dateInput, detailsInput].forEach((input) => {
    if (input) {
      input.addEventListener("blur", () => validateBookingField(input));
      input.addEventListener("input", () => {
        if (input.closest(".form-group")?.classList.contains("error")) {
          validateBookingField(input);
        }
      });
      input.addEventListener("change", () => {
        if (input.closest(".form-group")?.classList.contains("error")) {
          validateBookingField(input);
        }
      });
    }
  });

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    bookingStatus.className = "form-status";
    bookingStatus.style.display = "none";

    const isNameValid = validateBookingField(nameInput);
    const isEmailValid = validateBookingField(emailInput);
    const isPhoneValid = validateBookingField(phoneInput);
    const isServiceValid = validateBookingField(serviceInput);
    const isDateValid = validateBookingField(dateInput);
    const isDetailsValid = validateBookingField(detailsInput);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isServiceValid || !isDateValid || !isDetailsValid) {
      const firstInvalid = bookingForm.querySelector(".form-group.error input, .form-group.error select, .form-group.error textarea");
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const submitBtn = bookingForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn ? submitBtn.innerText : "Confirm Consultation Booking";
    if (submitBtn) {
      submitBtn.innerText = "Submitting...";
      submitBtn.disabled = true;
    }

    const formData = new FormData(bookingForm);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        bookingStatus.innerText = "Consultation booked! We have received your request and will reach out shortly to confirm.";
        bookingStatus.classList.add("success");
        bookingForm.reset();
        [nameInput, emailInput, phoneInput, serviceInput, dateInput, detailsInput].forEach((input) => {
          if (input) setFieldError(input, "");
        });
      } else {
        bookingStatus.innerText = data.message || "Something went wrong. Please try again.";
        bookingStatus.classList.add("error");
      }
    } catch (error) {
      bookingStatus.innerText = "Connection error. Please check your network and try again.";
      bookingStatus.classList.add("error");
    } finally {
      if (submitBtn) {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    }
  });
}

//FAQ accordion toggle
let faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  if (question && answer) {
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }

      if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 320);
      }
    });
  }
});

//Dynamic Nav Height Measurement & Scroll-Spy Active Nav Highlighting
window.addEventListener("DOMContentLoaded", () => {
  const navEl = document.querySelector(".navigation");

  function measureAndSetNavHeight() {
    if (!navEl) return 108;
    const height = Math.round(navEl.getBoundingClientRect().height) || navEl.offsetHeight || 108;
    document.documentElement.style.setProperty("--nav-height", `${height}px`);
    return height;
  }

  let currentNavHeight = measureAndSetNavHeight();

  // Debounced window resize handler to re-measure nav height on screen rotation / viewport changes
  let resizeDebounceTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeDebounceTimer);
    resizeDebounceTimer = setTimeout(() => {
      currentNavHeight = measureAndSetNavHeight();
    }, 100);
  });

  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = document.querySelectorAll("div[id]");

  if (navLinks.length > 0 && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: `-${currentNavHeight + 10}px 0px -40% 0px`,
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${currentId}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));
  }
});

//GSAP Scroll Animations
window.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero On-load Animation
  const heroHeading = document.querySelector(".hero .heading");
  const heroText = document.querySelector(".hero .text");
  const heroTiles = document.querySelectorAll(".hero .tile");
  const heroBtn = document.querySelector(".hero .action-button");
  const heroImg = document.querySelector(".hero .right-content");

  if (heroHeading) {
    const heroTimeline = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } });
    
    heroTimeline.fromTo(heroHeading, { opacity: 0, y: 25 }, { opacity: 1, y: 0 });
    if (heroText) heroTimeline.fromTo(heroText, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.6");
    if (heroTiles.length) heroTimeline.fromTo(heroTiles, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1 }, "-=0.5");
    if (heroBtn) heroTimeline.fromTo(heroBtn, { opacity: 0, y: 15 }, { opacity: 1, y: 0 }, "-=0.5");
    if (heroImg) heroTimeline.fromTo(heroImg, { opacity: 0, y: 25 }, { opacity: 1, y: 0 }, "-=0.7");
  }

  // Scroll-Triggered Section Animations
  const animateSections = [
    { selector: ".trust-strip", trigger: ".trust-strip" },
    { selector: ".about", trigger: ".about" },
    { selector: ".services", trigger: ".services", staggerItems: ".services .card" },
    { selector: ".certifications", trigger: ".certifications", staggerItems: ".certifications-grid .cert-card" },
    { selector: ".portfolio", trigger: ".portfolio", staggerItems: ".portfolio-card" },
    { selector: ".testimonials", trigger: ".testimonials", staggerItems: ".testimonials-grid .testimonial-card" },
    { selector: ".contact", trigger: ".contact" },
    { selector: ".faq", trigger: ".faq", staggerItems: ".faq-item" }
  ];

  animateSections.forEach((sec) => {
    const target = document.querySelector(sec.selector);
    if (!target) return;

    const heading = target.querySelector(".heading");
    const text = target.querySelector(".text");
    const label = target.querySelector(".trust-label");
    const logos = target.querySelectorAll(".trust-logo");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: target,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    });

    if (label) {
      tl.fromTo(label, { opacity: 0, y: 15 }, { opacity: 0.6, y: 0, duration: 0.6, ease: "power2.out" });
    }
    if (logos && logos.length) {
      tl.fromTo(logos, { opacity: 0, y: 15 }, { opacity: 0.6, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }, "-=0.4");
    }

    if (heading) {
      tl.fromTo(heading, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
    }
    if (text) {
      tl.fromTo(text, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.5");
    }

    if (sec.staggerItems) {
      const items = target.querySelectorAll(sec.staggerItems);
      if (items.length > 0) {
        tl.fromTo(items, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 }, "-=0.4");
      }
    }
  });

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
});