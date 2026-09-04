function StatCard({ title, value, subtitle, variant }) {
  return (
    <div className={`stat-card${variant ? ' stat-card--' + variant : ''}`}>
      <p className="stat-title">{title}</p>
      <p className="stat-value">{value}</p>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  );
}

export default StatCard;
