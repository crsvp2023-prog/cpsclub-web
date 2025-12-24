import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpsclub.com.au",
      },
    ],
  },
};

export default nextConfig;
