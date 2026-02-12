'use client';

import { MessageCircle, Instagram, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function SocialActionButtons() {
  const scrollToAppointment = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('agendamento');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-4">
      <div className="flex justify-between items-center gap-3">
        {/* WhatsApp Button */}
        <Link
          href="https://wa.me/5511999999999" // Substitua pelo número real
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-100 dark:border-green-800 transition-all duration-300 group shadow-sm hover:shadow-md"
          aria-label="Contato via WhatsApp"
        >
          <div className="bg-white dark:bg-green-800 p-2 rounded-full mb-2 shadow-sm group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
          </div>
          <span className="text-xs font-semibold text-green-700 dark:text-green-300 font-montserrat">WhatsApp</span>
        </Link>

        {/* Instagram Button */}
        <Link
          href="https://instagram.com/cleiagomes" // Substitua pelo perfil real
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 border border-pink-100 dark:border-pink-800 transition-all duration-300 group shadow-sm hover:shadow-md"
          aria-label="Perfil do Instagram"
        >
          <div className="bg-white dark:bg-pink-800 p-2 rounded-full mb-2 shadow-sm group-hover:scale-110 transition-transform">
            <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-300" />
          </div>
          <span className="text-xs font-semibold text-pink-700 dark:text-pink-300 font-montserrat">Instagram</span>
        </Link>

        {/* Agendamento Button */}
        <a
          href="#agendamento"
          onClick={scrollToAppointment}
          className="flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800 transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer"
          aria-label="Ir para Agendamento"
        >
          <div className="bg-white dark:bg-purple-800 p-2 rounded-full mb-2 shadow-sm group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-300" />
          </div>
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 font-montserrat">Agendar</span>
        </a>
      </div>
    </div>
  );
}
