import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaHeart } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import CardSection from "../components/Card";
import "../styles/dashboard.css";
import "../styles/dashboard_1.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  const [sendingRequestId, setSendingRequestId] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("authUser")) || {};

  // Fetch all users
  useEffect(() => {
    fetch("http://localhost:8081/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Search users
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers([]);
      return;
    }
    fetch(`http://localhost:8081/api/users/search?query=${encodeURIComponent(searchTerm)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch search results");
        return res.json();
      })
      .then((data) => setFilteredUsers(data))
      .catch((error) => console.error("Error fetching search results:", error));
  }, [searchTerm]);

  // Fetch pending requests
  const fetchPendingRequests = useCallback(async () => {
    if (!loggedInUser.id) return;
    try {
      const res = await fetch(`http://localhost:8081/api/connections/pending/${loggedInUser.id}`);
      if (!res.ok) throw new Error("Failed to fetch pending requests");
      const data = await res.json();
      setPendingRequests(data);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
    }
  }, [loggedInUser.id]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  // Accept request
  const acceptRequest = async (requestId) => {
    try {
      await fetch(`http://localhost:8081/api/connections/accept-request/${requestId}`, { method: "PUT" });
      fetchPendingRequests();
    } catch (err) {
      console.error("Error accepting request", err);
    }
  };

  // Reject request
  const rejectRequest = async (requestId) => {
    try {
      await fetch(`http://localhost:8081/api/connections/reject-request/${requestId}`, { method: "DELETE" });
      fetchPendingRequests();
    } catch (err) {
      console.error("Error rejecting request", err);
    }
  };

  const getDisplayName = (user) => user.fullName ?? user.name ?? user.username ?? "Unknown User";

  // Check if the user is already connected
  const isAlreadyConnected = (user) => {
    // Assuming we have an API or data to check existing connections
    return loggedInUser.connections && loggedInUser.connections.includes(user.id || user._id);
  };

  // Send connection request (fixed endpoint)
  const handleConnect = async (user) => {
    if (!loggedInUser.id) {
      alert("You must be logged in to send a connection request.");
      return;
    }
    if (isAlreadyConnected(user)) {
      alert(`You are already connected with ${getDisplayName(user)}.`);
      return;
    }
    setSendingRequestId(user.id || user._id);
    try {
      const res = await fetch("http://localhost:8081/api/connections/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: loggedInUser.id,
          receiverId: user.id || user._id,
        }),
      });

      if (!res.ok) throw new Error("Failed to send connection request");

      alert(`✅ Connection request sent to ${getDisplayName(user)}`);

      setFilteredUsers((prev) =>
        prev.map((u) =>
          u.id === (user.id || user._id) ? { ...u, requestSent: true } : u
        )
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === (user.id || user._id) ? { ...u, requestSent: true } : u
        )
      );
    } catch (err) {
      console.error("Error sending connection request:", err);
      alert("❌ Failed to send connection request");
    }
    setSendingRequestId(null);
  };

  const handleBellClick = () => {
    navigate("/messages");
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <h2 style={{ marginBottom: "15px" }}>
          Welcome{" "}
          <strong style={{ textDecoration: "underline" }}>
            {getDisplayName(loggedInUser)}
          </strong>
        </h2>

        <div className="top-icons">
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
                  <li>📌 Reminder: Complete your profile</li>
                </ul>
              </div>
            )}
          </div>

          <div
            className="heart-icon-wrapper"
            onMouseEnter={() => setShowRequests(true)}
            onMouseLeave={() => setShowRequests(false)}
          >
            <div className="heart-icon">
              <FaHeart color="red" size={24} />
              {pendingRequests.length > 0 && (
                <span className="request-badge">{pendingRequests.length}</span>
              )}
            </div>

            {showRequests && (
              <div className="requests-dropdown">
                <h4>Pending Requests</h4>
                {pendingRequests.length === 0 ? (
                  <p>No pending requests</p>
                ) : (
                  pendingRequests.map((req) => (
                    <div key={req.id} className="request-item">
                      <span>{req.senderName}</span>
                      <div>
                        <button className="accept-btn" onClick={() => acceptRequest(req.id)}>
                          Accept
                        </button>
                        <button className="reject-btn" onClick={() => rejectRequest(req.id)}>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search Users */}
        <div className="search-users">
          <input
            type="text"
            placeholder="Search users to connect..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          {searchTerm ? (
            <ul className="search-results">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <li key={index} className="search-result-item">
                    <span style={{ color: "black" }}>{getDisplayName(user)}</span>
                    {isAlreadyConnected(user) ? (
                      <button disabled>Already Connected</button>
                    ) : user.requestSent ? (
                      <button disabled>Request Sent</button>
                    ) : (
                      <button
                        className="connect-button"
                        onClick={() => handleConnect(user)}
                        disabled={sendingRequestId === (user.id || user._id)}
                      >
                        {sendingRequestId === (user.id || user._id) ? "Sending..." : "Connect"}
                      </button>
                    )}
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
                    <span style={{ color: "black" }}>{getDisplayName(user)}</span>
                    {isAlreadyConnected(user) ? (
                      <button disabled>Already Connected</button>
                    ) : user.requestSent ? (
                      <button disabled>Request Sent</button>
                    ) : (
                      <button
                        className="connect-button"
                        onClick={() => handleConnect(user)}
                        disabled={sendingRequestId === (user.id || user._id)}
                      >
                        {sendingRequestId === (user.id || user._id) ? "Sending..." : "Connect"}
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <h2 className="section-title">Connect with Professionals</h2>
        <CardSection />
      </main>
    </div>
  );
}
