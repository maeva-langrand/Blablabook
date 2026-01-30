const menu = document.querySelector('.navbar_list');
const burger = document.querySelector('.navbar_burger');

if (burger && menu) {
  const toggleMenu = () => {
    const isOpen = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  };

    burger.addEventListener('click', (e) => {
    e.stopPropagation(); 
    toggleMenu();
  });

  /* Closing burger menu if clicked outside */
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && e.target !== burger) {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    }
  });
}