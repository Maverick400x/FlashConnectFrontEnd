import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/messages.css";
import { FaVideo } from "react-icons/fa";

export default function Messages() {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Get logged-in user from localStorage
  const loggedUser = JSON.parse(localStorage.getItem("authUser")) || {};
  const loggedUserId = loggedUser.id;

  // Fetch connected users
  useEffect(() => {
    if (!loggedUserId) return;

    async function fetchConnectedUsers() {
      try {
        const res = await fetch(
          `http://localhost:8081/api/connections/connected/${loggedUserId}`
        );
        if (!res.ok) throw new Error("Failed to fetch connected users");
        const data = await res.json();
        setConnectedUsers(data);
      } catch (err) {
        console.error("Error fetching connected users:", err);
      }
    }

    fetchConnectedUsers();
  }, [loggedUserId]);

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (!selectedUser) return;

    async function fetchChat() {
      try {
        const res = await fetch(
          `http://localhost:8081/api/messages/chat?user1=${loggedUserId}&user2=${selectedUser.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch chat history");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching chat:", err);
      }
    }
    fetchChat();
  }, [selectedUser, loggedUserId]);

  // Send message
  async function handleSend() {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const res = await fetch(
        "http://localhost:8081/api/messages/sendMessages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: loggedUserId,
            recipientId: selectedUser.id,
            content: newMessage,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to send message");

      const sentMsg = await res.json();
      setMessages((prev) => [...prev, sentMsg]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  const handleVideoCall = () => {
    if (selectedUser) {
      alert(`Starting video call with ${selectedUser.username}...`);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <div className="messages-wrapper">
          {/* Left: Connected Users */}
          <div className="user-list">
            {connectedUsers.length > 0 ? (
              connectedUsers.map((user) => (
                <div
                  key={user.id}
                  className={`user-item ${
                    selectedUser?.id === user.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <h4>{user.username}</h4>
                  <p>{user.email}</p>
                </div>
              ))
            ) : (
              <p>No connected users.</p>
            )}
          </div>

          {/* Right: Chat View */}
          <div className="chat-view">
            {selectedUser ? (
              <>
                <div className="chat-header">
                  <h3>{selectedUser.username}</h3>
                  <button
                    className="video-call-button"
                    onClick={handleVideoCall}
                  >
                    <FaVideo className="video-icon" />
                  </button>
                </div>
                <div className="chat-body">
                  {messages.length > 0 ? (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`chat-bubble ${
                          msg.senderId === loggedUserId ? "me" : "them"
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))
                  ) : (
                    <p className="no-messages">No messages yet.</p>
                  )}
                </div>
                <div className="chat-footer">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button onClick={handleSend}>Send</button>
                </div>
              </>
            ) : (
              <p className="no-chat-selected">
                Select a connected user to start chatting
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}