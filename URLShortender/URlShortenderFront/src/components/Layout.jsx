import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Link to="/" className="brand-link">URL Shortener</Link>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end>Shorten</NavLink>
          {user ? (
            <NavLink to="/profile">Profile</NavLink>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
        {user && (
          <div className="user-chip">
            <span>{user.name}</span>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        )}
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
};

export default Layout;
