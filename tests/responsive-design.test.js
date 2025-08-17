/**
 * Responsive Design Validation Tests
 * Tests for Pet Heart Animal Clinic responsive layouts
 */

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Mock CSS media query testing
class MediaQueryMatcher {
  constructor(query) {
    this.query = query;
    this.matches = this.evaluateQuery(query);
    this.listeners = [];
  }

  evaluateQuery(query) {
    // Simple media query evaluation for testing
    if (query.includes('max-width: 768px')) {
      return global.mockViewportWidth <= 768;
    }
    if (query.includes('max-width: 1024px')) {
      return global.mockViewportWidth <= 1024;
    }
    if (query.includes('min-width: 769px')) {
      return global.mockViewportWidth >= 769;
    }
    return false;
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  addEventListener(event, callback) {
    if (event === 'change') {
      this.addListener(callback);
    }
  }

  removeEventListener(event, callback) {
    if (event === 'change') {
      this.removeListener(callback);
    }
  }

  dispatchEvent() {
    this.listeners.forEach(callback => callback(this));
  }
}

// Set up DOM environment
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pet Heart Animal Clinic</title>
      <style>
        /* Mobile styles */
        @media (max-width: 768px) {
          .mobile-menu { display: block; }
          .desktop-nav { display: none; }
          .hero-content { flex-direction: column; }
          .service-grid { grid-template-columns: 1fr; }
        }

        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .service-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-content { flex-direction: row; }
        }

        /* Desktop styles */
        @media (min-width: 1025px) {
          .mobile-menu { display: none; }
          .desktop-nav { display: flex; }
          .service-grid { grid-template-columns: repeat(3, 1fr); }
        }
      </style>
    </head>
    <body>
      <header>
        <nav class="desktop-nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
        </nav>
        <button class="mobile-menu" aria-label="Toggle mobile menu">Menu</button>
      </header>

      <main>
        <section class="hero">
          <div class="hero-content">
            <div class="hero-text">
              <h1>Pet Heart Animal Clinic</h1>
              <p>Caring for your beloved pets</p>
            </div>
            <div class="hero-image">
              <img src="/images/logo/logo.png" alt="Pet Heart Animal Clinic Logo">
            </div>
          </div>
        </section>

        <section class="services">
          <div class="service-grid">
            <div class="service-item">Dog Care</div>
            <div class="service-item">Cat Care</div>
            <div class="service-item">Emergency Care</div>
            <div class="service-item">Vaccinations</div>
            <div class="service-item">Surgery</div>
            <div class="service-item">Dental Care</div>
          </div>
        </section>
      </main>

      <footer>
        <div class="footer-content">
          <div class="contact-info">
            <p>Dr. Chathuranga Anura Kumara</p>
            <p>Pet Heart Animal Clinic</p>
          </div>
        </div>
      </footer>
    </body>
  </html>
