/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  // Simplified config for Vercel compatibility
  swcMinify: true,
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig