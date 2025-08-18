// src/pages/Dashboard.js
import React, { useCallback } from "react";
import Sidebar from "../components/Sidebar";
import CardSection from "../components/Card";
import UserSearch from "../components/UserSearch";
import Notifications from "../components/Notifications";
import ConnectionRequests from "../components/ConnectionRequests";
import "../styles/dashboard.css";
import "../styles/notification.css";
import "../styles/follow-request.css";
import "../styles/Sidebar.css";
import "../styles/dashboard_1.css";
import { toast, Toaster } from "react-hot-toast";

export default function Dashboard() {
  const loggedInUser = JSON.parse(localStorage.getItem("authUser")) || {};

  /** ✅ Fetch all users (to refresh UI after actions) **/
  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8081/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      await res.json(); // not storing here, just to trigger refresh
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  }, []);

  /** ✅ Send connection request **/
  const handleConnect = async (user, setSendingRequestId) => {
    if (!loggedInUser.id) {
      toast.error("⚠️ You must be logged in to send a connection request.", {
        position: "top-right",
      });
      return;
    }

    // Set loading state for button
    setSendingRequestId(user.id || user._id);

    try {
      const res = await fetch(
        "http://localhost:8081/api/connections/send-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: loggedInUser.id,
            receiverId: user.id || user._id,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to send connection request: ${errorText || res.statusText}`
        );
      }

      toast.success(`✅ Request sent to ${user.fullName}`, {
        position: "top-right",
      });

      fetchAllUsers();
    } catch (err) {
      console.error("Error sending connection request:", err);
      toast.error(`❌ Failed: ${err.message}`, { position: "top-right" });
    }

    setSendingRequestId(null); // reset button loader
  };

  return (
    <div className="dashboard-container">
      <Toaster />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        {/* Top Right: Notifications + Requests (flex row) */}
        <div className="top-icons">
          <div className="icon-wrapper">
            <Notifications loggedInUser={loggedInUser} />
          </div>
          <div className="icon-wrapper">
            <ConnectionRequests
              loggedInUser={loggedInUser}
              fetchAllUsers={fetchAllUsers}
            />
          </div>
        </div>

        {/* Search + Actions */}
        <UserSearch
          loggedInUser={loggedInUser}
          onAccept={() => {}}
          onReject={() => {}}
          onConnect={handleConnect}
        />

        {/* Card Section */}
        <h2 className="section-title">Connect with Professionals</h2>
        <CardSection />
      </main>
    </div>
  );
}