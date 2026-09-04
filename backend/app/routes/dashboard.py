from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services import disaster_report_service

router = APIRouter(tags=["Dashboard"])


def serialize_report(report):
    return {
        "id": getattr(report, "id", None),
        "disaster_type": getattr(report, "disaster_type", ""),
        "location": getattr(report, "location", ""),
        "latitude": getattr(report, "latitude", None),
        "longitude": getattr(report, "longitude", None),
        "severity": getattr(report, "severity", "Low"),
        "description": getattr(report, "description", ""),
        "affected_people": getattr(report, "affected_people", 0),
        "contact_number": getattr(report, "contact_number", ""),
        "status": getattr(report, "status", "Pending"),
        "created_at": (
            report.created_at.isoformat()
            if getattr(report, "created_at", None)
            else None
        ),
    }


@router.get("/api/reports")
def get_dashboard_reports(db: Session = Depends(get_db)):
    try:
        reports = disaster_report_service.get_reports(db=db)
        return [serialize_report(report) for report in reports]
    except Exception as error:
        print("Dashboard reports error:", error)
        return []


@router.get("/api/statistics")
def get_dashboard_statistics(db: Session = Depends(get_db)):
    try:
        reports = disaster_report_service.get_reports(db=db)

        total = len(reports)

        high = sum(
            1 for report in reports
            if str(getattr(report, "severity", "")).lower() == "high"
        )

        medium = sum(
            1 for report in reports
            if str(getattr(report, "severity", "")).lower() == "medium"
        )

        low = sum(
            1 for report in reports
            if str(getattr(report, "severity", "")).lower() == "low"
        )

        types = [
            getattr(report, "disaster_type", "")
            for report in reports
            if getattr(report, "disaster_type", "")
        ]

        locations = [
            getattr(report, "location", "")
            for report in reports
            if getattr(report, "location", "")
        ]

        most_common_disaster = (
            max(set(types), key=types.count)
            if types
            else "No reports yet"
        )

        most_affected_location = (
            max(set(locations), key=locations.count)
            if locations
            else "No reports yet"
        )

        return {
            "total_reports": total,
            "high_risk_reports": high,
            "medium_risk_reports": medium,
            "low_risk_reports": low,
            "most_common_disaster": most_common_disaster,
            "most_affected_location": most_affected_location,
        }

    except Exception as error:
        print("Dashboard statistics error:", error)

        return {
            "total_reports": 0,
            "high_risk_reports": 0,
            "medium_risk_reports": 0,
            "low_risk_reports": 0,
            "most_common_disaster": "No reports yet",
            "most_affected_location": "No reports yet",
        }
