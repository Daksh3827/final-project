const navigationBar = document.querySelector('[data-navbar]');

if (navigationBar) {
  const menuToggleBtn = navigationBar.querySelector('[data-nav-toggle]');
  const navigationLinks = navigationBar.querySelector('[data-nav-links]');
  const screenQuery = window.matchMedia('(max-width: 860px)');

  const toggleMenuState = (isOpen) => {
    navigationBar.classList.toggle('is-open', isOpen);
    menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
  };

  navigationBar.classList.add('nav-ready');

  menuToggleBtn.addEventListener('click', () => {
    toggleMenuState(!navigationBar.classList.contains('is-open'));
  });

  navigationLinks.querySelectorAll('a').forEach((navAnchor) => {
    navAnchor.addEventListener('click', () => toggleMenuState(false));
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && navigationBar.classList.contains('is-open')) {
      toggleMenuState(false);
      menuToggleBtn.focus();
    }
  });

  screenQuery.addEventListener('change', (evt) => {
    if (!evt.matches) {
      toggleMenuState(false);
    }
  });
}
