import React from "react";
import "../styles/Card.css";
import { FaUserMd, FaUserFriends, FaBrain, FaUserTie, FaCalculator } from "react-icons/fa";

const experts = [
  {
    title: "Doctors",
    description: "Connect with certified medical professionals for health advice and consultations.",
    icon: <FaUserMd size={48} color="#007bff" />,
  },
  {
    title: "Engineers",
    description: "Find engineers for technical guidance, career mentoring, or project collaborations.",
    icon: <FaUserTie size={48} color="#28a745" />,
  },
  {
    title: "Chartered Accountants",
    description: "Talk to CAs for financial planning, tax consultation, and business setup support.",
    icon: <FaCalculator size={48} color="#ffc107" />,
  },
  {
    title: "Mental Health Experts",
    description: "Seek guidance and support from professional mental health counselors and therapists.",
    icon: <FaBrain size={48} color="#e83e8c" />,
  },
  {
    title: "Friends",
    description: "Connect with people who share your interests and build meaningful friendships.",
    icon: <FaUserFriends size={48} color="#6f42c1" />,
  },
];

export default function CardSection() {
  const handleConnect = (title) => {
    alert(`Connecting with ${title}...`);
  };

  return (
    <div className="card-section-scroll-wrapper">
      <div className="card-section-horizontal">
        {experts.map((expert, index) => (
          <div className="card" key={index}>
            <div className="card-content">
              <div style={{ marginBottom: "1rem" }}>{expert.icon}</div>
              <h3 className="card-title">{expert.title}</h3>
              <p className="card-description">{expert.description}</p>
              <button className="card-button" onClick={() => handleConnect(expert.title)}>
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}