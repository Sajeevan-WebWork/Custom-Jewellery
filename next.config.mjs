/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dotgmevvwnthtwvgwuwv.supabase.co",
      },
    ],
  },
};

export default nextConfig;
