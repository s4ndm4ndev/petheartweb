#!/usr/bin/env node

/**
 * Pet Heart Animal Clinic - Deployment Verification Script
 * Verifies that the deployed site is working correctly
 */

const https = require('https');
const http = require('http');

const SITE_URL = process.env.SITE_URL || 'https://petheart-clinic.pages.dev';
const TIMEOUT = 10000; // 10 seconds

console.log('🏥 Pet Heart Animal Clinic - Deployment Verification');
console.log('====================================================');
console.log(`Testing site: ${SITE_URL}`);

const tests = [
  { path: '/', name: 'Homepage' },
  { path: '/about/', name: 'About Page' },
  { path: '/services/', name: 'Services Page' },
  { path: '/contact/', name: 'Contact Page' },
  { path: '/404.html', name: '404 Page' },
  { path: '/sitemap.xml', name: 'Sitemap' },
  { path: '/robots.txt', name: 'Robots.txt' }
];

async function testUrl(url, name) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    const startTime = Date.now();

    const req = client.get(url, { timeout: TIMEOUT }, (res) => {
      const responseTime = Date.now() - startTime;
      const success = res.statusCode >= 200 && res.statusCode < 400;

      console.log(`${success ? '✅' : '❌'} ${name}: ${res.statusCode} (${responseTime}ms)`);

      if (success) {
        // Check for key content indicators
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const hasTitle = body.includes('Pet Heart Animal Clinic');
          const hasLogo = body.includes('logo') || body.includes('Pet Heart Animal Clinic');
          const hasTheme = body.includes('data-theme') || body.includes('theme-toggle');

          if (name === 'Homepage' || name.includes('Page')) {
            console.log(`   - Title present: ${hasTitle ? '✅' : '❌'}`);
            console.log(`   - Logo/branding: ${hasLogo ? '✅' : '❌'}`);
            console.log(`   - Theme support: ${hasTheme ? '✅' : '❌'}`);
          }

          resolve({ success, responseTime, statusCode: res.statusCode });
        });
      } else {
        resolve({ success, responseTime, statusCode: res.statusCode });
      }
    });

    req.on('error', (err) => {
      console.log(`❌ ${name}: Error - ${err.message}`);
      resolve({ success: false, error: err.message });
    });

    req.on('timeout', () => {
      console.log(`❌ ${name}: Timeout after ${TIMEOUT}ms`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function runTests() {
  console.log('\n🧪 Running deployment tests...\n');

  const results = [];

  for (const test of tests) {
    const url = `${SITE_URL}${test.path}`;
    const result = await testUrl(url, test.name);
    results.push({ ...test, ...result });
  }

  console.log('\n📊 Test Summary:');
  console.log('================');

  const passed = results.filter(r => r.success).length;
  const total = results.length;
  const avgResponseTime = results
    .filter(r => r.responseTime)
    .reduce((sum, r) => sum + r.responseTime, 0) / results.filter(r => r.responseTime).length;

  console.log(`Tests passed: ${passed}/${total}`);
  console.log(`Average response time: ${Math.round(avgResponseTime)}ms`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! Pet Heart Animal Clinic website is deployed successfully.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the deployment.');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node verify-deployment.js [--site-url=URL]');
  console.log('');
  console.log('Options:');
  console.log('  --site-url=URL    Override the site URL to test');
  console.log('  --help, -h        Show this help message');
  process.exit(0);
}

const siteUrlArg = process.argv.find(arg => arg.startsWith('--site-url='));
if (siteUrlArg) {
  process.env.SITE_URL = siteUrlArg.split('=')[1];
}

runTests().catch(console.error);