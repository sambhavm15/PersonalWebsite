/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The old combined /gallery page was split into /photography and /art.
  async redirects() {
    return [{ source: "/gallery", destination: "/photography", permanent: true }];
  },
};

export default nextConfig;
