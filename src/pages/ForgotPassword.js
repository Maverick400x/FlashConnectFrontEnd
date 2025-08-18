import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import "../styles/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8081/api/users/request-password-reset", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast.success("✅ OTP sent to your email!");
        // ✅ Redirect to reset password page with email in state
        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div
      className="forgot-password-background"
      style={{
        minHeight: "100vh",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "white",
        paddingTop: "56px",
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-dark bg-dark fixed-top"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
      >
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            ⚡Flash Connect
          </Link>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className="overlay"
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
      <div
        className="form-container"
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
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center",color:"white" }}>
          Forgot Password
        </h2>

        <form className="auth-form" onSubmit={handleSendOtp}>
          {/* Email */}
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          {/* Send OTP */}
          <button
            type="submit"
            style={submitBtnStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#009e8c")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#00bfa6")
            }
          >
            Send OTP
          </button>

          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Remembered your password?{" "}
            <Link to="/login" style={{ color: "#00bfa6" }}>
              Login here
            </Link>
          </p>
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