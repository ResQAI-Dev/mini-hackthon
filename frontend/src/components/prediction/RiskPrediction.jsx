import { useState } from "react";
import PredictionForm from "./PredictionForm";

function RiskPrediction() {
  const [result, setResult] = useState(null);
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handlePredictionResult = async (data) => {
    setResult(data);
    setAiExplanation("");
    setAiError("");

    if (!data) {
      return;
    }

    setAiLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/ai/explain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            district: data.district,
            rainfall: data.rainfall,
            water_level: data.water_level,
            risk_score: data.risk_score,
            risk_level: data.risk_level,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("AI explanation request failed");
      }

      const aiData = await response.json();

      setAiExplanation(aiData.explanation);
    } catch (error) {
      console.error("AI Error:", error);
      setAiError(
        "AI explanation is currently unavailable. Please use the risk assessment and official safety guidance."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const getRiskClass = (level) => {
    if (level === "High") return "high";
    if (level === "Medium") return "medium";
    return "low";
  };

  const getActions = (level) => {
    if (level === "High") {
      return [
        "Move to a safer location if advised by authorities.",
        "Avoid flooded roads and fast-moving water.",
        "Keep emergency contacts and essential items ready.",
      ];
    }

    if (level === "Medium") {
      return [
        "Continue monitoring local weather and water conditions.",
        "Avoid unnecessary travel near flood-prone areas.",
        "Keep an emergency kit ready.",
      ];
    }

    return [
      "Continue monitoring local conditions.",
      "Keep emergency contacts available.",
      "Follow official disaster safety guidance.",
    ];
  };

  return (
    <div className="risk-page">
      <header className="risk-header">
        <div className="brand-badge">DISASTERGUARD LK</div>

        <h1>Smart Disaster Risk Assessment</h1>

        <p>
          Assess potential disaster risk using rainfall and water-level
          information for your area.
        </p>
      </header>

      <section className="prediction-card">
        <div className="card-title">
          <div>
            <span className="section-label">RISK PREDICTION</span>
            <h2>Assess Your Area</h2>
          </div>

          <div className="shield-icon">RISK</div>
        </div>

        <PredictionForm onResult={handlePredictionResult} />

        {result && (
          <div className={`result-card ${getRiskClass(result.risk_level)}`}>
            <div className="result-top">
              <div>
                <span className="result-label">RISK ASSESSMENT</span>
                <h2>{result.district}</h2>
              </div>

              <div className="risk-badge">
                {result.risk_level} Risk
              </div>
            </div>

            <div className="score-section">
              <div className="score-header">
                <span>Overall Risk Score</span>

                <strong>
                  {Number(result.risk_score).toFixed(0)}
                  <small>/100</small>
                </strong>
              </div>

              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{ width: `${result.risk_score}%` }}
                ></div>
              </div>

              <div className="scale-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            <div className="factor-grid">
              <div className="factor-card">
                <span className="factor-icon">RF</span>

                <div>
                  <small>RAINFALL</small>
                  <strong>{result.rainfall} mm</strong>
                </div>
              </div>

              <div className="factor-card">
                <span className="factor-icon">WL</span>

                <div>
                  <small>WATER LEVEL</small>
                  <strong>{result.water_level} m</strong>
                </div>
              </div>

              <div className="factor-card">
                <span className="factor-icon">LV</span>

                <div>
                  <small>RISK LEVEL</small>
                  <strong>{result.risk_level}</strong>
                </div>
              </div>
            </div>

            <div className="assessment-message">
              <div className="message-title">
                Assessment Summary
              </div>

              <p>{result.message}</p>
            </div>

            <div className="actions-section">
              <h3>Recommended Actions</h3>

              <div className="action-list">
                {getActions(result.risk_level).map((action, index) => (
                  <div className="action-item" key={index}>
                    <span>{index + 1}</span>
                    <p>{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI EXPLANATION */}
            <div className="ai-explanation-section">
              <div className="ai-title">
                <span className="ai-badge">AI</span>
                <div>
                  <strong>AI Risk Explanation</strong>
                  <small>Powered by Gemini</small>
                </div>
              </div>

              {aiLoading && (
                <div className="ai-loading">
                  Generating AI explanation...
                </div>
              )}

              {aiError && (
                <div className="ai-error">
                  {aiError}
                </div>
              )}

              {aiExplanation && (
                <div className="ai-response">
                  {aiExplanation.split("\n").map((line, index) => (
                    <p key={index}>
                      {line || "\u00A0"}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="official-note">
              <strong>Important:</strong> This prototype provides an
              estimated risk assessment. Always follow official warnings
              and instructions from Sri Lankan disaster management
              authorities.
            </div>
          </div>
        )}
      </section>

      <section className="risk-scale-card">
        <div>
          <span className="section-label">UNDERSTANDING THE SCORE</span>
          <h2>Risk Classification</h2>
        </div>

        <div className="risk-scale">
          <div className="scale-item low-scale">
            <span>0-39</span>
            <strong>Low Risk</strong>
            <small>Normal monitoring</small>
          </div>

          <div className="scale-item medium-scale">
            <span>40-69</span>
            <strong>Medium Risk</strong>
            <small>Stay alert</small>
          </div>

          <div className="scale-item high-scale">
            <span>70-100</span>
            <strong>High Risk</strong>
            <small>Take precautions</small>
          </div>
        </div>
      </section>

      <footer className="risk-footer">
        DisasterGuard LK | Smart Disaster Risk Assessment | Sri Lanka
      </footer>
    </div>
  );
}

export default RiskPrediction;