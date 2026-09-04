from sqlalchemy.orm import Session

from app.database import crud
from app.schemas.disaster_report import (
    DisasterReportCreate,
    DisasterReportStatusUpdate
)


def create_report(
    db: Session,
    report_data: DisasterReportCreate
):
    return crud.create_disaster_report(
        db,
        report_data
    )


def get_reports(
    db: Session,
    disaster_type: str | None = None,
    severity: str | None = None,
    status: str | None = None,
    location: str | None = None
):
    return crud.get_disaster_reports(
        db=db,
        disaster_type=disaster_type,
        severity=severity,
        status=status,
        location=location
    )


def get_report(
    db: Session,
    report_id: int
):
    return crud.get_disaster_report_by_id(
        db,
        report_id
    )


def change_report_status(
    db: Session,
    report_id: int,
    status_data: DisasterReportStatusUpdate
):
    return crud.update_disaster_report_status(
        db,
        report_id,
        status_data
    )