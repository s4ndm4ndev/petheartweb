# Pet Heart Animal Clinic - Deployment Guide

This document provides instructions for deploying the Pet Heart Animal Clinic website to Cloudflare Pages.

## 🚀 Quick Deployment

### Prerequisites
- GitHub repository with the website code
- Cloudflare account
- Hugo v0.120.4 or later

### Cloudflare Pages Setup

1. **Connect Repository**
   - Log in to Cloudflare Dashboard
   - Go to Pages → Create a project
   - Connect your GitHub repository
   - Select the `pet-heart-website` repository

2. **Configure Build Settings**
   ```
   Framework preset: Hugo
   Build command: hugo --minify --gc --cleanDestinationDir
   Build output directory: public
   Root directory: (leave empty)
   ```

3. **Environment Variables**
   Add these environment variables in Cloudflare Pages settings:
   ```
   HUGO_VERSION=0.120.4
   HUGO_ENV=production
   NODE_VERSION=18
   HUGO_ENABLEGITINFO=false
   ```

4. **Custom Domain** (Optional)
   - Add your custom domain in the Pages settings
   - Update `baseURL` in `hugo.toml` to match your domain

## 🔧 Build Configuration

### Local Testing
```bash
# Test the build locally
./build.sh

# Verify deployment readiness
node scripts/verify-deployment.js --site-url=http://localhost:1313
```

### GitHub Actions
The repository includes a GitHub Actions workflow (`.github/workflows/test-build.yml`) that:
- Tests the Hugo build on every push
- Validates that all required pages exist
- Uploads build artifacts for review

### Build Files
- `_redirects` - Handles URL routing and redirects
- `wrangler.toml` - Cloudflare Workers configuration
- `cloudflare-pages.json` - Deployment configuration
- `functions/_middleware.js` - Security headers and caching
- `build.sh` - Local build script
- `.env.example` - Environment variables template

## 🔍 Deployment Verification

After deployment, verify the site is working:

```bash
# Test the deployed site
node scripts/verify-deployment.js --site-url=https://your-site.pages.dev
```

The verification script checks:
- ✅ All pages load correctly (200 status)
- ✅ Pet Heart Animal Clinic branding is present
- ✅ Theme toggle functionality works
- ✅ Response times are acceptable
- ✅ Required files (sitemap, robots.txt) exist

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Hugo version matches `HUGO_VERSION` environment variable
   - Ensure all content files have proper front matter
   - Verify no syntax errors in templates

2. **Missing Pages**
   - Check that content files exist in the `content/` directory
   - Verify front matter includes `draft: false`
   - Ensure proper file naming conventions

3. **Styling Issues**
   - Verify SCSS compilation is working
   - Check that CSS files are being generated in `public/css/`
   - Ensure minification isn't breaking CSS

4. **JavaScript Not Working**
   - Check browser console for errors
   - Verify JS files are being copied to `public/js/`
   - Test theme toggle and back-to-top functionality

### Debug Commands

```bash
# Build with verbose output
hugo --minify --gc --cleanDestinationDir --verbose

# Check Hugo configuration
hugo config

# List all pages
hugo list all

# Test local server
hugo server --minify --disableFastRender
```

## 📊 Performance Optimization

The deployment includes several optimizations:

### Build Optimizations
- CSS and JS minification
- HTML minification
- Image optimization
- Garbage collection during build

### Runtime Optimizations
- Static asset caching (1 year)
- HTML caching (1 hour)
- Security headers via middleware
- Content compression

### Monitoring
- GitHub Actions for build testing
- Deployment verification script
- Performance metrics via Cloudflare Analytics

## 🔒 Security Features

- Content Security Policy headers
- X-Frame-Options protection
- HTTPS enforcement
- Secure referrer policy
- No external script dependencies

## 📝 Maintenance

### Regular Updates
1. Update Hugo version in environment variables
2. Review and update dependencies
3. Test build process regularly
4. Monitor site performance

### Content Updates
1. Edit markdown files in `content/` directory
2. Commit changes to trigger automatic deployment
3. Verify changes on preview deployment
4. Merge to main branch for production

## 🆘 Support

For deployment issues:
1. Check Cloudflare Pages build logs
2. Review GitHub Actions workflow results
3. Run local build script to reproduce issues
4. Use the deployment verification script

---

**Pet Heart Animal Clinic** - Caring for your pets with love and professionalism 🐾❤️