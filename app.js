(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
  };
  const $ = (id) => document.getElementById(id);

  // Each tool: board area, accent colour, icon, live URL and a mini preview of what it does
  const TOOLS = [
    { id: 'excel', icon: 'bi-bar-chart-line-fill', c: '#22c55e', url: 'https://devlewiso.github.io/excel-tool/', pv: 'excel' },
    { id: 'tasker', icon: 'bi-kanban-fill', c: '#f59e0b', url: 'https://devlewiso.github.io/tasker-manager/', pv: 'tasker' },
    { id: 'time', icon: 'bi-stopwatch-fill', c: '#ec4899', url: 'https://devlewiso.github.io/timer-tracker/', pv: 'time' },
    { id: 'audio', icon: 'bi-soundwave', c: '#6366f1', url: 'https://devlewiso.github.io/futuristic-audio-player/', pv: 'audio' },
    { id: 'webp', icon: 'bi-file-earmark-zip-fill', c: '#2dd4bf', url: 'https://devlewiso.github.io/img-webp/', pv: 'webp' },
    { id: 'profile', icon: 'bi-person-badge-fill', c: '#8b5cf6', url: 'https://eduguate.github.io/perfilUpdated/', pv: 'profile' },
    { id: 'video', icon: 'bi-youtube', c: '#ef4444', url: 'https://devlewiso.github.io/yt-downloader/', pv: 'video' },
  ];
  const LAB = [['counter', 'bi-calculator'], ['code', 'bi-code-slash'], ['resize', 'bi-aspect-ratio'], ['calendar', 'bi-calendar3'], ['notes', 'bi-journal-text'], ['weather', 'bi-cloud-sun']];

  const T = {
    es: {
      freeBar: 'Dashboard 100% gratis', freeRepo: 'Ver en GitHub', osTitle: 'Hazlo tuyo. Gratis.', osBtn: 'Descargar en GitHub',
      osDesc: 'Este dashboard es una plantilla gratuita: HTML, CSS y JavaScript sin dependencias pesadas. Cambia las herramientas y úsalo para tu empresa. Licencia MIT.',
      title: 'Tus herramientas,<br>en un solo rincón.', searchHint: 'Buscar una herramienta…', statLive: 'activas', statFree: 'para siempre',
      open: 'Abrir', favHint: 'Marca ★ tus favoritas', favAdd: 'añadida a favoritas', favDel: 'quitada de favoritas', noResults: 'Sin resultados',
      labTitle: 'En el laboratorio', labDesc: 'Herramientas que vienen en camino',
      greet: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Buenas noches'], today: 'hoy', saved: 'ahorrado',
      tools: {
        excel: ['Análisis de Excel', 'Visualiza tus hojas en segundos'], tasker: ['Gestor de Tareas', 'Organiza proyectos en tablero'],
        time: ['Tiempo y Asistencia', 'Registra tus horas'], audio: ['Reproductor de Audio', 'Música con visualizador en vivo'],
        webp: ['Conversor WebP', 'Imágenes más livianas'], profile: ['Perfil del Empleado', 'Tu ficha profesional'],
        video: ['Descargador de Video', 'Guarda videos offline'],
      },
      lab: { counter: 'Contador de palabras', code: 'Editor de código', resize: 'Redimensionar', calendar: 'Calendario', notes: 'Notas', weather: 'Clima' },
      kanban: ['Por hacer', 'En curso', 'Listo'],
    },
    en: {
      freeBar: '100% free dashboard', freeRepo: 'View on GitHub', osTitle: 'Make it yours. Free.', osBtn: 'Download on GitHub',
      osDesc: 'This dashboard is a free template: plain HTML, CSS and JavaScript with no heavy dependencies. Swap the tools and use it for your company. MIT license.',
      title: 'Your tools,<br>in one corner.', searchHint: 'Search a tool…', statLive: 'live', statFree: 'forever',
      open: 'Open', favHint: 'Star ★ your favorites', favAdd: 'added to favorites', favDel: 'removed from favorites', noResults: 'No results',
      labTitle: 'In the lab', labDesc: 'Tools on the way',
      greet: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'], today: 'today', saved: 'saved',
      tools: {
        excel: ['Excel Analytics', 'Visualize sheets in seconds'], tasker: ['Task Manager', 'Organize projects on a board'],
        time: ['Time & Attendance', 'Track your hours'], audio: ['Audio Player', 'Music with a live visualizer'],
        webp: ['WebP Converter', 'Lighter images'], profile: ['Employee Profile', 'Your professional card'],
        video: ['Video Downloader', 'Save videos offline'],
      },
      lab: { counter: 'Word counter', code: 'Code editor', resize: 'Image resizer', calendar: 'Calendar', notes: 'Notes', weather: 'Weather' },
      kanban: ['To do', 'Doing', 'Done'],
    },
  };

  let lang = store.get('ic-lang', (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en');
  let theme = store.get('ic-theme', 'dark');
  let favs = store.get('ic-favs', []).filter((id) => TOOLS.some((x) => x.id === id));
  const t = () => T[lang];
  document.documentElement.dataset.theme = theme;
  $('year').textContent = new Date().getFullYear();

  const rand = (i) => (Math.sin(i * 12.9898) * 43758.5453) % 1; // deterministic pseudo-random
  const preview = (x) => {
    const k = t().kanban;
    switch (x.pv) {
      case 'excel':
        return `<div class="pv pv-bars">${[38, 62, 45, 80, 58, 92, 70, 100, 76, 88].map((h, i) => `<i style="--h:${h}%;--d:${-i * 0.35}s"></i>`).join('')}</div>
          <div class="pv-sum"><b>12,480</b><small>▲ 18.4%</small></div>`;
      case 'tasker':
        return `<div class="pv pv-kanban">
          <div class="pv-col"><small>${k[0]}</small><i class="accent mover"></i><i></i><i></i><i></i><i></i></div>
          <div class="pv-col"><small>${k[1]}</small><i></i><i class="accent"></i><i></i></div>
          <div class="pv-col"><small>${k[2]}</small><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`;
      case 'time':
        return `<div class="pv pv-time"><div class="pv-ring"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="36"/><circle class="p" id="ring" cx="42" cy="42" r="36"/></svg></div>
          <div class="pv-digits"><span id="timer">06:42:18</span><small>${t().today}</small></div></div>`;
      case 'audio':
        return `<div class="pv pv-wave">${Array.from({ length: 34 }, (_, i) => `<i style="--h:${30 + Math.abs(rand(i + 1)) * 70}%;--d:${-Math.abs(rand(i + 7)) * 1.1}s"></i>`).join('')}</div>
          <span class="pv-play"><i class="bi bi-play-fill"></i></span>`;
      case 'webp':
        return `<div class="pv-comp"><div class="pv-row"><span>PNG</span><span class="bar"><i></i></span><span>2.4 MB</span></div>
          <div class="pv-row after"><span>WebP</span><span class="bar"><i></i></span><span>0.4 MB</span></div>
          <span class="pv-save">−83% ${t().saved}</span></div>`;
      case 'profile':
        return `<div class="pv-profile"><span class="pv-avatar">IC</span><span class="pv-lines"><i></i><i></i><em>RR.HH.</em></span></div>`;
      case 'video':
        return '<div class="pv-video"><b><i class="bi bi-download"></i></b><span></span></div>';
      default: return '';
    }
  };

  const board = $('board');
  const renderTiles = () => {
    board.querySelectorAll('.tool, .lab').forEach((n) => n.remove());
    const html = TOOLS.map((x, i) => {
      const [name, desc] = t().tools[x.id];
      const fav = favs.includes(x.id);
      return `<article class="tile tool" data-area="${x.id}" style="--c:${x.c};--i:${i + 1}">
        <div class="t-head"><span class="t-icon"><i class="bi ${x.icon}"></i></span>
          <div class="t-title"><h2>${name}</h2><p>${desc}</p></div>
          <button class="fav" type="button" data-fav="${x.id}" aria-pressed="${fav}" aria-label="★ ${name}"><i class="bi ${fav ? 'bi-star-fill' : 'bi-star'}"></i></button></div>
        <div class="t-body">${preview(x)}</div>
        <span class="t-open">${t().open} <i class="bi bi-arrow-up-right"></i></span>
        <a class="stretched" href="${x.url}" target="_blank" rel="noopener" aria-label="${t().open} ${name}"></a>
      </article>`;
    }).join('') + `<section class="tile lab" style="--i:${TOOLS.length + 1}" aria-labelledby="lab-t">
        <h2 id="lab-t"><i class="bi bi-stars"></i>${t().labTitle}</h2><p>${t().labDesc}</p>
        <ul>${LAB.map(([id, icon]) => `<li><i class="bi ${icon}"></i>${t().lab[id]}</li>`).join('')}</ul></section>`;
    board.insertAdjacentHTML('beforeend', html);
    tickTimer();
  };

  const renderFavs = () => {
    $('favs').innerHTML = favs.length
      ? favs.map((id) => { const x = TOOLS.find((y) => y.id === id); return `<a href="${x.url}" target="_blank" rel="noopener"><i class="bi ${x.icon}"></i>${t().tools[id][0]}</a>`; }).join('')
      : `<span>${t().favHint}</span>`;
  };

  const renderText = () => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t()[el.dataset.i18n]; });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t()[el.dataset.i18nHtml]; });
    $('palette-q').placeholder = t().searchHint;
    $('lang-label').textContent = lang === 'es' ? 'EN' : 'ES';
    $('stat-live').textContent = TOOLS.length;
    $('greeting').textContent = t().greet[Math.floor(new Date().getHours() / 6)];
  };
  const renderAll = () => { renderText(); renderTiles(); renderFavs(); };

  // Live clock + running timer preview
  const clock = () => { $('clock').textContent = new Date().toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' }); };
  const start = Date.now() - ((6 * 3600 + 42 * 60 + 18) * 1000);
  function tickTimer() {
    const el = $('timer'); const ring = $('ring'); if (!el) return;
    const s = Math.floor((Date.now() - start) / 1000);
    el.textContent = [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':');
    ring.style.strokeDashoffset = String(226 - 226 * ((s % 28800) / 28800)); // progress of an 8 h day
  }
  renderAll(); clock();
  setInterval(clock, 20000);
  if (!reduce) setInterval(tickTimer, 1000);

  const toast = (msg) => {
    const el = $('toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
  };

  // Controls
  $('lang-toggle').addEventListener('click', () => { lang = lang === 'es' ? 'en' : 'es'; store.set('ic-lang', lang); renderAll(); clock(); });
  const themeIcon = () => { $('theme-toggle').innerHTML = `<i class="bi ${theme === 'dark' ? 'bi-moon-stars' : 'bi-sun'}"></i>`; };
  themeIcon();
  $('theme-toggle').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark'; store.set('ic-theme', theme);
    document.documentElement.dataset.theme = theme; themeIcon();
  });
  board.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fav]'); if (!b) return;
    const id = b.dataset.fav; const on = !favs.includes(id);
    favs = on ? [...favs, id] : favs.filter((f) => f !== id);
    store.set('ic-favs', favs);
    b.setAttribute('aria-pressed', String(on)); b.innerHTML = `<i class="bi ${on ? 'bi-star-fill' : 'bi-star'}"></i>`;
    renderFavs(); toast(`${t().tools[id][0]} ${on ? t().favAdd : t().favDel}`);
  });

  // Spotlight follows the pointer on tool tiles
  if (finePointer && !reduce) {
    board.addEventListener('pointermove', (e) => {
      const tile = e.target.closest('.tool'); if (!tile) return;
      const r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${e.clientX - r.left}px`); tile.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }

  // Command palette (Ctrl/Cmd + K)
  const palette = $('palette'); const q = $('palette-q'); const plist = $('palette-list');
  let sel = 0; let results = [];
  const renderPalette = () => {
    const term = q.value.trim().toLowerCase();
    results = TOOLS.filter((x) => t().tools[x.id].join(' ').toLowerCase().includes(term));
    sel = Math.min(sel, Math.max(results.length - 1, 0));
    plist.innerHTML = results.length ? results.map((x, i) => {
      const [name, desc] = t().tools[x.id];
      return `<li role="option" aria-selected="${i === sel}" class="${i === sel ? 'sel' : ''}"><a href="${x.url}" target="_blank" rel="noopener"><i class="bi ${x.icon}" style="--c:${x.c}"></i><span>${name}<small>${desc}</small></span></a></li>`;
    }).join('') : `<li class="none">${t().noResults}</li>`;
  };
  const openPalette = () => { q.value = ''; sel = 0; renderPalette(); palette.showModal(); q.focus(); };
  $('open-search').addEventListener('click', openPalette);
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (palette.open) palette.close(); else openPalette(); }
  });
  q.addEventListener('input', () => { sel = 0; renderPalette(); });
  q.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, results.length - 1); renderPalette(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); renderPalette(); }
    if (e.key === 'Enter' && results[sel]) { window.open(results[sel].url, '_blank', 'noopener'); palette.close(); }
  });
  palette.addEventListener('click', (e) => { if (e.target === palette) palette.close(); });
})();