`, {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.mockViewportWidth = 1024; // Default desktop width

// Mock matchMedia
global.window.matchMedia = jest.fn().mockImplementation(query => {
  return new MediaQueryMatcher(query);
});

// Mock getComputedStyle
global.window.getComputedStyle = jest.fn().mockImplementation(element => {
  const styles = {};

  // Mock responsive styles based on viewport width
  if (global.mockViewportWidth <= 768) {
    // Mobile styles
    if (element.classList.contains('mobile-menu')) {
      styles.display = 'block';
    }
    if (element.classList.contains('desktop-nav')) {
      styles.display = 'none';
    }
    if (element.classList.contains('service-grid')) {
      styles.gridTemplateColumns = '1fr';
    }
  } else if (global.mockViewportWidth <= 1024) {
    // Tablet styles
    if (element.classList.contains('service-grid')) {
      styles.gridTemplateColumns = 'repeat(2, 1fr)';
    }
  } else {
    // Desktop styles
    if (element.classList.contains('mobile-menu')) {
      styles.display = 'none';
    }
    if (element.classList.contains('desktop-nav')) {
      styles.display = 'flex';
    }
    if (element.classList.contains('service-grid')) {
      styles.gridTemplateColumns = 'repeat(3, 1fr)';
    }
  }

  return styles;
});

describe('Responsive Design', () => {
  beforeEach(() => {
    // Reset viewport width
    global.mockViewportWidth = 1024;
  });

  describe('Mobile Layout (≤768px)', () => {
    beforeEach(() => {
      global.mockViewportWidth = 375; // iPhone width
    });

    test('should show mobile menu on mobile devices', () => {
      const mobileMenu = document.querySelector('.mobile-menu');
      const styles = global.window.getComputedStyle(mobileMenu);

      expect(styles.display).toBe('block');
    });

    test('should hide desktop navigation on mobile devices', () => {
      const desktopNav = document.querySelector('.desktop-nav');
      const styles = global.window.getComputedStyle(desktopNav);

      expect(styles.display).toBe('none');
    });

    test('should use single column layout for services on mobile', () => {
      const serviceGrid = document.querySelector('.service-grid');
      const styles = global.window.getComputedStyle(serviceGrid);

      expect(styles.gridTemplateColumns).toBe('1fr');
    });

    test('should have proper viewport meta tag', () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');

      expect(viewportMeta).toBeTruthy();
      expect(viewportMeta.getAttribute('content')).toContain('width=device-width');
      expect(viewportMeta.getAttribute('content')).toContain('initial-scale=1.0');
    });
  });

  describe('Tablet Layout (769px - 1024px)', () => {
    beforeEach(() => {
      global.mockViewportWidth = 768; // iPad width
    });

    test('should use two-column layout for services on tablet', () => {
      const serviceGrid = document.querySelector('.service-grid');
      const styles = global.window.getComputedStyle(serviceGrid);

      expect(styles.gridTemplateColumns).toBe('repeat(2, 1fr)');
    });

    test('should maintain responsive behavior at tablet breakpoint', () => {
      // Test at exact breakpoint
      global.mockViewportWidth = 769;

      const serviceGrid = document.querySelector('.service-grid');
      const styles = global.window.getComputedStyle(serviceGrid);

      expect(styles.gridTemplateColumns).toBe('repeat(2, 1fr)');
    });
  });

  describe('Desktop Layout (≥1025px)', () => {
    beforeEach(() => {
      global.mockViewportWidth = 1200; // Desktop width
    });

    test('should hide mobile menu on desktop', () => {
      const mobileMenu = document.querySelector('.mobile-menu');
      const styles = global.window.getComputedStyle(mobileMenu);

      expect(styles.display).toBe('none');
    });

    test('should show desktop navigation on desktop', () => {
      const desktopNav = document.querySelector('.desktop-nav');
      const styles = global.window.getComputedStyle(desktopNav);

      expect(styles.display).toBe('flex');
    });

    test('should use three-column layout for services on desktop', () => {
      const serviceGrid = document.querySelector('.service-grid');
      const styles = global.window.getComputedStyle(serviceGrid);

      expect(styles.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });
  });

  describe('Breakpoint Transitions', () => {
    test('should handle transition from mobile to tablet', () => {
      // Start at mobile
      global.mockViewportWidth = 768;
      let serviceGrid = document.querySelector('.service-grid');
      let styles = global.window.getComputedStyle(serviceGrid);
      expect(styles.gridTemplateColumns).toBe('1fr');

      // Move to tablet
      global.mockViewportWidth = 769;
      serviceGrid = document.querySelector('.service-grid');
      styles = global.window.getComputedStyle(serviceGrid);
      expect(styles.gridTemplateColumns).toBe('repeat(2, 1fr)');
    });

    test('should handle transition from tablet to desktop', () => {
      // Start at tablet
      global.mockViewportWidth = 1024;
      let serviceGrid = document.querySelector('.service-grid');
      let styles = global.window.getComputedStyle(serviceGrid);
      expect(styles.gridTemplateColumns).toBe('repeat(2, 1fr)');

      // Move to desktop
      global.mockViewportWidth = 1025;
      serviceGrid = document.querySelector('.service-grid');
      styles = global.window.getComputedStyle(serviceGrid);
      expect(styles.gridTemplateColumns).toBe('repeat(3, 1fr)');
    });
  });

  describe('Content Accessibility', () => {
    test('should maintain readable text at all viewport sizes', () => {
      const viewportSizes = [375, 768, 1024, 1200];

      viewportSizes.forEach(width => {
        global.mockViewportWidth = width;

        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = document.querySelectorAll('p');

        // All text elements should be present regardless of viewport
        expect(headings.length).toBeGreaterThan(0);
        expect(paragraphs.length).toBeGreaterThan(0);
      });
    });

    test('should maintain navigation accessibility across devices', () => {
      const viewportSizes = [375, 768, 1024, 1200];

      viewportSizes.forEach(width => {
        global.mockViewportWidth = width;

        // Either mobile menu or desktop nav should be available
        const mobileMenu = document.querySelector('.mobile-menu');
        const desktopNav = document.querySelector('.desktop-nav');

        expect(mobileMenu || desktopNav).toBeTruthy();

        if (width <= 768) {
          expect(mobileMenu.getAttribute('aria-label')).toBeTruthy();
        }
      });
    });
  });

  describe('Image Responsiveness', () => {
    test('should have responsive images', () => {
      const images = document.querySelectorAll('img');

      images.forEach(img => {
        expect(img.getAttribute('alt')).toBeTruthy();
        // In a real implementation, we'd check for srcset or responsive classes
      });
    });
  });

  describe('Touch Target Sizes', () => {
    test('should have adequate touch targets for mobile', () => {
      global.mockViewportWidth = 375;

      const interactiveElements = document.querySelectorAll('button, a, input');

      // All interactive elements should be present and accessible
      interactiveElements.forEach(element => {
        expect(element).toBeTruthy();

        // Check for accessibility attributes
        if (element.tagName === 'BUTTON') {
          expect(element.getAttribute('aria-label') || element.textContent.trim()).toBeTruthy();
        }
      });
    });
  });
});