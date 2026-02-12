/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'project-salom-service-site-mobile';

const nextConfig = {
  // 'export' apenas em produção para gerar site estático (GitHub Pages)
  output: isProd ? 'export' : undefined,
  // Define o caminho base para GitHub Pages (ex: /nome-do-repo)
  basePath: isProd ? `/${repoName}` : '',
  // Gera /rota/index.html em vez de /rota.html (melhor para GitHub Pages)
  trailingSlash: true,
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
    if (isProd) return [];
    return [
      {
        source: '/api/python/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ];
  },
  // Permite acesso via IP local durante desenvolvimento
  // experimental: {
  //   allowedDevOrigins: ['localhost:3000', '192.168.1.8:3000'],
  // },
};

export default nextConfig;
