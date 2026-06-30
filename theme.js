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

  try {
    var redir = sessionStorage.getItem('spa-redirect');
    if (redir) {
      sessionStorage.removeItem('spa-redirect');
      history.replaceState(null, '', redir);
    }
  } catch (e) {}

  showTab(currentName());
})();
