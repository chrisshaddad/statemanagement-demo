import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A parent folder also has a lockfile; pin the tracing root to this project.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
