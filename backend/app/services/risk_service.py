def calculate_risk(rainfall: float, water_level: float) -> dict:
    rainfall_score = min((rainfall / 150) * 60, 60)
    water_score = min((water_level / 5) * 40, 40)

    score = round(rainfall_score + water_score)
    score = min(score, 100)

    if score >= 70:
        risk_level = "High"
        message = "High estimated disaster risk. Please stay alert and follow official safety guidance."
    elif score >= 40:
        risk_level = "Medium"
        message = "Moderate estimated disaster risk. Please monitor local conditions."
    else:
        risk_level = "Low"
        message = "Low estimated risk based on the provided information."

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "message": message,
    }
