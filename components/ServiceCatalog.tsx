'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import ServiceCard from './ServiceCard';
import CategoryCarousel from './CategoryCarousel';
import { Service } from '../types/service';

type Category = 'todos' | 'Cabelo' | 'Unhas' | 'Estética';

/**
 * Componente ServiceCatalog
 * Responsável por exibir a grade de serviços (Catálogo).
 * Utiliza o hook useServices para buscar dados da API.
 */
export default function ServiceCatalog() {
  const { services, loading } = useServices();
  const [filter, setFilter] = useState<Category>('todos');

  // Filtra a lista de serviços com base na categoria
  const filteredServices = services.filter((s) =>
    filter === 'todos' ? true : s.category === filter,
  );

  if (loading) {
    return (
      <section
        id="catalogo"
        className="py-16 px-4 bg-gray-50 flex justify-center items-center min-h-[400px]"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-pink-600 animate-spin" />
          <p className="text-gray-500 font-medium">Carregando serviços...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="py-8 px-4 bg-gray-50">
      {/* Cabeçalho da seção com Título */}
      <div className="flex flex-col items-center mb-8 text-center px-4">
        <h2 
          className="font-bold font-montserrat text-gray-800 mb-2"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
        >
          Nossos Serviços
        </h2>
        <p 
          className="text-gray-500 max-w-lg mx-auto"
          style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)' }}
        >
          Explore nossas especialidades e encontre o tratamento perfeito para você.
        </p>
      </div>

      {/* Carrossel de Destaque por Categoria */}
      <CategoryCarousel key={filter} services={services} category={filter} />

      {/* Sistema de Navegação (Filtros) */}
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 border-b border-gray-100 md:static md:bg-transparent md:border-none md:p-0 md:mx-0 transition-all duration-300">
        <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-start md:justify-center no-scrollbar px-2">
          {(['todos', 'Cabelo', 'Unhas', 'Estética'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative flex-shrink-0 font-bold transition-all duration-300 transform select-none rounded-2xl ${
                filter === cat
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-200 ring-2 ring-pink-600 ring-offset-2 scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 shadow-sm hover:-translate-y-0.5'
              }`}
              style={{
                fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', // Fonte responsiva
                padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)', // Padding dinâmico
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Serviços - Ajustado com CSS Grid responsivo */}
      <div 
        className="grid gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 100%, 350px), 1fr))', // Grid inteligente
        }}
      >
        {filteredServices.map((service: Service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          Nenhum serviço encontrado nesta categoria.
        </p>
      )}
    </section>
  );
}
