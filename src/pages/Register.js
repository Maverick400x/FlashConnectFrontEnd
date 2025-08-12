import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/register.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Register() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*\d).{6,}$/;

    if (strongRegex.test(password)) return 'strong';
    else if (mediumRegex.test(password)) return 'medium';
    else return 'weak';
  };

  const getStrengthStyle = (strength) => {
    switch (strength) {
      case 'strong':
        return { width: '100%', backgroundColor: 'green' };
      case 'medium':
        return { width: '66%', backgroundColor: 'orange' };
      case 'weak':
        return { width: '33%', backgroundColor: 'red' };
      default:
        return { width: '0%', backgroundColor: 'transparent' };
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (passwordStrength === 'weak') {
      toast.error('Please choose a stronger password.');
      return;
    }

    const payload = { name, email, password, designation };

    try {
      const res = await fetch('http://localhost:8081/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.message || 'Registration failed');
        return;
      }

      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong during registration.');
    }
  };

  return (
    <div
      className="register-background"
      style={{
        minHeight: '100vh',
        backgroundImage:
          'url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: 'white',
        paddingTop: '56px', // for fixed navbar height
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-dark bg-dark fixed-top"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
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
          position: 'fixed',
          top: '56px',
          left: 0,
          width: '100%',
          height: 'calc(100% - 56px)',
          backgroundColor: 'rgba(12, 25, 47, 0.85)',
          zIndex: 0,
        }}
      ></div>

      {/* Form container */}
      <div
        className="form-container"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '400px',
          margin: 'auto',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 8px 16px rgba(0,191,166,0.5)',
          marginTop: '3rem',
          color: 'white',
        }}
      >
        <ToastContainer position="top-right" autoClose={2000} />
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Register</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
            style={inputStyle}
          />
          <div className="password-wrapper" style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
              style={{ ...inputStyle, paddingRight: '3rem' }}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
              style={{
                position: 'absolute',
                top: '50%',
                right: '0.75rem',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#00bfa6',
                cursor: 'pointer',
                fontSize: '1.1rem',
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {password && (
            <div
              className="password-strength-bar"
              style={{
                height: '8px',
                backgroundColor: '#333',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                overflow: 'hidden',
              }}
            >
              <div
                className="bar"
                style={{
                  height: '100%',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                  ...getStrengthStyle(passwordStrength),
                }}
              ></div>
              <span
                className="strength-label"
                style={{ color: 'white', fontWeight: '600', fontSize: '0.8rem', display: 'block', marginTop: '4px' }}
              >
                {passwordStrength.toUpperCase()}
              </span>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#00bfa6',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '4px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#009e8c')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00bfa6')}
          >
            Register
          </button>
        </form>
        <p className="form-footer" style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00bfa6', textDecoration: 'underline' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '4px',
  border: '1px solid #00bfa6',
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: 'white',
};