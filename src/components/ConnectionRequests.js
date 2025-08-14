import React, { useState, useEffect, useCallback } from "react";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function ConnectionRequests({ loggedInUser, fetchAllUsers }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  // Fetch pending requests
  const fetchPendingRequests = useCallback(async () => {
    if (!loggedInUser.id) return;
    try {
      const res = await fetch(
        `http://localhost:8081/api/connections/pending/${loggedInUser.id}`
      );
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

  // Accept request handler
  const acceptRequest = async (requestId) => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/connections/accept-request/${requestId}`,
        { method: "PUT" }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to accept request: ${errorText || res.statusText}`);
      }
      toast.success("Connection request accepted", { position: "top-right" });
      fetchPendingRequests();
      fetchAllUsers();
    } catch (err) {
      console.error("Error accepting request", err);
      toast.error(`❌ Failed to accept request: ${err.message}`, { position: "top-right" });
    }
  };

  // Reject request handler
  const rejectRequest = async (requestId) => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/connections/reject-request/${requestId}`,
        { method: "PUT" }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to reject request: ${errorText || res.statusText}`);
      }
      toast("🚫 Connection request rejected", {
        icon: "⚠",
        position: "top-right",
      });
      fetchPendingRequests();
      fetchAllUsers();
    } catch (err) {
      console.error("Error rejecting request", err);
      toast.error(`❌ Failed to reject request: ${err.message}`, { position: "top-right" });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".heart-icon-wrapper")) {
        setShowRequests(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="heart-icon-wrapper">
      <div
        className="heart-icon"
        onClick={(e) => {
          e.stopPropagation();
          setShowRequests((prev) => !prev);
        }}
      >
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
                  <button
                    className="accept-btn"
                    onClick={() => acceptRequest(req.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => rejectRequest(req.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}