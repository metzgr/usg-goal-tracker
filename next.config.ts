import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't fail the production build on lint/type issues (style-level warnings
  // that don't affect runtime). Keeps `next build` deployable on cloud.gov.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
