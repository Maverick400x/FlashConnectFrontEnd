import React, { useState, useEffect, useCallback } from "react";

export default function UserSearch({ loggedInUser, onAccept, onReject, onConnect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sendingRequestId, setSendingRequestId] = useState(null);

  // Function to search users with connection status
  const searchUsers = useCallback(async () => {
    if (!searchTerm.trim()) {
      setFilteredUsers([]);
      return;
    }
    if (!loggedInUser.id) {
      console.warn("loggedInUser ID not found, cannot fetch search results.");
      setFilteredUsers([]);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8081/api/users/search?query=${encodeURIComponent(
          searchTerm
        )}&requesterId=${loggedInUser.id}`
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setFilteredUsers([]);
    }
  }, [searchTerm, loggedInUser.id]);

  // Debounce search requests
  useEffect(() => {
    const handler = setTimeout(() => {
      searchUsers();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, searchUsers]);

  const getDisplayName = (user) =>
    user.fullName ?? user.name ?? user.username ?? "Unknown User";

  // Render button based on connection status
  const renderConnectionActionButton = (user) => {
    if (loggedInUser.id && user.id === loggedInUser.id) {
      return null;
    }

    switch (user.connectionStatusWithRequester) {
      case "ACCEPTED":
        return <button className="connected-button" disabled>Connected</button>;
      case "PENDING_SENT":
        return <button className="pending-sent-button" disabled>Request Sent</button>;
      case "PENDING_RECEIVED":
        return (
          <div className="flex space-x-2">
            <button
              className="accept-btn"
              onClick={() => onAccept(user.pendingRequestId)}
            >
              Accept
            </button>
            <button
              className="reject-btn"
              onClick={() => onReject(user.pendingRequestId)}
            >
              Reject
            </button>
          </div>
        );
      case "REJECTED_BY_YOU":
        return <button className="rejected-button" disabled>Rejected (You)</button>;
      case "REJECTED_BY_THEM":
        return <button className="rejected-button" disabled>Rejected (Them)</button>;
      case "BLOCKED_BY_YOU":
      case "BLOCKED_BY_THEM":
        return <button className="blocked-button" disabled>Blocked</button>;
      case "NOT_CONNECTED":
      default:
        return (
          <button
            className="connect-button"
            onClick={() => {
              setSendingRequestId(user.id || user._id);
              onConnect(user, setSendingRequestId);
            }}
            disabled={sendingRequestId === (user.id || user._id)}
          >
            {sendingRequestId === (user.id || user._id) ? "Sending..." : "Connect"}
          </button>
        );
    }
  };

  return (
    <div className="search-users">
      <input
        type="text"
        placeholder="Search users to connect..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {searchTerm && filteredUsers.length > 0 ? (
        <ul className="search-results">
          {filteredUsers.map((user) => (
            <li key={user.id} className="search-result-item">
              <span style={{ color: "black" }}>{getDisplayName(user)}</span>
              {renderConnectionActionButton(user)}
            </li>
          ))}
        </ul>
      ) : (
        searchTerm && <li className="no-results">No users found.</li>
      )}
    </div>
  );
}