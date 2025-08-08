import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="form-container">
      <Toaster position="top-right" reverseOrder={false} />
      <h2>Reset Password</h2>
      <form className="auth-form" onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-wrapper">
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowNewPassword((prev) => !prev)}
            aria-label="Toggle New Password Visibility"
          >
            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {/* Password Strength Bar */}
        {newPassword && (
          <div className="password-strength-bar">
            <div className="bar" style={getStrengthStyle(passwordStrength)}></div>
            <span className="strength-label">{passwordStrength.toUpperCase()}</span>
          </div>
        )}

        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Re-enter New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label="Toggle Confirm Password Visibility"
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {/* ✅ Real-Time Password Match Status */}
        {confirmPassword && (
          <p className={`match-status ${passwordsMatch ? 'match' : 'mismatch'}`}>
            {passwordsMatch ? '✔ Passwords match' : '✖ Passwords do not match'}
          </p>
        )}

        <button type="submit">Reset Password</button>
        <p className="login-link">
          Remembered your password? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}