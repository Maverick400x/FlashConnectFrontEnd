import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import CardSection from "../components/Card";
import "../styles/dashboard.css";
import "../styles/dashboard_1.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]); // All users fetched initially
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  // Fetch search results when searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/api/users/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (!res.ok) throw new Error("Failed to fetch search results");
        const data = await res.json();
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  // Helper to get display name safely
  const getDisplayName = (user) => {
    return user.fullName ?? user.name ?? user.username ?? "Unknown User";
  };

  // Connection request handler
  const handleConnect = (user) => {
    alert(`🔗 Connection request sent to ${getDisplayName(user)}`);
  };

  // Navigate to messages
  const handleBellClick = () => {
    navigate("/messages");
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
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

        <div className="search-users">
          <input
            type="text"
            placeholder="Search users to connect..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {/* Show filtered search results if searching, else show all users */}
          {searchTerm ? (
            <ul className="search-results">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <li key={index} className="search-result-item">
                    <span style={{ color: 'black' }}>{getDisplayName(user)}</span>
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
          ) : (
            <ul className="search-results">
              {users.length > 0 &&
                users.map((user, index) => (
                  <li key={index} className="search-result-item">
                    <span style={{ color: 'black' }}>{getDisplayName(user)}</span>
                    <button
                      className="connect-button"
                      onClick={() => handleConnect(user)}
                    >
                      Connect
                    </button>
                  </li>
                ))
              }
            </ul>
          )}
        </div>

        <h2 className="section-title">Connect with Professionals</h2>
        <CardSection />
      </main>
    </div>
  );
}
