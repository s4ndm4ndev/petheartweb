/**
 * Jest Test Setup
 * Global test configuration for Pet Heart Animal Clinic tests
 */

// Extend Jest matchers
expect.extend({
  toBeAccessible(received) {
    const pass = received && (
      received.getAttribute('aria-label') ||
      received.getAttribute('aria-labelledby') ||
      received.getAttribute('aria-describedby') ||
      received.textContent.trim()
    );

    if (pass) {
      return {
        message: () => `expected element not to be accessible`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be accessible (have aria-label, aria-labelledby, aria-describedby, or text content)`,
        pass: false,
      };
    }
  },

  toHaveValidTheme(received) {
    const theme = received.getAttribute('data-theme');
    const pass = theme === 'light' || theme === 'dark';

    if (pass) {
      return {
        message: () => `expected element not to have valid theme`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to have valid theme (light or dark), but got "${theme}"`,
        pass: false,
      };
    }
  },

  toBeResponsive(received) {
    const hasViewportMeta = !!received.querySelector('meta[name="viewport"]');
    const hasMediaQueries = received.innerHTML.includes('@media');

    const pass = hasViewportMeta || hasMediaQueries;

    if (pass) {
      return {
        message: () => `expected element not to be responsive`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be responsive (have viewport meta tag or media queries)`,
        pass: false,
      };
    }
  }
});

// Global test utilities
global.testUtils = {
  /**
   * Simulate scroll event
   * @param {number} scrollY - Scroll position
   */
  simulateScroll(scrollY) {
    global.window.pageYOffset = scrollY;
    global.document.documentElement.scrollTop = scrollY;

    const scrollEvent = new global.window.Event('scroll');
    global.window.dispatchEvent(scrollEvent);
  },

  /**
   * Simulate theme change
   * @param {boolean} isDark - Whether system prefers dark theme
   */
  simulateSystemThemeChange(isDark) {
    const mediaQuery = global.window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.matches = isDark;

    const changeEvent = { matches: isDark };
    mediaQuery.listeners?.forEach(listener => listener(changeEvent));
  },

  /**
   * Simulate viewport resize
   * @param {number} width - New viewport width
   */
  simulateViewportResize(width) {
    global.mockViewportWidth = width;

    // Update all media queries
    const queries = [
      '(max-width: 768px)',
      '(max-width: 1024px)',
      '(min-width: 769px)',
      '(min-width: 1025px)'
    ];

    queries.forEach(query => {
      const mediaQuery = global.window.matchMedia(query);
      const oldMatches = mediaQuery.matches;

      // Re-evaluate query
      if (query.includes('max-width: 768px')) {
        mediaQuery.matches = width <= 768;
      } else if (query.includes('max-width: 1024px')) {
        mediaQuery.matches = width <= 1024;
      } else if (query.includes('min-width: 769px')) {
        mediaQuery.matches = width >= 769;
      } else if (query.includes('min-width: 1025px')) {
        mediaQuery.matches = width >= 1025;
      }

      // Trigger change event if matches changed
      if (oldMatches !== mediaQuery.matches) {
        mediaQuery.dispatchEvent();
      }
    });
  },

  /**
   * Wait for async operations
   * @param {number} ms - Milliseconds to wait
   */
  async wait(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Get element computed styles (mocked)
   * @param {Element} element - DOM element
   * @returns {Object} Computed styles
   */
  getComputedStyle(element) {
    return global.window.getComputedStyle(element);
  }
};

// Console warnings for common issues
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  // Filter out expected warnings during testing
  const message = args.join(' ');

  if (
    message.includes('Back to top button not found') ||
    message.includes('Theme management failed')
  ) {
    // These are expected in some test scenarios
    return;
  }

  originalConsoleWarn.apply(console, args);
};

// Set up default test environment
beforeEach(() => {
  // Clear all mocks
  jest.clearAllMocks();

  // Reset console methods
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterEach(() => {
  // Clean up any global state
  if (global.localStorage) {
    global.localStorage.clear();
  }

  // Reset viewport width
  global.mockViewportWidth = 1024;
});