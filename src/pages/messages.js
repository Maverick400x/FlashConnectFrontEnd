import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/messages.css";
import { FaVideo } from "react-icons/fa"; // Optional: for a video call icon

export default function Messages() {
  const [conversations] = useState([
    {
      name: "Alice Johnson",
      lastMessage: "Hey! Are you free for a quick call?",
      time: "2 mins ago",
      messages: [
        { from: "Alice", text: "Hey! Are you free for a quick call?" },
        { from: "Me", text: "Sure, give me 5 minutes." },
        { from: "Alice", text: "...." },
      ],
    },
    {
      name: "John Doe",
      lastMessage: "Sent you the files. Check your inbox.",
      time: "10 mins ago",
      messages: [
        { from: "John", text: "Sent you the files. Check your inbox." },
        { from: "Me", text: "Received. Thanks!" },
      ],
    },
    {
      name: "Emily Davis",
      lastMessage: "Thanks for the connection!",
      time: "30 mins ago",
      messages: [
        { from: "Emily", text: "Thanks for the connection!" },
        { from: "Me", text: "Glad to connect 😊" },
      ],
    },
    {
      name: "Daniel Clark",
      lastMessage: "Let's catch up soon.",
      time: "1 hour ago",
      messages: [
        { from: "Daniel", text: "Let's catch up soon." },
        { from: "Me", text: "Sure, ping me anytime." },
      ],
    },
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedChat = conversations[selectedIndex];

  const handleVideoCall = () => {
    alert(`Starting video call with ${selectedChat.name}...`);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <div className="messages-wrapper">
          {/* Left: User List */}
          <div className="user-list">
            {conversations.map((chat, index) => (
              <div
                key={index}
                className={`user-item ${
                  index === selectedIndex ? "active" : ""
                }`}
                onClick={() => setSelectedIndex(index)}
              >
                <h4>{chat.name}</h4>
                <p>{chat.lastMessage}</p>
                <span>{chat.time}</span>
              </div>
            ))}
          </div>

          {/* Right: Chat View */}
          <div className="chat-view">
            <div className="chat-header">
              <h3>{selectedChat.name}</h3>
              <button className="video-call-button" onClick={handleVideoCall}>
                <FaVideo className="video-icon" /></button> {/* Optional: Video call button */}
            </div>
            <div className="chat-body">
              {selectedChat.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-bubble ${
                    msg.from === "Me" ? "me" : "them"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-footer">
              <input
                type="text"
                placeholder="Type a message..."
              />
              <button>Send</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}