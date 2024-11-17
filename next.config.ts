import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for detecting potential issues
  reactStrictMode: true,

  // Image optimization settings
  images: {
    domains: ['res.cloudinary.com'],
  },

  // Rewrites configuration for proxying API requests
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*", // Proxy API requests to the local server
      },
    ];
  },

  // Custom Webpack configuration with alias `@` for easy imports
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;
