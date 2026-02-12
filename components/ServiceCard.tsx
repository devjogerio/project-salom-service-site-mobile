'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, Banknote, Info, Calendar } from 'lucide-react';
import { Service } from '../types/service';
import ServiceModal from './ServiceModal';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full group">
        {/* Imagem do Serviço */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 350px"
          />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wide shadow-sm">
            {service.category}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 transition-colors duration-300">
            {service.name}
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow transition-colors duration-300">
            {service.description}
          </p>

          {/* Detalhes: Preço e Duração */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
              <Banknote size={18} className="text-pink-600 dark:text-pink-400" />
              <span className="font-bold text-lg">Valor a combinar</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
              <Clock size={16} />
              <span>{service.duration} min</span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-4 flex gap-3">
            <button 
              onClick={() => {
                const element = document.getElementById('agendamento');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 font-bold py-3 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors active:scale-95 text-sm flex items-center justify-center gap-1.5"
            >
              <Calendar size={16} />
              Agendar
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition-colors active:scale-95 text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-pink-200 dark:shadow-none"
            >
              <Info size={16} />
              Detalhes
            </button>
          </div>
        </div>
      </div>

      <ServiceModal 
        service={service} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
