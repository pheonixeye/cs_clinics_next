import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "**.localhost",
    "**.scf.usercontent.goog",
    "**.googleusercontent.com",
    "**.run.app",
    "**.google.com",
    "**.*",
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
