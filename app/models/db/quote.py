from sqlalchemy import Column, BigInteger, String, TIMESTAMP, func
from sqlalchemy.orm import relationship
from .base import Base

class QuoteModel(Base):
    __tablename__ = "quotes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    symbol = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relation vers les PricePoints
    price_points = relationship("PricePointModel", back_populates="quote", cascade="all, delete-orphan")