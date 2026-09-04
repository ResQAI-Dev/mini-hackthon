// DisasterChart renders simple horizontal bar charts from the reports data.
// No chart library needed — pure CSS bars.
function DisasterChart({ reports }) {
  if (!reports || reports.length === 0) {
    return <p>No data available.</p>;
  }

  // Count how many reports exist per disaster type
  const typeCounts = reports.reduce((acc, report) => {
    acc[report.disaster_type] = (acc[report.disaster_type] || 0) + 1;
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(typeCounts));

  return (
    <div className="chart-container">
      {Object.entries(typeCounts).map(([type, count]) => {
        const barPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
        return (
          <div key={type} className="chart-row">
            <span className="chart-label">{type}</span>
            <div className="chart-bar-track">
              <div
                className="chart-bar-fill"
                style={{ width: barPercent + '%' }}
              />
            </div>
            <span className="chart-count">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

export default DisasterChart;
