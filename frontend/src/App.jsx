import { useState } from "react";
import RiskPrediction from "./components/prediction/RiskPrediction";
import ReportingPage from "./pages/ReportingPage";
import "./App.css";

function App() {
  const [page, setPage] = useState("risk");

  return (
    <div className="app">
      <nav>
        <button onClick={() => setPage("risk")}>
          Risk Prediction
        </button>

        <button onClick={() => setPage("reporting")}>
          Disaster Reporting
        </button>
      </nav>

      {page === "risk" && <RiskPrediction />}
      {page === "reporting" && <ReportingPage />}
    </div>
  );
}

export default App;