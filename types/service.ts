export interface ServiceDetails {
  products_used?: string[];
  contraindications?: string[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // Duração em minutos
  image: string; // Thumbnail principal
  gallery: string[]; // Imagens detalhadas
  description: string;
  details?: ServiceDetails;
}
