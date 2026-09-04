import React, { useState } from 'react';
import { analyzeRisk, askDisasterQuestion } from '../../services/disasterApi';

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", 
  "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", 
  "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", 
  "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", 
  "Trincomalee", "Vavuniya"
];

export default function AIDisasterAssistant() {
  const [district, setDistrict] = useState('Ratnapura');
  const [condition, setCondition] = useState('');
  const [riskData, setRiskData] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);

  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!condition.trim()) return;
        setLoadingRisk(true);
        try {
        const result = await analyzeRisk(district, condition);
        setRiskData(result);
        } catch (err) {
        alert("Failed to analyze risk conditions. Ensure backend is running.");
        } finally {
        setLoadingRisk(false);
        }
    };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const userMsg = question;
    setQuestion('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoadingChat(true);

    try {
      const res = await askDisasterQuestion(userMsg, district);
      setChatHistory((prev) => [...prev, { sender: 'ai', text: res.answer }]);
    } catch (err) {
      setChatHistory((prev) => [...prev, { sender: 'ai', text: 'Error connecting to emergency advisor server.' }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const getBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      default: return 'bg-green-600 text-white';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">🤖 AI Disaster Assistant</h1>
        <p className="text-slate-600">Localized risk analysis & emergency guidance engine</p>
      </header>

      {/* Section 1: Condition Analysis & Recommendations */}
      <section className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">1. District Risk Analysis</h2>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select District</label>
              <select 
                value={district} 
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border rounded-lg p-2 bg-slate-50"
              >
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Observed Conditions</label>
              <input 
                type="text"
                placeholder="e.g., Continuous heavy rainfall for 8 hours and water rising near riverbank"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loadingRisk}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loadingRisk ? 'Analyzing Threat...' : 'Evaluate Risk'}
          </button>
        </form>

        {riskData && (
          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg text-slate-800">Assessed Risk Level:</span>
              <span className={`px-4 py-1 rounded-full font-bold uppercase text-sm ${getBadgeColor(riskData.risk_level)}`}>
                {riskData.risk_level}
              </span>
            </div>

            <div>
              <h3 className="font-semibold text-slate-700">Risk Explanation:</h3>
              <p className="text-slate-600 text-sm mt-1">{riskData.explanation}</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-700">Recommended Actions:</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 mt-1 space-y-1">
                {riskData.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-700">Emergency Hotlines:</h3>
              <div className="flex gap-2 mt-2">
                {riskData.emergency_contacts.map((contact, i) => (
                  <span key={i} className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-md font-medium">
                    {contact}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Conversational Emergency Q&A */}
      <section className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">2. Emergency Guidance Chat</h2>
        <div className="h-64 overflow-y-auto border rounded-lg p-4 bg-slate-50 mb-4 space-y-3">
          {chatHistory.length === 0 ? (
            <p className="text-slate-400 text-sm text-center">Ask any urgent question (e.g., "Where is the nearest shelter standard protocol?")</p>
          ) : (
            chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg text-sm ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-800 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loadingChat && <p className="text-slate-400 text-xs italic">ResQAI assistant is typing...</p>}
        </div>

        <form onSubmit={handleChat} className="flex gap-2">
          <input 
            type="text"
            placeholder="Type your disaster query..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-grow border rounded-lg p-2 text-sm"
          />
          <button 
            type="submit" 
            disabled={loadingChat}
            className="bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            Ask AI
          </button>
        </form>
      </section>
    </div>
  );
}