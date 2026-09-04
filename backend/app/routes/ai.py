from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import generate_risk_explanation

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])


class AIExplanationRequest(BaseModel):
    district: str
    rainfall: float
    water_level: float
    risk_score: float
    risk_level: str


@router.post("/explain")
def explain_risk(data: AIExplanationRequest):
    try:
        explanation = generate_risk_explanation(
            district=data.district,
            rainfall=data.rainfall,
            water_level=data.water_level,
            risk_score=data.risk_score,
            risk_level=data.risk_level,
        )

        return {
            "district": data.district,
            "risk_level": data.risk_level,
            "explanation": explanation,
        }

    except Exception as e:
        print("AI ERROR:", repr(e))
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
