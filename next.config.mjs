/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/hera-portfolio",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/hera-portfolio"
  },
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
