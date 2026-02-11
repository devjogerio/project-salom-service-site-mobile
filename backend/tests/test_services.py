from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_read_services_success():
    """
    Testa se o endpoint GET /services retorna 200 e uma lista.
    """
    response = client.get("/services")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Se houver seed data, deve ter pelo menos um item
    if len(data) > 0:
        assert "id" in data[0]
        assert "name" in data[0]


def test_read_service_by_id_not_found():
    """
    Testa se o endpoint GET /services/{id} retorna 404 para ID inexistente.
    """
    response = client.get("/services/non-existent-id")
    assert response.status_code == 404
