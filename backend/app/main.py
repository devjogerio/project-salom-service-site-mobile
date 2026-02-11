from fastapi import FastAPI, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import time
import psutil
from datetime import datetime

# Importações internas dos módulos da aplicação
from . import models, database, seed_data
from .routers import services, appointments

# Cria todas as tabelas no banco de dados com base nos modelos definidos em models.py.
# Esta operação é segura: se as tabelas já existirem, nada acontece.
models.Base.metadata.create_all(bind=database.engine)


def seed_database(db: Session):
    """
    Função auxiliar para popular o banco de dados com dados iniciais (seed)
    caso a tabela de serviços esteja vazia. Útil para primeira execução.

    Parâmetros:
    - db: Sessão do banco de dados SQLAlchemy.
    """
    # Verifica se já existem serviços cadastrados
    if db.query(models.Service).count() == 0:
        # Itera sobre a lista de dicionários de dados iniciais
        for service_data in seed_data.SERVICES_DATA:
            # Cria uma instância do modelo Service desempacotando o dicionário
            db_service = models.Service(**service_data)
            # Adiciona à sessão
            db.add(db_service)
        # Efetiva as alterações no banco de dados (commit)
        db.commit()
        print("Banco de dados populado com sucesso!")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerenciador de contexto do ciclo de vida da aplicação FastAPI.
    """
    # Cria uma sessão temporária para verificar o seed
    db = database.SessionLocal()
    try:
        # Tenta popular o banco
        seed_database(db)
    finally:
        # Garante o fechamento da sessão
        db.close()

    # Libera o controle para a aplicação rodar
    yield

    # Aqui poderia ter lógica de limpeza/shutdown se necessário


# Inicializa a aplicação FastAPI com título e gerenciador de lifespan
app = FastAPI(title="BeautySalon API", lifespan=lifespan, version="1.0.0")

# --- Configuração de CORS (Cross-Origin Resource Sharing) ---
origins = [
    "http://localhost:3000",  # Frontend local
    "http://localhost:8000",  # Swagger UI local
    "http://localhost",
]

# Adiciona o middleware de CORS à aplicação
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    # Lista de origens permitidas
    allow_credentials=True,   # Permite envio de cookies/autenticação
    allow_methods=["*"],      # Permite todos os métodos HTTP (GET, POST, etc.)
    allow_headers=["*"],      # Permite todos os headers
)

# --- Registro de Rotas ---
# Inclui os roteadores definidos nos módulos da pasta 'routers'
app.include_router(services.router)
app.include_router(appointments.router)


@app.get("/")
def read_root():
    """
    Endpoint raiz (GET /) para verificação de saúde da API (Health Check).
    """
    return {"message": "Bem-vindo à API do BeautySalon", "status": "online"}


@app.get("/health")
def health_check(response: Response):
    """
    Endpoint de Health Check avançado.
    Retorna status do sistema, uso de recursos e versão.
    """
    start_time = time.time()

    # Coleta métricas do sistema
    process = psutil.Process()
    memory_info = process.memory_info()

    health_data = {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": app.version,
        "system": {
            "cpu_percent": psutil.cpu_percent(),
            "memory_usage_mb": round(memory_info.rss / 1024 / 1024, 2)
        }
    }

    # Headers para evitar cache
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    # Monitoramento de latência (simples log/debug)
    latency = (time.time() - start_time) * 1000
    health_data["latency_ms"] = round(latency, 2)

    return health_data
