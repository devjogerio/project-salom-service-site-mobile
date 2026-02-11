/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'export' apenas em produção para gerar site estático (GitHub Pages)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
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
  // Rewrites ativos apenas em desenvolvimento para proxy do Backend
  rewrites: async () => {
    if (process.env.NODE_ENV === 'production') return [];
    return [
      {
        source: '/api/python/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ];
  },
  // Permite acesso via IP local durante desenvolvimento
  experimental: {
    allowedDevOrigins: ['localhost:3000', '192.168.1.8:3000'],
  },
};

export default nextConfig;
