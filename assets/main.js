(function() {
  'use strict';

  // ================================================================
  // 1. PRELOADER
  // ================================================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        preloader.classList.add('hidden');
      }, 600);
    });
    // Fallback: hide after 3s even if load event doesn't fire
    setTimeout(function() {
      if (!preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
      }
    }, 3000);
  }

  // ================================================================
  // 2. SCROLL PROGRESS BAR
  // ================================================================
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = scrollPercent + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
    });
  }

  // ================================================================
  // 3. HEADER NAVIGATION
  // ================================================================
  const header = document.getElementById('header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const heroSection = document.getElementById('hero');

  // Navbar: transparent on hero, solid after
  function updateHeader() {
    if (!header) return;
    const scrollY = window.scrollY;
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;

    if (scrollY > heroHeight - 100) {
      header.classList.remove('transparent');
      header.classList.add('solid');
    } else {
      header.classList.remove('solid');
      header.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Mobile menu toggle
  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      const isOpen = nav.classList.contains('open');
      nav.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close mobile menu on link click
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on click outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ================================================================
  // 4. ACTIVE NAV LINK ON SCROLL
  // ================================================================
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ================================================================
  // 5. SMOOTH SCROLL FOR ANCHOR LINKS
  // ================================================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // ================================================================
  // 6. SCROLL REVEAL (IntersectionObserver)
  // ================================================================
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function(el) { el.classList.add('active'); });
      return;
    }

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(function(el) { observer.observe(el); });
  }

  initScrollReveal();

  // ================================================================
  // 7. COUNTER ANIMATION
  // ================================================================
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function(counter) {
        counter.textContent = counter.getAttribute('data-target');
      });
      return;
    }

    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'), 10);
          animateCounter(counter, target);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) { counterObserver.observe(counter); });
  }

  function animateCounter(element, target) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    function update() {
      step++;
      current = Math.min(current + increment, target);
      element.textContent = Math.round(current);
      if (step < steps) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    update();
  }

  initCounters();

  // ================================================================
  // 8. GALLERY FILTER
  // ================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        filterBtns.forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        galleryItems.forEach(function(item) {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // ================================================================
  // 9. LIGHTBOX
  // ================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentLightboxIndex = -1;
  const lightboxItems = [];

  galleryItems.forEach(function(item) {
    const img = item.querySelector('.gallery-img');
    const caption = item.querySelector('.gallery-caption h3');
    if (img) {
      lightboxItems.push({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        caption: caption ? caption.textContent : ''
      });

      item.addEventListener('click', function() {
        const index = Array.from(galleryItems).indexOf(item);
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    if (!lightbox || !lightboxItems.length) return;
    currentLightboxIndex = index;
    const item = lightboxItems[index];
    lightboxImg.setAttribute('src', item.src);
    lightboxImg.setAttribute('alt', item.alt);
    lightboxCaption.textContent = item.caption;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    if (currentLightboxIndex < 0) return;
    const newIndex = currentLightboxIndex + direction;
    if (newIndex >= 0 && newIndex < lightboxItems.length) {
      openLightbox(newIndex);
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function() { navigateLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function() { navigateLightbox(1); });

  // Close lightbox on overlay click
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ================================================================
  // 10. TESTIMONIAL SLIDER
  // ================================================================
  const track = document.getElementById('testimonial-track');
  const slides = track ? track.querySelectorAll('.testimonial-card') : [];
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  let currentSlide = 0;
  let autoplayInterval = null;

  if (track && slides.length) {
    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentSlide = index;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';

      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { goToSlide(currentSlide - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goToSlide(currentSlide + 1); resetAutoplay(); });

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        goToSlide(parseInt(this.getAttribute('data-index'), 10));
        resetAutoplay();
      });
    });

    // Autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(function() {
        goToSlide(currentSlide + 1);
      }, 5000);
    }

    function resetAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
      startAutoplay();
    }

    startAutoplay();

    // Pause on hover
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
      slider.addEventListener('mouseenter', function() {
        if (autoplayInterval) clearInterval(autoplayInterval);
      });
      slider.addEventListener('mouseleave', function() {
        startAutoplay();
      });
    }
  }

  // ================================================================
  // 11. CONTACT FORM
  // ================================================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formSubmit = document.getElementById('form-submit');

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const messageInput = document.getElementById('contact-message');
    const websiteInput = document.getElementById('website'); // honeypot

    // Real-time validation
    nameInput.addEventListener('blur', function() { validateField(this, 2); });
    emailInput.addEventListener('blur', function() { validateEmail(this); });
    messageInput.addEventListener('blur', function() { validateField(this, 10); });

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Honeypot check
      if (websiteInput && websiteInput.value.trim() !== '') {
        console.log('Spam detected');
        return;
      }

      // Validate all fields
      const isNameValid = validateField(nameInput, 2);
      const isEmailValid = validateEmail(emailInput);
      const isMessageValid = validateField(messageInput, 10);

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        return;
      }

      // Show loading state
      if (formSubmit) {
        formSubmit.classList.add('loading');
        formSubmit.disabled = true;
      }

      // Collect form data
      var data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput ? phoneInput.value.trim() : '',
        service: document.getElementById('contact-service') ? document.getElementById('contact-service').value : '',
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
      };

      console.log('Form submission:', data);

      // Simulate sending
      setTimeout(function() {
        if (formSubmit) {
          formSubmit.classList.remove('loading');
          formSubmit.disabled = false;
        }
        contactForm.reset();
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('show');
        }
        clearErrors();

        // Reset form after 5s
        setTimeout(function() {
          contactForm.style.display = 'flex';
          if (formSuccess) formSuccess.classList.remove('show');
        }, 5000);
      }, 1500);

      // TODO: Wire to Formspree, Netlify Forms, or custom backend
      // fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // .then(function() { ... })
      // .catch(function(err) { console.error('Form error:', err); });
    });
  }

  function validateField(input, minLength) {
    var value = input.value.trim();
    var errorEl = input.parentElement.querySelector('.form-error');
    if (!errorEl) return true;

    if (value.length < minLength) {
      input.classList.add('error');
      errorEl.textContent = 'Please enter at least ' + minLength + ' characters';
      return false;
    }
    input.classList.remove('error');
    errorEl.textContent = '';
    return true;
  }

  function validateEmail(input) {
    var value = input.value.trim();
    var errorEl = input.parentElement.querySelector('.form-error');
    if (!errorEl) return true;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      input.classList.add('error');
      errorEl.textContent = 'Please enter a valid email address';
      return false;
    }
    input.classList.remove('error');
    errorEl.textContent = '';
    return true;
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(function(el) { el.textContent = ''; });
    document.querySelectorAll('.error').forEach(function(el) { el.classList.remove('error'); });
  }

  // ================================================================
  // 12. BACK TO TOP BUTTON
  // ================================================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ================================================================
  // 13. RESPONSIVE TOUCH SUPPORT
  // ================================================================
  // Enable hover effects on touch devices
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }

  // ================================================================
  // 14. DEBOUNCED RESIZE HANDLER
  // ================================================================
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      updateHeader();
    }, 200);
  });

  // ================================================================
  // 15. PAGE LOADED STATE
  // ================================================================
  document.body.classList.add('loaded');
  updateActiveNav();

})();
