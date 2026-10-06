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

# Stable models confirmed for this API key (3.8 can be slow under load)
PRIMARY_MODEL = "gemini-3.6-flash"
FALLBACK_MODEL = "gemini-flash-latest"

DEFAULT_CONTACTS = [
    "DMC Hotline: 117",
    "Police Emergency: 119",
    "Ambulance: 1990",
]


# ============================================================
# SYSTEM INSTRUCTION
# ============================================================

SYSTEM_INSTRUCTION = """
You are the Sri Lanka Disaster Management Assistant (ResQAI).
Give short, practical safety advice for Sri Lanka.
Use local geography, rainfall, floods, landslides, coastal and storm hazards when relevant.
Emergency contacts: DMC 117, Police 119, Ambulance 1990.
"""


# ============================================================
# HELPER: GEMINI REQUEST WITH RETRY + FALLBACK
# ============================================================

def _is_retryable(error: Exception) -> bool:
    text = str(error).lower()
    markers = (
        "503",
        "429",
        "unavailable",
        "timeout",
        "timed out",
        "resource_exhausted",
        "overloaded",
    )
    return any(marker in text for marker in markers)


def generate_with_retry(prompt: str, config: types.GenerateContentConfig):
    models_to_try = [PRIMARY_MODEL, FALLBACK_MODEL]
    last_error = None

    for model in models_to_try:
        for attempt in range(3):
            try:
                logger.info("Calling Gemini model=%s attempt=%s", model, attempt + 1)
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
                if _is_retryable(e) and attempt < 2:
                    wait_time = 2 ** attempt
                    logger.warning(
                        "Gemini retryable error (%s). Retrying in %ss...",
                        type(e).__name__,
                        wait_time,
                    )
                    time.sleep(wait_time)
                    continue
                # Non-retryable on this model: try fallback model
                logger.warning(
                    "Gemini model=%s failed: %s",
                    model,
                    str(e)[:200],
                )
                break

    raise last_error


def _extract_json(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start >= 0 and end > start:
            return json.loads(cleaned[start : end + 1])
        raise


# ============================================================
# DISASTER RISK ANALYSIS
# ============================================================

def analyze_disaster_risk(district: str, condition: str) -> AnalyzeRiskResponse:
    prompt = f"""
District: {district}, Sri Lanka
Observed conditions: {condition}

Return ONLY valid JSON (no markdown) with these fields:
{{
  "risk_level": "Low|Moderate|High|Critical",
  "explanation": "Two short sentences about the hazard in {district}.",
  "recommendations": ["action 1", "action 2", "action 3"],
  "emergency_contacts": ["DMC Hotline: 117", "Police Emergency: 119", "Ambulance: 1990"]
}}
"""

    try:
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            temperature=0.2,
            http_options=types.HttpOptions(timeout=120_000),
        )

        response = generate_with_retry(prompt, config)
        logger.info("Gemini risk response: %s", response.text[:500])

        data = _extract_json(response.text)
        data["emergency_contacts"] = data.get("emergency_contacts") or DEFAULT_CONTACTS

        # Normalize recommendations length
        recs = data.get("recommendations") or []
        if not isinstance(recs, list):
            recs = [str(recs)]
        while len(recs) < 3:
            recs.append("Stay informed via official DMC alerts and local authorities.")
        data["recommendations"] = recs[:3]

        if data.get("risk_level") not in {"Low", "Moderate", "High", "Critical"}:
            data["risk_level"] = "Moderate"

        return AnalyzeRiskResponse(**data)

    except Exception:
        logger.exception(
            "Failed to analyze disaster risk for district=%s",
            district,
        )
        raise


# ============================================================
# DISASTER CHAT
# ============================================================

def answer_disaster_query(
    question: str,
    district: Optional[str] = None,
) -> str:
    location_str = (
        f" (District: {district})"
        if district and district.strip()
        else ""
    )

    prompt = (
        f"User question: {question}{location_str}\n\n"
        "Give concise, actionable disaster guidance for Sri Lanka in under 120 words."
    )

    try:
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            temperature=0.3,
            http_options=types.HttpOptions(timeout=120_000),
        )
        response = generate_with_retry(prompt, config)
        return response.text.strip()
    except Exception:
        logger.exception("Failed to answer disaster query")
        raise
