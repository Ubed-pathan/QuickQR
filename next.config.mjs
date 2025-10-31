import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  eslint: {
    // Prevent CI from failing on lint warnings; optional but useful for first deploys
    ignoreDuringBuilds: true,
  },
  // Explicitly set tracing root to this workspace to avoid wrong root inference
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
