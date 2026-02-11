from pydantic import BaseModel, ConfigDict
from typing import List

# --- Schemas de Serviços ---


class ServiceDetails(BaseModel):
    """
    Schema para detalhes adicionais do serviço.
    """
    products_used: List[str] | None = None
    contraindications: List[str] | None = None


class ServiceBase(BaseModel):
    """
    Schema base com os campos comuns para serviços.
    """
    id: str
    name: str
    category: str
    price: float
    duration: int  # Duração em minutos
    image: str
    gallery: List[str]
    description: str
    details: ServiceDetails | None = None


class ServiceCreate(ServiceBase):
    """
    Schema para criação de serviços (POST).
    """
    pass


class Service(ServiceBase):
    """
    Schema para leitura de serviços (Response).
    """
    model_config = ConfigDict(from_attributes=True)


# --- Schemas de Agendamento ---

class AppointmentRequest(BaseModel):
    """
    Dados de entrada para solicitação de agendamento.
    """
    service_id: str
    customer_name: str
    customer_phone: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM


class AppointmentResponse(BaseModel):
    """
    Resposta da solicitação de agendamento.
    """
    status: str
    message: str
    appointment_id: str
    estimated_price: float
