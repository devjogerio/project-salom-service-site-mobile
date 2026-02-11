import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Service } from '../types/service';

interface CategoryCarouselProps {
  services: Service[];
  category: string;
}

/**
 * Componente CategoryCarousel
 * Exibe um carrossel de imagens baseado nos serviços da categoria selecionada.
 * Possui transição automática, navegação manual e indicadores.
 */
export default function CategoryCarousel({ services, category }: CategoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filtrar serviços pela categoria
  const filteredServices = category === 'todos' 
    ? services 
    : services.filter(s => s.category === category);
    
  // Extrair imagens (usar a imagem principal de cada serviço)
  // Limitar a 5 imagens para o carrossel não ficar gigante
  // Se houver poucas imagens, podemos repetir ou mostrar apenas as disponíveis
  const images = filteredServices
    .map(s => s.image)
    .filter(img => img) // Garantir que não são nulas
    .slice(0, 5);

  // Efeito para resetar o index quando a categoria mudar
  // Usando um padrão mais seguro para evitar updates desnecessários
  useEffect(() => {
    setCurrentIndex(0);
  }, [category]);

  // Efeito para rotação automática
  useEffect(() => {
    if (images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length, category]);

  if (images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-[2rem] mb-10 shadow-xl group"
      style={{
        height: 'clamp(250px, 40vw, 500px)', // Altura responsiva usando clamp()
      }}
    >
      {/* Imagens */}
      <div className="relative w-full h-full">
        {images.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
             <Image
              src={img}
              alt={`Destaque ${category} ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay gradiente para legibilidade do texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Título da Categoria sobreposto */}
      <div className="absolute bottom-8 left-6 md:left-10 text-white z-20 animate-in slide-in-from-bottom-4 duration-700 fade-in pr-6">
        <span 
          className="font-bold uppercase tracking-widest bg-pink-600 rounded-full mb-3 inline-block shadow-sm"
          style={{
            fontSize: 'clamp(0.65rem, 1.5vw, 0.875rem)', // Responsividade granular na fonte
            padding: 'clamp(0.25rem, 0.5vw, 0.5rem) clamp(0.75rem, 1.5vw, 1rem)', // Padding dinâmico
          }}
        >
          {category === 'todos' ? 'Destaques' : category}
        </span>
        <h3 
          className="font-bold drop-shadow-md leading-tight"
          style={{
             fontSize: 'clamp(1.5rem, 4vw, 3rem)', // Título escalável
             marginBottom: 'clamp(0.25rem, 0.5vw, 0.5rem)',
          }}
        >
          {category === 'todos' ? 'Nossos Melhores Serviços' : `Especialidade em ${category}`}
        </h3>
        <p 
          className="text-white/90 max-w-lg mt-2 hidden sm:block"
          style={{
            fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)', // Parágrafo adaptativo
            lineHeight: '1.5',
          }}
        >
          Confira nossos serviços exclusivos de {category === 'todos' ? 'beleza e bem-estar' : category.toLowerCase()} preparados especialmente para você.
        </p>
      </div>

      {/* Controles de Navegação */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/20 opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
            aria-label="Imagem anterior"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/20 opacity-0 group-hover:opacity-100 focus:opacity-100 active:scale-95"
            aria-label="Próxima imagem"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicadores */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-pink-500 w-8' : 'bg-white/50 w-2 hover:bg-white'
              }`}
              aria-label={`Ir para imagem ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
