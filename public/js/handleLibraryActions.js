
document.addEventListener("click", async (e) => {
    const button = e.target.closest(
        ".add-to-library-btn, .remove-from-library-btn"
    );
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  const bookId = button.dataset.bookId;
  const status = button.dataset.status;
  const bookWrapper = button.closest(".book");

  try {

    if (status === "remove") {
      const response = await fetch(`/bibliotheque/retirer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({bookId,}),
      });

      if (!response.ok) throw new Error("Suppression échouée");

      bookWrapper.remove();
      return;
    }

    const response = await fetch("/bibliotheque", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId,
        status,
      }),
    });

    if (!response.ok) throw new Error("Update échoué");


    const targetTrack =
      status === "read"
        ? document.querySelector("#library_read_list .carousel_track")
        : document.querySelector("#library_to_read_list .carousel_track");

    targetTrack.appendChild(bookWrapper);

       const menuButton = bookWrapper.querySelector(".add-to-library-btn");
    if (status === "read") {
      menuButton.dataset.status = "to_read";
      menuButton.textContent = "Déplacer vers les livres à lire";
    } else if (status === "to_read") {
      menuButton.dataset.status = "read";
      menuButton.textContent = "Déplacer vers les livres lus";
    }
    
  const sticker = bookWrapper.querySelector(".sticker");
    if (sticker) {
      if (status === "read") {
        sticker.classList.remove("toread");
        sticker.classList.add("read");
        sticker.textContent = "Lu";
      } else if (status === "to_read") {
        sticker.classList.remove("read");
        sticker.classList.add("toread");
        sticker.textContent = "À lire";
      }
    }
    
  } catch (error) {
    console.error(error);
  }
});