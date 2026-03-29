from sqlalchemy import Column, BigInteger, ForeignKey, TIMESTAMP, Numeric, Index
from sqlalchemy.orm import relationship
from .base import Base

class PriceSeriesModel(Base):
    __tablename__ = "price_points"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    quote_id = Column(BigInteger, ForeignKey("quotes.id"), nullable=False, index=True)
    datetime = Column(TIMESTAMP, nullable=False)
    close_price = Column(Numeric(12,4), nullable=False)
    created_at = Column(TIMESTAMP, server_default="NOW()", nullable=False)

    quote = relationship("QuoteModel", back_populates="price_points")

# Index pour faciliter les recherches par quote et période
Index("ix_pricepoints_quote_datetime", PriceSeriesModel.quote_id, PriceSeriesModel.datetime)