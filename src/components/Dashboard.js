import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // Make sure the path is correct
import "../styles/dashboard.css";

export default function Dashboard() {
  const [users] = useState([
    "John Doe", "Jane Smith", "Alice Johnson", "Robert Brown",
    "Emily Davis", "Michael Wilson", "Sarah Miller", "David Garcia",
    "Laura Martinez", "James Anderson", "Linda Taylor", "William Thomas",
    "Patricia Jackson", "Charles White", "Jessica Harris", "Daniel Clark",
    "Matthew Lewis", "Christopher Robinson",
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers([]);
    } else {
      const results = users.filter((user) =>
        user.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(results);
    }
  };

  const handleConnect = (user) => {
    alert(`Connection request sent to ${user}`);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <div className="search-users">
          <input
            type="text"
            placeholder="Search users to connect..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <ul className="search-results">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <li key={index} className="search-result-item">
                    <span>{user}</span>
                    <button
                      className="connect-button"
                      onClick={() => handleConnect(user)}
                    >
                      Let's Connect
                    </button>
                  </li>
                ))
              ) : (
                <li className="no-results">No users found.</li>
              )}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}