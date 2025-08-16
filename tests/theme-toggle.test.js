/**
 * Theme Toggle Functionality Tests
 * Tests for Pet Heart Animal Clinic theme management system
 */

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');

// Create a mock DOM environment
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Pet Heart Animal Clinic</title>
    </head>
    <body>
      <button class="theme-toggle" aria-label="Switch to dark mode">Toggle Theme</button>
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
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Mock matchMedia
global.window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: query === '(prefers-color-scheme: dark)',
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Import the ThemeManager after setting up mocks
const ThemeManager = require('../assets/js/theme-toggle.js');

describe('ThemeManager', () => {
  let themeManager;

  beforeEach(() => {
    // Clear localStorage before each test
    global.localStorage.clear();

    // Reset DOM state
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.className = '';

    // Create new instance
    themeManager = new ThemeManager();
  });

  afterEach(() => {
    // Clean up
    global.localStorage.clear();
  });

  describe('System Theme Detection', () => {
    test('should detect light theme when system prefers light', () => {
      global.window.matchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      const theme = themeManager.detectSystemTheme();
      expect(theme).toBe('light');
    });

    test('should detect dark theme when system prefers dark', () => {
      global.window.matchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      const theme = themeManager.detectSystemTheme();
      expect(theme).toBe('dark');
    });
  });

  describe('Theme Setting', () => {
    test('should set light theme correctly', () => {
      themeManager.setTheme('light');

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.classList.contains('theme-transitioning')).toBe(true);
    });

    test('should set dark theme correctly', () => {
      themeManager.setTheme('dark');

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.documentElement.classList.contains('theme-transitioning')).toBe(true);
    });

    test('should remove transition class after timeout', (done) => {
      themeManager.setTheme('dark');

      setTimeout(() => {
        expect(document.documentElement.classList.contains('theme-transitioning')).toBe(false);
        done();
      }, 350);
    });
  });

  describe('User Preference Management', () => {
    test('should save user preference to localStorage', () => {
      themeManager.toggleTheme();

      const savedTheme = global.localStorage.getItem('pet-heart-theme-preference');
      expect(savedTheme).toBeTruthy();
      expect(['light', 'dark']).toContain(savedTheme);
    });

    test('should load saved preference from localStorage', () => {
      global.localStorage.setItem('pet-heart-theme-preference', 'dark');

      const newManager = new ThemeManager();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should clear preference and revert to system theme', () => {
      global.localStorage.setItem('pet-heart-theme-preference', 'dark');

      themeManager.clearPreference();

      expect(global.localStorage.getItem('pet-heart-theme-preference')).toBeNull();
    });
  });

  describe('Theme Toggle Functionality', () => {
    test('should toggle from light to dark', () => {
      document.documentElement.setAttribute('data-theme', 'light');

      themeManager.toggleTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should toggle from dark to light', () => {
      document.documentElement.setAttribute('data-theme', 'dark');

      themeManager.toggleTheme();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('Button State Updates', () => {
    test('should update button aria-label for light theme', () => {
      const button = document.querySelector('.theme-toggle');

      themeManager.updateToggleButton('light');

      expect(button.getAttribute('aria-label')).toBe('Switch to dark mode');
      expect(button.getAttribute('title')).toBe('Switch to dark mode');
      expect(button.className).toContain('moon-icon');
    });

    test('should update button aria-label for dark theme', () => {
      const button = document.querySelector('.theme-toggle');

      themeManager.updateToggleButton('dark');

      expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
      expect(button.getAttribute('title')).toBe('Switch to light mode');
      expect(button.className).toContain('sun-icon');
    });
  });

  describe('Accessibility Features', () => {
    test('should announce theme changes to screen readers', () => {
      const liveRegion = document.getElementById('sr-live-region');

      themeManager.announceThemeChange('dark');

      expect(liveRegion.textContent).toContain('Switched to dark mode');
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    });

    test('should clear announcement after timeout', (done) => {
      const liveRegion = document.getElementById('sr-live-region');

      themeManager.announceThemeChange('light');

      setTimeout(() => {
        expect(liveRegion.textContent).toBe('');
        done();
      }, 2100);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing toggle button gracefully', () => {
      // Remove button from DOM
      const button = document.querySelector('.theme-toggle');
      button.remove();

      // Should not throw error
      expect(() => {
        const newManager = new ThemeManager();
        newManager.updateToggleButton('dark');
      }).not.toThrow();
    });

    test('should handle invalid theme values', () => {
      // Should not throw error with invalid theme
      expect(() => {
        themeManager.setTheme('invalid-theme');
      }).not.toThrow();

      expect(document.documentElement.getAttribute('data-theme')).toBe('invalid-theme');
    });
  });
});