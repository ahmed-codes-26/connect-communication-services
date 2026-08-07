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
  slidesPerView: 1,
  spaceBetween: 20,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true
  },
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true
  }
});