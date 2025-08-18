/**
 * Back to Top functionality for Pet Heart Animal Clinic website
 * Provides smooth scrolling to top with scroll threshold detection
 */

class BackToTop {
  constructor() {
    this.button = null;
    this.scrollThreshold = 300; // Show button after scrolling 300px
    this.isVisible = false;
    this.initTimeout = null;

    this.init();
  }

  init() {
    // Ensure DOM is fully loaded and try to find button
    const tryInit = () => {
      this.createButton();
      if (this.button) {
        this.bindEvents();
        console.log('Back to top button initialized successfully');
      } else {
        // Retry if button not found
        console.warn('Back to top button not found, retrying...');
        this.initTimeout = setTimeout(tryInit, 100);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryInit);
    } else {
      // DOM already loaded, init immediately
      tryInit();
    }
  }

  createButton() {
    // Button will be created via HTML partial, just get reference
    this.button = document.getElementById('back-to-top-btn');

    if (!this.button) {
      console.warn('Back to top button not found in DOM');
      return;
    }

    // Ensure initial state
    this.button.classList.remove('visible');
    this.button.setAttribute('aria-hidden', 'true');
    this.isVisible = false;
  }

  bindEvents() {
    if (!this.button) return;

    // Clear any existing timeout
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
      this.initTimeout = null;
    }

    // Scroll event listener with throttling for performance
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 16); // ~60fps throttling
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Click event for smooth scroll to top
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });

    // Keyboard support for accessibility
    this.button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.scrollToTop();
      }
    });

    // Initial scroll check in case page is already scrolled
    this.handleScroll();
  }

  handleScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition > this.scrollThreshold && !this.isVisible) {
      this.showButton();
    } else if (scrollPosition <= this.scrollThreshold && this.isVisible) {
      this.hideButton();
    }
  }

  showButton() {
    if (!this.button) return;

    this.button.classList.add('visible');
    this.button.setAttribute('aria-hidden', 'false');
    this.isVisible = true;
  }

  hideButton() {
    if (!this.button) return;

    this.button.classList.remove('visible');
    this.button.setAttribute('aria-hidden', 'true');
    this.isVisible = false;
  }

  scrollToTop() {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Announce the action to screen readers
    this.announceScrollAction();

    // Focus management for accessibility
    // After scrolling, focus should return to a logical element
    setTimeout(() => {
      const skipLink = document.querySelector('.skip-link');
      const mainContent = document.querySelector('#main-content');
      const header = document.querySelector('header');

      if (mainContent) {
        mainContent.focus();
      } else if (skipLink) {
        skipLink.focus();
      } else if (header) {
        header.focus();
      }
    }, 500);
  }

  /**
   * Announce scroll action to screen readers
   */
  announceScrollAction() {
    const announcement = 'Scrolled to top of page. Focus moved to main content.';

    // Use the global live region if available
    const liveRegion = document.getElementById('sr-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.textContent = announcement;

      // Clear the message after screen reader has time to announce it
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1500);
    }
  }

  // Cleanup method for potential memory leaks
  destroy() {
    if (this.initTimeout) {
      clearTimeout(this.initTimeout);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BackToTop();
});

// Export for potential testing or external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackToTop;
}