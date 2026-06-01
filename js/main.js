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

    // Intro (globo + logo) solo la primera vez que se abre la web
    try {
      if (localStorage.getItem('nexo_intro_seen')) {
        loader.style.display = 'none'
        document.body.style.overflow = ''
        return
      }
      localStorage.setItem('nexo_intro_seen', '1')
    } catch (e) { /* localStorage no disponible: mostrar intro igualmente */ }

    // Lock scroll initially
    document.body.style.overflow = 'hidden'

    let phi = 0
    let width = 0
    let globeFaded = false
    let siteRevealed = false

    const onResize = () => {
      width = canvas.offsetWidth || (globeWrap && globeWrap.offsetWidth) || 480
    }
    window.addEventListener('resize', onResize)
    onResize()

    // ── Custom Canvas globe — self-contained, always renders ──
    // A rotating point-cloud sphere with glowing city nodes and animated
    // "nexus" connection arcs. Represents NEXO connecting the world.
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const ctx = canvas.getContext('2d')
    const TEAL = [16, 200, 185]

    // Fibonacci sphere — evenly distributed dots that read as a 3D globe
    const N_DOTS = 760
    const GA = Math.PI * (3 - Math.sqrt(5))
    const dots = []
    for (let i = 0; i < N_DOTS; i++) {
      const y = 1 - (i / (N_DOTS - 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const th = i * GA
      dots.push([Math.cos(th) * r, y, Math.sin(th) * r])
    }

    const toVec = (lat, lon) => {
      const la = lat * Math.PI / 180, lo = lon * Math.PI / 180
      return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]
    }
    const CITIES = [
      [40.4168, -3.7038],  // Madrid
      [48.8566, 2.3522],   // Paris
      [51.5074, -0.1278],  // London
      [40.7128, -74.006],  // New York
      [35.6762, 139.6503], // Tokyo
      [25.2048, 55.2708],  // Dubai
    ].map(c => toVec(c[0], c[1]))
    const LINKS = [[0, 1], [0, 2], [0, 3], [1, 4], [2, 3], [3, 5], [1, 5]]

    const TILT = -0.42, cosT = Math.cos(TILT), sinT = Math.sin(TILT)

    const project = (p, cx, cy, R) => {
      const cp = Math.cos(phi), sp = Math.sin(phi)
      const x = p[0] * cp + p[2] * sp
      const z = -p[0] * sp + p[2] * cp
      const y = p[1]
      const y2 = y * cosT - z * sinT
      const z2 = y * sinT + z * cosT
      const persp = 1 / (1 - z2 * 0.16)
      return { x: cx + x * R * persp, y: cy - y2 * R * persp, z: z2 }
    }

    const slerp = (a, b, t) => {
      let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
      d = Math.max(-1, Math.min(1, d))
      const om = Math.acos(d)
      if (om < 1e-4) return a.slice()
      const s = Math.sin(om), k0 = Math.sin((1 - t) * om) / s, k1 = Math.sin(t * om) / s
      return [a[0] * k0 + b[0] * k1, a[1] * k0 + b[1] * k1, a[2] * k0 + b[2] * k1]
    }

    let raf = 0
    const t0 = performance.now()
    const draw = (now) => {
      const W = canvas.width, H = canvas.height
      const cx = W / 2, cy = H / 2
      const R = Math.min(W, H) * 0.40
      const tt = (now - t0) / 1000
      ctx.clearRect(0, 0, W, H)

      // atmosphere
      const glow = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R * 1.2)
      glow.addColorStop(0, 'rgba(16,200,185,0.12)')
      glow.addColorStop(1, 'rgba(16,200,185,0)')
      ctx.fillStyle = glow
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2); ctx.fill()

      // dotted sphere (depth-shaded)
      for (let i = 0; i < dots.length; i++) {
        const q = project(dots[i], cx, cy, R)
        const front = (q.z + 1) / 2
        ctx.fillStyle = `rgba(${TEAL[0]},${TEAL[1]},${TEAL[2]},${0.1 + front * 0.6})`
        ctx.beginPath(); ctx.arc(q.x, q.y, (0.6 + front * 1.5) * dpr, 0, Math.PI * 2); ctx.fill()
      }

      // nexus arcs + travelling pulse
      for (let l = 0; l < LINKS.length; l++) {
        const a = CITIES[LINKS[l][0]], b = CITIES[LINKS[l][1]]
        ctx.beginPath()
        const SEG = 48
        for (let s = 0; s <= SEG; s++) {
          const t = s / SEG
          const m = slerp(a, b, t)
          const lift = 1 + 0.32 * Math.sin(Math.PI * t)
          const q = project([m[0] * lift, m[1] * lift, m[2] * lift], cx, cy, R)
          s === 0 ? ctx.moveTo(q.x, q.y) : ctx.lineTo(q.x, q.y)
        }
        ctx.strokeStyle = 'rgba(16,200,185,0.30)'
        ctx.lineWidth = 1.1 * dpr
        ctx.stroke()
        const tp = (tt * 0.32 + l * 0.14) % 1
        const mp = slerp(a, b, tp)
        const lp = 1 + 0.32 * Math.sin(Math.PI * tp)
        const qp = project([mp[0] * lp, mp[1] * lp, mp[2] * lp], cx, cy, R)
        ctx.fillStyle = 'rgba(150,255,245,0.95)'
        ctx.beginPath(); ctx.arc(qp.x, qp.y, 2.1 * dpr, 0, Math.PI * 2); ctx.fill()
      }

      // glowing city nodes
      for (let i = 0; i < CITIES.length; i++) {
        const q = project(CITIES[i], cx, cy, R)
        if (q.z < -0.2) continue
        const front = (q.z + 1) / 2
        const pulse = 0.6 + 0.4 * Math.sin(tt * 2 + i)
        const baseR = (2.4 + front * 1.6) * dpr
        ctx.fillStyle = `rgba(16,200,185,${0.16 * pulse})`
        ctx.beginPath(); ctx.arc(q.x, q.y, baseR * 3.4, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgba(205,255,250,${0.7 + front * 0.3})`
        ctx.beginPath(); ctx.arc(q.x, q.y, baseR, 0, Math.PI * 2); ctx.fill()
      }

      phi += 0.0016
      raf = requestAnimationFrame(draw)
    }

    const sizeCanvas = () => {
      const cssW = canvas.offsetWidth || (globeWrap && globeWrap.offsetWidth) || 480
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssW * dpr)
    }

    let globe;

    const startGlobe = () => {
      sizeCanvas()
      window.addEventListener('resize', sizeCanvas)
      raf = requestAnimationFrame(draw)
      globe = {
        destroy: () => {
          cancelAnimationFrame(raf)
          window.removeEventListener('resize', sizeCanvas)
        },
      }
      setTimeout(() => { canvas.style.opacity = '1' }, 300)
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
    if (globeWrap) {
      globeWrap.addEventListener('click', fadeGlobeShowCTA)
    }

    // Start the custom globe immediately
    startGlobe()
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

  /* ── WORD ROTATE ──────────────────────────────────────── */
  const wordRotateContainers = document.querySelectorAll('.word-rotate')
  wordRotateContainers.forEach(container => {
    const words = container.querySelectorAll('.word-rotate__word')
    if (words.length <= 1) return

    let currentIndex = 0
    setInterval(() => {
      const currentWord = words[currentIndex]

      currentWord.classList.remove('word-rotate__word--active')
      currentWord.classList.add('word-rotate__word--out')

      currentIndex = (currentIndex + 1) % words.length
      const nextWord = words[currentIndex]

      nextWord.classList.remove('word-rotate__word--out')

      setTimeout(() => {
        nextWord.classList.add('word-rotate__word--active')
      }, 50)
    }, 2500)
  })

})
