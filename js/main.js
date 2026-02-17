/* ============================================================
   WAMAW TRAVEL GROUP — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll behaviour ── */
  const navbar = document.getElementById('navbar');

  function updateNav() {
    if (!navbar) return;
    const isTransparent = navbar.classList.contains('nav--transparent');
    if (isTransparent) {
      if (window.scrollY > 60) {
        navbar.classList.remove('nav--transparent');
        navbar.classList.add('nav--scrolled');
      } else {
        navbar.classList.remove('nav--scrolled');
        navbar.classList.add('nav--transparent');
      }
    } else {
      // Always show scrolled style on inner pages
      navbar.classList.add('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Mobile nav ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');

  function openMobile() {
    if (mobileNav) {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  window.closeMobile = function () {
    if (mobileNav) {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (hamburger) hamburger.addEventListener('click', openMobile);
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);

  // Close on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobile();
  });

  /* ── Scroll reveal ── */
  function initReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Smooth anchor links ── */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
          closeMobile();
        }
      });
    });
  }

  /* ── Stats counter animation ── */
  function animateCounter(el) {
    const text = el.textContent;
    const sup = el.querySelector('sup');
    const supText = sup ? sup.textContent : '';
    // Extract the number only
    const num = parseFloat(text.replace(supText, '').replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;

    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);

      if (sup) {
        el.innerHTML = current + '<sup>' + supText + '</sup>';
      } else {
        el.textContent = current;
      }

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.stats__number');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Active nav link highlight ── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__links a');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.style.color = '';
              const href = link.getAttribute('href');
              if (href && href.includes('#' + entry.target.id)) {
                link.style.color = 'var(--c-primary)';
              }
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ── Init all ── */
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initSmoothAnchors();
    initCounters();
    initActiveNav();
  });

  // Fallback for already-loaded DOM
  if (document.readyState !== 'loading') {
    initReveal();
    initSmoothAnchors();
    initCounters();
    initActiveNav();
  }
})();
