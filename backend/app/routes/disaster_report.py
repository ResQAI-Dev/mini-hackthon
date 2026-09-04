from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.disaster_report import (
    DisasterReportCreate,
    DisasterReportResponse,
    DisasterReportStatusUpdate
)
from app.services import disaster_report_service


router = APIRouter(
    prefix="/api/disaster-report",
    tags=["Disaster Report"]
)


@router.post(
    "",
    response_model=DisasterReportResponse,
    status_code=status.HTTP_201_CREATED
)
def create_disaster_report(
    report: DisasterReportCreate,
    db: Session = Depends(get_db)
):
    return disaster_report_service.create_report(
        db,
        report
    )


@router.get(
    "",
    response_model=list[DisasterReportResponse]
)
def get_disaster_reports(
    disaster_type: Optional[str] = None,
    severity: Optional[str] = None,
    status_filter: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return disaster_report_service.get_reports(
        db=db,
        disaster_type=disaster_type,
        severity=severity,
        status=status_filter,
        location=location
    )


@router.get(
    "/{report_id}",
    response_model=DisasterReportResponse
)
def get_disaster_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    report = disaster_report_service.get_report(
        db,
        report_id
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Disaster report not found"
        )

    return report


@router.put(
    "/{report_id}/status",
    response_model=DisasterReportResponse
)
def update_disaster_report_status(
    report_id: int,
    status_data: DisasterReportStatusUpdate,
    db: Session = Depends(get_db)
):
    report = disaster_report_service.change_report_status(
        db,
        report_id,
        status_data
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Disaster report not found"
        )

    return report