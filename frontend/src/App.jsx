import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import PredictionPage from "./pages/PredictionPage";
import ReportingPage from "./pages/ReportingPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import SafetyInfoPage from "./pages/SafetyInfoPage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/reporting" element={<ReportingPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/safety-info" element={<SafetyInfoPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
