/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /**
     * Disable Vercel Image Optimization to stay within the Hobby-plan
     * limit of 5 000 transformations / month.
     *
     * All product / catalogue images are already served from Cloudflare R2
     * (with its own CDN caching) or from Unsplash's own optimized URLs,
     * so the extra Vercel transformation step was redundant.
     */
    unoptimized: true,
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
