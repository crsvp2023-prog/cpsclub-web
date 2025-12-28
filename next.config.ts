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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = {
        ...config.externals,
        "firebase-admin": "firebase-admin",
      };
    }
    return config;
  },
};

export default nextConfig;
