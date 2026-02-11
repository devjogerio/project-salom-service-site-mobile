from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database

# Cria um roteador para agrupar endpoints relacionados a serviços
router = APIRouter(
    prefix="/services", # Prefixo de URL para todas as rotas deste arquivo (/services)
    tags=["services"],  # Tag para agrupamento na documentação Swagger UI
)


@router.get("", response_model=List[schemas.Service])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """
    Endpoint GET /services
    Retorna a lista de serviços cadastrados no banco de dados.
    
    Parâmetros:
    - skip (query param): Número de registros para pular (paginação). Padrão: 0.
    - limit (query param): Número máximo de registros para retornar. Padrão: 100.
    - db: Sessão de banco de dados injetada via Depends.
    """
    # Consulta ao banco: SELECT * FROM services OFFSET skip LIMIT limit
    services = db.query(models.Service).offset(skip).limit(limit).all()
    
    # Retorna a lista de objetos ORM
    return services


@router.get("/{service_id}", response_model=schemas.Service)
def read_service(service_id: str, db: Session = Depends(database.get_db)):
    """
    Endpoint GET /services/{service_id}
    Retorna os detalhes de um serviço específico pelo ID.
    
    Parâmetros:
    - service_id (path param): O ID (slug) do serviço a ser buscado.
    - db: Sessão de banco de dados injetada.
    """
    # Consulta ao banco: SELECT * FROM services WHERE id = service_id LIMIT 1
    service = db.query(models.Service).filter(
        models.Service.id == service_id).first()
    
    # Se não encontrar, retorna erro 404
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
        
    # Retorna o serviço encontrado
    return service
