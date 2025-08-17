#!/usr/bin/env node

/**
 * Comprehensive Functionality Validation Script
 * Validates all aspects of the Pet Heart Animal Clinic website
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class FunctionalityValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '✓',
      'error': '✗',
      'warning': '⚠',
      'section': '▶'
    }[type] || 'ℹ';

    console.log(`${prefix} [${timestamp}] ${message}`);

    this.results.details.push({
      timestamp,
      type,
      message
    });
  }

  pass(message) {
    this.results.passed++;
    this.log(message, 'info');
  }

  fail(message) {
    this.results.failed++;
    this.log(message, 'error');
  }

  warn(message) {
    this.results.warnings++;
    this.log(message, 'warning');
  }

  section(message) {
    this.log(`\n${message}`, 'section');
  }

  /**
   * Validate Hugo build process
   */
  validateHugoBuild() {
    this.section('Validating Hugo Build Process');

    try {
      // Check if Hugo is installed
      execSync('hugo version', { stdio: 'pipe' });
      this.pass('Hugo is installed and accessible');
    } catch (error) {
      this.fail('Hugo is not installed or not in PATH');
      return false;
    }

    try {
      // Clean previous build
      const publicDir = path.join(process.cwd(), 'public');
      if (fs.existsSync(publicDir)) {
        fs.rmSync(publicDir, { recursive: true, force: true });
        this.pass('Cleaned previous build directory');
      }

      // Run Hugo build
      execSync('hugo --minify --quiet', { stdio: 'pipe' });
      this.pass('Hugo build completed successfully');

      // Verify public directory was created
      if (fs.existsSync(publicDir)) {
        this.pass('Public directory generated');
      } else {
        this.fail('Public directory not generated');
        return false;
      }

      // Check for required files
      const requiredFiles = [
        'index.html',
        'about/index.html',
        'services/index.html',
        'contact/index.html',
        '404.html',
        'sitemap.xml',
        'robots.txt'
      ];

      requiredFiles.forEach(file => {
        const filePath = path.join(publicDir, file);
        if (fs.existsSync(filePath)) {
          this.pass(`Generated ${file}`);
        } else {
          this.fail(`Missing ${file}`);
        }
      });

      // Check for minified assets
      const cssDir = path.join(publicDir, 'css');
      const jsDir = path.join(publicDir, 'js');

      if (fs.existsSync(cssDir)) {
        const cssFiles = fs.readdirSync(cssDir);
        if (cssFiles.some(file => file.includes('.min.'))) {
          this.pass('CSS files are minified');
        } else {
          this.warn('CSS files may not be minified');
        }
      }

      if (fs.existsSync(jsDir)) {
        const jsFiles = fs.readdirSync(jsDir);
        if (jsFiles.some(file => file.includes('.min.'))) {
          this.pass('JavaScript files are minified');
        } else {
          this.warn('JavaScript files may not be minified');
        }
      }

      return true;
    } catch (error) {
      this.fail(`Hugo build failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Validate theme toggle functionality
   */
  validateThemeToggle() {
    this.section('Validating Theme Toggle Functionality');

    const themeTogglePath = path.join(process.cwd(), 'assets/js/theme-toggle.js');

    if (!fs.existsSync(themeTogglePath)) {
      this.fail('Theme toggle JavaScript file not found');
      return false;
    }

    const content = fs.readFileSync(themeTogglePath, 'utf8');

    // Check for required functionality
    const requiredFeatures = [
      'ThemeManager',
      'detectSystemTheme',
      'toggleTheme',
      'setTheme',
      'localStorage',
      'data-theme',
      'aria-label'
    ];

    requiredFeatures.forEach(feature => {
      if (content.includes(feature)) {
        this.pass(`Theme toggle includes ${feature}`);
      } else {
        this.fail(`Theme toggle missing ${feature}`);
      }
    });

    // Check for accessibility features
    if (content.includes('aria-live')) {
      this.pass('Theme toggle includes screen reader announcements');
    } else {
      this.warn('Theme toggle may be missing screen reader support');
    }

    // Check for smooth transitions
    if (content.includes('theme-transitioning')) {
      this.pass('Theme toggle includes smooth transitions');
    } else {
      this.warn('Theme toggle may be missing smooth transitions');
    }

    return true;
  }

  /**
   * Validate back-to-top functionality
   */
  validateBackToTop() {
    this.section('Validating Back-to-Top Functionality');

    const backToTopPath = path.join(process.cwd(), 'assets/js/back-to-top.js');

    if (!fs.existsSync(backToTopPath)) {
      this.fail('Back-to-top JavaScript file not found');
      return false;
    }

    const content = fs.readFileSync(backToTopPath, 'utf8');

    // Check for required functionality
    const requiredFeatures = [
      'BackToTop',
      'scrollThreshold',
      'handleScroll',
      'scrollToTop',
      'smooth',
      'visible',
      'aria-hidden'
    ];

    requiredFeatures.forEach(feature => {
      if (content.includes(feature)) {
        this.pass(`Back-to-top includes ${feature}`);
      } else {
        this.fail(`Back-to-top missing ${feature}`);
      }
    });

    // Check for performance optimization
    if (content.includes('setTimeout') || content.includes('throttl')) {
      this.pass('Back-to-top includes performance optimization');
    } else {
      this.warn('Back-to-top may be missing scroll throttling');
    }

    // Check for accessibility
    if (content.includes('focus') && content.includes('aria-live')) {
      this.pass('Back-to-top includes accessibility features');
    } else {
      this.warn('Back-to-top may be missing accessibility features');
    }

    return true;
  }

  /**
   * Validate responsive design
   */
  validateResponsiveDesign() {
    this.section('Validating Responsive Design');

    // Check for viewport meta tag in layouts
    const baseofPath = path.join(process.cwd(), 'layouts/_default/baseof.html');

    if (!fs.existsSync(baseofPath)) {
      this.fail('Base layout template not found');
      return false;
    }

    const baseofContent = fs.readFileSync(baseofPath, 'utf8');

    if (baseofContent.includes('viewport') && baseofContent.includes('width=device-width')) {
      this.pass('Viewport meta tag configured correctly');
    } else {
      this.fail('Viewport meta tag missing or incorrect');
    }

    // Check CSS for media queries
    const cssFiles = [
      'assets/css/main.scss',
      'assets/css/_base.scss',
      'assets/css/_components.scss'
    ];

    let hasMediaQueries = false;
    let hasFlexbox = false;
    let hasGrid = false;

    cssFiles.forEach(cssFile => {
      const cssPath = path.join(process.cwd(), cssFile);
      if (fs.existsSync(cssPath)) {
        const content = fs.readFileSync(cssPath, 'utf8');

        if (content.includes('@media')) {
          hasMediaQueries = true;
        }
        if (content.includes('flex') || content.includes('display: flex')) {
          hasFlexbox = true;
        }
        if (content.includes('grid') || content.includes('display: grid')) {
          hasGrid = true;
        }
      }
    });

    if (hasMediaQueries) {
      this.pass('CSS includes media queries for responsive design');
    } else {
      this.fail('CSS missing media queries');
    }

    if (hasFlexbox) {
      this.pass('CSS uses Flexbox for layouts');
    } else {
      this.warn('CSS may not be using Flexbox');
    }

    if (hasGrid) {
      this.pass('CSS uses Grid for layouts');
    } else {
      this.warn('CSS may not be using Grid');
    }

    return true;
  }

  /**
   * Validate content structure
   */
  validateContentStructure() {
    this.section('Validating Content Structure');

    const contentDir = path.join(process.cwd(), 'content');
    const requiredContent = [
      '_index.md',
      'about.md',
      'services.md',
      'contact.md'
    ];

    requiredContent.forEach(file => {
      const filePath = path.join(contentDir, file);
      if (fs.existsSync(filePath)) {
        this.pass(`Content file ${file} exists`);

        const content = fs.readFileSync(filePath, 'utf8');

        // Check for front matter
        if (content.startsWith('---')) {
          this.pass(`${file} has front matter`);
        } else {
          this.fail(`${file} missing front matter`);
        }

        // Check for required content
        if (file === 'about.md' && content.includes('Dr. Chathuranga Anura Kumara')) {
          this.pass(`${file} includes doctor information`);
        }

        if (content.includes('Pet Heart Animal Clinic')) {
          this.pass(`${file} includes clinic branding`);
        } else {
          this.warn(`${file} may be missing clinic branding`);
        }
      } else {
        this.fail(`Content file ${file} missing`);
      }
    });

    return true;
  }

  /**
   * Validate accessibility features
   */
  validateAccessibility() {
    this.section('Validating Accessibility Features');

    // Check layout templates for accessibility
    const layoutFiles = [
      'layouts/_default/baseof.html',
      'layouts/partials/header.html',
      'layouts/partials/theme-toggle.html',
      'layouts/partials/back-to-top.html'
    ];

    let hasSkipLinks = false;
    let hasAriaLabels = false;
    let hasSemanticHTML = false;
    let hasLiveRegion = false;

    layoutFiles.forEach(layoutFile => {
      const layoutPath = path.join(process.cwd(), layoutFile);
      if (fs.existsSync(layoutPath)) {
        const content = fs.readFileSync(layoutPath, 'utf8');

        if (content.includes('skip-link') || content.includes('skip to')) {
          hasSkipLinks = true;
        }
        if (content.includes('aria-label') || content.includes('aria-')) {
          hasAriaLabels = true;
        }
        if (content.includes('<main>') || content.includes('<nav>') || content.includes('<header>')) {
          hasSemanticHTML = true;
        }
        if (content.includes('aria-live') || content.includes('sr-live-region')) {
          hasLiveRegion = true;
        }
      }
    });

    if (hasSkipLinks) {
      this.pass('Skip navigation links implemented');
    } else {
      this.warn('Skip navigation links may be missing');
    }

    if (hasAriaLabels) {
      this.pass('ARIA labels implemented');
    } else {
      this.fail('ARIA labels missing');
    }

    if (hasSemanticHTML) {
      this.pass('Semantic HTML elements used');
    } else {
      this.fail('Semantic HTML elements missing');
    }

    if (hasLiveRegion) {
      this.pass('Live regions for screen readers implemented');
    } else {
      this.warn('Live regions for screen readers may be missing');
    }

    return true;
  }

  /**
   * Run all validations
   */
  async runAllValidations() {
    console.log('🏥 Pet Heart Animal Clinic - Functionality Validation\n');
    console.log('=' .repeat(60));

    const validations = [
      () => this.validateHugoBuild(),
      () => this.validateThemeToggle(),
      () => this.validateBackToTop(),
      () => this.validateResponsiveDesign(),
      () => this.validateContentStructure(),
      () => this.validateAccessibility()
    ];

    for (const validation of validations) {
      try {
        await validation();
      } catch (error) {
        this.fail(`Validation error: ${error.message}`);
      }
    }

    this.printSummary();
  }

  /**
   * Print validation summary
   */
  printSummary() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 VALIDATION SUMMARY');
    console.log('=' .repeat(60));

    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);

    const total = this.results.passed + this.results.failed;
    const successRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;

    console.log(`📈 Success Rate: ${successRate}%`);

    if (this.results.failed === 0) {
      console.log('\n🎉 All critical validations passed!');
      if (this.results.warnings > 0) {
        console.log('⚠️  Please review warnings for potential improvements.');
      }
    } else {
      console.log('\n❌ Some validations failed. Please review and fix the issues.');
    }

    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new FunctionalityValidator();
  validator.runAllValidations().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = FunctionalityValidator;