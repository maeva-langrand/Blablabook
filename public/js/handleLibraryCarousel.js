document.querySelectorAll('.library_content').forEach(library => {
  const track = library.querySelector(".carousel_track");
  const books = library.querySelectorAll(".book");
  const prevBtn = library.querySelector(".prev");
  const nextBtn = library.querySelector(".next");

  if (!track || books.length === 0) return;

  let index = 0;

  function isMobile() {
    return window.innerWidth < 1100;
  }

    function getVisibleBooks(track) {
  return Array.from(track.querySelectorAll(".book"))
    .filter(book => book.offsetParent !== null);
}

  function updateCarousel() {
    if (!isMobile()) {
      track.style.transform = 'none';
      return;
    }

const visibleBooks = getVisibleBooks(track);
if (visibleBooks.length === 0) return;

const width = visibleBooks[0].offsetWidth;
track.style.transform = `translateX(-${index * width}px)`;
  }

nextBtn?.addEventListener("click", () => {
  if (!isMobile()) return;

  const visibleBooks = getVisibleBooks(track);
  if (index < visibleBooks.length - 1) {
    index++;
    updateCarousel();
  }
});

prevBtn?.addEventListener("click", () => {
  if (!isMobile()) return;

  if (index > 0) {
    index--;
    updateCarousel();
  }
});

  window.addEventListener("resize", () => {
    index = 0;
    updateCarousel();
  });


});

function resetCarousels() {
  document.querySelectorAll(".library_content").forEach(library => {
    const track = library.querySelector(".carousel_track");
    if (!track) return;

    track.style.transform = "translateX(0)";

    library.dataset.index = "0";
  });
}

window.resetCarousels = resetCarousels;