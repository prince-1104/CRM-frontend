/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /**
     * Re-enabled Vercel Image Optimization.
     *
     * Product / catalogue images from R2 are already WebP but still
     * benefit from automatic resizing (srcSet) and quality tuning that
     * the Next.js <Image> component provides.  Without this, the
     * browser downloads the full-resolution original on every device.
     */
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.cloudflarestorage.com" },
      { protocol: "https", hostname: "cdn.staruniform.store" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
