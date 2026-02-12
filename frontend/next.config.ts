import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
 experimental: {
    // Ohne diesen Flag wird die instrumentation.ts ignoriert!
    instrumentationHook: true,
  } as any,
};

export default nextConfig;
