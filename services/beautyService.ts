import { Service, ServiceListSchema, ServiceSchema, AppointmentResponseSchema, AppointmentResponse } from '@/types/schemas';
import { AppointmentRequest } from '@/types/appointment';
import { z } from 'zod';

const isServer = typeof window === 'undefined';
const isProd = process.env.NODE_ENV === 'production';
const REPO_BASE = '/project-salom-service-site-mobile';

// Lógica de URL da API:
// 1. Se houver API_INTERNAL_URL definida (Docker Server-Side), use-a no servidor.
// 2. Senão, use NEXT_PUBLIC_API_URL se definida.
// 3. Fallback para dev local: localhost:8000 no servidor, /api/python (proxy) no cliente.
const API_URL = isServer && process.env.API_INTERNAL_URL 
  ? process.env.API_INTERNAL_URL 
  : (process.env.NEXT_PUBLIC_API_URL || (isServer ? 'http://127.0.0.1:8000' : '/api/python'));

/**
 * Serviço para buscar serviços de beleza.
 * Conecta com a API Python (FastAPI).
 */
export async function fetchServices(): Promise<Service[]> {
  // Em produção (GitHub Pages), usamos o JSON estático como fallback
  if (isProd && !process.env.NEXT_PUBLIC_API_URL) {
    try {
      console.log('Modo Produção Estático: Buscando serviços do JSON local...');
      const response = await fetch(`${REPO_BASE}/services_catalog.json`);
      if (!response.ok) throw new Error('Falha ao carregar catálogo estático');
      const data = await response.json();
      return ServiceListSchema.parse(data);
    } catch (error) {
      console.error('Erro ao carregar serviços estáticos:', error);
      return []; // Retorna vazio em caso de erro crítico no estático
    }
  }

  try {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar serviços: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Validação de Schema com Zod
    try {
      return ServiceListSchema.parse(data);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error('Erro de validação de schema (Zod) ao buscar serviços:', (validationError as any).errors);
        throw new Error('Dados recebidos da API são inválidos.');
      }
      throw validationError;
    }
  } catch (error) {
    console.error(
      'Falha ao conectar com a API, verifique se o backend está rodando.',
      error,
    );
    throw error;
  }
}

/**
 * Busca um serviço específico pelo ID.
 */
export async function fetchServiceById(id: string): Promise<Service | null> {
  try {
    const response = await fetch(`${API_URL}/services/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Erro ao buscar serviço: ${response.statusText}`);
    }
    const data = await response.json();

    // Validação de Schema com Zod
    try {
      return ServiceSchema.parse(data);
    } catch (validationError) {
       if (validationError instanceof z.ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error(`Erro de validação de schema (Zod) ao buscar serviço ${id}:`, (validationError as any).errors);
        throw new Error('Dados do serviço inválidos.');
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Falha ao buscar serviço na API', error);
    throw error;
  }
}

/**
 * Realiza a criação de um agendamento via API.
 */
export async function createAppointment(
  params: AppointmentRequest,
): Promise<AppointmentResponse> {
  // Mock para produção estática (GitHub Pages)
  if (isProd && !process.env.NEXT_PUBLIC_API_URL) {
    console.log('Modo Produção Estático: Simulando agendamento...');
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay fake
    
    return {
      status: 'confirmed',
      message: 'Agendamento realizado com sucesso (Simulação)',
      appointment_id: `mock-${Date.now()}`,
      estimated_price: 150.00
    };
  }

  try {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erro no agendamento');
    }

    const data = await response.json();

    // Validação de Schema com Zod
    try {
      return AppointmentResponseSchema.parse(data);
    } catch (validationError) {
       if (validationError instanceof z.ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error('Erro de validação de schema (Zod) ao criar agendamento:', (validationError as any).errors);
        throw new Error('Resposta de agendamento inválida.');
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Erro ao realizar agendamento:', error);
    throw error;
  }
}
