/**
 * HotelDownload.com — App JavaScript
 * Mobile-first, app-like interactions
 */

(function () {
  'use strict';

  // =========================================================================
  // Intersection Observer — Scroll Animations
  // =========================================================================

  function initScrollAnimations() {
    var targets = document.querySelectorAll('[data-animate]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      targets.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(function (el) { observer.observe(el); });
  }

  // =========================================================================
  // Bottom Navigation — Active State
  // =========================================================================

  function initBottomNav() {
    var path = window.location.pathname;
    var items = document.querySelectorAll('.bottom-nav__item');

    items.forEach(function (item) {
      item.classList.remove('active');
      item.removeAttribute('aria-current');

      var href = item.getAttribute('href');
      if (href === '/' && (path === '/' || path === '/index.html')) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      } else if (href !== '/' && path.startsWith(href)) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      }
    });
  }

  // =========================================================================
  // Top Navigation — Active State
  // =========================================================================

  function initTopNav() {
    var path = window.location.pathname;
    var links = document.querySelectorAll('.top-nav__links a');

    links.forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href === '/' && (path === '/' || path === '/index.html')) {
        link.classList.add('active');
      } else if (href !== '/' && path.startsWith(href)) {
        link.classList.add('active');
      }
    });
  }

  // =========================================================================
  // Pill Navigation — Filter (if applicable)
  // =========================================================================

  function initPillNav() {
    var pills = document.querySelectorAll('.pill-nav__item');
    if (!pills.length) return;

    pills.forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.preventDefault();

        // Toggle active pill
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');

        var filter = pill.getAttribute('data-filter');
        var cards = document.querySelectorAll('[data-category]');

        cards.forEach(function (card) {
          if (!filter || filter === 'all') {
            card.style.display = '';
            card.style.opacity = '0';
            requestAnimationFrame(function () {
              card.style.transition = 'opacity 0.3s ease';
              card.style.opacity = '1';
            });
          } else if (card.getAttribute('data-category').includes(filter)) {
            card.style.display = '';
            card.style.opacity = '0';
            requestAnimationFrame(function () {
              card.style.transition = 'opacity 0.3s ease';
              card.style.opacity = '1';
            });
          } else {
            card.style.opacity = '0';
            setTimeout(function () { card.style.display = 'none'; }, 200);
          }
        });
      });
    });
  }

  // =========================================================================
  // FAQ Accordion
  // =========================================================================

  function initFAQ() {
    var questions = document.querySelectorAll('.faq-question');
    questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');

        // Optional: close all others for accordion behavior
        // document.querySelectorAll('.faq-item.open').forEach(function(el) {
        //   el.classList.remove('open');
        //   el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        // });

        item.classList.toggle('open');
        btn.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  // =========================================================================
  // Search Toggle (placeholder for future implementation)
  // =========================================================================

  function initSearch() {
    var searchBtn = document.getElementById('search-toggle');
    if (!searchBtn) return;

    searchBtn.addEventListener('click', function () {
      // Future: open search modal/overlay
      // For now, scroll to top or focus search if present
      var searchInput = document.querySelector('.search-bar__input');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // =========================================================================
  // Touch Feedback for Cards
  // =========================================================================

  function initTouchFeedback() {
    var touchTargets = document.querySelectorAll('.card, .app-card, .country-card, .strategy-card');
    touchTargets.forEach(function (el) {
      el.addEventListener('touchstart', function () {
        el.style.transform = 'scale(0.98)';
      }, { passive: true });

      el.addEventListener('touchend', function () {
        el.style.transform = '';
      }, { passive: true });

      el.addEventListener('touchcancel', function () {
        el.style.transform = '';
      }, { passive: true });
    });
  }

  // =========================================================================
  // Service Worker Registration
  // =========================================================================

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {
          // Service worker registration failed silently
        });
      });
    }
  }

  // =========================================================================
  // Smooth scroll for anchor links
  // =========================================================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // =========================================================================
  // Performance: Lazy load images when they exist
  // =========================================================================

  function initLazyLoad() {
    var images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.removeAttribute('data-src');
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      images.forEach(function (img) { imgObserver.observe(img); });
    } else {
      images.forEach(function (img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // =========================================================================
  // Init
  // =========================================================================

  function init() {
    initScrollAnimations();
    initBottomNav();
    initTopNav();
    initPillNav();
    initFAQ();
    initSearch();
    initTouchFeedback();
    initSmoothScroll();
    initLazyLoad();
    initServiceWorker();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
