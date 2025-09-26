/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  experimental: {
    optimizePackageImports: ["@heroicons/react", "lucide-react"],
  },
};

export default nextConfig;
