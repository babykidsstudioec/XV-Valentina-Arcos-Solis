/* BabyKids Studio Fotográfico — Valentina Arcos Solís XV | Interacciones */
(() => {
  'use strict';
  const cfg = window.BABYKIDS_XV || {};
  const $ = id => document.getElementById(id);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const max = Math.max(1, Math.min(4, Number(cfg.maxPersonas) || 1));
  let opened = false, submitting = false;

  // Siempre mostrar el sobre e iniciar arriba cuando se reabre la invitación.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const gate = $('gate');
  const openButton = $('open-envelope');
  const sealButton = $('open-seal');
  document.body.classList.add('locked');
  function scrollTopNow() {
    const doc = document.documentElement;
    const previous = doc.style.scrollBehavior;
    doc.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    doc.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => doc.style.scrollBehavior = previous);
  }
  function resetEnvelope() {
    opened = false;
    gate.hidden = false;
    gate.classList.remove('opening', 'gone');
    openButton.disabled = false;
    if (sealButton) sealButton.disabled = false;
    document.body.classList.add('locked');
    document.body.classList.remove('invitation-open');
    $('storybook').style.transform = '';
    $('music').pause();
    scrollTopNow();
  }
  window.addEventListener('load', scrollTopNow);
  window.addEventListener('pageshow', event => {
    scrollTopNow();
    setTimeout(scrollTopNow, 100);
    if (event.persisted) resetEnvelope();
  });

  // Estrellas móviles alrededor del sobre, independientes de imágenes externas.
  const stars = $('gate-stars');
  if (stars) for (let i = 0; i < 65; i++) {
    const star = document.createElement('span');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = 1 + Math.random() * 2.6;
    star.style.width = star.style.height = `${size}px`;
    star.style.setProperty('--spd', `${2 + Math.random() * 4}s`);
    star.style.animationDelay = `${-Math.random() * 5}s`;
    stars.appendChild(star);
  }

  function magicBurst() {
    const layer = $('floating-sparkles');
    if (!layer) return;
    const quantity = prefersReducedMotion ? 8 : 38;
    for (let i = 0; i < quantity; i++) {
      const part = document.createElement('span');
      part.className = 'flying';
      part.textContent = ['✧', '✦', '❖', '✧', '✿'][i % 5];
      part.style.setProperty('--x', `${i % 2 ? 60 + Math.random() * 38 : Math.random() * 40}vw`);
      part.style.setProperty('--y', `${20 + Math.random() * 66}vh`);
      part.style.setProperty('--d', `${3 + Math.random() * 3}s`);
      part.style.setProperty('--dx', `${-70 + Math.random() * 140}px`);
      part.style.setProperty('--delay', `${Math.random() * 1.0}s`);
      part.style.fontSize = `${12 + Math.random() * 23}px`;
      layer.appendChild(part);
      setTimeout(() => part.remove(), 7500);
    }
  }
  const music = $('music');
  const musicButton = $('music-toggle');
  async function startMusic() {
    try { music.volume = 0.48; await music.play(); }
    catch { /* El botón Música sigue disponible si el móvil bloquea el inicio automático. */ }
  }
  function syncMusic() {
    const playing = !music.paused;
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
    musicButton.querySelector('.music-icon').textContent = playing ? 'Ⅱ' : '♫';
    $('music-text').textContent = playing ? 'Pausar' : 'Música';
  }
  musicButton.addEventListener('click', () => music.paused ? startMusic() : music.pause());
  music.addEventListener('play', syncMusic);
  music.addEventListener('pause', syncMusic);
  function openInvitation() {
    if (opened) return;
    opened = true;
    openButton.disabled = true;
    if (sealButton) sealButton.disabled = true;
    gate.classList.add('opening');
    startMusic();
    setTimeout(() => {
      scrollTopNow();
      document.body.classList.remove('locked');
      document.body.classList.add('invitation-open');
      gate.classList.add('gone');
      magicBurst();
      requestAnimationFrame(scrollTopNow);
      setTimeout(() => gate.hidden = true, prefersReducedMotion ? 80 : 800);
    }, prefersReducedMotion ? 650 : 3650);
  }
  openButton.addEventListener('click', openInvitation);
  if (sealButton) sealButton.addEventListener('click', openInvitation);
  // Zona táctil de respaldo: si el navegador considera que el brillo tapa la V, abrir de todas formas.
  $('envelope-stage').addEventListener('click', openInvitation);

  // Movimiento 3D también en pantallas táctiles: solo cuando se toca la portada.
  const book = $('storybook');
  let tiltReset;
  const clearTilt = () => book.style.transform = '';
  function tilt(event) {
    if (!opened || prefersReducedMotion) return;
    const rect = book.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    book.style.transform = `perspective(1500px) rotateX(${(-y * 6).toFixed(1)}deg) rotateY(${(x * 9).toFixed(1)}deg) translateZ(11px)`;
    clearTimeout(tiltReset);
    tiltReset = setTimeout(clearTilt, 750);
  }
  book.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') tilt(e); });
  book.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') tilt(e); });
  book.addEventListener('pointerup', clearTilt);
  book.addEventListener('pointerleave', clearTilt);
  book.addEventListener('pointercancel', clearTilt);

  // Información real del evento tomada de las referencias suministradas.
  const name = String(cfg.nombre || 'Valentina').trim();
  const surname = String(cfg.apellidos || 'Arcos Solís').trim();
  document.title = `${name} ${surname} | Mis XV años · BabyKids Studio Fotográfico`;
  $('name-heading').textContent = name;
  $('portrait-name').textContent = name;
  $('portrait-surname').textContent = surname.toLocaleUpperCase('es');
  $('message').textContent = String(cfg.mensaje || 'Te invito a vivir conmigo una noche de cuento.');
  $('place-name').textContent = String(cfg.lugar || 'Mall del Sol');
  $('venue-salon').textContent = String(cfg.salon || 'Salón Turquesa II').toLocaleUpperCase('es');
  $('venue-instructions').textContent = 'ⓘ  ' + String(cfg.indicaciones || 'Consulta el acceso con el organizador.');
  if (/^https:\/\//i.test(String(cfg.enlaceMapa || ''))) $('map-link').href = cfg.enlaceMapa;
  const date = String(cfg.fecha || '2027-01-30');
  const hour = String(cfg.hora || '20:00');
  const offset = /^[-+]\d\d:\d\d$/.test(cfg.zonaHorariaUTC) ? cfg.zonaHorariaUTC : '-05:00';
  const timestamp = Date.parse(`${date}T${hour}:00${offset}`);
  if (Number.isFinite(timestamp)) {
    const [y, m, d] = date.split('-').map(Number);
    $('countdown-date').textContent = new Intl.DateTimeFormat('es-EC', {weekday:'long', day:'numeric', month:'long', year:'numeric', timeZone:'UTC'}).format(new Date(Date.UTC(y, m-1, d))).toLocaleUpperCase('es');
    $('event-time').textContent = hour;
  }
  function updateCountdown() {
    if (!Number.isFinite(timestamp)) return;
    let left = Math.max(0, timestamp - Date.now());
    const days = Math.floor(left / 86400000); left %= 86400000;
    const hrs = Math.floor(left / 3600000); left %= 3600000;
    const mins = Math.floor(left / 60000);
    const secs = Math.floor(left % 60000 / 1000);
    [days, hrs, mins, secs].forEach((value, i) => {
      $(['days', 'hours', 'minutes', 'seconds'][i]).textContent = String(value).padStart(2, '0');
    });
    if (Date.now() >= timestamp) $('countdown-message').textContent = '¡Hoy comienza una noche de cuento!';
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Itinerario configurable y animado a medida que aparece en pantalla.
  const timeline = $('timeline');
  const items = Array.isArray(cfg.itinerario) ? cfg.itinerario : [];
  if (items.length) {
    timeline.replaceChildren();
    for (const entry of items) {
      const li = document.createElement('li'); li.className = 'timeline-item';
      const time = document.createElement('span'); time.className = 'timeline-time'; time.textContent = entry.hora || '';
      const dot = document.createElement('span'); dot.className = 'timeline-node'; dot.setAttribute('aria-hidden','true');
      const content = document.createElement('div');
      const title = document.createElement('h3'); title.textContent = entry.titulo || '';
      const detail = document.createElement('p'); detail.textContent = entry.detalle || '';
      content.append(title, detail); li.append(time, dot, content); timeline.appendChild(li);
    }
  }
  const animated = document.querySelectorAll('.reveal, .timeline-item');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }, {threshold:0.08,rootMargin:'0px 0px 5% 0px'});
    animated.forEach((el, i) => { if (el.classList.contains('timeline-item')) el.style.transitionDelay = `${Math.min(i % 5, 4) * 90}ms`;observer.observe(el); });
  } else animated.forEach(el => el.classList.add('visible'));



