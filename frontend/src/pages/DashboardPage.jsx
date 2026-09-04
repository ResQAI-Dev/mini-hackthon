import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';

// Quick action cards shown at the top of the dashboard
const quickActions = [
  {
    title: 'Risk Prediction',
    description: 'Analyze rainfall, water level and disaster risk.',
    buttonLabel: 'Analyze Risk',
    path: '/prediction',
    emoji: '📊',
  },
  {
    title: 'Disaster Reporting',
    description: 'Submit and monitor community disaster reports.',
    buttonLabel: 'Report Disaster',
    path: '/reporting',
    emoji: '📝',
  },
  {
    title: 'AI Disaster Assistant',
    description: 'Get AI-powered disaster guidance and safety recommendations.',
    buttonLabel: 'Ask AI Assistant',
    path: '/ai-assistant',
    emoji: '🤖',
  },
];

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Disaster Dashboard</h1>
        <p className="dashboard-subtitle">
          Monitor disaster reports, risk levels and community safety information.
        </p>
      </div>

      {/* Quick Actions */}
      <h2 className="section-title">Quick Actions</h2>
      <div className="quick-actions-grid">
        {quickActions.map((action) => (
          <div key={action.path} className="quick-action-card">
            <div className="quick-action-emoji">{action.emoji}</div>
            <h3 className="quick-action-title">{action.title}</h3>
            <p className="quick-action-desc">{action.description}</p>
            <button
              className="quick-action-btn"
              onClick={() => navigate(action.path)}
            >
              {action.buttonLabel}
            </button>
          </div>
        ))}
      </div>

      {/* Dashboard Content */}
      <Dashboard />
    </div>
  );
}

export default DashboardPage;
