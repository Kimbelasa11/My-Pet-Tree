(function() {
  'use strict';

  document.addEventListener('error', function(e) {
    var target = e.target;
    if (target.tagName === 'IMG' && !target.hasAttribute('data-fallback')) {
      target.setAttribute('data-fallback', '1');
      target.src = '/assets/images/gallery-placeholder.svg';
    }
  }, true);

  var header = document.getElementById('header');
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('navbar');
  var backToTop = document.getElementById('back-to-top');
  var mainContent = document.getElementById('main-content');

  var navLoadingBar = document.getElementById('nav-loading-bar');
  var activeFetchController = null;

  function getHero() { return document.getElementById('hero') || document.querySelector('.page-banner'); }
  function getHeroBg() { return document.querySelector('.hero-bg'); }
  function getNavLinks() { return document.querySelectorAll('.nav-link'); }

  function updateHeader() {
    if (!header) return;
    var heroEl = getHero();
    var scrollY = window.scrollY;
    var threshold = heroEl ? heroEl.offsetHeight - 100 : 0;
    if (scrollY > threshold) {
      header.classList.remove('transparent');
      header.classList.add('solid');
    } else {
      header.classList.remove('solid');
      header.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      var isOpen = nav.classList.contains('open');
      nav.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function(el) { el.classList.add('active'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('stagger-children')) {
            var children = entry.target.querySelectorAll('.reveal');
            children.forEach(function(child, i) {
              child.style.transitionDelay = (0.1 * i) + 's';
              child.classList.add('active');
            });
          } else {
            entry.target.classList.add('active');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function(el) { observer.observe(el); });
  }

  function initCounters() {
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function(c) { c.textContent = c.getAttribute('data-target') || c.textContent; });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var counter = entry.target;
          var target = parseInt(counter.getAttribute('data-target'), 10);
          if (!isNaN(target)) {
            animateCounter(counter, target);
          }
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { observer.observe(c); });
  }

  function animateCounter(element, target) {
    var duration = 2500;
    var startTime = null;
    var isFloat = target % 1 !== 0;
    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = isFloat ? (eased * target).toFixed(1) : Math.round(eased * target);
      element.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = isFloat ? target.toFixed(1) : target;
      }
    }
    requestAnimationFrame(update);
  }

  function initContactForm() {
    var contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    var nameInput = document.getElementById('contact-name');
    var emailInput = document.getElementById('contact-email');
    var messageInput = document.getElementById('contact-message');
    var websiteInput = document.getElementById('website');

    function showFieldError(input, message) {
      if (!input) return;
      var errorEl = input.parentElement.querySelector('.form-error');
      if (!errorEl) return;
      input.classList.add('error');
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }

    function clearFieldError(input) {
      if (!input) return;
      var errorEl = input.parentElement.querySelector('.form-error');
      if (!errorEl) return;
      input.classList.remove('error');
      errorEl.classList.remove('show');
    }

    if (nameInput) nameInput.addEventListener('blur', function() {
      if (this.value.trim().length < 2) {
        showFieldError(this, 'Please enter your name (at least 2 characters)');
      } else {
        clearFieldError(this);
      }
    });

    if (emailInput) emailInput.addEventListener('blur', function() {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(this.value.trim())) {
        showFieldError(this, 'Please enter a valid email address');
      } else {
        clearFieldError(this);
      }
    });

    if (messageInput) messageInput.addEventListener('blur', function() {
      if (this.value.trim().length < 10) {
        showFieldError(this, 'Please enter at least 10 characters');
      } else {
        clearFieldError(this);
      }
    });

    contactForm.addEventListener('submit', function(e) {
      if (websiteInput && websiteInput.value.trim() !== '') { e.preventDefault(); return; }
      var valid = true;
      if (nameInput) {
        if (nameInput.value.trim().length < 2) { showFieldError(nameInput, 'Please enter your name'); valid = false; }
        else { clearFieldError(nameInput); }
      }
      if (emailInput) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(emailInput.value.trim())) { showFieldError(emailInput, 'Please enter a valid email'); valid = false; }
        else { clearFieldError(emailInput); }
      }
      if (messageInput) {
        if (messageInput.value.trim().length < 10) { showFieldError(messageInput, 'Please enter at least 10 characters'); valid = false; }
        else { clearFieldError(messageInput); }
      }
      if (!valid) e.preventDefault();
    });
  }

  function initBackToTop() {
    if (!backToTop) return;
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initTextareas() {
    var textareas = document.querySelectorAll('textarea');
    textareas.forEach(function(ta) {
      ta.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 400) + 'px';
      });
    });
  }

  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 72;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  }

  var scrollParallaxActive = false;
  function initHeroParallax() {
    var heroBg = getHeroBg();
    var hero = getHero();
    if (!heroBg || !hero) return;
  }

  function updateHeroParallax() {
    if (scrollParallaxActive) return;
    var heroBg = getHeroBg();
    var hero = getHero();
    if (!heroBg || !hero) { scrollParallaxActive = true; return; }
    window.addEventListener('scroll', function() {
      var hb = getHeroBg();
      var h = getHero();
      if (!hb || !h) return;
      var scrollY = window.scrollY;
      var heroHeight = h.offsetHeight;
      if (scrollY <= heroHeight) {
        var progress = scrollY / heroHeight;
        var translateY = scrollY * 0.35;
        var scale = 1.08 - (progress * 0.04);
        hb.style.transform = 'translateY(' + translateY + 'px) scale(' + Math.max(scale, 1) + ')';
        hb.style.opacity = 1 - (progress * 0.12);
      }
    }, { passive: true });
    scrollParallaxActive = true;
  }

  function showToast(message, type) {
    type = type || 'info';
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    var icons = {
      success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    toast.innerHTML = (icons[type] || icons.info) + '<span>' + message + '</span><button class="toast-close">&times;</button>';
    container.appendChild(toast);
    var closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(function() { toast.remove(); }, 300);
    });
    setTimeout(function() {
      if (toast.parentNode) {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(function() { toast.remove(); }, 300);
      }
    }, 4000);
  }

  window.showToast = showToast;

  function updateActiveNavLink() {
    var path = window.location.pathname;
    var links = getNavLinks();
    links.forEach(function(link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (path === '/' && href === '/') {
        link.classList.add('active');
      } else if (path !== '/' && href !== '/' && path.startsWith(href)) {
        link.classList.add('active');
      }
    });
  }

  function initPageFeatures() {
    updateHeader();
    initScrollReveal();
    initCounters();
    initContactForm();
    initTextareas();
    updateHeroParallax();
    updateActiveNavLink();
    initSmoothScroll();
  }

  var scrollHandlerAdded = false;
  window.addEventListener('scroll', function() {
    updateHeader();
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  initPageFeatures();
  initBackToTop();

  // --- Client-side navigation (SPA) ---

  function loadContent(url, replace) {
    if (!mainContent) {
      window.location.href = url;
      return;
    }

    var currentPath = window.location.pathname + window.location.search;
    var targetPath;
    try {
      targetPath = new URL(url, window.location.origin).pathname + new URL(url, window.location.origin).search;
    } catch(e) {
      window.location.href = url;
      return;
    }
    if (currentPath === targetPath) return;

    if (activeFetchController) {
      activeFetchController.abort();
      activeFetchController = null;
    }

    var controller = new AbortController();
    activeFetchController = controller;

    mainContent.classList.add('nav-loading');
    if (navLoadingBar) navLoadingBar.classList.add('active');

    fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' }, signal: controller.signal })
      .then(function(response) {
        if (controller.signal.aborted) return;
        if (!response.ok) throw new Error('Navigation failed (' + response.status + ')');
        return response.text();
      })
      .then(function(html) {
        if (controller.signal.aborted) return;

        if (navLoadingBar) navLoadingBar.classList.remove('active');

        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        var newContent = doc.getElementById('main-content');
        if (!newContent) throw new Error('main-content not found in response');

        var newTitle = doc.querySelector('title');
        if (newTitle) document.title = newTitle.textContent;

        mainContent.innerHTML = newContent.innerHTML;
        mainContent.classList.remove('nav-loading');

        if (!replace) history.pushState({ url: url }, '', url);

        if (nav && navToggle) {
          nav.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }

        window.scrollTo({ top: 0 });

        if (activeFetchController === controller) activeFetchController = null;

        initPageFeatures();
      })
      .catch(function(err) {
        if (err.name === 'AbortError') return;
        console.error('Navigation error:', err);
        if (navLoadingBar) navLoadingBar.classList.remove('active');
        mainContent.classList.remove('nav-loading');
        if (activeFetchController === controller) activeFetchController = null;
        if (typeof window.showToast === 'function') {
          window.showToast('Failed to load page. Please try again.', 'error');
        }
      });
  }

  function isInternalNav(link, event) {
    if (!link) return false;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return false;
    if (link.hasAttribute('target') || link.hasAttribute('download')) return false;
    if (link.origin !== window.location.origin) return false;
    var href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    var method = link.getAttribute('data-method');
    if (method && method.toUpperCase() !== 'GET') return false;
    return true;
  }

  document.addEventListener('click', function(event) {
    var link = event.target.closest('a');
    if (!isInternalNav(link, event)) return;
    var href = link.getAttribute('href');
    if (href === window.location.pathname + window.location.search ||
        href === window.location.href ||
        href === window.location.origin + '/') return;
    event.preventDefault();
    loadContent(link.href, false);
  });

  window.addEventListener('popstate', function(event) {
    var url = (event.state && event.state.url) ? event.state.url : window.location.href;
    loadContent(url, true);
  });
})();
