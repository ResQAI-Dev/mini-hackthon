import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState({
    total_reports: 0,
    high_risk_reports: 0,
    medium_risk_reports: 0,
    low_risk_reports: 0,
    most_common_disaster: "No reports yet",
    most_affected_location: "No reports yet",
  });

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [type, setType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [statisticsResponse, reportsResponse] = await Promise.all([
        api.get("/api/statistics"),
        api.get("/api/reports"),
      ]);

      setStatistics(statisticsResponse.data);
      setReports(Array.isArray(reportsResponse.data) ? reportsResponse.data : []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  const disasterTypes = useMemo(() => {
    return [
      "All",
      ...new Set(
        reports
          .map((report) => report.disaster_type)
          .filter(Boolean)
      ),
    ];
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const text = [
        report.disaster_type,
        report.location,
        report.description,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesSeverity =
        severity === "All" ||
        String(report.severity).toLowerCase() === severity.toLowerCase();

      const matchesType =
        type === "All" || report.disaster_type === type;

      return matchesSearch && matchesSeverity && matchesType;
    });
  }, [reports, search, severity, type]);

  const total = statistics.total_reports || 0;
  const high = statistics.high_risk_reports || 0;
  const medium = statistics.medium_risk_reports || 0;
  const low = statistics.low_risk_reports || 0;

  const highRate = total > 0 ? Math.round((high / total) * 100) : 0;

  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <div>
          <p className="section-label">OVERVIEW</p>
          <h2>Disaster Monitoring Dashboard</h2>
          <p>
            Monitor community reports and understand the current disaster
            situation across Sri Lanka.
          </p>
        </div>

        <button className="refresh-button" onClick={loadDashboard}>
          Refresh Data
        </button>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      {loading ? (
        <div className="dashboard-loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-blue">
              <div className="stat-icon">R</div>
              <div>
                <span>Total Reports</span>
                <strong>{total}</strong>
                <small>Community reports</small>
              </div>
            </div>

            <div className="stat-card stat-red">
              <div className="stat-icon">H</div>
              <div>
                <span>High Risk</span>
                <strong>{high}</strong>
                <small>Requires attention</small>
              </div>
            </div>

            <div className="stat-card stat-orange">
              <div className="stat-icon">M</div>
              <div>
                <span>Medium Risk</span>
                <strong>{medium}</strong>
                <small>Needs monitoring</small>
              </div>
            </div>

            <div className="stat-card stat-green">
              <div className="stat-icon">L</div>
              <div>
                <span>Low Risk</span>
                <strong>{low}</strong>
                <small>Currently lower risk</small>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-panel risk-panel">
              <div className="panel-header">
                <div>
                  <p className="section-label">RISK SUMMARY</p>
                  <h3>Report Risk Distribution</h3>
                </div>
                <span className="risk-rate">{highRate}% high risk</span>
              </div>

              <div className="risk-bars">
                <div className="risk-row">
                  <div className="risk-row-label">
                    <span>High Risk</span>
                    <strong>{high}</strong>
                  </div>
                  <div className="bar">
                    <div
                      className="bar-fill high"
                      style={{
                        width: `${total ? (high / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="risk-row">
                  <div className="risk-row-label">
                    <span>Medium Risk</span>
                    <strong>{medium}</strong>
                  </div>
                  <div className="bar">
                    <div
                      className="bar-fill medium"
                      style={{
                        width: `${total ? (medium / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="risk-row">
                  <div className="risk-row-label">
                    <span>Low Risk</span>
                    <strong>{low}</strong>
                  </div>
                  <div className="bar">
                    <div
                      className="bar-fill low"
                      style={{
                        width: `${total ? (low / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-panel insights-panel">
              <div className="panel-header">
                <div>
                  <p className="section-label">INSIGHTS</p>
                  <h3>Current Situation</h3>
                </div>
              </div>

              <div className="insight-item">
                <span>Most Common Disaster</span>
                <strong>{statistics.most_common_disaster || "No reports yet"}</strong>
              </div>

              <div className="insight-item">
                <span>Most Affected Location</span>
                <strong>{statistics.most_affected_location || "No reports yet"}</strong>
              </div>

              <div className="insight-item">
                <span>Total Disaster Types</span>
                <strong>{Math.max(disasterTypes.length - 1, 0)}</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-panel reports-panel">
            <div className="panel-header reports-header">
              <div>
                <p className="section-label">COMMUNITY REPORTS</p>
                <h3>Recent Disaster Reports</h3>
              </div>

              <span className="report-count">
                {filteredReports.length} reports
              </span>
            </div>

            <div className="filters">
              <input
                type="text"
                placeholder="Search location, disaster or description..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
              >
                <option value="All">All Severity</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                {disasterTypes.map((disasterType) => (
                  <option key={disasterType} value={disasterType}>
                    {disasterType === "All"
                      ? "All Disaster Types"
                      : disasterType}
                  </option>
                ))}
              </select>
            </div>

            {filteredReports.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">+</div>
                <h4>No disaster reports found</h4>
                <p>
                  Reports submitted by the community will appear here.
                </p>
              </div>
            ) : (
              <div className="report-list">
                {filteredReports.map((report) => (
                  <article className="dashboard-report" key={report.id}>
                    <div className="report-main">
                      <div className="report-title-row">
                        <h4>{report.disaster_type}</h4>
                        <span
                          className={`severity-badge ${String(
                            report.severity || ""
                          ).toLowerCase()}`}
                        >
                          {report.severity}
                        </span>
                      </div>

                      <p className="report-location">
                        {report.location || "Location unavailable"}
                      </p>

                      <p className="report-description">
                        {report.description || "No description provided."}
                      </p>
                    </div>

                    <div className="report-meta">
                      <span>{report.affected_people || 0} affected</span>
                      <span>{report.status || "Pending"}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default Dashboard;
