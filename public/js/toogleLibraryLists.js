
  /* Toggle lists on my library page */
document.querySelectorAll('.library_toggle_button').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const list = document.getElementById(targetId);

    list.classList.toggle('active');

    btn.textContent = btn.textContent.includes('▼')
      ? btn.textContent.replace('▼', '▲')
      : btn.textContent.replace('▲', '▼');
  });
});