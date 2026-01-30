document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".book_add_toggle");
  const menu = document.querySelector(".book_add_menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

const showMessage = (msg, type = "success") => {
  const container = document.getElementById("message_container");
  if (!container) return;

  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = msg;
  container.appendChild(div);

  setTimeout(() => div.remove(), 3000);
};

  const sticker = document.getElementById("book_sticker");

  const updateSticker = (status) => {
  if (!sticker) return;

  if (status === "to_read") {
    sticker.textContent = "À lire";
    sticker.className = "book_sticker to_read";
    sticker.style.display = "block";
  } else if (status === "read") {
    sticker.textContent = "Lu";
    sticker.className = "book_sticker read";
    sticker.style.display = "block";
  } else {

    sticker.textContent = "";
    sticker.className = "book_sticker";
    sticker.style.display = "none";
  }
};


document.querySelectorAll(".add-to-library-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const bookId = btn.dataset.bookId;
    const status = btn.dataset.status;

    const res = await fetch("/bibliotheque", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, status })
    });

    if (res.ok) {
      showMessage("Livre ajouté à votre bibliothèque !");
      updateSticker(status);
    } else {
      showMessage("Erreur lors de l'ajout", "error");
    }
  });
});


 document.querySelectorAll(".remove-from-library-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const bookId = btn.dataset.bookId;

    try {
      const res = await fetch("/bibliotheque/retirer", {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId })
      });

      const data = await res.json();

      if (data.success) {
         updateSticker(null);
        btn.closest(".book-card")?.remove();
        showMessage("Livre retiré de votre bibliothèque !");
      } else {
        showMessage("Erreur lors du retrait", "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Erreur réseau", "error");
    }
  });
});