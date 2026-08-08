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