import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/scholar',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
