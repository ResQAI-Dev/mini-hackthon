from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from app.database.connection import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    district = Column(String, nullable=False)
    rainfall = Column(Float, nullable=False)
    water_level = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
