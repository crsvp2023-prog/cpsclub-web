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
  turbopack: {
    resolveAlias: {
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
    },
  },
};

export default nextConfig;
