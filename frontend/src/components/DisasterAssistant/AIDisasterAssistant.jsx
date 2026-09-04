import { useState } from 'react';
import { analyzeRisk, askDisasterQuestion } from '../../services/disasterApi';
import './AIDisasterAssistant.css';

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle',
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Trincomalee', 'Vavuniya',
];

function riskTone(level) {
  switch ((level || '').toLowerCase()) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'moderate':
      return 'moderate';
    default:
      return 'low';
  }
}

export default function AIDisasterAssistant() {
  const [district, setDistrict] = useState('Ratnapura');
  const [condition, setCondition] = useState('');
  const [riskData, setRiskData] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [riskError, setRiskError] = useState('');

  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!condition.trim()) return;

    setLoadingRisk(true);
    setRiskError('');
    try {
      const result = await analyzeRisk(district, condition.trim());
      setRiskData(result);
    } catch (err) {
      setRiskData(null);
      setRiskError(err.message || 'Failed to analyze risk. Is the backend running?');
    } finally {
      setLoadingRisk(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMsg = question.trim();
    setQuestion('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoadingChat(true);

    try {
      const res = await askDisasterQuestion(userMsg, district);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: res.answer || 'No guidance returned.' },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Could not reach the emergency advisor: ${err.message}`,
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="da-root">
      <header className="da-header">
        <p className="da-brand">ResQAI</p>
        <h1>AI Disaster Assistant</h1>
        <p className="da-subtitle">
          Localized condition analysis, risk explanation, safety steps, and emergency Q&amp;A for Sri Lanka.
        </p>
      </header>

      <section className="da-panel">
        <h2>1. Conditions analyze</h2>
        <form onSubmit={handleAnalyze} className="da-form">
          <label className="da-field">
            <span>District</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {SRI_LANKA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="da-field da-field-wide">
            <span>Observed conditions</span>
            <textarea
              rows={3}
              placeholder="e.g. Continuous heavy rainfall for 8 hours and water rising near the riverbank"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="da-btn da-btn-primary" disabled={loadingRisk}>
            {loadingRisk ? 'Analyzing threat…' : 'Evaluate risk'}
          </button>
        </form>

        {riskError && <p className="da-error" role="alert">{riskError}</p>}

        {riskData && (
          <div className="da-result">
            <div className="da-result-top">
              <h3>Risk level</h3>
              <span className={`da-badge da-badge-${riskTone(riskData.risk_level)}`}>
                {riskData.risk_level}
              </span>
            </div>

            <div className="da-block">
              <h3>Risk explanation</h3>
              <p>{riskData.explanation}</p>
            </div>

            <div className="da-block">
              <h3>Safety recommendations</h3>
              <ul>
                {(riskData.recommendations || []).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="da-block">
              <h3>Emergency contacts</h3>
              <div className="da-contacts">
                {(riskData.emergency_contacts || []).map((contact, i) => (
                  <span key={i}>{contact}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="da-panel">
        <h2>2. Disaster-related guidance</h2>
        <p className="da-hint">
          Ask safety questions for <strong>{district}</strong> (uses the district selected above).
        </p>

        <div className="da-chat">
          {chatHistory.length === 0 ? (
            <p className="da-chat-empty">
              Example: “Where should I go if the river floods tonight?”
            </p>
          ) : (
            chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`da-bubble ${msg.sender === 'user' ? 'da-bubble-user' : 'da-bubble-ai'}`}
              >
                {msg.text}
              </div>
            ))
          )}
          {loadingChat && <p className="da-typing">ResQAI is preparing guidance…</p>}
        </div>

        <form onSubmit={handleChat} className="da-chat-form">
          <input
            type="text"
            placeholder="Type your disaster question…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button type="submit" className="da-btn da-btn-dark" disabled={loadingChat}>
            Ask AI
          </button>
        </form>
      </section>
    </div>
  );
}
