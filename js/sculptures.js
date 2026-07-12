
let sculptures = [];
let currentIndex = 0;

const grid = document.getElementById("sculpture-grid");
const lightbox = document.getElementById("sculpture-lightbox");
const largeImage = document.getElementById("sculpture-large-image");

fetch("data/sculptures.json")
  .then(response => {
    if (!response.ok) throw new Error("Unable to load sculpture images.");
    return response.json();
  })
  .then(data => {
    sculptures = data;
    render();
  });

function render() {
  sculptures.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sculpture-card";
    button.innerHTML = `<img loading="lazy" src="${item.thumb}" alt="Sculpture ${index + 1}">`;
    button.addEventListener("click", () => openSculpture(index));
    grid.appendChild(button);
  });
}

function openSculpture(index) {
  currentIndex = index;
  showSculpture();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function showSculpture() {
  largeImage.src = sculptures[currentIndex].full;
}

function closeSculpture() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function move(direction) {
  currentIndex = (currentIndex + direction + sculptures.length) % sculptures.length;
  showSculpture();
}

document.querySelector(".sculpture-lightbox .close").addEventListener("click", closeSculpture);
document.querySelector(".sculpture-lightbox .prev").addEventListener("click", () => move(-1));
document.querySelector(".sculpture-lightbox .next").addEventListener("click", () => move(1));

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeSculpture();
  if (event.key === "ArrowLeft") move(-1);
  if (event.key === "ArrowRight") move(1);
});
