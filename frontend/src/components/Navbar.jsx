import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">🌏 Disaster Management System</div>
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/prediction"
          className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}
        >
          Risk Prediction
        </NavLink>
        <NavLink
          to="/reporting"
          className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}
        >
          Report Disaster
        </NavLink>
        <NavLink
          to="/ai-assistant"
          className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}
        >
          AI Assistant
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
