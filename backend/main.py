from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

reports = [
    {

        "id": 1,
        "disaster_type": "Flood",
        "location": "Colombo",
        "description": "Water level rising near the main road",
        "severity": "High"
    },
    {
        "id": 2,
        "disaster_type": "Landslide",
        "location": "Kandy",
        "description": "Small soil movement reported near hillside",
        "severity": "Medium"
    },
    {
        "id": 3,
        "disaster_type": "Flood",
        "location": "Galle",
        "description": "Minor flooding near residential area",
        "severity": "Low"
    },
    {
        "id": 4,
        "disaster_type": "Storm",
        "location": "Matara",
        "description": "Strong winds reported in the area",
        "severity": "High"
    }
]

@app.get("/")
def read_root():
    return {"message": "Disaster Management API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/reports")
def get_reports():
    return reports

@app.get("/api/statistics")
def get_statistics():
    total_reports = len(reports)
    high_risk_reports = 0
    medium_risk_reports = 0
    low_risk_reports = 0

    for report in reports:
        if report["severity"] == "High":
            high_risk_reports += 1
        elif report["severity"] == "Medium":
            medium_risk_reports += 1
        elif report["severity"] == "Low":
            low_risk_reports += 1

    return {
        "total_reports": total_reports,
        "high_risk_reports": high_risk_reports,
        "medium_risk_reports": medium_risk_reports,
        "low_risk_reports": low_risk_reports
    }