// ITINERARIO: luz viajera reversible, sincronizada con el desplazamiento táctil.
// Calcula el avance según la posición visible de cada punto (no según un temporizador).
// Compatible con Chrome Android, Safari iOS y las barras dinámicas del navegador.
const timelineSection = document.querySelector('.itinerary-section');
const travelingLight = document.createElement('span');
travelingLight.className = 'timeline-travel-light';
travelingLight.setAttribute('aria-hidden', 'true');
if (timeline) timeline.appendChild(travelingLight);
let scrollTicking = false;

function updateTimelineTrail() {
  scrollTicking = false;
  if (!timeline || !timelineSection) return;
  const timelineItems = [...timeline.querySelectorAll('.timeline-item')];
  if (timelineItems.length < 2) return;

  const box = timeline.getBoundingClientRect();
  if (box.width < 1 || box.height < 1) return;
  const centers = timelineItems.map(item => {
    const circle = item.querySelector('.timeline-node');
    const pointBox = circle?.getBoundingClientRect();
    return pointBox ? {
      x: pointBox.left - box.left + pointBox.width / 2,
      y: pointBox.top - box.top + pointBox.height / 2
    } : null;
  });
  if (centers.some(center => !center)) return;

  // En el móvil visualViewport incluye el espacio visible cuando Chrome/Safari
  // muestran u ocultan sus barras de herramientas. En escritorio equivale a innerHeight.
  const viewport = window.visualViewport;
  const visibleHeight = viewport?.height || window.innerHeight;
  const viewportTop = viewport?.offsetTop || 0;
  const readingLine = viewportTop + visibleHeight * 0.66;
  const readingPosition = readingLine - box.top;
  const first = centers[0].y;
  const length = Math.max(1, centers[centers.length - 1].y - first);
  const progress = Math.max(0, Math.min(1, (readingPosition - first) / length));
  const head = first + progress * length;
  const screenVisible = box.bottom > viewportTop - 10 && box.top < viewportTop + visibleHeight + 10;
  const isTraveling = screenVisible && readingPosition >= first - 42 && readingPosition <= first + length + 42;

  timeline.style.setProperty('--track-x', `${centers[0].x.toFixed(1)}px`);
  timeline.style.setProperty('--track-top', `${first.toFixed(1)}px`);
  timeline.style.setProperty('--track-length', `${length.toFixed(1)}px`);
  timeline.style.setProperty('--light-length', `${(progress * length).toFixed(1)}px`);
  timeline.style.setProperty('--light-y', `${head.toFixed(1)}px`);
  timeline.classList.toggle('light-traveling', isTraveling);

  timelineItems.forEach((item, index) => {
    const passed = readingPosition >= centers[index].y;
    const near = Math.abs(readingPosition - centers[index].y) < 25 && isTraveling;
    item.classList.toggle('is-active', passed);
    item.classList.toggle('is-current', near);
  });
}

