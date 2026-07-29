/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tạm thời bỏ qua NextJS Server optimization để tránh bug Docker network ở local
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
