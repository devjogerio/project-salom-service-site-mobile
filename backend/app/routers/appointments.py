from fastapi import APIRouter, HTTPException
import uuid
from .. import schemas

# Cria um roteador para os endpoints de agendamento
router = APIRouter(
    prefix="/appointments",  # Prefixo da URL (/appointments)
    tags=["appointments"],   # Tag para documentação
)


@router.post("", response_model=schemas.AppointmentResponse)
def create_appointment(request: schemas.AppointmentRequest):
    """
    Endpoint POST /appointments
    Recebe uma solicitação de agendamento e retorna a confirmação.
    
    Parâmetros:
    - request: Objeto JSON contendo service_id, customer_name, etc.
    """

    # Validação simples
    if not request.customer_name or not request.customer_phone:
        raise HTTPException(
            status_code=400, detail="Nome e telefone são obrigatórios.")

    # Simulação de processamento (em um sistema real, salvaria no banco)
    appointment_id = str(uuid.uuid4())
    
    # Mock de preço (poderia vir do banco)
    estimated_price = 0.0 # Placeholder, idealmente buscaria do serviço
    
    return schemas.AppointmentResponse(
        status="confirmed",
        message=f"Agendamento confirmado para {request.date} às {request.time}",
        appointment_id=appointment_id,
        estimated_price=estimated_price
    )
