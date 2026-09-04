from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    district: str = Field(..., min_length=2)
    rainfall: float = Field(..., ge=0)
    water_level: float = Field(..., ge=0)


class PredictionResponse(BaseModel):
    district: str
    risk_score: float
    risk_level: str
    message: str