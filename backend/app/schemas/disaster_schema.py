from pydantic import BaseModel, Field
from typing import List, Optional


class AnalyzeRiskRequest(BaseModel):
    district: str = Field(..., example="Ratnapura")
    condition: str = Field(
        ...,
        example="Heavy rain for over 6 hours and rising river water level"
    )


class AnalyzeRiskResponse(BaseModel):
    risk_level: str
    explanation: str
    recommendations: List[str]
    emergency_contacts: List[str]


class DisasterChatRequest(BaseModel):
    question: str
    district: Optional[str] = None


class DisasterChatResponse(BaseModel):
    answer: str