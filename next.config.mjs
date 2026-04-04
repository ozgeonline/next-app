/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "9gdj1dewg7.ufs.sh",
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '3mb',
  },
};

export default nextConfig;