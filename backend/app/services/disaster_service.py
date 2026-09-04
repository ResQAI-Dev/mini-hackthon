import os
import json
import logging
import time
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.schemas.disaster_schema import AnalyzeRiskResponse


# ============================================================
# ENVIRONMENT
# ============================================================

ENV_PATH = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

logger = logging.getLogger(__name__)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        f"GEMINI_API_KEY environment variable missing at: {ENV_PATH}"
    )


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(api_key=api_key)

PRIMARY_MODEL = "gemini-3.8-flash"
FALLBACK_MODEL = "gemini-3.7-flash"


# ============================================================
# SYSTEM INSTRUCTION
# ============================================================

SYSTEM_INSTRUCTION = """
You are the Sri Lanka Disaster Management Assistant (ResQAI).

Provide actionable and practical safety advice appropriate for Sri Lanka.

Analyze environmental conditions using:
- District geography
- Terrain
- Rivers
- Rainfall
- Flooding
- Landslides
- Coastal hazards
- Strong winds
- Storms
- Other relevant environmental hazards

Emergency contacts:
DMC: 117
Police: 119
Ambulance: 1990
"""


# ============================================================
# HELPER: GEMINI REQUEST WITH RETRY + FALLBACK
# ============================================================

def generate_with_retry(prompt, config):
    models_to_try = [
        PRIMARY_MODEL,
        FALLBACK_MODEL
    ]

    last_error = None

    for model in models_to_try:

        for attempt in range(3):

            try:
                logger.info(
                    "Calling Gemini model=%s attempt=%s",
                    model,
                    attempt + 1
                )

                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config,
                )

                if response and response.text:
                    return response

                raise ValueError("Gemini returned an empty response.")

            except Exception as e:
                last_error = e

                error_text = str(e)

                # Retry temporary overload / unavailable errors
                if "503" in error_text or "UNAVAILABLE" in error_text:

                    wait_time = 2 ** attempt

                    logger.warning(
                        "Gemini temporarily unavailable. "
                        "Retrying in %s seconds...",
                        wait_time
                    )

                    time.sleep(wait_time)
                    continue

                # Don't retry unrelated errors
                raise

    raise last_error


# ============================================================
# DISASTER RISK ANALYSIS
# ============================================================

def analyze_disaster_risk(
    district: str,
    condition: str
) -> AnalyzeRiskResponse:

    prompt = f"""
District: {district}, Sri Lanka

Observed Environmental Conditions:
{condition}

Evaluate the disaster threat.

Return JSON with exactly these fields:

{{
    "risk_level": "Low",
    "explanation": "Two-sentence hazard summary tailored to {district}.",
    "recommendations": [
        "Safety step 1",
        "Safety step 2",
        "Safety step 3"
    ],
    "emergency_contacts": [
        "DMC Hotline: 117",
        "Police Emergency: 119",
        "Ambulance: 1990"
    ]
}}

Rules:

- risk_level must be exactly:
  Low, Moderate, High, or Critical

- explanation should contain approximately 2 sentences.

- recommendations must contain exactly 3 actionable safety steps.

- emergency_contacts must contain exactly:
  DMC Hotline: 117
  Police Emergency: 119
  Ambulance: 1990

- Tailor the explanation to the geography and hazards of {district}, Sri Lanka.

- Return valid JSON only.
- Do not use Markdown.
"""

    try:

        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=AnalyzeRiskResponse,
            http_options=types.HttpOptions(
                timeout=60000
            ),
        )

        response = generate_with_retry(
            prompt,
            config
        )

        logger.info(
            "Gemini risk response: %s",
            response.text
        )

        data = json.loads(response.text)

        return AnalyzeRiskResponse(**data)

    except Exception:
        logger.exception(
            "Failed to analyze disaster risk for district=%s",
            district
        )
        raise


# ============================================================
# DISASTER CHAT
# ============================================================

def answer_disaster_query(
    question: str,
    district: Optional[str] = None
) -> str:

    location_str = (
        f" (District: {district})"
        if district and district.strip()
        else ""
    )

    prompt = (
        f"User Query: {question}{location_str}\n\n"
        "Provide practical and concise disaster guidance for Sri Lanka."
    )

    try:

        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            http_options=types.HttpOptions(
                timeout=60000
            ),
        )

        response = generate_with_retry(
            prompt,
            config
        )

        return response.text

    except Exception:
        logger.exception(
            "Failed to answer disaster query"
        )
        raise