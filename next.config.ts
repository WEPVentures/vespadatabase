import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Prisma's query engine binary lives in a custom generator output
  // directory and is loaded via a runtime path lookup rather than a
  // static require, so Next's file tracer misses it on its own — without
  // this, the .so.node engine never makes it into the deployed function.
  outputFileTracingIncludes: {
    "/**/*": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
