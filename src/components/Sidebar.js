import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom"; // ✅ Added Link
import {
  FaTachometerAlt,
  FaEnvelope,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBolt,
  FaUserFriends,
} from "react-icons/fa";
import "../styles/dashboard.css";

const DEFAULT_AVATAR =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

export default function Sidebar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState("");

  const getGreeting = () => {
    const now = new Date();
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const hour = istTime.getUTCHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing authUser from localStorage", err);
        setUserData(null);
      }
    }
  }, []);

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* App Logo as clickable link */}
      <Link
      className="logo fw-bold fs-4"
      to="/dashboard"
      style={{
        color: "white",
        textDecoration: "underline",
        textDecorationColor: "rgb(86, 188, 167)",
        textUnderlineOffset: "4px",
      }}
    >
      ⚡ Flash Connect
    </Link>

      {/* User Info */}
      {userData && (
        <div className="user-info">
          <img
            src={userData.profilePic || DEFAULT_AVATAR}
            alt="User Avatar"
            className="user-avatar"
          />
          <p style={{ fontSize: "14px", color: "#555" }}>
            {greeting} 👋
          </p>
          <p className="user-name">
            Hello,{" "}
            <u>
              <strong>
                {userData.fullName ?? userData.name ?? userData.username}
              </strong>
            </u>
          </p>

          {/* Followers and Following */}
          <div className="follow-stats-row">
            <div className="follow-item">
              <FaUserFriends className="follow-icon" />
              <span>
                <strong>{userData.followers ?? 0}</strong> Followers
              </span>
            </div>
            <div className="follow-item">
              <FaUserFriends className="follow-icon" />
              <span>
                <strong>{userData.following ?? 0}</strong> Following
              </span>
            </div>
          </div>
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