function handleScrollTimeline() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updateTimelineTrail);
}

// En móvil algunas fases del scroll táctil no disparan eventos continuos en window.
// Observamos también el touchmove y visualViewport para mantener la luz sincronizada.
window.addEventListener('scroll', handleScrollTimeline, {passive:true});
window.addEventListener('resize', handleScrollTimeline, {passive:true});
window.addEventListener('orientationchange', handleScrollTimeline, {passive:true});
document.addEventListener('scroll', handleScrollTimeline, {passive:true, capture:true});
document.addEventListener('touchmove', handleScrollTimeline, {passive:true});
document.addEventListener('touchend', handleScrollTimeline, {passive:true});
if (window.visualViewport) {
  window.visualViewport.addEventListener('scroll', handleScrollTimeline, {passive:true});
  window.visualViewport.addEventListener('resize', handleScrollTimeline, {passive:true});
}
window.addEventListener('load', () => setTimeout(handleScrollTimeline, 300));
openButton.addEventListener('click', () => setTimeout(handleScrollTimeline, prefersReducedMotion ? 850 : 3950));
handleScrollTimeline();

  // Inclinación 3D sutil en objetos premium, también disponible con el dedo.
  // Nunca interfiere con scroll ni con el formulario.
  for (const stage of document.querySelectorAll('.premium-object-stage')) {
    const art = stage.querySelector('.luxury-object');
    if (!art || prefersReducedMotion) continue;
    let resetId;
    const reset = () => {
      art.style.setProperty('--tilt-x','0deg');
      art.style.setProperty('--tilt-y','0deg');
    };
    const apply = event => {
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const nx = Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1));
      const ny = Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
      art.style.setProperty('--tilt-x',`${(-ny*5).toFixed(2)}deg`);
      art.style.setProperty('--tilt-y',`${(nx*8).toFixed(2)}deg`);
      clearTimeout(resetId);
      resetId=setTimeout(reset,1050);
    };
    stage.addEventListener('pointermove', event => {
      if (event.pointerType === 'mouse') apply(event);
    },{passive:true});
    stage.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') apply(event);
    },{passive:true});
    stage.addEventListener('pointerleave',reset,{passive:true});
    stage.addEventListener('pointercancel',reset,{passive:true});
  }

  // Sobres individuales con posiciones y tiempos distintos; una única capa ligera.
  const giftLayer = $('gift-rain-layer');
  if (giftLayer && !prefersReducedMotion) {
    const count = window.matchMedia('(max-width:680px)').matches ? 8 : 13;
    for (let i=0;i<count;i++) {
      const env=document.createElement('span');
      env.className='gift-faller';
      env.setAttribute('aria-hidden','true');
      env.style.setProperty('--left',`${4 + (i * 61 % 91)}%`);
      env.style.setProperty('--dur',`${6 + (i % 4)*1.25}s`);
      env.style.setProperty('--delay',`${-i*1.5}s`);
      env.style.setProperty('--scale',`${0.54+(i%5)*0.14}`);
      env.style.setProperty('--spin',`${(i%2===0?1:-1)*(9+i*5)}deg`);
      env.style.setProperty('--drift',`${(i%2===0?1:-1)*(30+i*8)}px`);
      giftLayer.appendChild(env);
    }
  }

  // Formulario, con cupo máximo configurable. En esta referencia hay 1 cupo.
  const form = $('rsvp-form');
  const attendance = $('attendance');
  const countField = $('count-field');
  const countInput = $('guest-count');
  const sendButton = $('send-rsvp');
  const feedback = $('form-feedback');
  const endpoint = String(cfg.appsScriptUrl || '').trim();
  const configured = /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec(?:\?.*)?$/i.test(endpoint);
  $('rsvp-cupo').textContent = max === 1 ? 'Hemos reservado 1 cupo en su honor.' : `Hemos reservado hasta ${max} cupos en su honor.`;
  countInput.replaceChildren();
  for (let i = 1; i <= max; i++) {
    const option = document.createElement('option');option.value = String(i);
    option.textContent = `${i} ${i === 1 ? 'persona' : 'personas'}`;countInput.appendChild(option);
  }
  const showCount = () => countField.hidden = max === 1 || attendance.value !== 'si';
  attendance.addEventListener('change', showCount);showCount();
  if (configured) {
    $('demo-notice').hidden = true;
    sendButton.textContent = '✧  ENVIAR MI RESPUESTA EN EL ESPEJO  ✧';
  }
  function setFeedback(message, status='') {
    feedback.textContent = message;feedback.className = 'feedback ' + status;
  }
  function showDone(heading, details) {
    form.hidden = true;$('rsvp-result').hidden = false;
    $('result-heading').textContent = heading;$('result-copy').textContent = details;
    $('rsvp-result').focus({preventScroll:true});
  }
  // Solo ejecutar con la URL real para el NUEVO EVENTO. Nada apunta a Sheets de otras personas.
  function callScript(payload) {
    return new Promise((resolve, reject) => {
      const cb = '__bkvxv' + Date.now().toString(36) + Math.random().toString(36).slice(2,9);
      const script = document.createElement('script');
      let finished = false;
      const timer = setTimeout(() => end(new Error('timeout')), 20000);
      function end(error, result) {if(finished)return;finished=true;clearTimeout(timer);delete window[cb];script.remove();error?reject(error):resolve(result)}
      window[cb] = result => end(null, result);
      script.onerror = () => end(new Error('network'));
      script.src = endpoint + '?' + new URLSearchParams({...payload,callback:cb}).toString();
      script.async = true;document.head.appendChild(script);
    });
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();if (submitting) return;
    const guest = $('guest-name').value.trim().replace(/\s+/g,' ');
    const attending = attendance.value;
    const personCount = attending === 'si' ? Number(countInput.value || 1) : 0;
    const note = $('note').value.trim();
    if (guest.length < 4 || !guest.includes(' ')) {setFeedback('Escribe tu nombre y al menos un apellido.','error');$('guest-name').focus();return}
    if (attending !== 'si' && attending !== 'no') {setFeedback('Selecciona si asistirás o no.','error');attendance.focus();return}
    if (attending === 'si' && (!Number.isInteger(personCount) || personCount < 1 || personCount > max)) {setFeedback(`Solo hay ${max} ${max===1?'cupo disponible':'cupos disponibles'} para esta invitación.`,'error');return}
    if (!configured) {showDone('¡Esta es una demostración!', 'La invitación y el formulario funcionan visualmente, pero NO se guardó ninguna confirmación. Conectaremos Google Sheets exclusivamente para esta quinceañera.');return}
    submitting = true;sendButton.disabled = true;sendButton.textContent = 'ENVIANDO RESPUESTA...';
    setFeedback('Verificando tu nombre y registrando la respuesta...');
    try {
      const reply = await callScript({action:'confirm',name:guest,attendance:attending==='si'?'Confirmado':'No asistirá',adults:personCount,children:0,note});
      if (reply.ok) showDone(attending==='si'?'¡Confirmación recibida!':'¡Gracias por avisarnos!',attending==='si'?'Hemos registrado tu asistencia. ¡Te esperamos en los XV de Valentina!':'Registramos que no podrás asistir. Gracias por responder.');
      else if (reply.code === 'already_answered') showDone('Tu respuesta ya está registrada','Este invitado ya había respondido. El sistema bloquea las confirmaciones duplicadas.');
      else setFeedback(reply.message || 'No pudimos completar el registro. Comunícate con el organizador.','error');
    } catch (err) {
      setFeedback('No pudimos verificar el resultado del envío. Consulta primero la lista del organizador antes de intentarlo otra vez.','error');
      console.warn('BabyKids XV RSVP:',err);
    } finally {
      submitting = false;
      if (!form.hidden) {sendButton.disabled = false;sendButton.textContent = '✧  ENVIAR MI RESPUESTA EN EL ESPEJO  ✧'}
    }
  });
})();
