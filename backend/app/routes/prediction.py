from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.risk_service import calculate_risk

router = APIRouter(prefix="/api/prediction", tags=["Risk Prediction"])


@router.post("", response_model=PredictionResponse)
def predict_risk(
    data: PredictionRequest,
    db: Session = Depends(get_db),
):
    result = calculate_risk(
        rainfall=data.rainfall,
        water_level=data.water_level,
    )

    prediction = Prediction(
        district=data.district,
        rainfall=data.rainfall,
        water_level=data.water_level,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
    )

    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return {
        "district": data.district,
        **result,
    }


@router.get("/history")
def get_prediction_history(db: Session = Depends(get_db)):
    predictions = (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())
        .limit(20)
        .all()
    )

    return predictions
