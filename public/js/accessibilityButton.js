(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const menu = document.getElementById('accessibility-menu');
    const toggleBtns = document.querySelectorAll('.header_accessibility_menu');

    if (!menu || toggleBtns.length === 0) return; /*If there's a dowload pb on buttons*/

    /* Accessibility menu*/
    const toggleMenu = () => {
      const isOpen = !menu.hasAttribute('hidden');
      if (isOpen) menu.setAttribute('hidden', '');
      else menu.removeAttribute('hidden');

      toggleBtns.forEach(btn => btn.setAttribute('aria-expanded', String(!isOpen)));
    };

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        toggleMenu();
      });
    });

    /*CLosed when clicked outside*/
    document.addEventListener('click', e => {
     /*separate two buttons in a table with 2 elements*/ if (![...toggleBtns].some(btn => btn.contains(e.target)) && !menu.contains(e.target)) {
        menu.setAttribute('hidden', '');
        toggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
      }
    });

    /* CLosed when ESC*/
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        menu.setAttribute('hidden', '');
        toggleBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
      }
    });

    /* Toggle options*/
    const themeBtn = document.getElementById('toggle-theme');
    const contrastBtn = document.getElementById('toggle-contrast');
    const lineHeightBtn = document.getElementById('toggle-line-height');

    let theme = localStorage.getItem('theme') || 'light';
    let contrast = localStorage.getItem('contrast') === 'true';
    let largeLineHeight = localStorage.getItem('lineHeight') === 'true';


    const applyTheme = () => {
      body.classList.remove('standard-dark', 'contrast-light', 'contrast-dark');
      if (contrast && theme === 'light') body.classList.add('contrast-light');
      if (contrast && theme === 'dark') body.classList.add('contrast-dark');
      if (!contrast && theme === 'dark') body.classList.add('standard-dark');

      if (themeBtn) {
        themeBtn.setAttribute('aria-pressed', theme === 'dark');
        themeBtn.textContent = theme === 'dark' ? '☀️ Mode clair' : '🌙 Mode sombre';
      }
      if (contrastBtn) {
        contrastBtn.setAttribute('aria-pressed', contrast);
        contrastBtn.textContent = contrast ? '🔅 Contraste normal' : '🔆 Contraste renforcé';
      }

      localStorage.setItem('theme', theme);
      localStorage.setItem('contrast', contrast);

    };

    const applyLineHeight = () => {
      body.classList.toggle('line-height-large', largeLineHeight);
      if (lineHeightBtn) {
        lineHeightBtn.setAttribute('aria-pressed', largeLineHeight);
        lineHeightBtn.textContent = largeLineHeight ? '📐 Interligne normal' : '📏 Interligne augmenté';
      }

  localStorage.setItem('lineHeight', largeLineHeight);
  
    };

    if (themeBtn) themeBtn.addEventListener('click', e => {
      e.stopPropagation(); /*DOesnt propagate to exterior click*/
      theme = theme === 'light' ? 'dark' : 'light';
      applyTheme();
    });

    if (contrastBtn) contrastBtn.addEventListener('click', e => {
      e.stopPropagation();
      contrast = !contrast;
      applyTheme();
    });

    if (lineHeightBtn) lineHeightBtn.addEventListener('click', e => {
      e.stopPropagation();
      largeLineHeight = !largeLineHeight;
      applyLineHeight();
    });

    applyTheme();
    applyLineHeight();
  });
})();
