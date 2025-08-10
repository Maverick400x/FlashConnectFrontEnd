import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaVideo } from "react-icons/fa";
import "../styles/messages.css";
import "../styles/dashboard.css"; // Ensure this is imported for the dashboard container styles

export default function Messages() {
  const [users, setUsers] = useState([]); // State to hold the list of all users
  const [selectedUser, setSelectedUser] = useState(null); // State for the currently selected user
  const [chatHistory, setChatHistory] = useState([]); // State for the chat history with the selected user
  const [currentMessage, setCurrentMessage] = useState(""); // State for the message input field

  // Assuming a static user ID for the logged-in user for demonstration
  // In a real app, this would come from a global state or context after login
  const myUserId = 1;

  // --- useEffect to Fetch All Users ---
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await response.json();
        setUsers(usersData);
        // Automatically select the first user if the list is not empty
        if (usersData.length > 0) {
          setSelectedUser(usersData[0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []); // Empty dependency array means this runs only once on mount

  // --- useEffect to Fetch Chat History for the Selected User ---
  useEffect(() => {
    if (selectedUser) {
      const fetchChatHistory = async () => {
        try {
          const response = await fetch(
            `http://localhost:8081/api/messages/chat?user1=${myUserId}&user2=${selectedUser.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch chat history");
          }
          const chatData = await response.json();
          setChatHistory(chatData);
        } catch (error) {
          console.error("Error fetching chat history:", error);
          setChatHistory([]); // Clear chat on error
        }
      };
      fetchChatHistory();
    }
  }, [selectedUser, myUserId]); // Runs whenever the selectedUser changes

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedUser) {
      return;
    }

    // Here, you would call your backend API to send the message
    // Example fetch call (not fully implemented):
    // const response = await fetch("http://localhost:8081/api/messages/sendMessages", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     senderId: myUserId,
    //     recipientId: selectedUser.id,
    //     content: currentMessage,
    //   }),
    // });

    // For now, let's just add it to the local state for a smoother UI
    const newMessage = {
      // These fields should match your backend's MessageResponseDTO
      senderId: myUserId,
      recipientId: selectedUser.id,
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };

    setChatHistory([...chatHistory, newMessage]);
    setCurrentMessage(""); // Clear the input field
  };

  const handleVideoCall = () => {
    if (selectedUser) {
      alert(`Starting video call with ${selectedUser.name}...`);
    }
  };

  // Helper function to get display name safely
  const getDisplayName = (user) => {
    return user?.name ?? user?.email ?? "Unknown User";
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <div className="messages-wrapper">
          {/* Left: User List */}
          <div className="user-list">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className={`user-item ${
                    selectedUser?.id === user.id ? "active" : ""
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <h4>{getDisplayName(user)}</h4>
                  {/* You'll likely need to fetch the last message for each user */}
                  {/* <p>Last message placeholder...</p> */}
                </div>
              ))
            ) : (
              <p>No users available.</p>
            )}
          </div>

          {/* Right: Chat View */}
          <div className="chat-view">
            {selectedUser ? (
              <>
                <div className="chat-header">
                  <h3>{getDisplayName(selectedUser)}</h3>
                  <button className="video-call-button" onClick={handleVideoCall}>
                    <FaVideo className="video-icon" />
                  </button>
                </div>
                <div className="chat-body">
                  {chatHistory.length > 0 ? (
                    chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`chat-bubble ${
                          msg.senderId === myUserId ? "me" : "them"
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))
                  ) : (
                    <div className="no-messages">
                      Start a conversation with {getDisplayName(selectedUser)}.
                    </div>
                  )}
                </div>
                <div className="chat-footer">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                Select a user to start a chat.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}