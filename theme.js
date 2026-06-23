// theme toggle: cycles light <-> dark, persists to localStorage.
// (an inline <head> script applies the saved theme before paint to avoid flicker.)
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

  document.querySelectorAll('[data-tab]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var name = el.getAttribute('data-tab');
      if (currentName() !== name) history.pushState(null, '', '/' + name);
      showTab(name);
      window.scrollTo(0, 0);
    });
  });

  // back/forward buttons
  window.addEventListener('popstate', function () {
    showTab(currentName());
  });

  // restore a deep link that came in via the 404.html bounce
  try {
    var redir = sessionStorage.getItem('spa-redirect');
    if (redir) {
      sessionStorage.removeItem('spa-redirect');
      history.replaceState(null, '', redir);
    }
  } catch (e) {}

  showTab(currentName()); // honor the path on first load
})();
