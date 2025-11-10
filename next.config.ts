import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rhwcxfhglvfodcybkcen.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Compiler options
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // React strict mode
  reactStrictMode: true,

  // Production source maps
  productionBrowserSourceMaps: false,

  // Experimental features
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },
};

export default nextConfig;
