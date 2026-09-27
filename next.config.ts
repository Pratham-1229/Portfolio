import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    BUILD_TIMESTAMP: new Date().toISOString(),
  },
  reactStrictMode: true,
  typedRoutes: true,
  allowedDevOrigins: ["localhost", "127.0.0.1", "localhost:3000"],
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      "@hugeicons/react",
      "@phosphor-icons/react",
      "@remixicon/react",
      "lucide-react",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "assets.chanhdai.com",
      },
    ],
    qualities: [75, 100],
  },
  compiler:
    process.env.NODE_ENV === "production"
      ? {
          removeConsole: {
            exclude: ["error"],
          },
        }
      : undefined,
  async redirects() {
    return [
      {
        source: "/llms-full.txt",
        destination: "/llms.txt",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/index.md",
          destination: "/llms.txt",
        },
      ],
      afterFiles: [],
    }
  },
}

export default nextConfig
