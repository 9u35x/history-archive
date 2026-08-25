import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "unpkg.com",
      },
    ],
  },
};

export default nextConfig;
