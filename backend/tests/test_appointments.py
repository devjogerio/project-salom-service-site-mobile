from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_appointment_success():
    """
    Testa se o endpoint POST /appointments cria um agendamento com sucesso.
    """
    payload = {
        "service_id": "corte-cabelo",
        "customer_name": "Maria Silva",
        "customer_phone": "11999999999",
        "date": "2023-12-25",
        "time": "14:00"
    }
    response = client.post("/appointments", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "confirmed"
    assert "appointment_id" in data

def test_create_appointment_missing_fields():
    """
    Testa se o endpoint retorna 400 quando faltam campos obrigatórios.
    """
    payload = {
        "service_id": "corte-cabelo",
        # customer_name faltando
        "customer_phone": "11999999999",
        "date": "2023-12-25",
        "time": "14:00"
    }
    response = client.post("/appointments", json=payload)
    assert response.status_code == 422 # FastAPI validation error is usually 422
