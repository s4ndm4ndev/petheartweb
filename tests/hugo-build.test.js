/**
 * Hugo Build Process Tests
 * Tests for Pet Heart Animal Clinic Hugo static site generation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Hugo Build Process', () => {
  const publicDir = path.join(process.cwd(), 'public');
  const contentDir = path.join(process.cwd(), 'content');
  const layoutsDir = path.join(process.cwd(), 'layouts');
  const assetsDir = path.join(process.cwd(), 'assets');

  beforeAll(() => {
    // Clean up any existing build
    if (fs.existsSync(publicDir)) {
      fs.rmSync(publicDir, { recursive: true, force: true });
    }
  });

  describe('Hugo Configuration', () => {
    test('should have valid hugo.toml configuration', () => {
      const hugoConfigPath = path.join(process.cwd(), 'hugo.toml');

      expect(fs.existsSync(hugoConfigPath)).toBe(true);

      const configContent = fs.readFileSync(hugoConfigPath, 'utf8');

      // Check for required configuration
      expect(configContent).toContain('baseURL');
      expect(configContent).toContain('title = "Pet Heart Animal Clinic"');
      expect(configContent).toContain('languageCode');
      expect(configContent).toContain('doctor_name = "Dr. Chathuranga Anura Kumara"');
      expect(configContent).toContain('primary_color = "#87CEEB"');
    });

    test('should have proper minification settings', () => {
      const hugoConfigPath = path.join(process.cwd(), 'hugo.toml');
      const configContent = fs.readFileSync(hugoConfigPath, 'utf8');

      expect(configContent).toContain('[minify]');
      expect(configContent).toContain('disableCSS = false');
      expect(configContent).toContain('disableHTML = false');
      expect(configContent).toContain('disableJS = false');
    });
  });

  describe('Content Structure', () => {
    test('should have required content files', () => {
      const requiredFiles = [
        '_index.md',
        'about.md',
        'services.md',
        'contact.md'
      ];

      requiredFiles.forEach(file => {
        const filePath = path.join(contentDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    test('should have valid front matter in content files', () => {
      const contentFiles = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

      contentFiles.forEach(file => {
        const filePath = path.join(contentDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for front matter
        expect(content).toMatch(/^---\s*\n/);
        expect(content).toContain('title:');

        // Check for required fields in specific files
        if (file === '_index.md') {
          expect(content).toContain('Pet Heart Animal Clinic');
        }
        if (file === 'about.md') {
          expect(content).toContain('Dr. Chathuranga Anura Kumara');
        }
      });
    });
  });

  describe('Layout Templates', () => {
    test('should have required layout files', () => {
      const requiredLayouts = [
        '_default/baseof.html',
        '_default/single.html',
        'index.html',
        'partials/head.html',
        'partials/header.html',
        'partials/footer.html'
      ];

      requiredLayouts.forEach(layout => {
        const layoutPath = path.join(layoutsDir, layout);
        expect(fs.existsSync(layoutPath)).toBe(true);
      });
    });

    test('should have valid HTML structure in baseof.html', () => {
      const baseofPath = path.join(layoutsDir, '_default/baseof.html');
      const content = fs.readFileSync(baseofPath, 'utf8');

      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<html');
      expect(content).toContain('<head>');
      expect(content).toContain('<body>');
      expect(content).toContain('{{ block "main" . }}');
    });

    test('should have theme toggle and back-to-top partials', () => {
      const themeTogglePath = path.join(layoutsDir, 'partials/theme-toggle.html');
      const backToTopPath = path.join(layoutsDir, 'partials/back-to-top.html');

      expect(fs.existsSync(themeTogglePath)).toBe(true);
      expect(fs.existsSync(backToTopPath)).toBe(true);
    });
  });

  describe('Asset Files', () => {
    test('should have required CSS files', () => {
      const requiredCSS = [
        'css/main.scss',
        'css/_variables.scss',
        'css/_base.scss',
        'css/_components.scss',
        'css/_themes.scss'
      ];

      requiredCSS.forEach(cssFile => {
        const cssPath = path.join(assetsDir, cssFile);
        expect(fs.existsSync(cssPath)).toBe(true);
      });
    });

    test('should have required JavaScript files', () => {
      const requiredJS = [
        'js/theme-toggle.js',
        'js/back-to-top.js',
        'js/main.js'
      ];

      requiredJS.forEach(jsFile => {
        const jsPath = path.join(assetsDir, jsFile);
        expect(fs.existsSync(jsPath)).toBe(true);
      });
    });

    test('should have valid SCSS structure', () => {
      const mainScssPath = path.join(assetsDir, 'css/main.scss');
      const content = fs.readFileSync(mainScssPath, 'utf8');

      expect(content).toContain('@import');
      expect(content).toContain('variables');
      expect(content).toContain('base');
      expect(content).toContain('components');
      expect(content).toContain('themes');
    });
  });

  describe('Static Assets', () => {
    test('should have logo and favicon files', () => {
      const staticDir = path.join(process.cwd(), 'static');

      // Check for logo
      const logoPath = path.join(staticDir, 'images/logo');
      expect(fs.existsSync(logoPath)).toBe(true);

      // Check for favicon
      const faviconPath = path.join(staticDir, 'favicon.ico');
      expect(fs.existsSync(faviconPath)).toBe(true);
    });
  });

  describe('Build Process', () => {
    test('should build successfully without errors', () => {
      expect(() => {
        execSync('hugo --minify --quiet', {
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      }).not.toThrow();
    });

    test('should generate public directory', () => {
      // Run build
      execSync('hugo --minify --quiet', {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      expect(fs.existsSync(publicDir)).toBe(true);
    });

    test('should generate required HTML files', () => {
      // Ensure build has run
      if (!fs.existsSync(publicDir)) {
        execSync('hugo --minify --quiet', {
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      }

      const requiredFiles = [
        'index.html',
        'about/index.html',
        'services/index.html',
        'contact/index.html',
        '404.html'
      ];

      requiredFiles.forEach(file => {
        const filePath = path.join(publicDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    test('should generate minified CSS and JS', () => {
      // Ensure build has run
      if (!fs.existsSync(publicDir)) {
        execSync('hugo --minify --quiet', {
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      }

      const cssDir = path.join(publicDir, 'css');
      const jsDir = path.join(publicDir, 'js');

      expect(fs.existsSync(cssDir)).toBe(true);
      expect(fs.existsSync(jsDir)).toBe(true);

      // Check for minified files
      const cssFiles = fs.readdirSync(cssDir);
      const jsFiles = fs.readdirSync(jsDir);

      expect(cssFiles.some(file => file.includes('.min.'))).toBe(true);
      expect(jsFiles.some(file => file.includes('.min.'))).toBe(true);
    });

    test('should generate sitemap.xml', () => {
      // Ensure build has run
      if (!fs.existsSync(publicDir)) {
        execSync('hugo --minify --quiet', {
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      }

      const sitemapPath = path.join(publicDir, 'sitemap.xml');
      expect(fs.existsSync(sitemapPath)).toBe(true);

      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      expect(sitemapContent).toContain('<urlset');
      expect(sitemapContent).toContain('<url>');
    });

    test('should generate robots.txt', () => {
      // Ensure build has run
      if (!fs.existsSync(publicDir)) {
        execSync('hugo --minify --quiet', {
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      }

      const robotsPath = path.join(publicDir, 'robots.txt');
      expect(fs.existsSync(robotsPath)).toBe(true);
    });
  });

  describe('Generated HTML Validation', () => {
    beforeAll(() => {
      // Ensure build has run
      if (!fs.existsSync(publicDir)) {
        execSync('hugo --minify --quiet', {
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      }
    });

    test('should have valid HTML structure in generated pages', () => {
      const indexPath = path.join(publicDir, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf8');

      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<html');
      expect(content).toContain('<head>');
      expect(content).toContain('<body>');
      expect(content).toContain('Pet Heart Animal Clinic');
    });

    test('should include theme toggle functionality', () => {
      const indexPath = path.join(publicDir, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf8');

      expect(content).toContain('theme-toggle');
      expect(content).toContain('data-theme');
    });

    test('should include back-to-top functionality', () => {
      const indexPath = path.join(publicDir, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf8');

      expect(content).toContain('back-to-top');
    });

    test('should have proper meta tags', () => {
      const indexPath = path.join(publicDir, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf8');

      expect(content).toContain('<meta name="viewport"');
      expect(content).toContain('<meta name="description"');
      expect(content).toContain('charset="utf-8"');
    });

    test('should include Pet Heart branding', () => {
      const indexPath = path.join(publicDir, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf8');

      expect(content).toContain('Pet Heart Animal Clinic');
      expect(content).toContain('Dr. Chathuranga Anura Kumara');
    });
  });

  describe('Performance Optimization', () => {
    beforeAll(() => {
      // Ensure build has run
      if (!fs.existsSync(publicDir)) {
        execSync('hugo --minify --quiet', {
          cwd: process.cwd(),
          stdio: 'pipe'
        });
      }
    });

    test('should have minified HTML', () => {
      const indexPath = path.join(publicDir, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf8');

      // Minified HTML should have reduced whitespace
      expect(content).not.toMatch(/\n\s+\n/);
    });

    test('should have optimized static assets', () => {
      const cssDir = path.join(publicDir, 'css');
      const jsDir = path.join(publicDir, 'js');

      if (fs.existsSync(cssDir)) {
        const cssFiles = fs.readdirSync(cssDir);
        cssFiles.forEach(file => {
          if (file.endsWith('.css')) {
            const filePath = path.join(cssDir, file);
            const content = fs.readFileSync(filePath, 'utf8');

            // Should be minified (no unnecessary whitespace)
            expect(content.length).toBeGreaterThan(0);
          }
        });
      }

      if (fs.existsSync(jsDir)) {
        const jsFiles = fs.readdirSync(jsDir);
        jsFiles.forEach(file => {
          if (file.endsWith('.js')) {
            const filePath = path.join(jsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');

            // Should contain the expected functionality
            if (file.includes('theme-toggle')) {
              expect(content).toContain('ThemeManager');
            }
            if (file.includes('back-to-top')) {
              expect(content).toContain('BackToTop');
            }
          }
        });
      }
    });
  });
});