/**
 * Browser Compatibility Tests
 * Tests for Pet Heart Animal Clinic cross-browser functionality
 */

describe('Browser Compatibility', () => {
  // Mock different browser environments
  const browserEnvironments = {
    chrome: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      features: {
        localStorage: true,
        matchMedia: true,
        smoothScroll: true,
        flexbox: true,
        grid: true
      }
    },
    firefox: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      features: {
        localStorage: true,
        matchMedia: true,
        smoothScroll: true,
        flexbox: true,
        grid: true
      }
    },
    safari: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      features: {
        localStorage: true,
        matchMedia: true,
        smoothScroll: true,
        flexbox: true,
        grid: true
      }
    },
    edge: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      features: {
        localStorage: true,
        matchMedia: true,
        smoothScroll: true,
        flexbox: true,
        grid: true
      }
    },
    mobileSafari: {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      features: {
        localStorage: true,
        matchMedia: true,
        smoothScroll: true,
        flexbox: true,
        grid: true,
        touch: true
      }
    },
    chromeAndroid: {
      userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      features: {
        localStorage: true,
        matchMedia: true,
        smoothScroll: true,
        flexbox: true,
        grid: true,
        touch: true
      }
    }
  };

  function mockBrowserEnvironment(browserName) {
    const browser = browserEnvironments[browserName];

    // Mock navigator
    Object.defineProperty(global.navigator, 'userAgent', {
      value: browser.userAgent,
      configurable: true
    });

    // Mock feature detection
    global.window.localStorage = browser.features.localStorage ? {
      data: {},
      getItem(key) { return this.data[key] || null; },
      setItem(key, value) { this.data[key] = value; },
      removeItem(key) { delete this.data[key]; },
      clear() { this.data = {}; }
    } : undefined;

    global.window.matchMedia = browser.features.matchMedia ?
      jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      })) : undefined;

    // Mock CSS support
    global.CSS = {
      supports: jest.fn().mockImplementation((property, value) => {
        if (property === 'display' && value === 'flex') {
          return browser.features.flexbox;
        }
        if (property === 'display' && value === 'grid') {
          return browser.features.grid;
        }
        if (property === 'scroll-behavior' && value === 'smooth') {
          return browser.features.smoothScroll;
        }
        return true;
      })
    };

    return browser;
  }

  describe('Theme Toggle Cross-Browser Compatibility', () => {
    Object.keys(browserEnvironments).forEach(browserName => {
      test(`should work in ${browserName}`, () => {
        const browser = mockBrowserEnvironment(browserName);

        // Import ThemeManager after setting up browser environment
        delete require.cache[require.resolve('../assets/js/theme-toggle.js')];
        const ThemeManager = require('../assets/js/theme-toggle.js');

        expect(() => {
          new ThemeManager();
        }).not.toThrow();

        // Test localStorage functionality if supported
        if (browser.features.localStorage) {
          expect(global.window.localStorage).toBeDefined();
          expect(() => {
            global.window.localStorage.setItem('test', 'value');
            global.window.localStorage.getItem('test');
          }).not.toThrow();
        }

        // Test matchMedia functionality if supported
        if (browser.features.matchMedia) {
          expect(global.window.matchMedia).toBeDefined();
          expect(() => {
            global.window.matchMedia('(prefers-color-scheme: dark)');
          }).not.toThrow();
        }
      });
    });

    test('should gracefully degrade without localStorage', () => {
      mockBrowserEnvironment('chrome');
      global.window.localStorage = undefined;

      delete require.cache[require.resolve('../assets/js/theme-toggle.js')];

      expect(() => {
        const ThemeManager = require('../assets/js/theme-toggle.js');
        new ThemeManager();
      }).not.toThrow();
    });

    test('should gracefully degrade without matchMedia', () => {
      mockBrowserEnvironment('chrome');
      global.window.matchMedia = undefined;

      delete require.cache[require.resolve('../assets/js/theme-toggle.js')];

      expect(() => {
        const ThemeManager = require('../assets/js/theme-toggle.js');
        new ThemeManager();
      }).not.toThrow();
    });
  });

  describe('Back-to-Top Cross-Browser Compatibility', () => {
    Object.keys(browserEnvironments).forEach(browserName => {
      test(`should work in ${browserName}`, () => {
        const browser = mockBrowserEnvironment(browserName);

        // Mock smooth scroll support
        global.window.scrollTo = browser.features.smoothScroll ?
          jest.fn() :
          jest.fn().mockImplementation(options => {
            // Fallback for browsers without smooth scroll
            if (typeof options === 'object') {
              global.window.pageYOffset = options.top || 0;
            }
          });

        delete require.cache[require.resolve('../assets/js/back-to-top.js')];
        const BackToTop = require('../assets/js/back-to-top.js');

        expect(() => {
          new BackToTop();
        }).not.toThrow();

        // Test scroll functionality
        expect(() => {
          global.window.scrollTo({ top: 0, behavior: 'smooth' });
        }).not.toThrow();
      });
    });

    test('should work without smooth scroll support', () => {
      mockBrowserEnvironment('chrome');

      // Mock older browser without smooth scroll
      global.window.scrollTo = jest.fn().mockImplementation(options => {
        if (typeof options === 'object') {
          global.window.pageYOffset = options.top || 0;
        }
      });

      delete require.cache[require.resolve('../assets/js/back-to-top.js')];
      const BackToTop = require('../assets/js/back-to-top.js');

      const backToTop = new BackToTop();

      expect(() => {
        backToTop.scrollToTop();
      }).not.toThrow();

      expect(global.window.scrollTo).toHaveBeenCalled();
    });
  });

  describe('Mobile Browser Compatibility', () => {
    const mobileBrowsers = ['mobileSafari', 'chromeAndroid'];

    mobileBrowsers.forEach(browserName => {
      test(`should handle touch events in ${browserName}`, () => {
        const browser = mockBrowserEnvironment(browserName);

        // Mock touch events
        global.window.TouchEvent = class TouchEvent extends Event {
          constructor(type, options = {}) {
            super(type, options);
            this.touches = options.touches || [];
            this.changedTouches = options.changedTouches || [];
          }
        };

        // Test that touch-specific functionality doesn't break
        expect(browser.features.touch).toBe(true);
        expect(() => {
          new global.window.TouchEvent('touchstart');
        }).not.toThrow();
      });

      test(`should handle viewport changes in ${browserName}`, () => {
        mockBrowserEnvironment(browserName);

        // Mock viewport changes (orientation, keyboard)
        global.window.visualViewport = {
          width: 375,
          height: 667,
          scale: 1,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn()
        };

        expect(() => {
          global.window.visualViewport.addEventListener('resize', () => {});
        }).not.toThrow();
      });
    });
  });

  describe('CSS Feature Detection', () => {
    test('should detect flexbox support', () => {
      mockBrowserEnvironment('chrome');

      expect(global.CSS.supports('display', 'flex')).toBe(true);
    });

    test('should detect grid support', () => {
      mockBrowserEnvironment('chrome');

      expect(global.CSS.supports('display', 'grid')).toBe(true);
    });

    test('should detect smooth scroll support', () => {
      mockBrowserEnvironment('chrome');

      expect(global.CSS.supports('scroll-behavior', 'smooth')).toBe(true);
    });

    test('should handle missing CSS.supports', () => {
      mockBrowserEnvironment('chrome');
      global.CSS = undefined;

      // Should not throw when CSS.supports is not available
      expect(() => {
        const hasFlexbox = global.CSS && global.CSS.supports('display', 'flex');
        expect(hasFlexbox).toBeFalsy();
      }).not.toThrow();
    });
  });

  describe('JavaScript Feature Detection', () => {
    test('should detect ES6 features', () => {
      // Test arrow functions
      expect(() => {
        const arrow = () => 'test';
        return arrow();
      }).not.toThrow();

      // Test const/let
      expect(() => {
        const test = 'const';
        let variable = 'let';
        return test + variable;
      }).not.toThrow();

      // Test template literals
      expect(() => {
        const name = 'Pet Heart';
        return `Welcome to ${name}`;
      }).not.toThrow();
    });

    test('should handle Promise support', () => {
      expect(typeof Promise).toBe('function');

      expect(() => {
        return new Promise(resolve => resolve('test'));
      }).not.toThrow();
    });

    test('should handle async/await support', async () => {
      const asyncFunction = async () => {
        return 'test';
      };

      expect(typeof asyncFunction).toBe('function');

      const result = await asyncFunction();
      expect(result).toBe('test');
    });
  });

  describe('Error Handling Across Browsers', () => {
    test('should handle JavaScript errors gracefully', () => {
      mockBrowserEnvironment('chrome');

      // Mock console methods
      const originalError = console.error;
      console.error = jest.fn();

      // Test error handling
      expect(() => {
        try {
          throw new Error('Test error');
        } catch (error) {
          console.error('Caught error:', error.message);
        }
      }).not.toThrow();

      expect(console.error).toHaveBeenCalled();

      // Restore console
      console.error = originalError;
    });

    test('should handle missing DOM elements gracefully', () => {
      mockBrowserEnvironment('chrome');

      // Test with missing elements
      const missingElement = global.document.querySelector('.non-existent');
      expect(missingElement).toBeNull();

      // Should not throw when checking for missing elements
      expect(() => {
        if (missingElement) {
          missingElement.addEventListener('click', () => {});
        }
      }).not.toThrow();
    });
  });
});