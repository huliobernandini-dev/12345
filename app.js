/* ── Parallax scroll ── */
var BASE_URL = window.location.href.includes('htmlpreview.github.io') ? 'https://htmlpreview.github.io/?https://raw.githubusercontent.com/Reykuz/-/main/' : './';
var layerGroup  = document.getElementById('layer-group');
var layerEmboss = document.getElementById('layer-emboss');

var isMobile = window.innerWidth <= 768;

if (!isMobile) {
  window.addEventListener('scroll', function () {
    var s      = window.scrollY;
    var limit  = 928;
    var offset = Math.min(s, limit);
    var pos    = '150px ' + (-164 - offset) + 'px';
    layerGroup.style.webkitMaskPosition = pos;
    layerGroup.style.maskPosition       = pos;
    layerEmboss.style.top = (-216 - offset) + 'px';
  }, { passive: true });
} else {
  layerGroup.style.webkitMaskPosition = '150px -164px';
  layerGroup.style.maskPosition = '150px -164px';
}

/* ── Services orbit ── */
(function() {
  var CARDS = Array.from(document.querySelectorAll('.s-card'));
  var N = CARDS.length;
  var current = 0;
  var timer;

  var ACTIVE_W = 340, ACTIVE_H = 400;
  var SMALL_W  = 180, SMALL_H  = 220;
  var ACTIVE_ICON = 300, SMALL_ICON = 140;

  var SLOTS = [
    { lf: 0.30, tf: 0.35 },
    { lf: 0.62, tf: 0.05 },
    { lf: 0.78, tf: 0.40 },
    { lf: 0.60, tf: 0.74 },
    { lf: 0.18, tf: 0.72 },
    { lf: 0.02, tf: 0.28 },
  ];

  var dotsEl = document.getElementById('dots');
  for (var i = 0; i < N; i++) {
    var d = document.createElement('div');
    d.className = 'dot';
    d.dataset.i = i;
    d.addEventListener('click', (function(idx){ return function(){ goTo(idx); }; })(i));
    dotsEl.appendChild(d);
  }

  function render() {
    var orbitEl = document.getElementById('orbit');
    var OW = orbitEl.offsetWidth;
    var OH = orbitEl.offsetHeight;
    CARDS.forEach(function(card, idx) {
      var slot = (idx - current + N) % N;
      var pos  = SLOTS[slot];
      var isActive = slot === 0;
      var cw = isActive ? ACTIVE_W : SMALL_W;
      var ch = isActive ? ACTIVE_H : SMALL_H;
      var isize = isActive ? ACTIVE_ICON : SMALL_ICON;
      var left = Math.max(0, Math.round(pos.lf * OW - cw / 2));
      var top  = Math.max(0, Math.round(pos.tf * OH - ch / 2));
      card.style.width  = cw + 'px';
      card.style.height = ch + 'px';
      card.style.left   = left + 'px';
      card.style.top    = top  + 'px';
      card.style.zIndex = isActive ? 10 : 5;
      card.classList.toggle('active', isActive);

      var label = card.querySelector('.s-label');
      label.style.fontSize = isActive ? '13px' : '9px';
      label.style.opacity  = isActive ? '1' : '0.7';

      var labelHeight = isActive ? 58 : 42;
      var topZoneH = ch - labelHeight;
      var maxIcon = topZoneH - 16;
      var actualIcon = Math.min(isize, maxIcon);
      var itop = Math.round((topZoneH - actualIcon) / 2);

      var icon = card.querySelector('.s-icon');
      icon.style.width  = actualIcon + 'px';
      icon.style.height = actualIcon + 'px';
      icon.style.top    = itop + 'px';
      icon.style.transform = 'translateX(-50%)';
    });
    Array.from(dotsEl.children).forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) { current = idx; render(); }
  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(function() { current = (current + 1) % N; render(); }, 3000);
  }

  CARDS.forEach(function(card) {
    card.addEventListener('click', function() { goTo(+this.dataset.idx); });
  });

  var orbit = document.getElementById('orbit');
  orbit.addEventListener('mouseenter', function() { clearInterval(timer); });
  orbit.addEventListener('mouseleave', function() { startTimer(); });

  render();
  startTimer();
})();

