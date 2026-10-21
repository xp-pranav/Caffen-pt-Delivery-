/* High Contrast — interactions */
(() => {
  'use strict';

  const doc = document;
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Sticky header shadow ---------- */
  const header = $('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const toggle = $('[data-nav-toggle]');
  const nav = $('#primary-nav');

  const closeNav = () => {
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    doc.body.style.overflow = '';
  };
  const openNav = () => {
    header.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    doc.body.style.overflow = 'hidden';
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      header.classList.contains('is-open') ? closeNav() : openNav();
    });
    $$('.nav__link').forEach((a) => a.addEventListener('click', closeNav));
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }
  /* ---------- Hero gallery ---------- */
  const slides = [
    { src: 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9St1d8jJuJPipKLVEsnBqs4OBzr1nzQN443Mb_9OUd6LH0VOTAVmo19GiDI4FJa_Qp0mAk_vf_CbKPXEUDkdobQyJEXXjusRjBEm-Cg3DOD1r3_I6ufQ7k4iH3UpPPAtHRW46V7yjBRDQY=w1200-h1600-k-no', alt: 'The High Contrast espresso barfront on a quiet laneway' },
    { src: 'images/2cup.jpg', alt: 'A short black poured in a white cup on the bar' },
    { src: 'images/board.jpg', alt: 'A flat white with a clean pour of latte art' }
  ];
  const hero = $('#hero-');
  const galleryBtns = $$('[data-slide]');
  const setSlide = (i) => {
    const { src, alt } = slides[i];
    galleryBtns.forEach((b, idx) => b.setAttribute('aria-current', idx === i ? 'true' : 'false'));
    const apply = () => { hero.src = src; hero.alt = alt; hero.style.opacity = '1'; };
    hero.style.opacity = '0';
    if (reduced) { apply(); return; }
    setTimeout(apply, 180);
  };
  galleryBtns.forEach((btn, i) => btn.addEventListener('click', () => setSlide(i)));

  /* ---------- Menu filter ---------- */
  const tabs = $$('.menu__tab');
  const items = $$('.menu-item');
  const countEl = $('#menu-count');
  const emptyEl = $('#menu-empty');
  const listEl = $('#menu-list');

  const filter = (cat) => {
    let visible = 0;
    items.forEach((item) => {
      const show = cat === 'all' || item.dataset.category === cat;
      item.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyEl) emptyEl.hidden = visible > 0;
    if (listEl) listEl.hidden = visible === 0;
    if (countEl) countEl.textContent = `${visible} item${visible === 1 ? '' : 's'}`;
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-pressed', 'false'));
      tab.setAttribute('aria-pressed', 'true');
      filter(tab.dataset.category);
    });
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
        next.click();
      }
    });
  });
  filter('all');

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
