'use client';

import { useRef } from 'react';
import { Loader2 } from 'lucide-react';
import ProfileHeader from '@/components/ProfileHeader';
import ServiceCatalog from '@/components/ServiceCatalog';
import AppointmentScheduler from '@/components/AppointmentScheduler';
import ContactForm from '@/components/ContactForm';
import { useServices } from '@/hooks/useServices';

/**
 * Página Home (SPA)
 * Integra todos os módulos da aplicação em uma experiência de rolagem contínua.
 */
export default function Home() {
  // Referência para rolagem suave até o catálogo
  const catalogRef = useRef<HTMLDivElement>(null);
  const { services, loading } = useServices();

  // Função para rolar até o catálogo
  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 text-pink-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho do Perfil */}
      <ProfileHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Coluna Principal (Esquerda) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Catálogo de Serviços */}
            <div ref={catalogRef} id="catalogo">
              <ServiceCatalog />
            </div>

            {/* Formulário de Contato Rápido */}
            <ContactForm />
          </div>

          {/* Sidebar (Direita - Desktop) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-montserrat mb-4 border-b pb-2">
                  Agendamento
                </h3>
                <AppointmentScheduler />
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bg-gradient-to-r from-pink-600 to-pink-700 text-white text-center py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto">
          <p className="font-bold font-montserrat text-xl mb-3">
            Cléia Gomes • Nail Designer & Beauty Artist
          </p>
          <p className="text-base font-roboto opacity-90 mb-6">
            Realçando sua beleza natural com arte e dedicação.
          </p>
          <div className="h-px bg-white/20 w-full max-w-md mx-auto mb-6"></div>
          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} Todos os direitos reservados.
            <br />
            Agende seu horário e sinta-se única.
          </p>
        </div>
      </footer>
    </div>
  );
}
