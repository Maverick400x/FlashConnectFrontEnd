import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaEnvelope,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBolt
} from "react-icons/fa"; // Font Awesome icons
import "../styles/dashboard.css";

// Replace this URL with your default avatar image if needed
const DEFAULT_AVATAR =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

export default function Sidebar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* App Logo */}
      <h2 className="logo">
        <FaBolt className="sidebar-icon" /> Flash Connect
      </h2>

      {/* User Info with Photo */}
      {userData && (
        <div className="user-info">
          <img
            src={userData.profilePic || DEFAULT_AVATAR}
            alt="User Avatar"
            className="user-avatar"
          />
          <p className="user-name">Welcome <strong>{userData.username}</strong></p>
          <p className="user-email">Email : {userData.email}</p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <FaTachometerAlt className="sidebar-icon" /> Dashboard
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <FaEnvelope className="sidebar-icon" /> Messages
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <FaUser className="sidebar-icon" /> Profile
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <FaCog className="sidebar-icon" /> Settings
        </NavLink>
        <NavLink
          to="/help"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <FaQuestionCircle className="sidebar-icon" /> Help
        </NavLink>
        <button className="nav-item logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="sidebar-icon" /> Logout
        </button>
      </nav>
    </aside>
  );
}