import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained — no dependencies on Replit artifact routing
  // Connect via standard env vars: DATABASE_URL, RESEND_API_KEY, etc.
  images: {
    // In production, configure domains for any external image sources
    remotePatterns: [],
  },
  // Ensure trailing slashes are consistent for SEO
  trailingSlash: false,
};

export default nextConfig;
