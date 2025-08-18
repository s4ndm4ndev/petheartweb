# Pet Heart Animal Clinic Website

A modern, accessible Hugo-based static website for Pet Heart Animal Clinic, featuring responsive design, light/dark theme support, and comprehensive veterinary service information.

## 🏥 About Pet Heart Animal Clinic

Pet Heart Animal Clinic is a veterinary practice run by **Dr. Chathuranga Anura Kumara**, providing comprehensive care for dogs, cats, and other animals with a caring, loving, and professional approach.

## 🌟 Features

- **Hugo Static Site** - Fast, secure, and maintainable web presence
- **Responsive Design** - Mobile-first approach optimized for all devices
- **Light/Dark Theme** - Automatic system detection with manual toggle
- **Accessibility Compliant** - WCAG 2.1 standards with keyboard navigation
- **Performance Optimized** - SEO-friendly with excellent Core Web Vitals
- **Sky Blue Branding** - Professional aesthetic with caring color palette (#87CEEB)
- **Progressive Enhancement** - Works without JavaScript, enhanced with JS features

## 🚀 Quick Start

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (latest version)
- [Node.js](https://nodejs.org/) (for testing)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd petheartweb
   ```

2. Install testing dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   hugo server --minify --disableFastRender
   ```

4. Visit [http://localhost:1313](http://localhost:1313)

## 🔧 Development Commands

### Building
```bash
# Build for production
./build.sh

# Alternative Hugo build
hugo --minify --gc --cleanDestinationDir

# Development server
hugo server --minify --disableFastRender
```

### Testing
```bash
# Run all tests
npm test

# Specific test suites
npm run test:theme           # Theme toggle functionality
npm run test:back-to-top     # Back-to-top button
npm run test:responsive      # Responsive design
npm run test:hugo           # Hugo build validation

# Test with coverage
npm run test:coverage

# Validate everything
npm run validate:all
```

### Deployment Verification
```bash
# Verify local deployment
node scripts/verify-deployment.js --site-url=http://localhost:1313
```

## 📁 Project Structure

```
petheartweb/
├── content/           # Markdown content files
├── layouts/           # Hugo templates
│   ├── _default/      # Default templates
│   └── partials/      # Reusable components
├── assets/            # SCSS and JavaScript source
│   ├── css/          # SCSS stylesheets
│   └── js/           # JavaScript modules
├── static/           # Static assets (images, favicons)
├── public/           # Generated site (git ignored)
├── tests/            # Test files and validation
├── scripts/          # Build and deployment scripts
├── functions/        # Cloudflare Workers functions
├── hugo.toml         # Hugo configuration
├── package.json      # Node.js dependencies and scripts
└── CLAUDE.md         # Detailed development guide
```

## 🎨 Design System

### Brand Colors
- **Primary**: Sky Blue (#87CEEB)
- **Supporting**: Shades of blue, white, and black
- **Theme**: Professional yet caring aesthetic

### Typography
- **Body Text**: Inter font family
- **Headings**: Poppins font family

### Components
- Responsive navigation with mobile menu
- Theme toggle with system detection
- Back-to-top functionality
- Hero sections with call-to-action
- Service cards and information blocks

## 📱 Pages & Content

### Core Pages
- **Homepage** - Welcome and overview of services
- **About** - Dr. Chathuranga Anura Kumara and clinic information
- **Services** - Comprehensive veterinary care details
- **Contact** - Clinic location, hours, and contact information

### Content Management
All content is managed through Markdown files in the `content/` directory with YAML front matter for metadata and SEO optimization.

## ♿ Accessibility Features

WCAG 2.1 AA compliant with:
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and live regions
- Skip navigation links
- Color contrast compliance
- Focus management
- Alternative text for images

## ⚡ Performance & Security

### Performance
- CSS and JavaScript minification
- Image optimization
- Static asset caching (1 year)
- HTML caching (1 hour)
- Critical CSS inlining

### Security
- Content Security Policy headers
- X-Frame-Options protection
- HTTPS enforcement
- No external script dependencies
- Secure referrer policies

## 🌐 Deployment

The site is deployed on **Cloudflare Pages** with:
- Automatic deployment on git push
- Environment variables configuration
- Security headers via Cloudflare Workers
- Global CDN distribution

### Build Configuration
- **Build Command**: `hugo --minify --gc --cleanDestinationDir`
- **Output Directory**: `public`
- **Hugo Version**: Latest stable

## 🧪 Testing Strategy

### Automated Testing (Jest)
- Theme toggle functionality
- Back-to-top button behavior
- Responsive design validation
- Hugo build verification
- Browser compatibility checks

### Manual Testing
- Accessibility compliance (`tests/manual-validation.html`)
- Cross-browser compatibility
- Mobile device testing
- Performance validation

## 📝 Configuration

### Hugo Configuration (`hugo.toml`)
Contains site parameters including:
- Clinic and doctor information
- Brand settings and colors
- SEO configuration
- Build optimization settings
- Structured data for local SEO

### Environment Variables
Set in Cloudflare Pages dashboard for production deployment.

## 🤝 Contributing

1. Follow the existing code style and conventions
2. Maintain the caring and professional tone in all content
3. Ensure accessibility compliance for any new features
4. Test thoroughly before submitting changes
5. Update documentation as needed

### Development Guidelines
- **Brand Consistency**: Maintain sky blue color palette and caring messaging
- **Accessibility First**: All features must be keyboard accessible
- **Performance**: Optimize for Core Web Vitals
- **Progressive Enhancement**: Ensure functionality without JavaScript

## 📖 Documentation

For detailed development information, see [CLAUDE.md](CLAUDE.md) which contains:
- Complete architecture overview
- Detailed component documentation
- Content management guidelines
- Deployment procedures
- Testing requirements

## 📞 Contact & Support

For questions about Pet Heart Animal Clinic services, visit the [Contact page](https://petheartweb.swiftscripters.workers.dev/contact/) or call the clinic directly.

For technical issues with the website, please refer to the development documentation in CLAUDE.md.

## 📄 License

This project is proprietary to Pet Heart Animal Clinic.

---

Built with ❤️ using [Hugo](https://gohugo.io/) and deployed on [Cloudflare Pages](https://pages.cloudflare.com/)