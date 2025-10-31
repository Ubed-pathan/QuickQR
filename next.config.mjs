import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  // Explicitly set tracing root to this workspace to avoid wrong root inference
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
