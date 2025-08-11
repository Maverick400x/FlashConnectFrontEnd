import React, { useRef, useEffect, useState } from "react";
import "../styles/Card.css";
import {
  FaUserMd,
  FaUserFriends,
  FaBrain,
  FaUserTie,
  FaCalculator,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const experts = [
  {
    title: "Doctors",
    description:
      "Connect with certified medical professionals for health advice and consultations.",
    icon: <FaUserMd size={48} color="#007bff" />,
  },
  {
    title: "Engineers",
    description:
      "Find engineers for technical guidance, career mentoring, or project collaborations.",
    icon: <FaUserTie size={48} color="#28a745" />,
  },
  {
    title: "Chartered Accountants",
    description:
      "Talk to CAs for financial planning, tax consultation, and business setup support.",
    icon: <FaCalculator size={48} color="#ffc107" />,
  },
  {
    title: "Mental Health Experts",
    description:
      "Seek guidance and support from professional mental health counselors and therapists.",
    icon: <FaBrain size={48} color="#e83e8c" />,
  },
  {
    title: "Friends",
    description:
      "Connect with people who share your interests and build meaningful friendships.",
    icon: <FaUserFriends size={48} color="#6f42c1" />,
  },
];

export default function CardSection() {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleConnect = (title) => {
    toast.success(`Connecting with ${title}...`, {
      position: "top-right",
      style: {
        background: "#333",
        color: "#fff",
        fontSize: "14px",
        borderRadius: "8px",
      },
    });
  };

  // Auto-scroll logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollStep = 500; // pixels per slide
    const interval = setInterval(() => {
      if (!isHovered) {
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth
        ) {
          container.scrollTo({ left: 0, behavior: "smooth" }); // reset to start
        } else {
          container.scrollBy({ left: scrollStep, behavior: "smooth" });
        }
      }
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <>
      <Toaster />
      <div
        className="card-section-scroll-wrapper"
        style={{ overflowX: "auto", scrollBehavior: "smooth", whiteSpace: "nowrap" }}
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-section-horizontal" style={{ display: "flex" }}>
          {experts.map((expert, index) => (
            <div
              className="card"
              key={index}
              style={{
                minWidth: "250px",
                flex: "0 0 auto",
                marginRight: "16px",
              }}
            >
              <div className="card-content">
                <div style={{ marginBottom: "1rem" }}>{expert.icon}</div>
                <h3 className="card-title">{expert.title}</h3>
                <p className="card-description">{expert.description}</p>
                <button
                  className="card-button"
                  onClick={() => handleConnect(expert.title)}
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}