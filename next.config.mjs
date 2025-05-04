/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "9gdj1dewg7.ufs.sh",
      },
    ],
    
  },
};

export default nextConfig;
