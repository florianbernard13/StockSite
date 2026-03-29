import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .base import Base

load_dotenv()
DB_USER = os.getenv("STOCK_DB_USER")
DB_PASSWORD = os.getenv("STOCK_DB_PASSWORD")
DB_HOST = os.getenv("STOCK_DB_HOST", "localhost")
DB_PORT = os.getenv("STOCK_DB_PORT", "5432")
DB_NAME = os.getenv("STOCK_DB_NAME")


# Remplace USER / PASSWORD / HOST / PORT / DB par tes infos Docker
DATABASE_URL = "postgresql+psycopg2://stock:stock@localhost:5433/stock"

engine = create_engine(DATABASE_URL, echo=True, future=True)

# Crée une session
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

def init_db():
    # Crée toutes les tables dans la BDD
    Base.metadata.create_all(bind=engine)