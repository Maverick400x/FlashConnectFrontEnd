import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import '../styles/login.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
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

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (passwordStrength === 'weak') {
      toast.error('Please use a stronger password.');
      return;
    }

    const storedUsers = localStorage.getItem('registeredUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const userExists = users.some((user) => user.email === email);
    if (!userExists) {
      toast.error('No account found with that email.');
      return;
    }

    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        return { ...user, password: newPassword };
      }
      return user;
    });

    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    toast.success('Password updated successfully! Redirecting to login...');

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;

  return (
    <div
      className="forgot-password-background"
      style={{
        minHeight: '100vh',
        backgroundImage:
          'url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: 'white',
        paddingTop: '56px', // for navbar height
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

      {/* Form Container */}
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
        <Toaster position="top-right" reverseOrder={false} />
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Reset Password</h2>
        <form className="auth-form" onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <div className="password-wrapper" style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
              style={{ ...inputStyle, paddingRight: '3rem' }}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowNewPassword((prev) => !prev)}
              aria-label="Toggle New Password Visibility"
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
              <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {/* Password Strength Bar */}
          {newPassword && (
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

          <div className="password-wrapper" style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: '3rem' }}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label="Toggle Confirm Password Visibility"
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
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {/* Real-Time Password Match Status */}
          {confirmPassword && (
            <p
              className={`match-status ${passwordsMatch ? 'match' : 'mismatch'}`}
              style={{
                color: passwordsMatch ? '#00bfa6' : 'red',
                fontWeight: '600',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
              {passwordsMatch ? '✔ Passwords match' : '✖ Passwords do not match'}
            </p>
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
            Reset Password
          </button>

          <p className="login-link" style={{ textAlign: 'center', marginTop: '1rem' }}>
            Remembered your password?{' '}
            <Link to="/login" style={{ color: '#00bfa6', textDecoration: 'underline' }}>
              Login here
            </Link>
          </p>
        </form>
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