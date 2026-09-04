from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from app.database.connection import Base


class DisasterReport(Base):
    __tablename__ = "disaster_reports"

    id = Column(Integer, primary_key=True, index=True)

    disaster_type = Column(String(100), nullable=False)

    location = Column(String(255), nullable=False)

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    severity = Column(String(50), nullable=False)

    description = Column(Text, nullable=False)

    affected_people = Column(Integer, nullable=True)

    contact_number = Column(String(30), nullable=True)

    status = Column(
        String(50),
        nullable=False,
        default="Pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )