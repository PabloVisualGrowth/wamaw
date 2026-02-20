/* ============================================================
   WAMAW TRAVEL GROUP — main.js
   Handles: scroll progress, navbar, mobile menu, scroll reveal,
            counter animation, word rotate, magic cards, FAQ,
            contact form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SCROLL PROGRESS BAR ──────────────────────────────── */
  const scrollProgress = document.querySelector('.scroll-progress')
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      scrollProgress.style.width = `${progress}%`
    }, { passive: true })
  }

  /* ── NAVBAR ───────────────────────────────────────────── */
  const nav = document.querySelector('.nav')
  if (nav) {
    const isTransparent = nav.classList.contains('nav--transparent')
    const isLight = nav.dataset.light === 'true'

    const updateNav = () => {
      const scrolled = window.scrollY > 40
      if (isTransparent) {
        if (scrolled) {
          nav.classList.remove('nav--transparent')
          if (isLight) {
            nav.classList.add('nav--light-scrolled')
          } else {
            nav.classList.add('nav--scrolled')
          }
        } else {
          nav.classList.add('nav--transparent')
          nav.classList.remove('nav--scrolled', 'nav--light-scrolled')
        }
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true })
    updateNav()
  }

  /* ── MOBILE MENU ──────────────────────────────────────── */
  const hamburger = document.querySelector('.nav__hamburger')
  const mobileMenu = document.querySelector('.nav__mobile')
  const mobileClose = document.querySelector('.nav__mobile-close')
  const mobileLinks = document.querySelectorAll('.nav__mobile a')

  const openMenu = () => {
    mobileMenu?.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }
  const closeMenu = () => {
    mobileMenu?.classList.remove('is-open')
    document.body.style.overflow = ''
  }

  hamburger?.addEventListener('click', openMenu)
  mobileClose?.addEventListener('click', closeMenu)
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu))
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu() })

  /* ── SCROLL REVEAL ────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal')
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '-30px 0px' })

    reveals.forEach(el => revealObserver.observe(el))
  }

  /* ── COUNTER ANIMATION ────────────────────────────────── */
  const statNumbers = document.querySelectorAll('[data-count]')
  if (statNumbers.length) {
    const easeOut = t => 1 - Math.pow(1 - t, 3)

    const animateCounter = (el, target, suffix) => {
      const duration = 1800
      const start = performance.now()
      const update = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const value = Math.round(easeOut(progress) * target)
        el.textContent = value + suffix
        if (progress < 1) requestAnimationFrame(update)
      }
      requestAnimationFrame(update)
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target
          const target = parseInt(el.dataset.count, 10)
          const suffix = el.dataset.suffix || ''
          animateCounter(el, target, suffix)
          statsObserver.unobserve(el)
        }
      })
    }, { threshold: 0.5 })

    statNumbers.forEach(el => statsObserver.observe(el))
  }



  /* ── MAGIC CARDS (mouse-tracking gradient spotlight) ──── */
  const magicCards = document.querySelectorAll('.magic-card')
  magicCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    })
  })

  /* ── FAQ ACCORDION ────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq__item')
  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question')
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open')
      // Close all
      faqItems.forEach(i => i.classList.remove('is-open'))
      // Open clicked if was closed
      if (!isOpen) item.classList.add('is-open')
    })
  })

  /* ── ACTIVE NAV LINKS (section intersection) ──────────── */
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.nav__links a[href*="#"]')

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(`#${id}`))
          })
        }
      })
    }, { threshold: 0.35, rootMargin: '-80px 0px' })

    sections.forEach(section => sectionObserver.observe(section))
  }

  /* ── SMOOTH SCROLL for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'))
      if (target) {
        e.preventDefault()
        const offset = 80 // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    })
  })

  /* ── CONTACT FORM ─────────────────────────────────────── */
  const contactForm = document.querySelector('#contact-form')
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault()
      const formInner = contactForm.querySelector('.form__fields')
      const success = contactForm.querySelector('.form__success')
      if (formInner) formInner.style.display = 'none'
      if (success) success.classList.add('is-visible')
    })
  }

  /* ── MARQUEE — duplicate content for seamless loop ────── */
  // The marquee HTML already has 2 copies; this verifies it's present
  const trustTrack = document.querySelector('.trust-bar__track')
  if (trustTrack && trustTrack.children.length > 0) {
    // If not already duplicated (for SSR/JS-off fallback), clone the items
    const existingItems = trustTrack.querySelectorAll('.trust-bar__group')
    if (existingItems.length < 2) {
      const clone = trustTrack.querySelector('.trust-bar__group')?.cloneNode(true)
      if (clone) trustTrack.appendChild(clone)
    }
  }

})
