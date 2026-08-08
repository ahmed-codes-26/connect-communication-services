//Navigation functionality
let openButton = document.querySelector("#open");
let navigationBar = document.querySelector(".nav-links");
let closeButton = document.querySelector("#close");


openButton.addEventListener('click', () => {
    navigationBar.classList.add("open");
});

navigationBar.addEventListener("click", () => {
    navigationBar.classList.remove("open");
});

closeButton.addEventListener("click", () => {
    navigationBar.classList.remove("open");
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