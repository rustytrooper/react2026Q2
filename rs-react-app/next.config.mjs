/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './dist',
  allowedDevOrigins: ['97900344-9f6e-4ad9-8a5c-97ef98b325c9-00-3en6odirql6oo.riker.replit.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        port: '',
        pathname: '/**', 
      },
    ],
  },
}

export default nextConfig
