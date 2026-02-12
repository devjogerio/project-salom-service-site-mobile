import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import SocialActionButtons from './SocialActionButtons';

export default function ProfileHeader() {
  return (
    <header className="flex flex-col items-center justify-center pt-14 pb-10 px-5 bg-white dark:bg-gray-900 w-full border-b border-gray-50 dark:border-gray-800 transition-colors duration-300">
      <div className="relative mb-6">
        <div className="w-48 h-48 rounded-full border-[5px] border-pink-500 p-1.5 bg-white dark:bg-gray-800 shadow-xl overflow-hidden transition-colors duration-300">
          <Image
            src="https://images.unsplash.com/photo-1595476103596-697edcd70c4c?q=80&w=1000&auto=format&fit=crop"
            alt="Foto de Perfil"
            width={192}
            height={192}
            className="rounded-full w-full h-full object-cover"
            priority
            unoptimized // Allow external URL without next.config.js changes if possible, or assume it works
          />
        </div>
        <div className="absolute bottom-3 right-3 bg-green-500 w-6 h-6 rounded-full border-[3px] border-white dark:border-gray-900" title="Online Agora"></div>
      </div>

      <div className="text-center space-y-1.5 w-full">
        <h1 className="text-4xl font-bold font-montserrat text-gray-900 dark:text-white transition-colors duration-300">
          Cléia Gomes
        </h1>
        <p className="text-xl text-pink-600 dark:text-pink-400 font-medium transition-colors duration-300">
          Nail Designer & Beauty Artist
        </p>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2.5 transition-colors duration-300">
          Transformando beleza em arte. Especialista em alongamentos e design de unhas.
        </p>
        
        {/* Toggle de Tema */}
        <div className="mt-4 flex justify-center">
          <ThemeToggle />
        </div>

        {/* Botões de Ação Social (WhatsApp, Instagram, Agendar) */}
        <SocialActionButtons />
      </div>
    </header>
  );
}
