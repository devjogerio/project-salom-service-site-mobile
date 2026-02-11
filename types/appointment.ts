export interface AppointmentRequest {
  service_id: string;
  customer_name: string;
  customer_phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

export interface AppointmentResponse {
  status: string;
  message: string;
  appointment_id: string;
  estimated_price: number;
}
