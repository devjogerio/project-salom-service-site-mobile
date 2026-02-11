from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env, se existir
load_dotenv()

# Obtém a URL de conexão do banco de dados das variáveis de ambiente.
# Se não estiver definida, usa um valor padrão para desenvolvimento (PostgreSQL no Docker).
# Em produção, DATABASE_URL deve ser sempre fornecida.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/honda_db")

# Configuração da engine do SQLAlchemy
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    # Necessário para SQLite para permitir acesso de múltiplas threads (FastAPI é async)
    connect_args = {"check_same_thread": False}

# Cria a engine do SQLAlchemy.
# A engine é responsável por gerenciar a conexão com o banco de dados.
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# Cria uma fábrica de sessões (SessionLocal).
# Cada instância de SessionLocal será uma sessão de banco de dados.
# autocommit=False: Transações não são commitadas automaticamente (padrão seguro).
# autoflush=False: Alterações não são enviadas ao banco automaticamente antes de consultas.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cria a classe Base declarativa.
# Todos os modelos (tabelas) da aplicação herdarão desta classe.
Base = declarative_base()

def get_db():
    """
    Função geradora de dependência para obter uma sessão de banco de dados.
    Utilizada pelo FastAPI em cada requisição que precisa de acesso ao banco.
    """
    # Cria uma nova sessão para a requisição atual
    db = SessionLocal()
    try:
        # Entrega a sessão para o uso na rota
        yield db
    finally:
        # Garante que a sessão seja fechada após o uso, mesmo se houver erros.
        # Isso evita vazamento de conexões.
        db.close()
