document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".books_filters_toggle");
  const filters = document.querySelector(".books_filters");

  if (!toggle || !filters) return;

  toggle.addEventListener("click", () => {
    const isOpen = filters.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  document.addEventListener("click", (e) => {
    if (
      filters.classList.contains("is-open") &&
      !filters.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      filters.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && filters.classList.contains("is-open")) {
    filters.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

});