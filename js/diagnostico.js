/* ============================================================
   NEXO — Autodiagnóstico de Movilidad Corporativa (Scorecard)
   15 preguntas · Bloque 1 (1-10) puntúa eficiencia ·
   Bloque 2 (11-15) califica negocio y presupuesto.
   ============================================================ */
(function () {
  'use strict';

  // ── Question set ──
  // type 'scored': cuenta para el % de eficiencia (score 0/1/2)
  // type 'choice': califica (no puntúa, enruta el CTA)
  // type 'open': caja abierta
  const Q = [
    // ─── BLOQUE 1 · Tu operativa actual (puntúa) ───
    {
      block: 1, type: 'scored', area: 'Política de viajes',
      q: '¿Tu empresa tiene una política de viajes escrita y actualizada?',
      adviceLow: 'Sin una política clara, cada empleado reserva a su manera. Estandarizarla es la palanca nº1 de ahorro y control.',
      o: [
        { t: 'Sí, formal y actualizada cada año', s: 2 },
        { t: 'Existe, pero está desactualizada', s: 1 },
        { t: 'No tenemos política escrita', s: 0 },
      ],
    },
    {
      block: 1, type: 'scored', area: 'Centralización',
      q: '¿Centralizas todas las reservas en un único canal o proveedor?',
      adviceLow: 'Reservar por canales dispersos dispara el coste y elimina la trazabilidad. Un único punto lo cambia todo.',
      o: [
        { t: 'Sí, todo pasa por un único canal', s: 2 },
        { t: 'En parte, depende del viaje', s: 1 },
        { t: 'No, cada uno reserva por su cuenta', s: 0 },
      ],
    },
    {
      block: 1, type: 'scored', area: 'Soporte 24/7',
      q: '¿Tienes una persona localizable cuando algo falla fuera de horario?',
      adviceLow: 'Una incidencia a las 23h sin nadie al otro lado cuesta dinero y reputación. El soporte real es 24/7.',
      o: [
        { t: 'Sí, soporte 24/7 los 365 días', s: 2 },
        { t: 'Solo en horario de oficina', s: 1 },
        { t: 'No, lo resuelve el propio viajero', s: 0 },
      ],
    },
    {
      block: 1, type: 'scored', area: 'Tarifas negociadas',
      q: '¿Accedes a tarifas corporativas negociadas con aerolíneas y hoteles?',
      adviceLow: 'Sin tarifas negociadas pagas precio de mostrador. Aquí suele esconderse hasta un 20-25% de sobrecoste.',
      o: [
        { t: 'Sí, negociaciones activas', s: 2 },
        { t: 'Algunas, no de forma sistemática', s: 1 },
        { t: 'No, pagamos tarifa pública', s: 0 },
      ],
    },
    {
      block: 1, type: 'scored', area: 'Visibilidad del gasto',
      q: '¿Tienes visibilidad del gasto en viajes en tiempo real?',
      adviceLow: 'Si no ves el gasto hasta que llega la factura, no decides: reaccionas. El reporting en vivo te devuelve el control.',
      o: [
        { t: 'Sí, dashboard en tiempo real', s: 2 },
        { t: 'Solo informes mensuales', s: 1 },
        { t: 'No tengo visibilidad clara', s: 0 },
      ],
    },
    {
      block: 1, type: 'scored', area: 'Gestión de incidencias',
      q: '¿Cómo gestionas los cambios e incidencias en ruta?',
      adviceLow: 'Encadenar llamadas a varios proveedores en plena incidencia quema horas y nervios. Un gestor único lo absorbe.',
      o: [
        { t: 'Equipo dedicado que lo resuelve', s: 2 },
        { t: 'Llamando a varios proveedores', s: 1 },
        { t: 'Lo resuelve el propio viajero', s: 0 },
      ],
    },
    {
      block: 1, type: 'scored', area: 'Sostenibilidad',
      q: '¿Mides y compensas la huella de carbono de los desplazamientos?',
      adviceLow: 'Cada vez más clientes y licitaciones lo exigen. Medir la huella ya no es opcional, es ventaja competitiva.',
      o: [
        { t: 'Sí, la medimos y compensamos', s: 2 },
        { t: 'La medimos, no compensamos', s: 1 },
        { t: 'No lo medimos', s: 0 },
      ],
    },
    {
      block: 1, type: 'scored', area: 'Conciliación de facturas',
      q: '¿Cómo concilias las facturas de viaje con la contabilidad?',
      adviceLow: 'La conciliación manual de viajes es un agujero de horas administrativas. Automatizarla libera a tu equipo.',
      o: [
        { t: 'Conciliación automática centralizada', s: 2 },
        { t: 'Manual, pero ordenada', s: 1 },
        { t: 'Es un caos cada cierre', s: 0 },
      ],
    },
    {
      block: 1, type: 'scored', area: 'Herramienta para el equipo',
      q: '¿El equipo dispone de una app para gestionar sus viajes?',
      adviceLow: 'Sin una app propia, todo pasa por email y llamadas. Una herramienta self-service multiplica la eficiencia.',
      o: [
        { t: 'Sí, con app propia', s: 2 },
        { t: 'A veces, herramientas sueltas', s: 1 },
        { t: 'No, todo por email/teléfono', s: 0 },
      ],
    },
    {
      block: 1, type: 'scored', area: 'Optimización con datos',
      q: '¿Usas los datos de viajes para optimizar tu política cada año?',
      adviceLow: 'Los datos que no se revisan no ahorran. Una revisión periódica convierte el histórico en decisiones de ahorro.',
      o: [
        { t: 'Sí, revisión periódica con datos', s: 2 },
        { t: 'Alguna vez lo hemos mirado', s: 1 },
        { t: 'Nunca lo analizamos', s: 0 },
      ],
    },

    // ─── BLOQUE 2 · Tu empresa y objetivos (califica) ───
    {
      block: 2, type: 'choice', key: 'volumen',
      q: '¿Cuántos viajes gestiona tu empresa al mes, aproximadamente?',
      o: [
        { t: 'Entre 1 y 5', v: 'bajo' },
        { t: 'Entre 6 y 20', v: 'medio' },
        { t: 'Entre 21 y 50', v: 'alto' },
        { t: 'Más de 50', v: 'muy-alto' },
      ],
    },
    {
      block: 2, type: 'choice', key: 'objetivo',
      q: '¿Cuál es tu prioridad para los próximos 90 días?',
      o: [
        { t: 'Reducir el coste de los viajes', v: 'coste' },
        { t: 'Quitarme el caos operativo de encima', v: 'caos' },
        { t: 'Tener reporting y control real', v: 'control' },
        { t: 'Viajar de forma más sostenible', v: 'sostenibilidad' },
      ],
    },
    {
      block: 2, type: 'choice', key: 'dolor',
      q: '¿Cuál es hoy tu mayor obstáculo?',
      o: [
        { t: 'No tengo tiempo para gestionarlo', v: 'tiempo' },
        { t: 'El coste se me dispara', v: 'coste' },
        { t: 'No tengo control ni visibilidad', v: 'control' },
        { t: 'El servicio actual me falla', v: 'servicio' },
      ],
    },
    {
      block: 2, type: 'choice', key: 'preferencia',
      q: '¿Cómo prefieres resolverlo?',
      o: [
        { t: 'Quiero que lo hagan por mí, llave en mano', v: 'dfy' },
        { t: 'Quiero apoyo pero seguir implicado', v: 'mixto' },
        { t: 'Prefiero aprender a optimizarlo yo', v: 'diy' },
      ],
    },
    {
      block: 2, type: 'open', key: 'extra',
      q: '¿Hay algo más que debamos saber para ayudarte mejor?',
      placeholder: 'Opcional — cuéntanos cualquier detalle relevante de tu operativa…',
    },
  ];

  const answers = new Array(Q.length).fill(null);
  let i = 0;

  // ── DOM ──
  const el = (id) => document.getElementById(id);
  const quiz = el('dx-quiz'), results = el('dx-results');
  const $fill = el('dx-fill'), $count = el('dx-count'), $block = el('dx-block');
  const $q = el('dx-question'), $opts = el('dx-options');
  const $back = el('dx-back'), $hint = el('dx-hint');
  if (!quiz) return;

  function render() {
    const item = Q[i];
    $count.textContent = (i + 1) + ' / ' + Q.length;
    $fill.style.width = ((i) / Q.length * 100) + '%';
    $block.textContent = item.block === 1
      ? 'Bloque 1 · Tu operativa actual'
      : 'Bloque 2 · Tu empresa y objetivos';
    $q.textContent = item.q;
    $back.disabled = i === 0;
    $opts.innerHTML = '';

    if (item.type === 'open') {
      const ta = document.createElement('textarea');
      ta.className = 'dx__textarea';
      ta.placeholder = item.placeholder || '';
      ta.value = answers[i] && answers[i].text ? answers[i].text : '';
      ta.addEventListener('input', () => { answers[i] = { text: ta.value }; });
      $opts.appendChild(ta);
      $hint.innerHTML = '';
      const finish = mkButton('Ver mi resultado →', () => {
        if (!answers[i]) answers[i] = { text: ta.value || '' };
        showResults();
      });
      $hint.appendChild(finish);
      return;
    }

    $hint.textContent = 'Selecciona una opción para continuar';
    item.o.forEach((opt, idx) => {
      const b = document.createElement('button');
      b.className = 'dx__opt' + (answers[i] && answers[i].idx === idx ? ' is-selected' : '');
      b.innerHTML = '<span class="dx__opt-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><span>' + opt.t + '</span>';
      b.addEventListener('click', () => {
        answers[i] = { idx: idx, score: opt.s, v: opt.v };
        // visual select then auto-advance
        Array.from($opts.children).forEach(c => c.classList.remove('is-selected'));
        b.classList.add('is-selected');
        setTimeout(next, 230);
      });
      $opts.appendChild(b);
    });
  }

  function mkButton(label, fn) {
    const b = document.createElement('button');
    b.className = 'dx__opt';
    b.style.justifyContent = 'center';
    b.style.borderColor = 'var(--c-primary)';
    b.style.background = 'rgba(11,180,170,.14)';
    b.style.fontWeight = '700';
    b.style.maxWidth = '260px';
    b.textContent = label;
    b.addEventListener('click', fn);
    return b;
  }

  function next() {
    if (i < Q.length - 1) { i++; render(); }
    else showResults();
  }
  $back.addEventListener('click', () => { if (i > 0) { i--; render(); } });

  // ── Results ──
  function showResults() {
    // score from block 1
    let pts = 0, max = 0;
    const low = [];
    Q.forEach((item, idx) => {
      if (item.type !== 'scored') return;
      max += 2;
      const a = answers[idx];
      const s = a ? a.score : 0;
      pts += s;
      if (s <= 1) low.push({ area: item.area, advice: item.adviceLow, s: s });
    });
    const pct = max ? Math.round(pts / max * 100) : 0;

    quiz.classList.add('is-hidden-dx');
    results.classList.remove('is-hidden-dx');
    $fill.style.width = '100%';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // verdict
    let verdict, vtext;
    if (pct >= 75) {
      verdict = 'Operativa sólida — con margen de ventaja';
      vtext = 'Gestionas la movilidad mejor que la mayoría. Los detalles que aún se te escapan son justo los que separan a las empresas eficientes de las excelentes.';
    } else if (pct >= 45) {
      verdict = 'Operativa a medias — estás dejando valor sobre la mesa';
      vtext = 'Haces algunas cosas bien, pero hay fugas claras de coste, tiempo y control. La buena noticia: son las más rápidas de corregir.';
    } else {
      verdict = 'Operativa de alto riesgo — pierdes en silencio';
      vtext = 'Tu empresa está asumiendo sobrecostes e incidencias evitables cada mes. Es el punto donde más rápido se nota un cambio de modelo.';
    }
    el('dx-verdict').textContent = verdict;
    el('dx-verdict-text').textContent = vtext;

    // animate ring + number
    const C = 326.7;
    requestAnimationFrame(() => {
      el('dx-ring').style.strokeDashoffset = (C - C * pct / 100).toFixed(1);
    });
    animateNum(el('dx-score'), pct);

    // insights — 3 weakest areas (or strengths if none)
    const box = el('dx-insights');
    box.innerHTML = '';
    let picks = low.sort((a, b) => a.s - b.s).slice(0, 3);
    if (picks.length === 0) {
      picks = [{ area: 'Mantén la ventaja', advice: 'Tu base es excelente. El siguiente nivel es exprimir los datos para anticipar y negociar aún mejor cada año.' }];
    }
    const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
    picks.forEach(p => {
      const d = document.createElement('div');
      d.className = 'dx__insight';
      d.innerHTML = icon + '<div><h4>' + p.area + '</h4><p>' + p.advice + '</p></div>';
      box.appendChild(d);
    });

    // ── Differentiated CTA (budget logic §5) ──
    const pref = pick('preferencia');
    const vol = pick('volumen');
    const highValue = pref === 'dfy' || vol === 'alto' || vol === 'muy-alto';

    if (highValue) {
      el('dx-cta-title').textContent = 'Tienes el perfil para una consultoría 1:1';
      el('dx-cta-text').textContent = 'Por volumen y objetivos, lo más rentable es una sesión gratuita de 30 min donde te mostramos, con tus números, cuánto puedes ahorrar y cómo lo gestionaríamos en 90 días. Déjanos tus datos y te llamamos.';
      setLabel('Reservar mi consultoría gratuita');
    } else {
      el('dx-cta-title').textContent = 'Te preparamos un plan de mejora a medida';
      el('dx-cta-text').textContent = 'Con tus respuestas podemos enviarte recomendaciones concretas para optimizar tu operativa. Cuéntanos dónde te enviamos el plan y damos el primer paso, sin compromiso.';
      setLabel('Recibir mi plan de mejora');
    }
  }

  // ── Lead capture (results form) ──
  const leadForm = el('dx-lead');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      leadForm.classList.add('is-hidden-dx');
      const ok = el('dx-success');
      if (ok) ok.classList.remove('is-hidden-dx');
    });
  }

  function pick(key) {
    const idx = Q.findIndex(x => x.key === key);
    return idx >= 0 && answers[idx] ? answers[idx].v : null;
  }
  function setLabel(t) {
    el('dx-cta-label').textContent = t;
    el('dx-cta-label2').textContent = t;
  }
  function animateNum(node, target) {
    const dur = 1200, t0 = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      node.textContent = Math.round(ease(p) * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  render();
})();
