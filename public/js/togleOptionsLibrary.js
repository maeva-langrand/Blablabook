document.addEventListener("click", (e) => {
  const toggle = e.target.closest(".book_add_toggle");

  document.querySelectorAll(".book_add_menu").forEach(menu => {
    menu.classList.remove("open");
    menu.previousElementSibling?.setAttribute("aria-expanded", "false");
  });

  if (!toggle) return;

  const menu = toggle.nextElementSibling;
  menu.classList.toggle("open");

  toggle.setAttribute(
    "aria-expanded",
    menu.classList.contains("open")
  );

  e.stopPropagation();
});