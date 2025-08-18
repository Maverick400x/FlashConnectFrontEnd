import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

export default function UserSearch({ loggedInUser, onAccept, onReject, onConnect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sendingRequestId, setSendingRequestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  // --- Helpers ---
  const getUserId = (u) => u?.id ?? u?._id ?? null;
  const getDisplayName = (u) => u?.fullName ?? u?.name ?? u?.username ?? "Unknown User";

  // Treat any of these as "connected"
  const isConnectedStatus = (status) =>
    ["ACCEPTED", "CONNECTED", "APPROVED", "FRIENDS"].includes(String(status || "").toUpperCase());

  // Build a message path. If your app uses a different pattern, adjust here.
  const buildMessagePath = (u) => {
    const uid = getUserId(u);
    return uid ? `/messages?to=${encodeURIComponent(uid)}` : "/messages";
  };

  // Button style helper
  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
  });

  // --- Fetch search results with cancelation ---
  const searchUsers = useCallback(async () => {
    if (!searchTerm.trim()) {
      setFilteredUsers([]);
      return;
    }
    if (!loggedInUser?.id) {
      console.warn("loggedInUser ID not found, cannot fetch search results.");
      setFilteredUsers([]);
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8081/api/users/search?query=${encodeURIComponent(
          searchTerm
        )}&requesterId=${loggedInUser.id}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();
      setFilteredUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching search results:", error);
        setFilteredUsers([]);
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, loggedInUser?.id]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      searchUsers();
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, searchUsers]);

  // Optimistic UI update + re-sync
  const handleAction = async (type, ...args) => {
    // Optimistic tweak
    if (type === "accept") {
      const reqId = args[0];
      setFilteredUsers((prev) =>
        prev.map((u) =>
          u.pendingRequestId === reqId ? { ...u, connectionStatusWithRequester: "ACCEPTED" } : u
        )
      );
      await onAccept(...args);
    } else if (type === "reject") {
      const reqId = args[0];
      setFilteredUsers((prev) =>
        prev.map((u) =>
          u.pendingRequestId === reqId ? { ...u, connectionStatusWithRequester: "REJECTED_BY_YOU" } : u
        )
      );
      await onReject(...args);
    } else if (type === "connect") {
      const user = args[0];
      const setSending = args[1];
      const uid = getUserId(user);
      setSending(uid);
      setFilteredUsers((prev) =>
        prev.map((u) =>
          getUserId(u) === uid ? { ...u, connectionStatusWithRequester: "PENDING_SENT" } : u
        )
      );
      await onConnect(user, setSending);
    }

    // Re-sync from backend (in case optimistic state differs)
    searchUsers();
  };

  // Render action control
  const renderConnectionAction = (user) => {
    const uid = getUserId(user);
    if (loggedInUser?.id && uid === loggedInUser.id) return null;

    const status = user?.connectionStatusWithRequester;

    if (isConnectedStatus(status)) {
      // Show Message link (green)
      const to = buildMessagePath(user);
      return (
        <Link to={to} style={buttonStyle("green")}>
          Message
        </Link>
      );
      // If you prefer programmatic nav:
      // return (
      //   <button style={buttonStyle("green")} onClick={() => navigate(to)}>
      //     Message
      //   </button>
      // );
    }

    switch (String(status || "").toUpperCase()) {
      case "PENDING_SENT":
        return (
          <button style={buttonStyle("#6c757d")} disabled>
            Request Sent
          </button>
        );

      case "PENDING_RECEIVED":
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={buttonStyle("#007bff")}
              onClick={() => handleAction("accept", user.pendingRequestId)}
            >
              Accept
            </button>
            <button
              style={buttonStyle("#dc3545")}
              onClick={() => handleAction("reject", user.pendingRequestId)}
            >
              Reject
            </button>
          </div>
        );

      case "REJECTED_BY_YOU":
      case "REJECTED_BY_THEM":
        return (
          <button style={buttonStyle("#6c757d")} disabled>
            {status === "REJECTED_BY_YOU" ? "Rejected (You)" : "Rejected (Them)"}
          </button>
        );

      case "BLOCKED_BY_YOU":
      case "BLOCKED_BY_THEM":
        return (
          <button style={buttonStyle("black")} disabled>
            Blocked
          </button>
        );

      case "NOT_CONNECTED":
      default:
        return (
          <button
            style={buttonStyle("#17a2b8")}
            onClick={() => handleAction("connect", user, setSendingRequestId)}
            disabled={sendingRequestId === uid}
          >
            {sendingRequestId === uid ? "Sending..." : "Connect"}
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

      {loading && <p className="loading-text">Searching...</p>}

      {searchTerm && !loading && filteredUsers.length > 0 ? (
        <ul className="search-results">
          {filteredUsers.map((user) => {
            const uid = getUserId(user);
            return (
              <li key={uid ?? Math.random()} className="search-result-item">
                <span style={{ color: "black", marginRight: "10px" }}>
                  {getDisplayName(user)}
                </span>
                {renderConnectionAction(user)}
              </li>
            );
          })}
        </ul>
      ) : (
        searchTerm && !loading && <li className="no-results">No users found.</li>
      )}
    </div>
  );
}