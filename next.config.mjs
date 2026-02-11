/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'www.honda.com.br',
      },
    ],
  },
  // Desativa rewrites no modo export estático, pois não são suportados
  // rewrites: async () => { ... }
};

export default nextConfig;
