from sqlalchemy import Column, String, Integer, Float, JSON
from .database import Base


class Service(Base):
    """
    Modelo de dados que representa a tabela 'services' no banco de dados.
    Herda de Base (declarative_base) do SQLAlchemy.
    """
    # Nome da tabela no banco de dados
    __tablename__ = "services"

    # Coluna ID: Chave primária, tipo String (slug), indexada para busca rápida
    id = Column(String, primary_key=True, index=True)

    # Coluna Name: Nome do serviço, indexado
    name = Column(String, index=True)

    # Coluna Category: Categoria do serviço (ex: 'Cabelo', 'Unhas', 'Estética')
    category = Column(String)

    # Coluna Price: Preço base do serviço
    price = Column(Float)

    # Coluna Duration: Duração estimada em minutos
    duration = Column(Integer)

    # Coluna Image: URL da imagem principal (thumbnail)
    image = Column(String)

    # Coluna Gallery: Lista de URLs de imagens adicionais (JSON)
    gallery = Column(JSON)

    # Coluna Description: Descrição textual detalhada do serviço
    description = Column(String)

    # Coluna Details: Detalhes adicionais (produtos usados, recomendações)
    details = Column(JSON)
