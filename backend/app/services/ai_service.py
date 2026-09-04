import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_risk_explanation(
    district: str,
    rainfall: float,
    water_level: float,
    risk_score: float,
    risk_level: str,
) -> str:

    prompt = f"""
You are the AI risk-assessment assistant for DisasterGuard LK,
a Sri Lankan disaster risk assessment prototype.

Assessment:
District: {district}
Rainfall: {rainfall} mm
Water Level: {water_level} m
Risk Score: {risk_score}/100
Risk Level: {risk_level}

Generate a concise and professional response.

Use EXACTLY this structure:

RISK OVERVIEW
Write 2 short sentences explaining the estimated risk.

KEY RISK FACTORS
- Rainfall factor.
- Water-level factor.
- One relevant local vulnerability factor.

RECOMMENDED ACTIONS
- One practical safety action.
- One preparedness action.
- Follow official disaster warnings.

IMPORTANT:
- Maximum 120 words.
- Use simple professional language.
- Do not use # markdown headings.
- Do not use bold formatting.
- Avoid unnecessary repetition.
- Do not claim scientific certainty.
- Do not present this as an official government warning.
- Mention that this is a prototype assessment.
- Do not mention that you are an AI model.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text.strip()

    except Exception as e:
        print("Gemini unavailable:", repr(e))

        return f"""RISK OVERVIEW
The estimated risk level for {district} is {risk_level}, based on the provided rainfall and water-level information.
This is a prototype assessment and should not be treated as an official warning.

KEY RISK FACTORS
- Rainfall: {rainfall} mm.
- Water level: {water_level} m.
- Estimated risk score: {risk_score}/100.

RECOMMENDED ACTIONS
- Monitor local weather and environmental conditions.
- Keep essential emergency items ready.
- Follow official disaster warnings and instructions."""
