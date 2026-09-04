from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class DisasterReportCreate(BaseModel):
    disaster_type: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    location: str = Field(
        ...,
        min_length=2,
        max_length=255
    )

    latitude: float = Field(
        ...,
        ge=-90,
        le=90
    )

    longitude: float = Field(
        ...,
        ge=-180,
        le=180
    )

    severity: str = Field(
        ...,
        min_length=2,
        max_length=50
    )

    description: str = Field(
        ...,
        min_length=10,
        max_length=2000
    )

    affected_people: Optional[int] = Field(
        default=None,
        ge=0
    )

    contact_number: Optional[str] = Field(
        default=None,
        max_length=30
    )


class DisasterReportStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        min_length=2,
        max_length=50
    )


class DisasterReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int

    disaster_type: str

    location: str

    latitude: float

    longitude: float

    severity: str

    description: str

    affected_people: Optional[int]

    contact_number: Optional[str]

    status: str

    created_at: datetime