#!/bin/bash

# Pet Heart Animal Clinic - Optimized Cloudflare Pages Build Script
# Enhanced for 2025 best practices with dynamic base URL and environment detection

set -e

echo "🏥 Building Pet Heart Animal Clinic website..."

# Check if Hugo is available
if ! command -v hugo &> /dev/null; then
    echo "❌ Hugo is not installed or not in PATH"
    exit 1
fi

# Set Hugo version for consistency (Cloudflare Pages compatibility)
export HUGO_VERSION=${HUGO_VERSION:-"0.143.1"}
echo "📦 Hugo version: $(hugo version)"

# Dynamic base URL configuration for Cloudflare Pages
# CF_PAGES_URL is available in Cloudflare Pages environment
if [ -n "$CF_PAGES_URL" ]; then
    BASE_URL="$CF_PAGES_URL"
    echo "🌐 Using Cloudflare Pages URL: $BASE_URL"
elif [ -n "$CF_PAGES_BRANCH" ] && [ "$CF_PAGES_BRANCH" = "master" ]; then
    # Production deployment - use your custom domain if configured
    BASE_URL="${HUGO_BASEURL:-https://petheart.pages.dev}"
    echo "🌐 Production deployment, base URL: $BASE_URL"
else
    # Preview deployment or local build
    BASE_URL="https://preview.pages.dev"
    echo "🌐 Preview deployment, base URL: $BASE_URL"
fi

# Clean previous build with verbose output
echo "🧹 Cleaning previous build..."
rm -rf public/
rm -rf resources/_gen/

# Set Hugo environment
export HUGO_ENV=${HUGO_ENV:-"production"}
echo "🔧 Hugo environment: $HUGO_ENV"

# Build with optimized flags for Cloudflare Pages
echo "🔨 Building site with optimization..."
hugo \
    --minify \
    --gc \
    --cleanDestinationDir \
    --baseURL="$BASE_URL" \
    --environment="$HUGO_ENV" \
    --verbose

# Post-build optimizations
echo "⚡ Running post-build optimizations..."

# Generate additional SEO files if not present
if [ ! -f "public/robots.txt" ]; then
    echo "🤖 Generating robots.txt..."
    cat > public/robots.txt << EOF
User-agent: *
Allow: /
Sitemap: $BASE_URL/sitemap.xml
EOF
fi

# Verify critical files exist
CRITICAL_FILES=("index.html" "sitemap.xml" "404.html")
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "public/$file" ]; then
        echo "❌ Critical file missing: $file"
        exit 1
    fi
done

# Build verification and statistics
if [ -d "public" ] && [ "$(ls -A public)" ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build statistics:"
    echo "   - Total files: $(find public -type f | wc -l)"
    echo "   - HTML files: $(find public -name "*.html" | wc -l)"
    echo "   - CSS files: $(find public -name "*.css" | wc -l)"
    echo "   - JS files: $(find public -name "*.js" | wc -l)"
    echo "   - Images: $(find public \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) | wc -l)"
    
    # Calculate total build size
    BUILD_SIZE=$(du -sh public | cut -f1)
    echo "   - Total size: $BUILD_SIZE"
    
    # Verify HTML structure
    HTML_COUNT=$(find public -name "*.html" -exec grep -l "<html" {} \; | wc -l)
    echo "   - Valid HTML pages: $HTML_COUNT"
else
    echo "❌ Build failed - no output generated"
    exit 1
fi

echo "🚀 Ready for deployment to Cloudflare Pages!"
echo "🌐 Base URL configured: $BASE_URL"