/* ── Cases ── */
(function() {
  var CASES_INDEX = './case str/index.json';
  var CASES_PATH  = './case str/';
  var MAX = 4;

  fetch(CASES_INDEX)
    .then(function(r) { if (!r.ok) throw 0; return r.json(); })
    .then(function(data) { renderCases(data.slice(0, MAX)); })
    .catch(renderCasesDemo);

  function renderCases(cases) {
    var grid = document.getElementById('cases-grid');
    if (!grid) return;
    grid.innerHTML = '';
    cases.forEach(function(c) {
      var card = document.createElement('a');
      card.className = 'case-card';
      card.href = BASE_URL + 'case%20str/' + c.file;
      var coverSrc = c.cover ? (c.cover.startsWith('media/') ? CASES_PATH + c.cover : CASES_PATH + c.cover) : '';
      card.innerHTML =
        (coverSrc ? '<img class="case-card-img" src="' + coverSrc + '" alt="' + esc(c.title||'') + '" onerror="this.style.display=\'none\'">' : '<div class="case-card-placeholder">НЕТ ОБЛОЖКИ</div>') +
        '<div class="case-card-blur-inner"></div>' +
        '<div class="case-card-body"><div class="case-card-cat">' + esc(c.category||'') + '</div><div class="case-card-title">' + esc(c.title||'Без названия') + '</div></div>';
      grid.appendChild(card);
    });
    // Убираем квадратную карточку-кнопку — оставляем только маленькую кнопку в шапке
    // appendMoreCase(grid); // <-- ЗАКОММЕНТИРОВАНО
  }

  function renderCasesDemo() {
    renderCases([
      { title: 'Брендинг для tech-стартапа',            category: '3D / MOTION', cover: '', file: '#' },
      { title: 'Motion-дизайн для социальных сетей',    category: 'MOTION',      cover: '', file: '#' },
      { title: 'Конверсионный лендинг для e-commerce',  category: 'ДИЗАЙН',      cover: '', file: '#' },
      { title: 'Фирменный стиль ресторанной сети',      category: 'БРЕНДИНГ',    cover: '', file: '#' },
    ]);
  }
})();

/* ── Blog ── */
(function() {
  var BLOG_INDEX = './str/index.json';
  var BLOG_PATH  = './str/';
  var MAX = 2;

  fetch(BLOG_INDEX)
    .then(function(r) { if (!r.ok) throw 0; return r.json(); })
    .then(function(data) { renderBlog(data.slice(0, MAX)); })
    .catch(renderBlogDemo);

  function renderBlog(articles) {
    var grid = document.getElementById('blog-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!articles.length) {
      // если нет статей, показываем пустое сообщение
      grid.innerHTML = '<div class="blog-empty">СТАТЕЙ ПОКА НЕТ</div>';
      return;
    }
    articles.forEach(function(a) {
      var card = document.createElement('a');
      card.className = 'blog-card';
      card.href = BASE_URL + 'str/' + a.file;
      var coverHTML = a.cover
        ? '<img src="' + BLOG_PATH + a.cover + '" alt="' + esc(a.title||'') + '" onerror="this.parentNode.innerHTML=\'<div class=blog-card-cover-placeholder>НЕТ ОБЛОЖКИ</div>\'">'
        : '<div class="blog-card-cover-placeholder">НЕТ ОБЛОЖКИ</div>';
      card.innerHTML =
        '<div class="blog-card-cover">' + coverHTML + '</div>' +
        '<div class="blog-card-body"><div class="blog-card-cat">' + esc(a.category||'') + '</div><div class="blog-card-title">' + esc(a.title||'Без названия') + '</div></div>';
      grid.appendChild(card);
    });
    // Убираем квадратную карточку-кнопку
    // appendMoreBlog(grid); // <-- ЗАКОММЕНТИРОВАНО
  }

  function renderBlogDemo() {
    renderBlog([
      { title: 'Как мы делаем 3D-анимацию для брендов',       category: '3D / MOTION', cover: '', file: '#' },
      { title: 'ROI креатива: считаем эффективность дизайна',  category: 'МАРКЕТИНГ',  cover: '', file: '#' },
    ]);
  }
})();

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}