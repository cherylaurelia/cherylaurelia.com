(function () {
  var btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var current = document.documentElement.getAttribute('data-theme')
        || (prefersDark ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('a[href^="http"]').forEach(function (a) {
    a.target = '_blank';
    a.rel = 'noopener';
  });

  var panels = document.querySelectorAll('[data-panel]');
  var navLinks = document.querySelectorAll('nav a[data-tab]');

  function currentName() {
    var p = location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    return p || 'about';
  }

  function showTab(name) {
    if (!name || !document.querySelector('[data-panel="' + name + '"]')) {
      name = 'about';
    }
    panels.forEach(function (p) {
      p.hidden = p.getAttribute('data-panel') !== name;
    });
    navLinks.forEach(function (a) {
      var tab = a.getAttribute('data-tab');
      a.classList.toggle('active', tab === name || name.indexOf(tab + '/') === 0);
    });
  }

  function countView() {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: location.pathname, title: document.title });
    }
  }

  document.querySelectorAll('[data-tab]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var name = el.getAttribute('data-tab');
      var changed = currentName() !== name;
      if (changed) history.pushState(null, '', '/' + name);
      showTab(name);
      window.scrollTo(0, 0);
      if (changed) countView();
    });
  });

  window.addEventListener('popstate', function () {
    showTab(currentName());
    countView();
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    window.addEventListener('mousemove', function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var s = document.documentElement.style;
        s.setProperty('--px', (e.clientX / window.innerWidth - 0.5).toFixed(3));
        s.setProperty('--py', (e.clientY / window.innerHeight - 0.5).toFixed(3));
        ticking = false;
      });
    });
  }

  try {
    var redir = sessionStorage.getItem('spa-redirect');
    if (redir) {
      sessionStorage.removeItem('spa-redirect');
      history.replaceState(null, '', redir);
    }
  } catch (e) {}

  showTab(currentName());

  var artModal = document.getElementById('art-modal');
  var artModalImg = document.getElementById('art-modal-img');
  var artModalTitle = document.getElementById('art-modal-title');
  var artModalDesc = document.getElementById('art-modal-desc');
  var artModalAudio = document.getElementById('art-modal-audio');
  var artMuteBtn = document.getElementById('art-mute-btn');

  function openArt(thumb) {
    artModalImg.src = thumb.getAttribute('data-img') || '';
    artModalImg.alt = thumb.getAttribute('data-title') || '';
    artModalTitle.textContent = thumb.getAttribute('data-title') || '';
    artModalDesc.textContent = thumb.getAttribute('data-desc') || '';
    artModalAudio.src = thumb.getAttribute('data-audio') || '';
    artModalAudio.muted = false;
    artMuteBtn.classList.remove('is-muted');
    artModal.hidden = false;
    document.body.style.overflow = 'hidden';
    var playPromise = artModalAudio.play();
    if (playPromise && playPromise.catch) playPromise.catch(function () {});
  }

  function closeArt() {
    artModal.hidden = true;
    document.body.style.overflow = '';
    artModalAudio.pause();
    artModalAudio.currentTime = 0;
    artModalAudio.src = '';
  }

  document.querySelectorAll('.art-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () { openArt(thumb); });
  });

  if (artModal) {
    artModal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeArt);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !artModal.hidden) closeArt();
    });
  }

  if (artMuteBtn) {
    artMuteBtn.addEventListener('click', function () {
      artModalAudio.muted = !artModalAudio.muted;
      artMuteBtn.classList.toggle('is-muted', artModalAudio.muted);
    });
  }
})();
