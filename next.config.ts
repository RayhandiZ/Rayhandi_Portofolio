import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      // Two small edits to the glass library, made while bundling: see config/liquid-glass-loader.cjs.
      // process.cwd() rather than __dirname, which is undefined when Node loads this file as ESM.
      "*": {
        condition: {
          path: /node_modules\/@zakisheriff\/liquid-glass\/dist\/index\.m?js$/,
        },
        loaders: [path.join(process.cwd(), "config", "liquid-glass-loader.cjs")],
      },
    },
  },
};

export default nextConfig;
