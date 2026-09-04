from sqlalchemy.orm import Session
from app.models.disaster_report import DisasterReport


def create_disaster_report(db: Session, report_data):
    data = report_data.model_dump() if hasattr(report_data, "model_dump") else report_data.dict()
    report = DisasterReport(**data)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_disaster_reports(db: Session, disaster_type=None, severity=None, status=None, location=None):
    query = db.query(DisasterReport)

    if disaster_type:
        query = query.filter(DisasterReport.disaster_type == disaster_type)

    if severity:
        query = query.filter(DisasterReport.severity == severity)

    if status:
        query = query.filter(DisasterReport.status == status)

    if location:
        query = query.filter(DisasterReport.location.ilike(f"%{location}%"))

    return query.order_by(DisasterReport.created_at.desc()).all()


def get_disaster_report_by_id(db: Session, report_id: int):
    return db.query(DisasterReport).filter(
        DisasterReport.id == report_id
    ).first()


def update_disaster_report_status(db: Session, report_id: int, status_value: str):
    report = get_disaster_report_by_id(db, report_id)

    if not report:
        return None

    report.status = status_value
    db.commit()
    db.refresh(report)

    return report
