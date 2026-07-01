/* ================================================================
   My Pet Tree Website — Main JavaScript
   ================================================================ */

// ================================================================
// 1. NAVIGATION TOGGLE (Mobile Menu)
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('open');
      nav.classList.toggle('open');
    });

    // Close menu when a link is clicked
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('open');
        nav.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navToggle.contains(event.target) && !nav.contains(event.target)) {
        navToggle.classList.remove('open');
        nav.classList.remove('open');
      }
    });
  }

  // ================================================================
  // 2. ACTIVE NAV LINK (Based on current page)
  // ================================================================

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ================================================================
  // 3. SCROLL REVEAL
  // ================================================================

  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  // Call once on load to catch elements already in view
  revealOnScroll();

  // ================================================================
  // 4. GALLERY FILTER
  // ================================================================

  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter gallery items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          // Trigger reflow to animate
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 0);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ================================================================
  // 5. FORM HANDLING (Adopt a Tree Form)
  // ================================================================

  const adoptForm = document.getElementById('adopt-form');
  if (adoptForm) {
    adoptForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(this);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        treeType: formData.get('tree-type'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
      };

      // Log to console (in production, send to backend)
      console.log('Form submission:', data);

      // Show success message
      const successMsg = document.querySelector('.form-success');
      if (successMsg) {
        successMsg.classList.add('show');
      }

      // Optional: Reset form and hide success after 5 seconds
      setTimeout(() => {
        adoptForm.reset();
        if (successMsg) {
          successMsg.classList.remove('show');
        }
      }, 5000);

      // TODO: Wire to Formspree, Netlify Forms, or custom backend
      // Example (Formspree):
      // fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // .then(() => successMsg.classList.add('show'))
      // .catch(err => console.error('Form error:', err));
    });
  }

  // ================================================================
  // 6. SMOOTH SCROLL OFFSET FOR STICKY HEADER
  // ================================================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 70;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ================================================================
  // 7. LAZY LOAD IMAGES (Optional enhancement)
  // ================================================================

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ================================================================
  // 8. UTILITY: Debounce function for scroll events
  // ================================================================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Use debounce for performance-critical listeners
  const debouncedReveal = debounce(revealOnScroll, 100);
  window.addEventListener('scroll', debouncedReveal);
});

// ================================================================
// 9. UTILITY: Add to body on page load for conditional CSS
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('loaded');
});
