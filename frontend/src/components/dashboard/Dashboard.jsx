import { useState, useEffect } from 'react';
import api from '../../services/api';
import StatCard from './StatCard';
import DisasterChart from './DisasterChart';
import SafetyInfoPage from '../../pages/SafetyInfoPage';

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/api/statistics'), api.get('/api/reports')])
      .then(([, reportsResponse]) => {
        setReports(reportsResponse.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="status-message">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="status-message">Failed to load dashboard data.</p>;
  }

  // ── KPI Calculations ──────────────────────────────────────────
  const totalReports = reports.length;

  const highRiskReports = reports.filter((r) => r.severity === 'High').length;
  const mediumRiskReports = reports.filter((r) => r.severity === 'Medium').length;
  const lowRiskReports = reports.filter((r) => r.severity === 'Low').length;

  const highRiskRate = totalReports > 0
    ? Math.round((highRiskReports / totalReports) * 100)
    : 0;

  // Most common disaster type
  const typeCounts = reports.reduce((acc, r) => {
    acc[r.disaster_type] = (acc[r.disaster_type] || 0) + 1;
    return acc;
  }, {});
  const mostCommonType = Object.keys(typeCounts).reduce(
    (a, b) => (typeCounts[a] >= typeCounts[b] ? a : b),
    '-'
  );

  // Most affected location
  const locationCounts = reports.reduce((acc, r) => {
    acc[r.location] = (acc[r.location] || 0) + 1;
    return acc;
  }, {});
  const mostAffectedLocation = Object.keys(locationCounts).reduce(
    (a, b) => (locationCounts[a] >= locationCounts[b] ? a : b),
    '-'
  );

  // Total unique disaster types
  const totalDisasterTypes = new Set(reports.map((r) => r.disaster_type)).size;
  // ─────────────────────────────────────────────────────────────

  // Filtered reports for the list below
  const filteredReports = reports.filter((report) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      report.location.toLowerCase().includes(searchLower) ||
      report.disaster_type.toLowerCase().includes(searchLower);
    const matchesSeverity =
      severityFilter === 'All' || report.severity === severityFilter;
    const matchesType =
      typeFilter === 'All' || report.disaster_type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  // Severity badge class helper
  function severityClass(severity) {
    if (severity === 'High') return 'severity-high';
    if (severity === 'Medium') return 'severity-medium';
    return 'severity-low';
  }

  return (
    <div>
      {/* ── KPI Row 1 ── */}
      <div className="stats-grid">
        <StatCard title="Total Reports" value={totalReports} />
        <StatCard
          title="High Risk Reports"
          value={highRiskReports}
          subtitle={`${highRiskRate}% of all reports`}
          variant="high"
        />
        <StatCard
          title="High Risk Rate"
          value={`${highRiskRate}%`}
          subtitle={`${highRiskReports} of ${totalReports} reports`}
        />
        <StatCard title="Most Common Disaster" value={mostCommonType || '-'} />
      </div>

      {/* ── KPI Row 2 ── */}
      <div className="stats-grid">
        <StatCard title="Medium Risk" value={mediumRiskReports} variant="medium" />
        <StatCard title="Low Risk" value={lowRiskReports} variant="low" />
        <StatCard title="Most Affected Location" value={mostAffectedLocation || '-'} />
        <StatCard title="Total Disaster Types" value={totalDisasterTypes} />
      </div>

      {/* ── Disaster Statistics ── */}
      <h2 className="section-title">Disaster Statistics</h2>
      <DisasterChart reports={reports} />

      {/* ── Search & Filters ── */}
      <h2 className="section-title" style={{ marginTop: '2.5rem' }}>Search Reports</h2>
      <div className="controls-container">
        <input
          type="text"
          className="filter-input"
          placeholder="Search location or disaster type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="All">All Severities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Flood">Flood</option>
          <option value="Landslide">Landslide</option>
          <option value="Storm">Storm</option>
        </select>
      </div>

      {/* ── Disaster Reports List ── */}
      <h2 className="section-title">Disaster Reports</h2>
      {filteredReports.length === 0 ? (
        <p className="empty-state">No reports found.</p>
      ) : (
        <div className="reports-list">
          {filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-card-header">
                <h3 className="report-type">{report.disaster_type}</h3>
                <span className={`severity-badge ${severityClass(report.severity)}`}>
                  {report.severity}
                </span>
              </div>
              <p className="report-location">
                <strong>Location:</strong> {report.location}
              </p>
              <p className="report-description">{report.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Safety Information ── */}
      <h2 className="section-title" style={{ marginTop: '2.5rem' }}>Safety Information</h2>
      <SafetyInfoPage />
    </div>
  );
}

export default Dashboard;
