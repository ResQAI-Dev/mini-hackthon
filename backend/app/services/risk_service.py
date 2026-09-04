def calculate_risk(rainfall: float, water_level: float) -> dict:
    score = 0

    if rainfall >= 150:
        score += 60
    elif rainfall >= 75:
        score += 35
    elif rainfall >= 30:
        score += 15

    if water_level >= 5:
        score += 40
    elif water_level >= 3:
        score += 25
    elif water_level >= 1:
        score += 10

    score = min(score, 100)

    if score >= 70:
        risk_level = "High"
        message = "High disaster risk. Please stay alert and follow official safety guidance."
    elif score >= 40:
        risk_level = "Medium"
        message = "Moderate disaster risk. Please monitor local conditions."
    else:
        risk_level = "Low"
        message = "Low estimated risk based on the provided information."

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "message": message,
    }
