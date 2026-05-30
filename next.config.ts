import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Turbopack config to prevent compile issues on canvas/encoding
  turbopack: {
    resolveAlias: {
      canvas: { browser: "./empty.ts" },
      encoding: { browser: "./empty.ts" }
    }
  },
  // Webpack config fallback
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
    }
    return config;
  },
};

export default nextConfig;
