const searchInput = document.querySelector(".library_search_input");
const clearBtn = document.querySelector(".library_clear_search");
const books = document.querySelectorAll(".book");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  clearBtn.classList.toggle("active", query.length > 0);

  let anyVisible = false;

  books.forEach(book => {
    const searchable = book.dataset.search || "";
    const matches = searchable.includes(query);
    book.style.display = matches ? "" : "none";
    if (matches) anyVisible = true;
  });

    document.querySelectorAll(".carousel_track").forEach(track => {
    let emptyMsg = track.querySelector(".no-books-message");

     if (!anyVisible) {
    if (!emptyMsg) {
      emptyMsg = document.createElement("div");
      emptyMsg.classList.add("no-books-message", "book");
      emptyMsg.textContent = "Aucun livre ne correspond à votre recherche";
      track.appendChild(emptyMsg);
    }
  } else {
    if (emptyMsg) emptyMsg.remove();
  }
});


  resetCarousels();
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.classList.remove("active");

  books.forEach(book => {
    book.style.display = "";
  });

  resetCarousels?.();
});