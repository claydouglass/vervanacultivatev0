/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com;
              style-src 'self' 'unsafe-inline' *.googleapis.com;
              img-src 'self' data: *.googleapis.com *.gstatic.com;
              font-src 'self' data: *.gstatic.com;
              connect-src 'self' *.googleapis.com;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  }
}

export default nextConfig