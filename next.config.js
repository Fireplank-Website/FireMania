/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'rb.gy'
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes.
        source: '/(.*)',
        // Add security headers to all routes to prevent you peeps from hacking me
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

const ContentSecurityPolicy = `
  default-src * 'unsafe-inline' 'unsafe-eval';
  img-src 'self' data: firebasestorage.googleapis.com avatars.githubusercontent.com lh3.googleusercontent.com tuk-cdn.s3.amazonaws.com;
`