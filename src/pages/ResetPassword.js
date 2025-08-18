// ResetPassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import "../styles/login.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // OTP
  const [newPassword, setNewPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  // ✅ Password strength checker
  const checkStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    setStrength(checkStrength(value));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email!");
      return;
    }
    if (!verificationCode) {
      toast.error("Please enter the OTP sent to your email!");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password!");
      return;
    }

    const payload = { email, verificationCode, newPassword };
    console.log("📤 Sending payload:", payload);

    try {
      const response = await fetch("http://localhost:8081/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("📥 Server response:", data);

      if (response.ok) {
        toast.success(
          typeof data === "string"
            ? data
            : data.message || "✅ Password reset successful!"
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(
          typeof data === "string"
            ? data
            : data.message || "Failed to reset password."
        );
      }
    } catch (error) {
      console.error("❌ Error resetting password:", error);
      toast.error("Something went wrong!");
    }
  };

  // ✅ Strength label
  const getStrengthLabel = () => {
    switch (strength) {
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "";
    }
  };

  // ✅ Strength bar color
  const getStrengthColor = () => {
    switch (strength) {
      case 1: return "red";
      case 2: return "orange";
      case 3: return "#ffc107"; // yellow
      case 4: return "limegreen";
      default: return "transparent";
    }
  };

  return (
    <div className="reset-password-background"
      style={{
        minHeight: "100vh",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "white",
        paddingTop: "56px",
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark fixed-top"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
      >
        <div className="container">
          <span className="navbar-brand fw-bold fs-3">⚡Flash Connect</span>
        </div>
      </nav>

      {/* Overlay */}
      <div className="overlay"
        style={{
          position: "fixed",
          top: "56px",
          left: 0,
          width: "100%",
          height: "calc(100% - 56px)",
          backgroundColor: "rgba(12, 25, 47, 0.85)",
          zIndex: 0,
        }}
      ></div>

      {/* Form */}
      <div className="form-container"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "400px",
          margin: "auto",
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 8px 16px rgba(0,191,166,0.5)",
          marginTop: "3rem",
          color: "white",
        }}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" ,color: "white"}}>
          Reset Password
        </h2>

        <form className="auth-form" onSubmit={handleResetPassword}>
          <input type="email" placeholder="Enter your Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            required style={inputStyle} />

          <input type="text" placeholder="Enter OTP"
            value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}
            required style={inputStyle} />

          <input type="password" placeholder="New Password"
            value={newPassword} onChange={(e) => handlePasswordChange(e.target.value)}
            required style={inputStyle} />

          {newPassword && (
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  height: "8px",
                  borderRadius: "4px",
                  background: getStrengthColor(),
                  width: `${(strength / 4) * 100}%`,
                  transition: "width 0.3s ease",
                }}
              ></div>
              <small style={{ color: getStrengthColor() }}>
                {getStrengthLabel()}
              </small>
            </div>
          )}

          <button type="submit" style={submitBtnStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#009e8c")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#00bfa6")}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

/* Input Styles */
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "1rem",
  borderRadius: "4px",
  border: "1px solid #00bfa6",
  backgroundColor: "rgba(255,255,255,0.1)",
  color: "white",
  outline: "none",
};

/* Submit Button Styles */
const submitBtnStyle = {
  width: "100%",
  backgroundColor: "#00bfa6",
  border: "none",
  padding: "0.75rem",
  borderRadius: "4px",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};