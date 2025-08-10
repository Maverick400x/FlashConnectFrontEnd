import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

const DEFAULT_AVATAR =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields state (username removed)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePic: user?.profilePic || DEFAULT_AVATAR,
  });

  if (!user) {
    return (
      <div className="profile-container">
        <Sidebar />
        <div className="profile-content">
          <h2>Profile</h2>
          <p>No user data found. Please log in.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // TODO: Make an API call to update user profile
      console.log("Updated Profile Data:", formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Profile Content */}
      <div className="profile-content">
        <h2>My Profile</h2>

        <div className="profile-card">
          <img
            src={isEditing ? formData.profilePic : user.profilePic || DEFAULT_AVATAR}
            alt="User Avatar"
            className="profile-avatar"
          />

          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="profile-input"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="profile-input"
              />
              <input
                type="text"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
                placeholder="Profile Picture URL"
                className="profile-input"
              />
            </>
          ) : (
            <>
              <h3>{user.name || "No Name Provided"}</h3>
              <p>Email: {user.email}</p>
            </>
          )}
        </div>

        <div className="profile-details">
          <h4>Account Details</h4>
          <ul>
            <li>
              <strong>Name:</strong>{" "}
              {isEditing ? formData.name : user.name || "Not provided"}
            </li>
            <li>
              <strong>Email:</strong>{" "}
              {isEditing ? formData.email : user.email}
            </li>
            <li>
              <strong>Joined On:</strong>{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
