/** @type {import('next').NextConfig} */
let withBundleAnalyzer;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch {
  // Fallback if bundle analyzer is not available
  withBundleAnalyzer = (config) => config;
}

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
  compiler: {
    styledJsx: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
  swcMinify: true,
  output: process.env.BUILD_OUTPUT === 'export' ? 'export' : 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
}

module.exports = withBundleAnalyzer(nextConfig)