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