// src/components/Notifications.js
import React, { useState, useEffect, useCallback } from "react";
import { FaBell } from "react-icons/fa";

export default function Notifications({ loggedInUser, onBellClick }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!loggedInUser.id) return;
    try {
      const res = await fetch(
        `http://localhost:8081/api/messages/notifications/${loggedInUser.id}`
      );
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      const sorted = data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setNotifications(sorted.slice(0, 3));
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [loggedInUser.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div
      className="notification-bell-wrapper"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <div className="notification-bell" onClick={onBellClick}>
        <FaBell className="bell-icon" />
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <p>
            <strong>Notifications</strong>
          </p>
          <ul>
            {notifications.length === 0 ? (
              <li>No new messages</li>
            ) : (
              notifications.map((notif, idx) => (
                <li key={idx}>
                  📩 <strong>{notif.senderName}</strong>:{" "}
                  {notif.content?.length > 30
                    ? notif.content.slice(0, 30) + "..."
                    : notif.content}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}