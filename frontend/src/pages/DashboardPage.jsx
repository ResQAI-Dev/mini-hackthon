import { useNavigate } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import "../dashboard-page.css";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="hero-badge">SRI LANKA DISASTER MANAGEMENT</span>
          <h1>DisasterGuard LK</h1>
          <p>
            Smart disaster risk assessment and community reporting platform
            designed for Sri Lankan communities.
          </p>
        </div>
      </section>

      <section className="quick-actions">
        <button onClick={() => navigate("/prediction")}>
          <strong>Risk Prediction</strong>
          <span>Assess rainfall and water-level risk</span>
        </button>

        <button onClick={() => navigate("/reporting")}>
          <strong>Report Disaster</strong>
          <span>Submit a community disaster report</span>
        </button>

        <button onClick={() => navigate("/ai-assistant")}>
          <strong>AI Assistant</strong>
          <span>Get disaster safety guidance</span>
        </button>

        <button onClick={() => navigate("/safety-info")}>
          <strong>Safety Information</strong>
          <span>View disaster preparedness guidance</span>
        </button>
      </section>

      <Dashboard />
    </div>
  );
}

export default DashboardPage;
