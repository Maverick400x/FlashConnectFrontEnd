import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; // Reuse the same CSS

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">Flash Connect</h2>
      <nav className="nav-links">
        <Link to="/dashboard" className="nav-item active">Dashboard</Link>
        <Link to="/messages" className="nav-item">Messages</Link>
        <Link to="/profile" className="nav-item">Profile</Link>
        <Link to="/settings" className="nav-item">Settings</Link>
        <Link to="/help" className="nav-item">Help</Link>
        <button className="nav-item logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
}