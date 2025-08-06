import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

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
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          Messages
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          Profile
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          Settings
        </NavLink>
        <NavLink
          to="/help"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          Help
        </NavLink>
        <button className="nav-item logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
}