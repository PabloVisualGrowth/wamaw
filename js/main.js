/* ============================================================
   WAMAW TRAVEL GROUP — main.js
   Handles: scroll progress, navbar, mobile menu, scroll reveal,
            counter animation, word rotate, magic cards, FAQ,
            contact form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── GLOBE PRELOADER & SCROLL REVEAL ───────────────────── */
  const initLoader = () => {
    const canvas = document.getElementById('globe-canvas')
    const loader = document.getElementById('preloader')
    const globeWrap = document.getElementById('globe-container')
    const ctaWrap = document.getElementById('preloader-cta')
    const ctaForm = document.getElementById('preloader-form')
    const skipBtn = document.getElementById('skip-cta-btn')

    if (!canvas || !loader) return

    // Lock scroll initially
    document.body.style.overflow = 'hidden'

    let phi = 0
    let width = 0
    let globeFaded = false
    let siteRevealed = false

    const onResize = () => {
      width = canvas.offsetWidth
    }
    window.addEventListener('resize', onResize)
    onResize()

    // Config based on user request (MagicUI/Cobe)
    const GLOBE_CONFIG = {
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        state.phi = phi
        phi += 0.005
        state.width = width * 2
        state.height = width * 2
      },
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [40.4168, -3.7038], size: 0.05 }, // Madrid
        { location: [40.7128, -74.006], size: 0.07 }, // NY
        { location: [35.6762, 139.6503], size: 0.07 }, // Tokyo
        { location: [-23.5505, -46.6333], size: 0.07 }, // Sao Paulo
        { location: [25.2048, 55.2708], size: 0.07 }, // Dubai
      ],
    }

    let globe;

    const startGlobe = () => {
      globe = window.createGlobe(canvas, GLOBE_CONFIG)

      // Fade in symbols
      setTimeout(() => {
        canvas.style.opacity = '1'
      }, 500)
    }

    // Step 1: Fade out globe and logo simultaneously, then show CTA
    const fadeGlobeShowCTA = () => {
      if (globeFaded) return
      globeFaded = true

      // Cleanup initial scroll listeners
      window.removeEventListener('wheel', handleInteraction)
      window.removeEventListener('touchmove', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)

      // Fade out globe wrapper (which contains both canvas and logo)
      if (globeWrap) {
        globeWrap.style.transition = 'opacity 1s ease-out'
        globeWrap.style.opacity = '0'

        setTimeout(() => {
          globeWrap.style.display = 'none'
          if (globe) globe.destroy()

          // Show CTA
          if (ctaWrap) {
            ctaWrap.classList.remove('is-hidden')
            ctaWrap.classList.add('is-visible')
          } else {
            finalizeEntry()
          }
        }, 1000) // 1s transition
      }
    }

    // Step 2: Finalize entry to main site
    const finalizeEntry = () => {
      if (siteRevealed) return
      siteRevealed = true

      // Fade out CTA specifically before hiding the whole loader
      if (ctaWrap) {
        ctaWrap.classList.remove('is-visible')
        ctaWrap.style.opacity = '0'
      }

      setTimeout(() => {
        loader.classList.add('is-hidden')
        document.body.style.overflow = ''

        setTimeout(() => {
          window.dispatchEvent(new Event('scroll'))
        }, 800)
      }, 500) // Wait for CTA fade out
    }

    // CTA Events
    if (ctaForm) {
      ctaForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const btn = ctaForm.querySelector('button[type="submit"]')
        btn.textContent = 'Enviando...'
        setTimeout(() => {
          btn.textContent = '¡Gracias!'
          setTimeout(finalizeEntry, 800)
        }, 1000)
      })
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', finalizeEntry)
    }

    const handleInteraction = (e) => {
      if (globeFaded) return
      // Trigger sequence only on scroll down or swipe up
      if (e.type === 'wheel' && e.deltaY > 0) fadeGlobeShowCTA()
      if (e.type === 'touchmove') fadeGlobeShowCTA()
      if (e.type === 'keydown' && (e.key === 'ArrowDown' || e.key === ' ')) fadeGlobeShowCTA()
    }

    window.addEventListener('wheel', handleInteraction, { passive: true })
    window.addEventListener('touchmove', handleInteraction, { passive: true })
    window.addEventListener('keydown', handleInteraction)

    // Initialization check
    if (window.createGlobe) {
      startGlobe()
    } else {
      const checkCobe = setInterval(() => {
        if (window.createGlobe) {
          clearInterval(checkCobe)
          startGlobe()
        }
      }, 100)
    }
  }

  initLoader()


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
