import type { Metadata } from 'next';
import { Roboto, Montserrat } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';
import { ThemeProvider } from './providers';

/**
 * Configuração da fonte Montserrat
 * Usada para títulos e destaques principais
 * Pesos: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
 */
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

/**
 * Configuração da fonte Roboto
 * Usada para textos corridos e informações gerais
 * Pesos: 400 (Regular), 500 (Medium), 700 (Bold)
 */
const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cléia Gomes | Nail Designer & Beauty Services',
  description: 'Agende seu horário com Cléia Gomes. Serviços de manicure, pedicure, cabelo e estética.',
};

/**
 * RootLayout
 * Layout principal da aplicação.
 * Define a estrutura HTML básica, fontes e container principal mobile-first.
 * O container 'max-w-md' centraliza o conteúdo em telas maiores, simulando um app.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${roboto.variable} antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-roboto transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Layout Principal Responsivo */}
          <main className="w-full min-h-screen bg-white dark:bg-gray-900 shadow-none overflow-x-hidden relative transition-colors duration-300">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
