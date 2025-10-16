/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force HTTPS in production
  ...(process.env.NODE_ENV === 'production' && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            },
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload'
            },
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
            }
          ]
        }
      ];
    }
  }),

  // Other Next.js config options
  experimental: {
    // Enable if needed
  },

  // Environment variables validation
  env: {
    // Add any client-side environment variables here
  },

  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
