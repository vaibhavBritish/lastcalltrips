/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["upload.wikimedia.org", "plus.unsplash.com", "placehold.co","res.cloudinary.com"],
  },
};

module.exports = nextConfig;
