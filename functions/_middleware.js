// Cloudflare Pages middleware for Pet Heart Animal Clinic
// Handles security headers, caching, and performance optimization

export async function onRequest(context) {
  const response = await context.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy for Pet Heart Animal Clinic website
  const csp = [
    "default-src 'self'",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: *.cloudflare.com",
    "script-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Cache control for static assets
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  if (pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    // Cache static assets for 1 year
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (pathname.match(/\.(html)$/) || pathname === '/') {
    // Cache HTML for 1 hour
    response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }

  return response;
}