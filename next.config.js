/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org', 'images.unsplash.com'],
  },
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRError: false,
  },
}

module.exports = nextConfig