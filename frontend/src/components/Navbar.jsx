import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " nav-link--active" : "");

  return (
    <nav className="navbar">
      <div className="navbar-brand">DisasterGuard LK</div>

      <div className="navbar-links">
        <NavLink to="/" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/prediction" className={linkClass}>
          Risk Prediction
        </NavLink>

        <NavLink to="/reporting" className={linkClass}>
          Report Disaster
        </NavLink>

        <NavLink to="/ai-assistant" className={linkClass}>
          AI Assistant
        </NavLink>

        <NavLink to="/safety-info" className={linkClass}>
          Safety Info
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
