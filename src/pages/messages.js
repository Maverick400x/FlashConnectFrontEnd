import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/messages.css";
import { FaVideo } from "react-icons/fa";

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const loggedUserId = 1; // Replace with the actual logged-in user's ID

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:8081/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }
    fetchUsers();
  }, []);

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
  }, [selectedUser]);

  // Send message
  async function handleSend() {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const res = await fetch("http://localhost:8081/api/messages/sendMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: loggedUserId,
          recipientId: selectedUser.id,
          content: newMessage,
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");

      // Refresh messages after sending
      setNewMessage("");
      const updatedMessages = await res.json();
      setMessages((prev) => [...prev, updatedMessages]);
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
          {/* Left: User List */}
          <div className="user-list">
            {users.map((user) => (
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
            ))}
          </div>

          {/* Right: Chat View */}
          <div className="chat-view">
            {selectedUser ? (
              <>
                <div className="chat-header">
                  <h3>{selectedUser.username}</h3>
                  <button className="video-call-button" onClick={handleVideoCall}>
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
              <p className="no-chat-selected">Select a user to start chatting</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}