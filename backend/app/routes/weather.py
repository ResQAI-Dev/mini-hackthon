from fastapi import APIRouter, HTTPException
import requests

router = APIRouter(prefix="/api/weather", tags=["Weather"])


DISTRICT_COORDINATES = {
    "Colombo": (6.9271, 79.8612),
    "Gampaha": (7.0840, 80.0098),
    "Kalutara": (6.5854, 79.9607),
    "Kandy": (7.2906, 80.6337),
    "Matale": (7.4675, 80.6234),
    "Nuwara Eliya": (6.9497, 80.7891),
    "Galle": (6.0329, 80.2168),
    "Matara": (5.9549, 80.5550),
    "Hambantota": (6.1429, 81.1212),
    "Jaffna": (9.6615, 80.0255),
    "Kilinochchi": (9.3803, 80.3770),
    "Mannar": (8.9810, 79.9044),
    "Vavuniya": (8.7514, 80.4971),
    "Mullaitivu": (9.2671, 80.8142),
    "Batticaloa": (7.7170, 81.7000),
    "Ampara": (7.2965, 81.6820),
    "Trincomalee": (8.5874, 81.2152),
    "Kurunegala": (7.4863, 80.3623),
    "Puttalam": (8.0362, 79.8283),
    "Anuradhapura": (8.3114, 80.4037),
    "Polonnaruwa": (7.9403, 81.0188),
    "Badulla": (6.9934, 81.0550),
    "Monaragala": (6.8728, 81.3507),
    "Ratnapura": (6.6828, 80.3992),
    "Kegalle": (7.2513, 80.3464),
}


@router.get("/{district}")
def get_rainfall(district: str):
    if district not in DISTRICT_COORDINATES:
        raise HTTPException(status_code=404, detail="District not found")

    latitude, longitude = DISTRICT_COORDINATES[district]

    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}"
        f"&longitude={longitude}"
        "&daily=rain_sum"
        "&forecast_days=1"
        "&timezone=Asia%2FColombo"
    )

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()
        rainfall = data["daily"]["rain_sum"][0]

        return {
            "district": district,
            "rainfall": round(float(rainfall)),
            "unit": "mm",
            "source": "Open-Meteo",
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Unable to retrieve automatic rainfall data",
        )

