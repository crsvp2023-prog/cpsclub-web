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
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        stream: false,
        util: false,
        zlib: false,
        constants: false,
      };
    }
    return config;
  },
};

export default nextConfig;
