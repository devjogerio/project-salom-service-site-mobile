import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Configuração do Next.js
 * output: 'export' -> Gera um site estático (HTML/CSS/JS) na pasta 'out' para hospedagem simples (GitHub Pages)
 * images.unoptimized: true -> Desativa a otimização de imagens do Next.js Image Server, necessário para exportação estática
 */
const nextConfig: NextConfig = {
  // No modo Docker (standalone) ou Produção padrão, usamos servidor Node.js.
  // Isso permite o uso de API Routes e Rewrites (Proxy).
  output: process.env.DOCKER_BUILD ? 'standalone' : undefined,
  images: {
    unoptimized: false, // Otimização de imagens ativa no servidor Node
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.honda.com.br',
      },
    ],
  },
  // Proxy ativo em Dev e Prod para facilitar comunicação com Backend Python
  rewrites: async () => {
    return [
      {
        source: '/api/python/:path*',
        destination: 'http://127.0.0.1:8000/:path*', // Proxy para Backend Python
      },
    ];
  },
};

export default nextConfig;
