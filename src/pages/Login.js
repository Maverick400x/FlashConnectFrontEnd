import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = { email, password };

    try {
      const res = await fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.message || 'Invalid email or password.', {
          position: 'top-right',
          autoClose: 3000,
          pauseOnHover: true
        });
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      const data = await res.json();
      login(data);

      toast.success('Login successful! Redirecting...', {
        position: 'top-right',
        autoClose: 2000,
        pauseOnHover: false
      });

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong during login.');
    }
  };

  return (
    <div
      className="login-background"
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

      {/* Form container */}
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
        }}
      >
        <ToastContainer
          style={{ marginTop: '60px' }} // 👈 pushes toast down
        />
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "white" }}>Login</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={shake ? 'error-input' : ''}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #00bfa6",
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "white",
            }}
          />
          <div className="password-wrapper" style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={shake ? 'error-input' : ''}
              required
              style={{
                width: "100%",
                padding: "0.75rem 3rem 0.75rem 0.75rem",
                borderRadius: "4px",
                border: "1px solid #00bfa6",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
              }}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle Password Visibility"
              style={{
                position: "absolute",
                top: "50%",
                right: "0.75rem",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#00bfa6",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#00bfa6",
              border: "none",
              padding: "0.75rem",
              borderRadius: "4px",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#009e8c")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#00bfa6")}
          >
            Login
          </button>
        </form>
        <br />
        <div className="form-footer-links" style={{ textAlign: "center", marginTop: "1rem" }}>
          <p className="form-footer" style={{ marginBottom: "0.5rem" }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: "#00bfa6", textDecoration: "underline" }}>
              Register
            </Link>
          </p>
          <p className="form-footer">
            <Link to="/forgot-password" style={{ color: "#00bfa6", textDecoration: "underline" }}>
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}