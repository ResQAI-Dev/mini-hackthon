import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.disaster_schema import (
    AnalyzeRiskRequest, 
    AnalyzeRiskResponse,
    DisasterChatRequest, 
    DisasterChatResponse
)
import app.services.disaster_service as service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/disaster", tags=["Disaster Assistant"])


@router.post(
    "/analyze", 
    response_model=AnalyzeRiskResponse, 
    status_code=status.HTTP_200_OK,
    summary="Analyze disaster risk for a district based on observed conditions"
)
def analyze_conditions(payload: AnalyzeRiskRequest):
    """
    Evaluates environmental conditions for a Sri Lankan district and returns 
    assessed risk level, localized explanation, safety actions, and emergency contacts.
    """
    try:
        return service.analyze_disaster_risk(payload.district, payload.condition)
    except Exception as e:
        logger.error(f"Error during risk analysis: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Risk analysis error: {str(e)}"
        )


@router.post(
    "/chat", 
    response_model=DisasterChatResponse, 
    status_code=status.HTTP_200_OK,
    summary="Interactive emergency guidance Q&A"
)
def disaster_chat(payload: DisasterChatRequest):
    """
    Provides immediate safety guidance and protocols in response to user queries.
    """
    try:
        answer = service.answer_disaster_query(payload.question, payload.district)
        return DisasterChatResponse(answer=answer)
    except Exception as e:
        logger.error(f"Error during disaster chat guidance: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Chat guidance error: {str(e)}"
        )