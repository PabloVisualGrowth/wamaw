/* ============================================================
   WAMAW TRAVEL GROUP — Main JS 2026
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll Progress Bar ── */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  /* ── Navbar scroll behaviour ── */
  function initNav() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function update() {
      if (window.scrollY > 60) {
        navbar.classList.remove('nav--transparent');
        navbar.classList.add('nav--scrolled');
      } else {
        if (navbar.classList.contains('nav--transparent') || !navbar.dataset.inner) {
          navbar.classList.add('nav--transparent');
          navbar.classList.remove('nav--scrolled');
        }
      }
    }

    // Inner pages always scrolled
    if (navbar.dataset.inner) {
      navbar.classList.add('nav--scrolled');
    } else {
      navbar.classList.add('nav--transparent');
      window.addEventListener('scroll', update, { passive: true });
      update();
    }
  }

  /* ── Mobile Menu ── */
  function initMobileMenu() {
    const hamburger  = document.getElementById('hamburger');
    const menu       = document.getElementById('mobileMenu');
    const menuClose  = document.getElementById('menuClose');
    if (!hamburger || !menu) return;

    function open()  { menu.classList.add('open');  document.body.style.overflow = 'hidden'; }
    function close() { menu.classList.remove('open'); document.body.style.overflow = ''; }

    hamburger.addEventListener('click', open);
    if (menuClose) menuClose.addEventListener('click', close);

    // Close links
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ── Scroll Reveal ── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal, .text-animate');
    if (!els.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Smooth Anchors ── */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Word Rotate ── */
  function initWordRotate() {
    const words = document.querySelectorAll('.word-rotate__word');
    if (!words.length) return;

    let current = 0;
    words[0].classList.add('active');

    setInterval(function () {
      const next = (current + 1) % words.length;
      words[current].classList.remove('active');
      words[current].classList.add('exit');
      setTimeout(function () { words[current].classList.remove('exit'); }, 500);
      words[next].classList.add('active');
      current = next;
    }, 2500);
  }

  /* ── Stats Counter ── */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-card__number[data-target]');
    if (!counters.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const dur    = 1600;
        const start  = performance.now();

        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
          el.textContent = v + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { io.observe(el); });
  }

  /* ── Magic Cards Mouse Tracking ── */
  function initMagicCards() {
    document.querySelectorAll('.magic-card').forEach(function (card) {
      const border = card.querySelector('.magic-card__border');
      const glow   = card.querySelector('.magic-card__glow');

      card.addEventListener('pointermove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (border) {
          border.style.background =
            'radial-gradient(280px circle at ' + x + 'px ' + y + 'px, rgba(30,144,214,.5), transparent 100%)';
          border.style.inset = '-1px';
        }
        if (glow) {
          glow.style.background =
            'radial-gradient(200px circle at ' + x + 'px ' + y + 'px, rgba(30,144,214,.08), transparent 100%)';
        }
      });

      function reset() {
        if (border) border.style.background = '';
        if (glow)   glow.style.background = '';
      }
      card.addEventListener('pointerleave', reset);
    });
  }

  /* ── Contact Form ── */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const privacy = form.querySelector('#privacy');
      if (privacy && !privacy.checked) {
        privacy.style.outline = '2px solid rgba(30,144,214,.8)';
        return;
      }
      const btn = form.querySelector('.form__submit');
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
      setTimeout(function () {
        const msg = document.getElementById('successMsg');
        if (btn)  { btn.style.display = 'none'; }
        if (msg)  { msg.classList.add('show'); }
        form.reset();
      }, 1200);
    });
  }

  /* ── Explore Button Scroll ── */
  function initExploreBtn() {
    document.querySelectorAll('[data-scroll-to]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = document.querySelector(this.dataset.scrollTo);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Init ── */
  function init() {
    initScrollProgress();
    initNav();
    initMobileMenu();
    initReveal();
    initAnchors();
    initWordRotate();
    initCounters();
    initMagicCards();
    initContactForm();
    initExploreBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
