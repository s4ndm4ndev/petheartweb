/**
 * Back to Top Functionality Tests
 * Tests for Pet Heart Animal Clinic back-to-top component
 */

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');

// Create a mock DOM environment with scrollable content
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Pet Heart Animal Clinic</title>
    </head>
    <body style="height: 2000px;">
      <header>
        <h1>Pet Heart Animal Clinic</h1>
      </header>
      <main id="main-content" tabindex="-1">
        <p>Main content here</p>
      </main>
      <button id="back-to-top-btn" aria-label="Back to top" aria-hidden="true">
        Back to Top
      </button>
      <div id="sr-live-region" aria-live="polite"></div>
    </body>
  </html>
`, {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

// Set up global DOM objects
global.window = dom.window;
global.document = dom.window.document;

// Mock scroll properties and methods
Object.defineProperty(global.window, 'pageYOffset', {
  value: 0,
  writable: true
});

Object.defineProperty(global.document.documentElement, 'scrollTop', {
  value: 0,
  writable: true
});

global.window.scrollTo = jest.fn();

// Mock setTimeout for testing
global.setTimeout = jest.fn((callback, delay) => {
  // Execute immediately for testing
  callback();
  return 1;
});

global.clearTimeout = jest.fn();

// Import the BackToTop class after setting up mocks
const BackToTop = require('../assets/js/back-to-top.js');

describe('BackToTop', () => {
  let backToTop;
  let button;

  beforeEach(() => {
    // Reset scroll position
    global.window.pageYOffset = 0;
    global.document.documentElement.scrollTop = 0;

    // Reset button state
    button = document.getElementById('back-to-top-btn');
    button.classList.remove('visible');
    button.setAttribute('aria-hidden', 'true');

    // Clear mocks
    jest.clearAllMocks();

    // Create new instance
    backToTop = new BackToTop();
  });

  describe('Initialization', () => {
    test('should find back-to-top button in DOM', () => {
      expect(backToTop.button).toBeTruthy();
      expect(backToTop.button.id).toBe('back-to-top-btn');
    });

    test('should set default scroll threshold', () => {
      expect(backToTop.scrollThreshold).toBe(300);
    });

    test('should initialize as not visible', () => {
      expect(backToTop.isVisible).toBe(false);
    });

    test('should handle missing button gracefully', () => {
      // Remove button from DOM
      button.remove();

      // Should not throw error
      expect(() => {
        new BackToTop();
      }).not.toThrow();
    });
  });

  describe('Scroll Detection', () => {
    test('should show button when scrolled past threshold', () => {
      // Simulate scroll past threshold
      global.window.pageYOffset = 400;

      backToTop.handleScroll();

      expect(button.classList.contains('visible')).toBe(true);
      expect(button.getAttribute('aria-hidden')).toBe('false');
      expect(backToTop.isVisible).toBe(true);
    });

    test('should hide button when scrolled above threshold', () => {
      // First show the button
      backToTop.isVisible = true;
      button.classList.add('visible');
      button.setAttribute('aria-hidden', 'false');

      // Then simulate scroll above threshold
      global.window.pageYOffset = 200;

      backToTop.handleScroll();

      expect(button.classList.contains('visible')).toBe(false);
      expect(button.getAttribute('aria-hidden')).toBe('true');
      expect(backToTop.isVisible).toBe(false);
    });

    test('should not show button when at top of page', () => {
      global.window.pageYOffset = 0;

      backToTop.handleScroll();

      expect(button.classList.contains('visible')).toBe(false);
      expect(backToTop.isVisible).toBe(false);
    });

    test('should handle scroll at exact threshold', () => {
      global.window.pageYOffset = 300;

      backToTop.handleScroll();

      expect(button.classList.contains('visible')).toBe(false);
      expect(backToTop.isVisible).toBe(false);
    });
  });

  describe('Scroll to Top Functionality', () => {
    test('should call window.scrollTo with smooth behavior', () => {
      backToTop.scrollToTop();

      expect(global.window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });

    test('should announce scroll action to screen readers', () => {
      const liveRegion = document.getElementById('sr-live-region');

      backToTop.scrollToTop();

      expect(liveRegion.textContent).toContain('Scrolled to top of page');
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    });

    test('should focus main content after scrolling', () => {
      const mainContent = document.getElementById('main-content');
      mainContent.focus = jest.fn();

      backToTop.scrollToTop();

      expect(mainContent.focus).toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    test('should handle click events', () => {
      const scrollToTopSpy = jest.spyOn(backToTop, 'scrollToTop');

      // Simulate click event
      const clickEvent = new dom.window.Event('click');
      clickEvent.preventDefault = jest.fn();

      button.dispatchEvent(clickEvent);

      expect(clickEvent.preventDefault).toHaveBeenCalled();
      expect(scrollToTopSpy).toHaveBeenCalled();
    });

    test('should handle Enter key press', () => {
      const scrollToTopSpy = jest.spyOn(backToTop, 'scrollToTop');

      // Simulate Enter key event
      const keyEvent = new dom.window.KeyboardEvent('keydown', { key: 'Enter' });
      keyEvent.preventDefault = jest.fn();

      button.dispatchEvent(keyEvent);

      expect(keyEvent.preventDefault).toHaveBeenCalled();
      expect(scrollToTopSpy).toHaveBeenCalled();
    });

    test('should handle Space key press', () => {
      const scrollToTopSpy = jest.spyOn(backToTop, 'scrollToTop');

      // Simulate Space key event
      const keyEvent = new dom.window.KeyboardEvent('keydown', { key: ' ' });
      keyEvent.preventDefault = jest.fn();

      button.dispatchEvent(keyEvent);

      expect(keyEvent.preventDefault).toHaveBeenCalled();
      expect(scrollToTopSpy).toHaveBeenCalled();
    });

    test('should ignore other key presses', () => {
      const scrollToTopSpy = jest.spyOn(backToTop, 'scrollToTop');

      // Simulate other key event
      const keyEvent = new dom.window.KeyboardEvent('keydown', { key: 'Tab' });
      keyEvent.preventDefault = jest.fn();

      button.dispatchEvent(keyEvent);

      expect(keyEvent.preventDefault).not.toHaveBeenCalled();
      expect(scrollToTopSpy).not.toHaveBeenCalled();
    });
  });

  describe('Performance Optimization', () => {
    test('should throttle scroll events', () => {
      const handleScrollSpy = jest.spyOn(backToTop, 'handleScroll');

      // Simulate multiple rapid scroll events
      const scrollEvent = new dom.window.Event('scroll');
      global.window.dispatchEvent(scrollEvent);
      global.window.dispatchEvent(scrollEvent);
      global.window.dispatchEvent(scrollEvent);

      // Should only call handleScroll once due to throttling
      expect(handleScrollSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility Features', () => {
    test('should have proper ARIA attributes when hidden', () => {
      backToTop.hideButton();

      expect(button.getAttribute('aria-hidden')).toBe('true');
    });

    test('should have proper ARIA attributes when visible', () => {
      backToTop.showButton();

      expect(button.getAttribute('aria-hidden')).toBe('false');
    });

    test('should clear announcement after timeout', () => {
      const liveRegion = document.getElementById('sr-live-region');

      backToTop.announceScrollAction();

      // setTimeout should be called to clear the message
      expect(global.setTimeout).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    test('should handle missing button gracefully in show/hide methods', () => {
      backToTop.button = null;

      expect(() => {
        backToTop.showButton();
        backToTop.hideButton();
      }).not.toThrow();
    });

    test('should handle missing live region gracefully', () => {
      const liveRegion = document.getElementById('sr-live-region');
      liveRegion.remove();

      expect(() => {
        backToTop.announceScrollAction();
      }).not.toThrow();
    });

    test('should handle missing focus targets gracefully', () => {
      const mainContent = document.getElementById('main-content');
      mainContent.remove();

      expect(() => {
        backToTop.scrollToTop();
      }).not.toThrow();
    });
  });
});