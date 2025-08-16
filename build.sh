#!/bin/bash

# Pet Heart Animal Clinic - Cloudflare Pages Build Script
# This script ensures proper Hugo build with optimization for production

set -e

echo "🏥 Building Pet Heart Animal Clinic website..."

# Check if Hugo is available
if ! command -v hugo &> /dev/null; then
    echo "❌ Hugo is not installed or not in PATH"
    exit 1
fi

# Display Hugo version
echo "📦 Hugo version: $(hugo version)"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf public/
rm -rf resources/_gen/

# Build the site with minification and optimization
echo "🔨 Building site with minification..."
hugo --minify --gc --cleanDestinationDir

# Verify build output
if [ -d "public" ] && [ "$(ls -A public)" ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build statistics:"
    echo "   - Total files: $(find public -type f | wc -l)"
    echo "   - HTML files: $(find public -name "*.html" | wc -l)"
    echo "   - CSS files: $(find public -name "*.css" | wc -l)"
    echo "   - JS files: $(find public -name "*.js" | wc -l)"
    echo "   - Image files: $(find public -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" | wc -l)"
else
    echo "❌ Build failed - no output generated"
    exit 1
fi

echo "🚀 Ready for deployment to Cloudflare Pages!"