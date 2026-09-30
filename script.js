(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const navLinks = nav?.querySelectorAll('a') ?? [];
  const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setHeaderState = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 18);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const closeMenu = (restoreFocus = false) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuButton.focus();
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) nav?.querySelector('a')?.focus({ preventScroll: true });
  });

  navLinks.forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu(true);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });

  const reveals = document.querySelectorAll('.reveal');
  const userReducedMotion = () => reducedMotionMedia.matches || document.body.classList.contains('reduce-motion');

  if ('IntersectionObserver' in window && !userReducedMotion()) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(item => observer.observe(item));
  } else {
    reveals.forEach(item => item.classList.add('is-visible'));
  }

  const a11yRoot = document.querySelector('[data-a11y]');
  const a11yTrigger = a11yRoot?.querySelector('.a11y-trigger');
  const a11yPanel = a11yRoot?.querySelector('.a11y-panel');
  const decrease = a11yRoot?.querySelector('[data-font="decrease"]');
  const increase = a11yRoot?.querySelector('[data-font="increase"]');
  const contrast = a11yRoot?.querySelector('[data-contrast]');
  const motion = a11yRoot?.querySelector('[data-motion]');
  const reset = a11yRoot?.querySelector('[data-reset]');

  const prefs = {
    font: Number(localStorage.getItem('rm-font-scale') || 1),
    contrast: localStorage.getItem('rm-contrast') === 'true',
    motion: localStorage.getItem('rm-motion') === 'true'
  };

  const applyPrefs = () => {
    prefs.font = Math.min(1.25, Math.max(.9, prefs.font));
    document.documentElement.style.setProperty('--font-scale', prefs.font.toFixed(2));
    document.body.classList.toggle('high-contrast', prefs.contrast);
    document.body.classList.toggle('reduce-motion', prefs.motion);
    contrast?.setAttribute('aria-pressed', String(prefs.contrast));
    motion?.setAttribute('aria-pressed', String(prefs.motion));
  };

  const savePrefs = () => {
    localStorage.setItem('rm-font-scale', String(prefs.font));
    localStorage.setItem('rm-contrast', String(prefs.contrast));
    localStorage.setItem('rm-motion', String(prefs.motion));
  };

  applyPrefs();

  a11yTrigger?.addEventListener('click', () => {
    const willOpen = a11yPanel?.hidden ?? true;
    if (!a11yPanel) return;
    a11yPanel.hidden = !willOpen;
    a11yTrigger.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) a11yPanel.querySelector('button')?.focus();
  });

  decrease?.addEventListener('click', () => {
    prefs.font -= .05;
    applyPrefs();
    savePrefs();
  });
  increase?.addEventListener('click', () => {
    prefs.font += .05;
    applyPrefs();
    savePrefs();
  });
  contrast?.addEventListener('click', () => {
    prefs.contrast = !prefs.contrast;
    applyPrefs();
    savePrefs();
  });
  motion?.addEventListener('click', () => {
    prefs.motion = !prefs.motion;
    applyPrefs();
    savePrefs();
  });
  reset?.addEventListener('click', () => {
    prefs.font = 1;
    prefs.contrast = false;
    prefs.motion = false;
    applyPrefs();
    savePrefs();
  });

  document.addEventListener('pointerdown', event => {
    if (!a11yRoot || !a11yPanel || a11yPanel.hidden) return;
    if (!a11yRoot.contains(event.target)) {
      a11yPanel.hidden = true;
      a11yTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && a11yPanel && !a11yPanel.hidden) {
      a11yPanel.hidden = true;
      a11yTrigger?.setAttribute('aria-expanded', 'false');
      a11yTrigger?.focus();
    }
  });
})();