import { useState, useEffect } from 'react';
import { Service } from '@/types/service';
import { fetchServices } from '@/services/beautyService';

/**
 * Hook personalizado useServices.
 * Responsável por gerenciar o estado da lista de serviços no frontend.
 * Abstrai a lógica de busca (fetch), carregamento (loading) e tratamento de erros.
 */
export function useServices() {
  // Estado para armazenar a lista de serviços
  const [services, setServices] = useState<Service[]>([]);

  // Estado para controlar o indicador de carregamento (spinner)
  const [loading, setLoading] = useState(true);

  // Estado para armazenar mensagens de erro, caso ocorram
  const [error, setError] = useState<string | null>(null);

  // useEffect executa a lógica de busca quando o componente é montado
  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      try {
        setLoading(true);
        // Chama o serviço de busca (que faz a requisição para a API Python)
        const data = await fetchServices();

        if (mounted) {
          setServices(data);
        }
      } catch (err) {
        console.error('Erro ao carregar serviços:', err);

        if (mounted) {
          setError('Erro ao carregar catálogo de serviços.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  return { services, loading, error };
}
