
let allWorks = [];
let visibleWorks = [];
let currentIndex = 0;

const grid = document.getElementById("art-grid");
const showing = document.getElementById("showing");
const lightbox = document.getElementById("lightbox");
const largeImage = document.getElementById("large-image");
const artTitle = document.getElementById("art-title");
const artInfo = document.getElementById("art-info");

fetch("data/artworks.json")
  .then(response => {
    if (!response.ok) throw new Error("Unable to load artwork data.");
    return response.json();
  })
  .then(data => {
    allWorks = data;
    visibleWorks = data;
    renderGrid();
  });

function badgeText(status) {
  if (status === "SOLD") return "Sold";
  return status;
}

function renderGrid() {
  grid.innerHTML = "";
  showing.textContent = visibleWorks.length === allWorks.length
    ? "Showing all works"
    : `Showing ${visibleWorks.length} works`;

  visibleWorks.forEach((art, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "art-card";
    card.innerHTML = `
      <img loading="lazy" src="${art.thumb}" alt="${art.title}">
      <span class="status-badge">${badgeText(art.availability)}</span>
      <span class="art-overlay">
        <span><b>${art.title}</b><small>${art.year || ""}</small></span>
      </span>`;
    card.addEventListener("click", () => openArtwork(index));
    grid.appendChild(card);
  });
}

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    visibleWorks = filter === "all"
      ? allWorks
      : allWorks.filter(art => art.availability === filter);
    renderGrid();
  });
});

function addInfoRow(label, value) {
  if (!value) return "";
  return `<div class="art-info-row"><dt>${label}</dt><dd>${value}</dd></div>`;
}

function showArtwork() {
  const art = visibleWorks[currentIndex];
  largeImage.src = art.full;
  largeImage.alt = art.title;
  artTitle.innerHTML = `${art.title}${art.year ? `<br><small style="font-size:14px;color:#888;font-family:Arial;font-weight:400">${art.year}</small>` : ""}`;

  let info = "";
  info += addInfoRow("Title", art.title);
  info += addInfoRow("Dimensions", art.dimensions);
  info += addInfoRow("Medium", art.medium);
  info += addInfoRow("Series", art.series);
  info += addInfoRow("Availability", art.availability);

  if (art.availability === "Available") {
    info += addInfoRow("Price", "Price on Request");
  } else if ((art.availability === "SOLD" || art.availability === "Commission Work") && art.price) {
    info += addInfoRow("Price", art.price);
  }

  artInfo.innerHTML = info;
}

function openArtwork(index) {
  currentIndex = index;
  showArtwork();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeArtwork() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function moveArtwork(direction) {
  currentIndex = (currentIndex + direction + visibleWorks.length) % visibleWorks.length;
  showArtwork();
}

document.querySelector(".close").addEventListener("click", closeArtwork);
document.querySelector(".prev").addEventListener("click", () => moveArtwork(-1));
document.querySelector(".next").addEventListener("click", () => moveArtwork(1));

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeArtwork();
  if (event.key === "ArrowLeft") moveArtwork(-1);
  if (event.key === "ArrowRight") moveArtwork(1);
});
