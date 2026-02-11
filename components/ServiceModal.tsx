'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Clock, Banknote, CheckCircle, AlertCircle } from 'lucide-react';
import { Service } from '../types/service';

interface ServiceModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Componente ServiceModal
 * Exibe detalhes do serviço em uma modal com carrossel de imagens.
 * 
 * @param service - Objeto contendo os dados do serviço
 * @param isOpen - Estado que controla a visibilidade da modal
 * @param onClose - Função para fechar a modal
 */
export default function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  // Garantir que temos 3 imagens para o carrossel (usando a galeria ou repetindo a principal)
  const images = service.gallery && service.gallery.length > 0 
    ? service.gallery.slice(0, 3) 
    : [service.image, service.image, service.image]; // Fallback para garantir 3 imagens

  // Preencher até 3 se tiver menos
  while (images.length < 3) {
    images.push(service.image);
  }

  /**
   * Avança para a próxima imagem do carrossel (cíclico)
   */
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  /**
   * Retorna para a imagem anterior do carrossel (cíclico)
   */
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header com Botão Fechar */}
        <div className="relative h-80 w-full bg-gray-100">
          <Image
            src={images[currentImageIndex]}
            alt={`${service.name} - Imagem ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>

          {/* Controles do Carrossel */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-md transition-all"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-md transition-all"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_: string, idx: number) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900">{service.name}</h2>
              <span className="inline-block mt-1 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-bold rounded-full uppercase tracking-wide">
                {service.category}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-pink-600 font-bold text-xl">
                <Banknote size={20} />
                <span>Valor a combinar</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <Clock size={14} />
                <span>{service.duration} min</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">
                Sobre o Serviço
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {service.details?.products_used && service.details.products_used.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Produtos Utilizados
                </h3>
                <ul className="space-y-2">
                  {service.details.products_used.map((product: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                      <span>{product}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.details?.contraindications && service.details.contraindications.length > 0 && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Contraindicações
                </h3>
                <ul className="space-y-1">
                  {service.details.contraindications.map((item, idx) => (
                    <li key={idx} className="text-sm text-red-600 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-red-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer com Ação Principal */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => {
              onClose();
              const element = document.getElementById('agendamento');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Clock size={20} />
            Agendar Agora
          </button>
        </div>
      </div>
    </div>
  );
}
