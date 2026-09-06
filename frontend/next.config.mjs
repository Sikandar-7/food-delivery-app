/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle with only the node_modules actually
  // reached at runtime. The container then ships ~1/10th of a full install.
  // Vercel ignores this setting and uses its own build output, so the existing
  // deployment is unaffected.
  output: 'standalone',
};

export default nextConfig;
