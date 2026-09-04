import { useState } from "react";
import api from "../services/api";
import "./AIAssistantPage.css";

const quickQuestions = [
  "What should I do during a flood?",
  "How can I prepare my home for heavy rain?",
  "What should I do if water levels are rising?",
  "What emergency items should I keep ready?",
];

function AIAssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAI = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Please enter a disaster-related question.");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await api.post("/api/ai/explain", {
        question: trimmedQuestion,
        district: "Sri Lanka",
        rainfall: 0,
        water_level: 0,
        risk_score: 0,
        risk_level: "Low",
      });

      setAnswer(
        response?.data?.explanation ||
        response?.data?.message ||
        "Sorry, I could not generate an answer."
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to connect to the AI Assistant. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectQuickQuestion = (item) => {
    setQuestion(item);
    setAnswer("");
    setError("");
  };

  const clearAssistant = () => {
    setQuestion("");
    setAnswer("");
    setError("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      askAI();
    }
  };

  return (
    <div className="ai-page">
      <section className="ai-hero">
        <div className="ai-hero-icon">AI</div>

        <div>
          <span className="ai-eyebrow">SMART DISASTER SUPPORT</span>
          <h1>AI Disaster Assistant</h1>
          <p>
            Get quick, practical disaster preparedness and safety guidance
            for situations that may affect Sri Lankan communities.
          </p>
        </div>
      </section>

      <section className="ai-main-card">
        <div className="ai-card-header">
          <div>
            <h2>How can I help?</h2>
            <p>
              Ask a question about floods, heavy rain, landslides,
              emergency preparation, or disaster safety.
            </p>
          </div>

          <span className="ai-status">
            <span className="status-dot"></span>
            AI Ready
          </span>
        </div>

        <div className="quick-section">
          <span className="quick-label">QUICK QUESTIONS</span>

          <div className="quick-buttons">
            {quickQuestions.map((item) => (
              <button
                key={item}
                type="button"
                className="quick-question"
                onClick={() => selectQuickQuestion(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="question-section">
          <label htmlFor="ai-question">
            Ask about a disaster situation
          </label>

          <textarea
            id="ai-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: What should I do during a flood?"
            disabled={loading}
          />

          <div className="question-footer">
            <span>Ctrl + Enter to ask</span>

            <div className="ai-actions">
              {question && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={clearAssistant}
                  disabled={loading}
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                className="ask-button"
                onClick={askAI}
                disabled={loading || !question.trim()}
              >
                {loading ? "Thinking..." : "Ask AI Assistant"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="ai-error">
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="ai-loading-card">
            <div className="loading-icon">AI</div>

            <div>
              <strong>AI Assistant is thinking...</strong>
              <p>Preparing a practical safety response.</p>
            </div>

            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {answer && !loading && (
          <div className="ai-answer-card">
            <div className="answer-header">
              <div className="answer-icon">AI</div>

              <div>
                <span>AI DISASTER ASSISTANT</span>
                <h3>Safety Guidance</h3>
              </div>
            </div>

            <div className="answer-content">
              {answer}
            </div>

            <div className="answer-note">
              <strong>Important:</strong> This is informational guidance
              from the prototype. Always follow official disaster warnings
              and instructions from relevant authorities.
            </div>
          </div>
        )}
      </section>

      <section className="ai-features">
        <div className="feature-card">
          <div className="feature-icon">01</div>
          <h3>Ask Questions</h3>
          <p>
            Get guidance about common disaster situations and preparedness.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">02</div>
          <h3>Practical Guidance</h3>
          <p>
            Receive simple recommendations that are easy to understand.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">03</div>
          <h3>Safety First</h3>
          <p>
            Designed to support awareness while official guidance remains
            the priority.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AIAssistantPage;
