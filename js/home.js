
const highlightSlides = Array.from(document.querySelectorAll(".highlight-slide"));
const highlightDotsContainer = document.querySelector(".slider-dots");
const highlightPrevious = document.querySelector(".slider-btn.prev");
const highlightNext = document.querySelector(".slider-btn.next");
let highlightIndex = 0;
let highlightTimer;

highlightSlides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.className = "slider-dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Show highlight ${index + 1}`);
  dot.addEventListener("click", () => {
    showHighlight(index);
    restartHighlights();
  });
  highlightDotsContainer.appendChild(dot);
});
const highlightDots = Array.from(document.querySelectorAll(".slider-dot"));

function showHighlight(index) {
  highlightSlides[highlightIndex].classList.remove("active");
  highlightDots[highlightIndex].classList.remove("active");
  highlightIndex = (index + highlightSlides.length) % highlightSlides.length;
  highlightSlides[highlightIndex].classList.add("active");
  highlightDots[highlightIndex].classList.add("active");
}
function nextHighlight() { showHighlight(highlightIndex + 1); }
function restartHighlights() {
  window.clearInterval(highlightTimer);
  highlightTimer = window.setInterval(nextHighlight, 6000);
}
highlightPrevious.addEventListener("click", () => { showHighlight(highlightIndex - 1); restartHighlights(); });
highlightNext.addEventListener("click", () => { showHighlight(highlightIndex + 1); restartHighlights(); });
highlightDots[0].classList.add("active");
restartHighlights();
