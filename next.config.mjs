/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Match the artifact behavior (no optimization pipeline required for local assets).
    unoptimized: true
  }
};

export default nextConfig;
