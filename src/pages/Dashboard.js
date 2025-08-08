import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import CardSection from "../components/Card";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [users] = useState([
    "John Doe", "Jane Smith", "Alice Johnson", "Robert Brown",
    "Emily Davis", "Michael Wilson", "Sarah Miller", "David Garcia",
    "Laura Martinez", "James Anderson", "Linda Taylor", "William Thomas",
    "Patricia Jackson", "Charles White", "Jessica Harris", "Daniel Clark",
    "Matthew Lewis", "Christopher Robinson",
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔍 Handle search input
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers([]);
    } else {
      const results = users.filter((user) =>
        user.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(results);
    }
  };

  // 🔗 Handle connection request
  const handleConnect = (user) => {
    alert(`🔗 Connection request sent to ${user}`);
  };

  // 🔔 Navigate to messages
  const handleBellClick = () => {
    navigate("/messages");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <main className="main-content">
        
        {/* 🔔 Notification Bell with Dropdown */}
        <div
          className="notification-bell-wrapper"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="notification-bell" onClick={handleBellClick}>
            <FaBell className="bell-icon" />
            <span className="notification-count">3</span>
          </div>

          {showDropdown && (
            <div className="notification-dropdown">
              <p><strong>Notifications</strong></p>
              <ul>
                <li>📩 New message from Alice</li>
                <li>👤 John sent a connection request</li>
                <li>📌 Reminder: Complete your profile</li>
              </ul>
            </div>
          )}
        </div>

        {/* 👥 User Search Bar */}
        <div className="search-users">
          <input
            type="text"
            placeholder="Search users to connect..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />

          {/* 🔍 Dynamic Search Result List */}
          {searchTerm && (
            <ul className="search-results">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <li key={index} className="search-result-item">
                    <span>{user}</span>
                    <button
                      className="connect-button"
                      onClick={() => handleConnect(user)}
                    >
                      Connect
                    </button>
                  </li>
                ))
              ) : (
                <li className="no-results">No users found.</li>
              )}
            </ul>
          )}
        </div>

        {/* 💼 Card Section */}
        <h2 className="section-title">Connect with Professionals</h2>
        <CardSection />
      </main>
    </div>
  );
}