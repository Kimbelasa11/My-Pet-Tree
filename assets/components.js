/* ================================================================
   My Pet Tree — Shared Page Components
   ================================================================ */

var MyPetTree = MyPetTree || {};

(function() {
  'use strict';

  // ================================================================
  // NAVIGATION DATA
  // ================================================================
  var navItems = [
    { label: 'Home', href: 'index.html', id: 'home' },
    { label: 'About Us', href: 'about.html', id: 'about' },
    { label: 'Products', href: 'products.html', id: 'products' },
    { label: 'Services', href: 'services.html', id: 'services' },
    { label: 'Gallery', href: 'gallery.html', id: 'gallery' },
    { label: 'Team', href: 'team.html', id: 'team' },
    { label: 'Testimonials', href: 'testimonials.html', id: 'testimonials' },
    { label: 'Contact', href: 'contact.html', id: 'contact' }
  ];

  // ================================================================
  // HEADER HTML
  // ================================================================
  function buildHeader(currentPageId) {
    var navHtml = '';
    for (var i = 0; i < navItems.length; i++) {
      var item = navItems[i];
      var active = item.id === currentPageId ? ' class="nav-link active"' : ' class="nav-link"';
      navHtml += '<li><a href="' + item.href + '"' + active + '>' + item.label + '</a></li>';
    }

    return [
      '<header id="header">',
      '  <div class="container header-inner">',
      '    <a href="index.html" class="logo" aria-label="My Pet Tree - Home">',
      '      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon" aria-hidden="true">',
      '        <circle cx="20" cy="20" r="18" fill="#d4a234" opacity="0.2"/>',
      '        <path d="M20 6C20 6 10 14 10 24C10 30 14 34 20 36C26 34 30 30 30 24C30 14 20 6 20 6Z" fill="#2d5016"/>',
      '        <path d="M20 10C20 10 14 16 14 24C14 28 17 31 20 32C23 31 26 28 26 24C26 16 20 10 20 10Z" fill="#d4a234" opacity="0.5"/>',
      '      </svg>',
      '      <span class="logo-text">My Pet Tree</span>',
      '    </a>',
      '    <button id="theme-toggle" class="theme-toggle" aria-label="Switch to dark mode" type="button">',
      '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">',
      '        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
      '      </svg>',
      '    </button>',
      '    <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navbar">',
      '      <span></span><span></span><span></span>',
      '    </button>',
      '    <nav id="navbar" role="navigation" aria-label="Main navigation">',
      '      <ul>' + navHtml + '</ul>',
      '    </nav>',
      '  </div>',
      '</header>'
    ].join('\n');
  }

  // ================================================================
  // FOOTER HTML
  // ================================================================
  function buildFooter() {
    return [
      '<footer id="footer" role="contentinfo">',
      '  <div class="container">',
      '    <div class="footer-grid">',
      '      <div class="footer-brand">',
      '        <a href="index.html" class="footer-logo">',
      '          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="footer-logo-icon" aria-hidden="true">',
      '            <circle cx="20" cy="20" r="18" fill="#d4a234" opacity="0.2"/>',
      '            <path d="M20 6C20 6 10 14 10 24C10 30 14 34 20 36C26 34 30 30 30 24C30 14 20 6 20 6Z" fill="#2d5016"/>',
      '            <path d="M20 10C20 10 14 16 14 24C14 28 17 31 20 32C23 31 26 28 26 24C26 16 20 10 20 10Z" fill="#d4a234" opacity="0.5"/>',
      '          </svg>',
      '          My Pet Tree',
      '        </a>',
      '        <p>Professional tree planting, landscaping, and environmental conservation for a greener tomorrow.</p>',
      '        <div class="footer-social">',
      '          <a href="#" aria-label="Follow us on Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>',
      '          <a href="#" aria-label="Follow us on Instagram"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg></a>',
      '          <a href="#" aria-label="Follow us on Twitter"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>',
      '          <a href="#" aria-label="Follow us on LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>',
      '        </div>',
      '      </div>',
      '      <div class="footer-links">',
      '        <h4>Quick Links</h4>',
      '        <ul>',
      '          <li><a href="index.html">Home</a></li>',
      '          <li><a href="about.html">About Us</a></li>',
      '          <li><a href="products.html">Products</a></li>',
      '          <li><a href="services.html">Services</a></li>',
      '          <li><a href="gallery.html">Gallery</a></li>',
      '          <li><a href="team.html">Team</a></li>',
      '          <li><a href="testimonials.html">Testimonials</a></li>',
      '          <li><a href="contact.html">Contact</a></li>',
      '        </ul>',
      '      </div>',
      '      <div class="footer-links">',
      '        <h4>Our Services</h4>',
      '        <ul>',
      '          <li><a href="services.html">Tree Planting</a></li>',
      '          <li><a href="services.html">Landscaping</a></li>',
      '          <li><a href="services.html">Garden Maintenance</a></li>',
      '          <li><a href="services.html">Environmental Consultation</a></li>',
      '          <li><a href="services.html">Nursery</a></li>',
      '          <li><a href="services.html">Plant Care</a></li>',
      '        </ul>',
      '      </div>',
      '      <div class="footer-contact">',
      '        <h4>Contact Information</h4>',
      '        <ul>',
      '          <li><a href="mailto:hello@mypettree.com">hello@mypettree.com</a></li>',
      '          <li><a href="tel:+15551234567">(555) 123-4567</a></li>',
      '          <li>123 Green Street, Suite 100<br>Your City, State 12345</li>',
      '        </ul>',
      '      </div>',
      '    </div>',
      '    <div class="footer-bottom">',
      '      <p>&copy; 2026 My Pet Tree. All rights reserved.</p>',
      '      <p class="footer-legal"><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>',
      '    </div>',
      '  </div>',
      '</footer>'
    ].join('\n');
  }

  // ================================================================
  // PAGE BANNER HTML
  // ================================================================
  function buildBanner(title, subtitle, bgImage) {
    bgImage = bgImage || 'assets/images/hero-placeholder.svg';
    return [
      '<section class="page-banner" aria-label="Page header">',
      '  <div class="page-banner-bg" style="background-image: url(\'' + bgImage + '\');" aria-hidden="true"></div>',
      '  <div class="page-banner-overlay" aria-hidden="true"></div>',
      '  <div class="container page-banner-content">',
      '    <h1 class="page-banner-title">' + title + '</h1>',
      '    <p class="page-banner-subtitle">' + subtitle + '</p>',
      '  </div>',
      '</section>'
    ].join('\n');
  }

  // ================================================================
  // RENDER FUNCTIONS
  // ================================================================
  MyPetTree.renderHeader = function(currentPageId) {
    var el = document.getElementById('header-placeholder');
    if (el) {
      el.innerHTML = buildHeader(currentPageId);
      el.style.display = 'block';
    }
  };

  MyPetTree.renderFooter = function() {
    var el = document.getElementById('footer-placeholder');
    if (el) {
      el.innerHTML = buildFooter();
      el.style.display = 'block';
    }
  };

  MyPetTree.renderBanner = function(title, subtitle, bgImage) {
    var el = document.getElementById('banner-placeholder');
    if (el) {
      el.innerHTML = buildBanner(title, subtitle, bgImage);
      el.style.display = 'block';
    }
  };

  MyPetTree.getNavItems = function() {
    return navItems;
  };

})();
