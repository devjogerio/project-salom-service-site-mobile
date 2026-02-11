import { z } from 'zod';

// Schema para Serviço
export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  image: z.string().url(),
  gallery: z.array(z.string().url()),
  description: z.string(),
  details: z.object({
    products_used: z.array(z.string()),
    contraindications: z.array(z.string()),
  }).optional(),
});

// Schema para lista de serviços
export const ServiceListSchema = z.array(ServiceSchema);

// Schema para Resposta de Agendamento
export const AppointmentResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  appointment_id: z.string(),
  estimated_price: z.number(),
});

// Tipos inferidos pelo Zod
export type Service = z.infer<typeof ServiceSchema>;
export type AppointmentResponse = z.infer<typeof AppointmentResponseSchema>;
